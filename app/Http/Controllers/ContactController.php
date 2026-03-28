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

        // 2. Honeypot check — hidden field "website" must be empty
        if ($request->filled('website')) {
            // Bot detected — silently accept but don't process
            return redirect()->back()->with('success', 'Your message has been sent!');
        }

        // 3. Timing check — form must take at least 3 seconds to fill
        if ($request->filled('_form_loaded_at')) {
            $loadedAt = (int) $request->input('_form_loaded_at');
            if ($loadedAt > 0 && (time() - $loadedAt) < 3) {
                return redirect()->back()->with('success', 'Your message has been sent!');
            }
        }

        // 4. Cloudflare Turnstile verification
        $turnstileSecret = config('services.turnstile.secret_key');
        if ($turnstileSecret) {
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
            'website' => 'nullable|max:0', // honeypot — must be empty
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

        // 5. Store attachments on LOCAL disk (not public) — admin downloads via controller
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

        // 6. Build notes — sanitize input (strip HTML tags)
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

        // 7. Create Lead
        $lead = \App\Models\Lead::create([
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

        // 8. Store attachment metadata in lead (as JSON appended to notes)
        if (count($attachmentPaths) > 0) {
            $lead->update([
                'notes' => $lead->notes . "\n\n--- Attachment Paths (admin only) ---\n" . implode("\n", array_map(fn($a) => $a['path'], $attachmentPaths)),
            ]);
        }

        // 9. Send email to admin
        $formData = $request->only(['name', 'email', 'message']);
        $formData['service'] = $selectedService;
        $formData['budget'] = $request->budget ?? '0';

        try {
            $recipientEmail = \App\Models\Setting::get('company.email', 'ajari.nawfel@gmail.com');
            Mail::to($recipientEmail)->send(new ContactFormMail($formData));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Contact form admin email failed: {$e->getMessage()}");
        }

        // 10. Send confirmation email to the guest
        try {
            $confirmSlug = $isSimulator ? 'simulator-confirmation' : ($isQuote ? 'quote-request-confirmation' : 'contact-confirmation');
            $confirmTemplate = \App\Models\EmailTemplate::where('slug', $confirmSlug)
                ->where('is_active', true)
                ->where('locale', 'en')
                ->first();

            if ($confirmTemplate) {
                $portalUrl = config('app.url', 'https://na-innovations.be');
                $confirmSubject = str_replace(
                    ['{{ client_name }}', '{{ estimated_budget }}', '{{ portal_url }}'],
                    [strip_tags($request->name), $request->budget ?? '0', $portalUrl],
                    $confirmTemplate->subject
                );
                $confirmBody = str_replace(
                    ['{{ client_name }}', '{{ estimated_budget }}', '{{ portal_url }}'],
                    [strip_tags($request->name), $request->budget ?? '0', $portalUrl],
                    $confirmTemplate->body
                );

                Mail::to($request->email)->send(new \App\Mail\TemplateMail($confirmSubject, $confirmBody));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Contact form confirmation email failed: {$e->getMessage()}");
        }

        if ($isSimulator) {
            return redirect()->back()->with('success', 'Your estimate request has been sent! Check your inbox for a confirmation. We will get back to you within 24 hours.');
        }

        return redirect()->back()->with('success', $isQuote
            ? 'Your quote request has been sent! Check your inbox for a confirmation.'
            : 'Your message has been sent! Check your inbox for a confirmation.');
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
}
