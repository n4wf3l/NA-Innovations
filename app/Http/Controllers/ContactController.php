<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use App\Mail\ContactFormMail;
use Inertia\Inertia;
use App\Enums\ProjectType;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact', [
            'projectTypes' => ProjectType::TYPES,
            'turnstileSiteKey' => config('services.turnstile.site_key'),
            'simulatorMode' => \App\Models\Setting::get('simulator.mode', 'europe_only'),
        ]);
    }

    public function sendEmail(Request $request)
    {
        // 1. Rate limiting: max 5 submissions per IP per hour
        $key = 'contact-form:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return redirect()->back()->with('error', "Too many submissions. Please try again in {$seconds} seconds.");
        }
        RateLimiter::hit($key, 3600); // 1 hour window

        // 2. Honeypot check - hidden field "website" must be empty
        if ($request->filled('website')) {
            // Bot detected - silently accept but don't process
            return redirect()->back()->with('success', 'Your message has been sent!');
        }

        // 3. Timing check - form must take at least 3 seconds to fill
        if ($request->filled('_form_loaded_at')) {
            $loadedAt = (int) $request->input('_form_loaded_at');
            if ($loadedAt > 0 && (time() - $loadedAt) < 3) {
                return redirect()->back()->with('success', 'Your message has been sent!');
            }
        }

        // 4. Cloudflare Turnstile verification (skip in local/testing)
        $turnstileSecret = config('services.turnstile.secret_key');
        if ($turnstileSecret && !app()->environment('local', 'testing')) {
            $turnstileToken = $request->input('cf-turnstile-response');
            if (!$turnstileToken) {
                return redirect()->back()->withErrors(['captcha' => 'Please complete the security check.'])->withInput();
            }

            $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $turnstileSecret,
                'response' => $turnstileToken,
                'remoteip' => $request->ip(),
            ]);

            if (!$response->json('success')) {
                return redirect()->back()->withErrors(['captcha' => 'Security verification failed. Please try again.'])->withInput();
            }
        }

        $isQuote = $request->input('type') === 'quote';
        $isSimulator = $request->input('type') === 'simulator';

        // 5. Validation
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
            'website' => 'nullable|max:0', // honeypot - must be empty
        ];

        if ($isSimulator) {
            $rules['service'] = 'nullable|string|max:255';
            $rules['budget'] = 'nullable|string|max:255';
            $rules['company'] = 'nullable|string|max:255';
            $rules['phone'] = 'nullable|string|max:50';
            $rules['configuration'] = 'nullable|string|max:10000';
        } elseif ($isQuote) {
            $rules['service'] = 'nullable|string|max:255';
            $rules['budget'] = 'nullable|string|max:255';
            $rules['company'] = 'nullable|string|max:255';
            $rules['phone'] = 'nullable|string|max:50';
            $rules['timeline'] = 'nullable|string|max:255';
            $rules['attachments'] = 'nullable|array|max:5';
            $rules['attachments.*'] = 'file|mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg,webp,zip|max:10240';
        } else {
            $rules['service'] = 'required|string|max:255';
            $rules['budget'] = 'nullable|numeric';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $selectedService = $request->input('service', 'General inquiry');

        // Split name
        $nameParts = explode(' ', trim($request->name), 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        // 5. Store attachments on LOCAL disk (not public) - admin downloads via controller
        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $originalName = $file->getClientOriginalName();
                $safeName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
                $path = $file->storeAs('contact-attachments', $safeName, 'local');
                $attachmentPaths[] = [
                    'path' => $path,
                    'name' => $originalName,
                    'size' => $file->getSize(),
                ];
            }
        }

        // 6. Build notes - sanitize input (strip HTML tags)
        $cleanMessage = strip_tags($request->message);
        $notes = '';
        if ($isSimulator) {
            if ($request->company) $notes .= "Company: " . strip_tags($request->company) . "\n";
            if ($request->phone) $notes .= "Phone: " . strip_tags($request->phone) . "\n";
            $notes .= "Estimated Budget: " . strip_tags($request->budget) . " EUR\n";
            $notes .= "Source: Price Simulator\n\n";

            // Parse configuration JSON
            if ($request->configuration) {
                $config = json_decode($request->configuration, true);
                if ($config) {
                    if (!empty($config['projectType']['name'])) {
                        $notes .= "Project Type: {$config['projectType']['name']} (base: {$config['projectType']['basePrice']} EUR)\n";
                    }
                    if (!empty($config['features'])) {
                        $notes .= "\nSelected Features:\n";
                        foreach ($config['features'] as $feature) {
                            $notes .= "  - {$feature['name']}: {$feature['price']} EUR\n";
                        }
                    }
                    if (!empty($config['design']['name'])) {
                        $notes .= "\nDesign: {$config['design']['name']} ({$config['design']['price']} EUR)\n";
                    }
                    if (!empty($config['maintenance']['name'])) {
                        $notes .= "Maintenance: {$config['maintenance']['name']} ({$config['maintenance']['price']} EUR)\n";
                    }
                    if (!empty($config['timeline']['name'])) {
                        $multiplierPct = ($config['timeline']['multiplier'] ?? 0) * 100;
                        $notes .= "Timeline: {$config['timeline']['name']} (+{$multiplierPct}%)\n";
                    }
                    if (!empty($config['priceBreakdown'])) {
                        $pb = $config['priceBreakdown'];
                        $notes .= "\nPrice Breakdown:\n";
                        $notes .= "  Base: {$pb['base']} EUR\n";
                        $notes .= "  Features: +{$pb['featuresTotal']} EUR\n";
                        $notes .= "  Design: +{$pb['designTotal']} EUR\n";
                        $notes .= "  Maintenance: +{$pb['maintenanceTotal']} EUR\n";
                        $notes .= "  Timeline: +{$pb['timelineExtra']} EUR\n";
                        $notes .= "  TOTAL: {$pb['total']} EUR\n";
                    }
                }
            }
            $notes .= "\nMessage:\n{$cleanMessage}";
        } elseif ($isQuote) {
            if ($request->company) $notes .= "Company: " . strip_tags($request->company) . "\n";
            if ($request->phone) $notes .= "Phone: " . strip_tags($request->phone) . "\n";
            if ($request->budget) $notes .= "Budget: " . strip_tags($request->budget) . "\n";
            if ($request->timeline) $notes .= "Timeline: " . strip_tags($request->timeline) . "\n";
            if ($request->existing_website) $notes .= "Existing website: " . strip_tags($request->existing_website) . "\n";
            if ($request->how_found_us) $notes .= "How they found us: " . strip_tags($request->how_found_us) . "\n";
            if ($request->preferred_lang) $notes .= "Preferred language: " . strtoupper(strip_tags($request->preferred_lang)) . "\n";
            if (count($attachmentPaths) > 0) {
                $notes .= "Attachments: " . count($attachmentPaths) . " file(s)\n";
                foreach ($attachmentPaths as $att) {
                    $notes .= "  - {$att['name']} (" . round($att['size'] / 1024) . " KB)\n";
                }
            }
            $notes .= "\nMessage:\n{$cleanMessage}";
        } else {
            $notes .= "Subject: " . strip_tags($request->input('service')) . "\n\nMessage:\n{$cleanMessage}";
        }

        // 7. Create Lead - assign to primary admin (public contact form has no tenant context)
        $defaultAdminId = \App\Models\User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
            ->where('role', 'admin')->orderBy('id')->value('id');

        $lead = \App\Models\Lead::create([
            'admin_id' => $defaultAdminId,
            'first_name' => strip_tags($firstName),
            'last_name' => strip_tags($lastName),
            'email' => $request->email,
            'phone' => $request->phone ? strip_tags($request->phone) : null,
            'company_name' => $request->company ? strip_tags($request->company) : null,
            'source' => $isSimulator ? 'website_simulator' : ($isQuote ? 'website_quote' : 'website_contact'),
            'service_interest' => strip_tags($selectedService),
            'estimated_budget' => is_numeric($request->budget) ? $request->budget : null,
            'notes' => $notes,
            'status' => 'new',
        ]);

        // 7b. Link referral partner if ref code is present
        if ($request->filled('ref')) {
            $refPartner = \App\Models\ReferralPartner::where('referral_code', $request->ref)->where('is_active', true)->first();
            if ($refPartner) {
                $lead->update(['referral_partner_id' => $refPartner->id, 'source' => 'referral']);

                // Notify the partner
                \App\Models\NotificationLog::create([
                    'user_id' => $refPartner->user_id,
                    'type' => 'referral_used',
                    'title' => 'Nouveau lead via votre code !',
                    'message' => strip_tags($request->name) . ' a demandé un devis en utilisant votre code de parrainage.',
                    'action_url' => '/partner/leads/' . $lead->id,
                    'is_read' => false,
                ]);

                // Email notification if enabled
                $partnerUser = $refPartner->user;
                if ($partnerUser && ($partnerUser->preferences['email_notifications'] ?? true)) {
                    try {
                        \Illuminate\Support\Facades\Mail::to($partnerUser->email)->send(
                            new \App\Mail\TemplateMail(
                                'Votre code de parrainage a été utilisé !',
                                '<p>Bonjour ' . $partnerUser->name . ',</p><p><strong>' . strip_tags($request->name) . '</strong> vient de demander un devis en utilisant votre code de parrainage <strong>' . $request->ref . '</strong>.</p><p>Connectez-vous pour suivre l\'avancement de ce lead.</p>'
                            )
                        );
                    } catch (\Exception $e) {}
                }
            }
        }

        // 8. Store attachment metadata in lead (as JSON appended to notes)
        if (count($attachmentPaths) > 0) {
            $lead->update([
                'notes' => $lead->notes . "\n\n--- Attachment Paths (admin only) ---\n" . implode("\n", array_map(fn($a) => $a['path'], $attachmentPaths)),
            ]);
        }

        // 9. Send email to admin (via template - controllable by toggle)
        $this->sendViaTemplate('contact-form-admin', \App\Models\Setting::get('company.email', config('mail.from.address')), [
            'client_name' => strip_tags($request->name),
            'client_email' => $request->email,
            'service' => $selectedService,
            'budget' => $request->budget ?? '0',
            'message' => strip_tags($request->message),
        ]);

        // 10. Send confirmation email to the guest (via template - controllable by toggle)
        $confirmSlug = $isSimulator ? 'simulator-confirmation' : ($isQuote ? 'quote-request-confirmation' : 'contact-confirmation');
        $this->sendViaTemplate($confirmSlug, $request->email, [
            'client_name' => strip_tags($request->name),
            'estimated_budget' => $request->budget ?? '0',
            'portal_url' => config('app.url', ''),
        ]);

        if ($isSimulator) {
            return redirect()->back()->with('success', __('Your estimate request has been sent! Check your inbox for a confirmation. We will get back to you within 24 hours.'));
        }

        return redirect()->back()->with('success', $isQuote
            ? __('Your quote request has been sent! Check your inbox for a confirmation.')
            : __('Your message has been sent! Check your inbox for a confirmation.'));
    }

    /**
     * Download a contact form attachment (admin only).
     */
    public function downloadAttachment(Request $request, string $filename)
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            abort(403);
        }

        $path = 'contact-attachments/' . $filename;
        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->download($path, $filename);
    }

    /**
     * Send an email via a template slug. Respects is_active toggle.
     */
    private function sendViaTemplate(string $slug, string $to, array $variables): void
    {
        try {
            $locale = app()->getLocale(); // fr, en, or nl - set by visitor's language preference

            // Try visitor's locale first, fallback to 'en', then any available
            $template = \App\Models\EmailTemplate::where('slug', $slug)
                ->where('is_active', true)
                ->where('locale', $locale)
                ->first()
                ?? \App\Models\EmailTemplate::where('slug', $slug)
                    ->where('is_active', true)
                    ->where('locale', 'en')
                    ->first()
                ?? \App\Models\EmailTemplate::where('slug', $slug)
                    ->where('is_active', true)
                    ->first();

            if (!$template) return; // Template disabled or missing - don't send

            $subject = $template->subject;
            $body = $template->body;
            foreach ($variables as $key => $value) {
                $subject = str_replace("{{ {$key} }}", $value ?? '', $subject);
                $body = str_replace("{{ {$key} }}", $value ?? '', $body);
            }

            Mail::to($to)->send(new \App\Mail\TemplateMail($subject, $body));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Email [{$slug}] to {$to} failed: {$e->getMessage()}");
        }
    }
}
