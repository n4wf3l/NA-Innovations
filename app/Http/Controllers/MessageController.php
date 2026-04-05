<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Projet;
use App\Models\AcademicProjet;
use App\Models\Setting;
use App\Models\PublicService;
use App\Models\LandingSection;
use App\Models\Faq;
use Inertia\Inertia;


class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();
        return view('dashboard', compact('messages'));
    }
    public function store(Request $request)
{
    $request->validate([
        'content' => 'required|string',
        'enabled' => 'boolean',
    ]);


    $message = Message::where('enabled', true)->first();

    if ($message) {
        $message->update([
            'content' => $request->input('content'),
            'enabled' => $request->has('enabled'),
        ]);
    } else {
        $message = new Message();
        $message->content = $request->input('content');
        $message->enabled = $request->has('enabled');
        $message->save();
    }

    return redirect()->route('dashboard')->with('success', 'Message ajouté avec succès!');
}


public function welcomeMessages()
{
    $messages = Message::where('enabled', true)->get();

    $cachedData = \Illuminate\Support\Facades\Cache::remember('landing_page_data', 300, function () {
        $latestPosts = \App\Models\Post::published()->with('author')->latest('published_at')->take(3)->get();

        $socialLinks = Setting::where('group', 'social')->get()
            ->filter(fn($s) => !empty($s->value))
            ->mapWithKeys(fn($s) => [str_replace('social.', '', $s->key) => $s->value]);

        $branding = [
            'logo_path' => Setting::get('branding.logo_path', ''),
            'company_name' => Setting::get('branding.company_name', 'NA Innovations'),
            'tagline' => Setting::get('branding.tagline', ''),
        ];

        $services = PublicService::where('is_active', true)->orderBy('sort_order')->get()->map(function ($s) {
            $s->title = __($s->title);
            $s->description = __($s->description);
            return $s;
        });

        // Portfolio projects (published only) with images
        $portfolioProjects = \App\Models\PortfolioProject::where('is_published', true)
            ->with(['images' => fn($q) => $q->orderBy('sort_order'), 'projet'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->get();

        // Landing sections (hero, cta, etc.)
        $landingSections = LandingSection::orderBy('sort_order')->get()
            ->keyBy('section_key')
            ->map(function ($section) {
                if ($section->section_key === 'process' && isset($section->metadata['steps'])) {
                    $meta = $section->metadata;
                    $meta['steps'] = array_map(function ($step) {
                        $step['title'] = __($step['title']);
                        if (isset($step['description'])) $step['description'] = __($step['description']);
                        return $step;
                    }, $meta['steps']);
                    $section->metadata = $meta;
                }
                return $section;
            });

        // Testimonials from portfolio projects
        $portfolioTestimonials = \App\Models\PortfolioProject::whereNotNull('testimonial_text')
            ->where('testimonial_text', '!=', '')
            ->where('is_published', true)
            ->with('projet')
            ->get()
            ->map(fn($p) => [
                'text' => $p->testimonial_text,
                'author' => $p->testimonial_author,
                'role' => $p->testimonial_role,
                'project' => $p->projet?->nom_societe,
                'logo' => $p->projet?->image,
            ]);

        // Testimonials from clients (approved + show on landing)
        $clientTestimonials = \App\Models\Testimonial::onLanding()
            ->with('user:id,name,company_name,avatar')
            ->get()
            ->map(function ($t) {
                // Try to find project logo for this client
                $projectLogo = \App\Models\Projet::where('client_id', $t->user_id)
                    ->whereNotNull('image')
                    ->value('image');

                return [
                    'text' => $t->message,
                    'author' => $t->user->name,
                    'role' => $t->user->company_name ? 'Client' : 'Client',
                    'project' => $t->user->company_name,
                    'logo' => $projectLogo ?: $t->user->avatar,
                ];
            });

        $testimonials = $portfolioTestimonials->merge($clientTestimonials);

        // FAQs
        $faqs = Faq::where('is_active', true)->orderBy('sort_order')->get();

        // Public statistics
        $publicStats = [
            'projects_delivered' => \App\Models\Projet::where('status', 'completed')->count(),
            'active_clients' => \App\Models\User::where('role', 'client')->where('is_active', true)->count(),
            'technologies' => \App\Models\PortfolioProject::where('is_published', true)->pluck('tech_stack')->flatten()->unique()->count(),
            'years_experience' => max(1, now()->year - 2024),
        ];

        // SEO data
        $seo = [
            'title' => Setting::get('seo.home_title', 'NA Innovations'),
            'description' => Setting::get('seo.home_description', ''),
        ];

        // Presentation video URL
        $videoUrl = Setting::get('branding.video_url', '');

        return [
            'portfolio' => $portfolioProjects,
            'latestPosts' => $latestPosts,
            'socialLinks' => $socialLinks,
            'branding' => $branding,
            'services' => $services,
            'landingSections' => $landingSections,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
            'publicStats' => $publicStats,
            'seo' => $seo,
            'videoUrl' => $videoUrl,
        ];
    });

    return Inertia::render('Welcome', array_merge($cachedData, [
        'messages' => $messages->pluck('content'),
        'simulatorMode' => \App\Models\Setting::get('simulator.mode', 'europe_only'),
    ]));
}
    }

