<?php
use App\Http\Controllers\Controller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\ContactController;

use App\Http\Controllers\AboutController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicProjetController;
use App\Http\Controllers\MessageController;
use App\Models\Projet;
use App\Models\AcademicProjet;
use App\Models\PublicService;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Landing page is handled by MessageController::welcomeMessages below

Route::get('/brochure', function () {
    $path = \App\Models\Setting::get('brochure.file_path', '');
    if (!$path || !\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
        abort(404);
    }
    $companyName = \App\Models\Setting::get('branding.company_name', 'NA Innovations');
    $downloadName = preg_replace('/[^A-Za-z0-9-]/', '-', $companyName) . '-Brochure.pdf';
    return \Illuminate\Support\Facades\Storage::disk('public')->response($path, $downloadName, [
        'Content-Type' => 'application/pdf',
    ]);
})->name('public.brochure');


Route::get('/dashboard/ajouter-projet', [ProjetController::class, 'create'])->name('projets.create');
Route::post('/projets', [ProjetController::class, 'store'])->name('projets.store');
Route::get('/dashboard/ajouter-projet-academique', [AcademicProjetController::class, 'create'])->name('academic_projets.create');
Route::post('/academic_projets', [AcademicProjetController::class, 'store'])->name('academic_projets.store');
Route::get('/academic-projects', [AcademicProjetController::class, 'index'])->name('academic_projects.index');

Route::delete('/projets/{projet}', [ProjetController::class, 'destroy'])->name('projets.destroy');
Route::delete('/academic_projets/{academic_projet}', [AcademicProjetController::class, 'destroy'])->name('academic_projets.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return redirect(match (auth()->user()->role) {
            'admin' => '/admin/settings/branding',
            'developer' => '/dev/profile',
            'referral_partner' => '/partner/profile',
            'client' => '/client/profile',
            default => '/',
        });
    })->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/about', [App\Http\Controllers\AboutController::class, 'index'])->name('about');

Route::get('/projects', function () {
    $projects = \App\Models\PortfolioProject::where('is_published', true)
        ->with(['images' => fn($q) => $q->orderBy('sort_order'), 'projet'])
        ->orderBy('is_featured', 'desc')
        ->orderBy('sort_order')
        ->get();
    return \Inertia\Inertia::render('Projects', ['portfolio' => $projects]);
})->name('projects');

Route::get('/projects/{slug}', function (string $slug) {
    $project = \App\Models\PortfolioProject::where('slug', $slug)->where('is_published', true)
        ->with(['images' => fn($q) => $q->orderBy('sort_order'), 'projet'])
        ->firstOrFail();

    $allSlugs = \App\Models\PortfolioProject::where('is_published', true)
        ->orderBy('is_featured', 'desc')
        ->orderBy('sort_order')
        ->get(['id', 'title', 'slug']);

    $currentIndex = $allSlugs->search(fn($p) => $p->id === $project->id);
    $previousProject = $currentIndex > 0 ? $allSlugs[$currentIndex - 1]->only(['slug', 'title']) : null;
    $nextProject = $currentIndex < $allSlugs->count() - 1 ? $allSlugs[$currentIndex + 1]->only(['slug', 'title']) : null;

    return \Inertia\Inertia::render('Projects/Show', [
        'project' => $project,
        'previousProject' => $previousProject,
        'nextProject' => $nextProject,
    ]);
})->name('projects.show');


Route::get('/posts', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Post::published()->with('author');

    if ($request->filled('category')) {
        $query->where('category', $request->category);
    }

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('excerpt', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }

    $posts = $query->latest('published_at')->paginate(9)->withQueryString();

    $categories = \App\Models\Post::published()
        ->whereNotNull('category')
        ->distinct()
        ->pluck('category');

    $seo = [
        'title' => \App\Models\Setting::get('seo.blog_title', 'Blog — NA Innovations'),
        'description' => \App\Models\Setting::get('seo.blog_description', 'Articles et actualités sur le développement web et mobile.'),
    ];

    return \Inertia\Inertia::render('Blog', [
        'posts' => $posts,
        'categories' => $categories,
        'seo' => $seo,
    ]);
})->name('posts.index');

Route::get('/posts/{slug}', function (string $slug) {
    $post = \App\Models\Post::where('slug', $slug)->published()->with('author')->firstOrFail();

    $relatedPosts = \App\Models\Post::published()
        ->where('id', '!=', $post->id)
        ->where('category', $post->category)
        ->latest('published_at')
        ->take(3)
        ->get();

    return \Inertia\Inertia::render('Blog/Show', [
        'post' => $post,
        'relatedPosts' => $relatedPosts,
    ]);
})->name('posts.show');

Route::get('/dashboard', function () {
    $user = auth()->user();
    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'developer' => redirect('/dev/dashboard'),
        'referral_partner' => redirect('/partner/dashboard'),
        'client' => redirect('/client/dashboard'),
        default => redirect('/'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');
Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
Route::get('/', [MessageController::class, 'welcomeMessages'])->name('welcome');
Route::get('/sitemap.xml', [App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

// Notification polling endpoint (lightweight JSON)
Route::get('/api/notifications/poll', function () {
    if (!auth()->check()) return response()->json(['count' => 0, 'notifications' => []]);
    $notifications = \App\Models\NotificationLog::where('user_id', auth()->id())
        ->latest()
        ->take(10)
        ->get(['id', 'title', 'message', 'action_url', 'is_read', 'created_at']);
    $unread = \App\Models\NotificationLog::where('user_id', auth()->id())->where('is_read', false)->count();
    return response()->json(['count' => $unread, 'notifications' => $notifications]);
})->middleware('auth')->name('notifications.poll');

// Mark notification as read
Route::post('/api/notifications/{id}/read', function ($id) {
    if (!auth()->check()) abort(403);
    \App\Models\NotificationLog::where('id', $id)->where('user_id', auth()->id())->update(['is_read' => true]);
    return response()->json(['ok' => true]);
})->middleware('auth')->name('notifications.read');

// Mark all as read
Route::post('/api/notifications/read-all', function () {
    if (!auth()->check()) abort(403);
    \App\Models\NotificationLog::where('user_id', auth()->id())->where('is_read', false)->update(['is_read' => true]);
    return response()->json(['ok' => true]);
})->middleware('auth')->name('notifications.read-all');

// Sidebar preferences (order, hidden items, accent color)
Route::put('/api/sidebar-preferences', function (\Illuminate\Http\Request $request) {
    if (!auth()->check()) abort(403);
    $validated = $request->validate([
        'sidebar_order' => 'nullable|array',
        'hidden_items' => 'nullable|array',
        'accent_color' => 'nullable|string|max:20',
        'sidebar_style' => 'nullable|string|in:default,compact,minimal',
    ]);
    $user = auth()->user();
    $prefs = $user->preferences ?? [];
    $prefs['sidebar'] = array_filter([
        'order' => $validated['sidebar_order'] ?? null,
        'hidden' => $validated['hidden_items'] ?? null,
        'accent_color' => $validated['accent_color'] ?? null,
        'style' => $validated['sidebar_style'] ?? null,
    ]);
    $user->update(['preferences' => $prefs]);
    return response()->json(['ok' => true]);
})->middleware('auth')->name('sidebar.preferences');

// Tour completion — saves in user preferences
Route::put('/api/tour-completed', function (\Illuminate\Http\Request $request) {
    if (!auth()->check()) abort(403);
    $tourKey = $request->input('tour_key');
    $allowed = ['client_dashboard', 'partner_dashboard', 'dev_dashboard', 'admin_dashboard'];
    if (!in_array($tourKey, $allowed)) abort(422);

    $user = auth()->user();
    $prefs = $user->preferences ?? [];
    $prefs['onboarding'] = $prefs['onboarding'] ?? [];

    if ($request->boolean('reset')) {
        unset($prefs['onboarding'][$tourKey]);
    } else {
        $prefs['onboarding'][$tourKey] = true;
    }

    $user->preferences = $prefs;
    $user->save();

    return response()->json(['ok' => true]);
})->middleware('auth')->name('tour.completed');


Route::get('/services', function () {
    $services = PublicService::where('is_active', true)->orderBy('sort_order')->get()->map(function ($s) {
        $s->title = __($s->title);
        $s->description = __($s->description);
        return $s;
    });
    return Inertia::render('Services', ['services' => $services]);
})->name('services');

Route::get('/products', function () {
    $products = \App\Models\Product::where('is_published', true)
        ->with('project')
        ->orderBy('is_featured', 'desc')
        ->orderBy('sort_order')
        ->get();
    return \Inertia\Inertia::render('Products/SaaS', ['products' => $products]);
})->name('products.saas');

Route::get('/products/{slug}', function (string $slug) {
    $product = \App\Models\Product::where('slug', $slug)->where('is_published', true)->firstOrFail();
    return \Inertia\Inertia::render('Products/SaaSShow', ['product' => $product]);
})->name('products.saas.show');

Route::get('/terms', function () {
    $terms = \App\Models\LandingSection::where('section_key', 'terms')->first();
    return Inertia::render('Legal/Terms', ['content' => $terms]);
})->name('terms');

Route::get('/privacy', function () {
    $privacy = \App\Models\LandingSection::where('section_key', 'privacy')->first();
    return Inertia::render('Legal/Privacy', ['content' => $privacy]);
})->name('privacy');

Route::get('/pricing', function () {
    $seo = [
        'title' => \App\Models\Setting::get('seo.pricing_title', 'Tarifs — NA Innovations'),
        'description' => \App\Models\Setting::get('seo.pricing_description', 'Nos tarifs indicatifs par type de projet.'),
    ];
    return \Inertia\Inertia::render('Pricing', ['seo' => $seo]);
})->name('pricing');

Route::get('/ref/{code}', function (string $code) {
    $partner = \App\Models\ReferralPartner::where('referral_code', $code)->where('is_active', true)->first();
    if (!$partner) return redirect('/contact');
    return redirect('/contact?ref=' . $code);
})->name('referral.redirect');

Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/send-email', [ContactController::class, 'sendEmail'])->name('send-email');
Route::get('/admin/contact-attachments/{filename}', [ContactController::class, 'downloadAttachment'])->middleware('auth')->name('contact.attachment');

Route::get('locale/{locale}', [App\Http\Controllers\LocaleController::class, 'switch'])->name('locale.switch');

// Chatbot API (public, no auth)
Route::post('/api/chatbot', [App\Http\Controllers\ChatbotController::class, 'chat'])->name('chatbot');
Route::get('/api/chatbot/status', function () {
    $enabled = \App\Models\Setting::get('chatbot.enabled', 'false') === 'true';
    $apiOk = \App\Models\Setting::get('chatbot.api_available', 'true') === 'true';
    $hasKnowledge = !empty(\App\Models\Setting::get('chatbot.knowledge_text', ''));
    return response()->json(['available' => $enabled && $apiOk && $hasKnowledge]);
})->name('chatbot.status');

// Financial PIN routes (accessible to all authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/financial-pin/verify', [App\Http\Controllers\FinancialPinController::class, 'verify'])->name('financial-pin.verify');
    Route::post('/financial-pin/lock', [App\Http\Controllers\FinancialPinController::class, 'lock'])->name('financial-pin.lock');
    Route::get('/financial-pin/status', [App\Http\Controllers\FinancialPinController::class, 'status'])->name('financial-pin.status');
});

// Developer portal routes
Route::prefix('dev')->middleware(['auth', 'developer'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Dev\DashboardController::class, 'index'])->name('dev.dashboard');
    Route::get('/projects', [App\Http\Controllers\Dev\ProjectController::class, 'index'])->name('dev.projects.index');
    Route::get('/projects/{project}', [App\Http\Controllers\Dev\ProjectController::class, 'show'])->name('dev.projects.show');
    Route::post('/projects/{project}/claim', [App\Http\Controllers\Dev\ProjectController::class, 'claim'])->name('dev.projects.claim');
    Route::patch('/projects/{project}/status', [App\Http\Controllers\Dev\ProjectController::class, 'updateStatus'])->name('dev.projects.update-status');

    // Support
    Route::get('/support', [App\Http\Controllers\Client\SupportController::class, 'index'])->name('dev.support.index');
    Route::post('/support', [App\Http\Controllers\Client\SupportController::class, 'store'])->name('dev.support.store');
    Route::get('/support/{ticket}', [App\Http\Controllers\Client\SupportController::class, 'show'])->name('dev.support.show');
    Route::post('/support/{ticket}/reply', [App\Http\Controllers\Client\SupportController::class, 'reply'])->name('dev.support.reply');

    // Dev Profile
    Route::get('/profile', [App\Http\Controllers\Dev\ProfileController::class, 'index'])->name('dev.profile');
    Route::put('/profile', [App\Http\Controllers\Dev\ProfileController::class, 'update'])->name('dev.profile.update');
    Route::put('/profile/password', [App\Http\Controllers\Dev\ProfileController::class, 'updatePassword'])->name('dev.profile.password');

    // Time entries
    Route::post('/projects/{project}/time', [App\Http\Controllers\Dev\TimeEntryController::class, 'store'])->name('dev.time.store');
    Route::put('/time/{entry}', [App\Http\Controllers\Dev\TimeEntryController::class, 'update'])->name('dev.time.update');
    Route::delete('/time/{entry}', [App\Http\Controllers\Dev\TimeEntryController::class, 'destroy'])->name('dev.time.destroy');

    // Dev Notes
    Route::post('/projects/{project}/notes', [App\Http\Controllers\Dev\ProjectController::class, 'storeNote'])->name('dev.notes.store');
    Route::delete('/notes/{note}', [App\Http\Controllers\Dev\ProjectController::class, 'destroyNote'])->name('dev.notes.destroy');

    // Dev Documentation
    Route::post('/projects/{project}/docs', [App\Http\Controllers\Dev\ProjectController::class, 'storeDocs'])->name('dev.projects.docs.store');
    Route::put('/project-docs/{doc}', [App\Http\Controllers\Dev\ProjectController::class, 'updateDocs'])->name('dev.projects.docs.update');

    // Dev portal advanced features
    Route::post('/projects/{project}/release', [App\Http\Controllers\Dev\ProjectController::class, 'release'])->name('dev.projects.release');
    Route::post('/projects/{project}/milestones', [App\Http\Controllers\Dev\ProjectController::class, 'storeMilestone'])->name('dev.milestones.store');
    Route::post('/projects/{project}/milestones/reorder', [App\Http\Controllers\Dev\ProjectController::class, 'reorderMilestones'])->name('dev.milestones.reorder');
    Route::put('/milestones/{milestone}', [App\Http\Controllers\Dev\ProjectController::class, 'updateMilestone'])->name('dev.milestones.update');
    Route::delete('/milestones/{milestone}', [App\Http\Controllers\Dev\ProjectController::class, 'deleteMilestone'])->name('dev.milestones.destroy');
    Route::post('/projects/{project}/messages', [App\Http\Controllers\Dev\ProjectController::class, 'storeMessage'])->name('dev.messages.store');
    Route::patch('/projects/{project}/blocked-status', [App\Http\Controllers\Dev\ProjectController::class, 'updateBlockedStatus'])->name('dev.projects.blocked-status');
    Route::put('/projects/{project}/credentials', [App\Http\Controllers\Dev\ProjectController::class, 'updateCredentials'])->name('dev.projects.credentials');
    Route::get('/earnings', [App\Http\Controllers\Dev\EarningsController::class, 'index'])->name('dev.earnings');
    Route::get('/team', [App\Http\Controllers\Dev\TeamController::class, 'index'])->name('dev.team');

    // Dev Exports
    Route::get('/exports/timesheet', [App\Http\Controllers\Dev\ExportController::class, 'timesheetPdf'])->name('dev.exports.timesheet');
    Route::get('/exports/statement', [App\Http\Controllers\Dev\ExportController::class, 'monthlyStatement'])->name('dev.exports.statement');
});

// Partner portal routes
Route::prefix('partner')->middleware(['auth', 'referral'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Partner\DashboardController::class, 'index'])->name('partner.dashboard');
    Route::get('/leads', [App\Http\Controllers\Partner\LeadController::class, 'index'])->name('partner.leads.index');
    Route::get('/leads/submit', [App\Http\Controllers\Partner\LeadController::class, 'create'])->name('partner.leads.submit');
    Route::post('/leads/submit', [App\Http\Controllers\Partner\LeadController::class, 'store'])->name('partner.leads.store');
    Route::get('/leads/{lead}', [App\Http\Controllers\Partner\LeadController::class, 'show'])->name('partner.leads.show');
    Route::get('/commissions', [App\Http\Controllers\Partner\CommissionController::class, 'index'])->name('partner.commissions.index');
    Route::get('/commissions/export', [App\Http\Controllers\Partner\CommissionController::class, 'exportCsv'])->name('partner.commissions.export');
    Route::get('/commissions/export-pdf', [App\Http\Controllers\Partner\CommissionController::class, 'exportPdf'])->name('partner.commissions.export-pdf');
    Route::get('/resources', [App\Http\Controllers\Partner\PageController::class, 'index'])->name('partner.pages.index');
    Route::get('/resources/{slug}', [App\Http\Controllers\Partner\PageController::class, 'show'])->name('partner.pages.show');
    Route::get('/guide', [App\Http\Controllers\Partner\GuideController::class, 'index'])->name('partner.guide');
    Route::get('/prospecting', [App\Http\Controllers\Partner\GuideController::class, 'prospecting'])->name('partner.prospecting');
    Route::get('/help', function () {
        return \Inertia\Inertia::render('Partner/Help', [
            'faqs' => \App\Models\PartnerFaq::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(['id', 'question', 'answer', 'category']),
            'contactEmail' => \App\Models\Setting::get('partner.contact_email', \App\Models\Setting::get('email_signature.email', 'info@nainnovations.be')),
        ]);
    })->name('partner.help');
    Route::post('/prospecting/request-access', [App\Http\Controllers\Partner\GuideController::class, 'requestKbAccess'])->name('partner.kb.request');
    Route::get('/reminders', [App\Http\Controllers\Partner\ReminderController::class, 'index'])->name('partner.reminders');
    Route::post('/reminders', [App\Http\Controllers\Partner\ReminderController::class, 'store'])->name('partner.reminders.store');
    Route::put('/reminders/{reminder}', [App\Http\Controllers\Partner\ReminderController::class, 'update'])->name('partner.reminders.update');
    Route::patch('/reminders/{reminder}/dismiss', [App\Http\Controllers\Partner\ReminderController::class, 'dismiss'])->name('partner.reminders.dismiss');
    Route::delete('/reminders/{reminder}', [App\Http\Controllers\Partner\ReminderController::class, 'destroy'])->name('partner.reminders.destroy');
    // Partner Prospects (mini-CRM)
    Route::get('/prospects', [App\Http\Controllers\Partner\ProspectController::class, 'index'])->name('partner.prospects.index');
    Route::post('/prospects', [App\Http\Controllers\Partner\ProspectController::class, 'store'])->name('partner.prospects.store');
    Route::put('/prospects/{prospect}', [App\Http\Controllers\Partner\ProspectController::class, 'update'])->name('partner.prospects.update');
    Route::patch('/prospects/{prospect}/status', [App\Http\Controllers\Partner\ProspectController::class, 'updateStatus'])->name('partner.prospects.status');
    Route::delete('/prospects/{prospect}', [App\Http\Controllers\Partner\ProspectController::class, 'destroy'])->name('partner.prospects.destroy');

    // Support
    Route::get('/support', [App\Http\Controllers\Client\SupportController::class, 'index'])->name('partner.support.index');
    Route::post('/support', [App\Http\Controllers\Client\SupportController::class, 'store'])->name('partner.support.store');
    Route::get('/support/{ticket}', [App\Http\Controllers\Client\SupportController::class, 'show'])->name('partner.support.show');
    Route::post('/support/{ticket}/reply', [App\Http\Controllers\Client\SupportController::class, 'reply'])->name('partner.support.reply');

    Route::get('/profile', [App\Http\Controllers\Partner\ProfileController::class, 'edit'])->name('partner.profile');
    Route::put('/profile', [App\Http\Controllers\Partner\ProfileController::class, 'update'])->name('partner.profile.update');
    Route::put('/profile/password', [App\Http\Controllers\Partner\ProfileController::class, 'updatePassword'])->name('partner.profile.password');
});

// GitHub OAuth
Route::middleware('auth')->group(function () {
    Route::get('/auth/github/redirect', [App\Http\Controllers\Auth\GitHubController::class, 'redirect'])->name('github.redirect');
    Route::get('/auth/github/callback', [App\Http\Controllers\Auth\GitHubController::class, 'callback'])->name('github.callback');
    Route::post('/auth/github/disconnect', [App\Http\Controllers\Auth\GitHubController::class, 'disconnect'])->name('github.disconnect');
});

// API endpoints (session auth)
Route::get('/api/projects/{project}/commits', App\Http\Controllers\Api\ProjectCommitsController::class)->middleware('auth')->name('api.projects.commits');

// Public quote actions via token (no login required)
Route::get('/quotes/{quote}/view/{token}', function (\App\Models\Quote $quote, string $token) {
    if ($quote->view_token !== $token) abort(403);
    if (!$quote->viewed_at && in_array($quote->status, ['sent'])) {
        $quote->update(['status' => 'viewed', 'viewed_at' => now()]);
    }
    return \Inertia\Inertia::render('Public/QuoteView', ['quote' => $quote->load('items')]);
})->name('quotes.public-view');

Route::post('/quotes/{quote}/accept/{token}', function (\Illuminate\Http\Request $request, \App\Models\Quote $quote, string $token) {
    if ($quote->view_token !== $token) abort(403);
    if (!in_array($quote->status, ['sent', 'viewed'])) {
        return redirect()->back()->with('error', 'Ce devis ne peut plus être accepté.');
    }
    \App\Services\WorkflowService::onQuoteAccepted($quote);
    return redirect()->back()->with('success', 'Devis accepté ! Votre projet a été initié.');
})->name('quotes.public-accept');

Route::post('/quotes/{quote}/reject/{token}', function (\Illuminate\Http\Request $request, \App\Models\Quote $quote, string $token) {
    if ($quote->view_token !== $token) abort(403);
    if (!in_array($quote->status, ['sent', 'viewed'])) {
        return redirect()->back()->with('error', 'Ce devis ne peut plus être refusé.');
    }
    $request->validate(['reason' => 'nullable|string|max:1000']);
    \App\Services\WorkflowService::onQuoteRejected($quote, $request->input('reason'));
    return redirect()->back()->with('success', 'Devis refusé.');
})->name('quotes.public-reject');

// Client portal routes
Route::prefix('client')->middleware(['auth', 'client'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Client\DashboardController::class, 'index'])->name('client.dashboard');
    Route::get('/projects', [App\Http\Controllers\Client\ProjectController::class, 'index'])->name('client.projects.index');
    Route::get('/projects/{project}', [App\Http\Controllers\Client\ProjectController::class, 'show'])->name('client.projects.show');
    Route::post('/projects/{project}/comment', [App\Http\Controllers\Client\ProjectController::class, 'addComment'])->name('client.projects.comment');
    Route::get('/quotes', [App\Http\Controllers\Client\QuoteController::class, 'index'])->name('client.quotes.index');
    Route::get('/quotes/{quote}', [App\Http\Controllers\Client\QuoteController::class, 'show'])->name('client.quotes.show');
    Route::get('/quotes/{quote}/pdf', [App\Http\Controllers\Client\QuoteController::class, 'downloadPdf'])->name('client.quotes.pdf');
    Route::get('/quotes/{quote}/pdf/preview', [App\Http\Controllers\Client\QuoteController::class, 'previewPdf'])->name('client.quotes.pdf.preview');
    Route::post('/quotes/{quote}/accept', [App\Http\Controllers\Client\QuoteController::class, 'accept'])->name('client.quotes.accept');
    Route::post('/quotes/{quote}/reject', [App\Http\Controllers\Client\QuoteController::class, 'reject'])->name('client.quotes.reject');
    Route::get('/invoices', [App\Http\Controllers\Client\InvoiceController::class, 'index'])->name('client.invoices.index');
    Route::get('/invoices/{invoice}', [App\Http\Controllers\Client\InvoiceController::class, 'show'])->name('client.invoices.show');
    Route::get('/invoices/{invoice}/pdf', [App\Http\Controllers\Client\InvoiceController::class, 'downloadPdf'])->name('client.invoices.pdf');
    Route::get('/invoices/{invoice}/pdf/preview', [App\Http\Controllers\Client\InvoiceController::class, 'previewPdf'])->name('client.invoices.pdf.preview');
    Route::get('/profile', [App\Http\Controllers\Client\ProfileController::class, 'edit'])->name('client.profile');
    Route::put('/profile', [App\Http\Controllers\Client\ProfileController::class, 'update'])->name('client.profile.update');
    Route::post('/profile/avatar', [App\Http\Controllers\Client\ProfileController::class, 'updateAvatar'])->name('client.profile.avatar');
    Route::put('/profile/password', [App\Http\Controllers\Client\ProfileController::class, 'updatePassword'])->name('client.profile.password');
    Route::put('/profile/notifications', [App\Http\Controllers\Client\ProfileController::class, 'updateNotifications'])->name('client.profile.notifications');
    Route::delete('/profile', [App\Http\Controllers\Client\ProfileController::class, 'deleteAccount'])->name('client.profile.delete');

    // Support
    Route::get('/support', [App\Http\Controllers\Client\SupportController::class, 'index'])->name('client.support.index');
    Route::post('/support', [App\Http\Controllers\Client\SupportController::class, 'store'])->name('client.support.store');
    Route::get('/support/{ticket}', [App\Http\Controllers\Client\SupportController::class, 'show'])->name('client.support.show');
    Route::post('/support/{ticket}/reply', [App\Http\Controllers\Client\SupportController::class, 'reply'])->name('client.support.reply');

    // Client Testimonial
    Route::post('/testimonial', function (\Illuminate\Http\Request $request) {
        $request->validate(['message' => 'required|string|max:1000', 'rating' => 'nullable|integer|min:1|max:5']);
        $existing = \App\Models\Testimonial::where('user_id', auth()->id())->first();
        if ($existing) return back()->with('error', 'Vous avez déjà soumis un témoignage.');
        \App\Models\Testimonial::create(['user_id' => auth()->id(), 'message' => $request->message, 'rating' => $request->rating, 'status' => 'pending']);
        // Notify admins
        \App\Models\User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)->where('role', 'admin')->where('is_active', true)->each(fn($admin) =>
            \App\Models\NotificationLog::create(['user_id' => $admin->id, 'type' => 'testimonial_submitted', 'title' => 'Nouveau témoignage', 'message' => auth()->user()->name . ' a soumis un témoignage.', 'action_url' => '/admin/settings/testimonials', 'is_read' => false])
        );
        return back()->with('success', 'Merci ! Votre témoignage a été soumis pour approbation.');
    })->name('client.testimonial.store');

    // Project Attachments (external documents)
    Route::get('projects/{project}/attachments/{document}/download', [App\Http\Controllers\Client\ProjectController::class, 'downloadAttachment'])->name('client.projects.attachments.download');

    // Technical Documentation (read-only)
    Route::get('projects/{project}/docs', [App\Http\Controllers\Client\ProjectController::class, 'docs'])->name('client.projects.docs');

    // Purchase Orders
    Route::get('purchase-orders', [App\Http\Controllers\Client\PurchaseOrderController::class, 'index'])->name('client.purchase-orders.index');
    Route::get('purchase-orders/{po}/pdf', [App\Http\Controllers\Client\PurchaseOrderController::class, 'downloadPdf'])->name('client.purchase-orders.pdf');

    // Annual Summary Export
    Route::get('exports/annual-summary', [App\Http\Controllers\Client\ExportController::class, 'annualSummary'])->name('client.exports.annual-summary');

    // Documents
    Route::get('documents/{document}', [App\Http\Controllers\Client\DocumentController::class, 'show'])->name('client.documents.show');
    Route::post('documents/{document}/sign', [App\Http\Controllers\Client\DocumentController::class, 'sign'])->name('client.documents.sign');
    Route::post('documents/{document}/reject', [App\Http\Controllers\Client\DocumentController::class, 'reject'])->name('client.documents.reject');
    Route::get('documents/{document}/pdf', [App\Http\Controllers\Client\DocumentController::class, 'downloadPdf'])->name('client.documents.pdf');
    Route::get('documents/{document}/pdf/preview', [App\Http\Controllers\Client\DocumentController::class, 'previewPdf'])->name('client.documents.pdf.preview');
});

// API routes (authenticated)
Route::middleware('auth')->group(function () {
    Route::get('/api/search', App\Http\Controllers\Api\SearchController::class)->name('api.search');
});

// Admin routes
Route::prefix('admin')->middleware(['auth', 'admin', 'admin.tenant'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
    Route::put('dashboard/preferences', [App\Http\Controllers\Admin\DashboardController::class, 'updatePreferences'])->name('admin.dashboard.preferences');
    Route::put('dashboard/activity-mode', function (\Illuminate\Http\Request $request) {
        $mode = $request->validate(['mode' => 'required|in:hour,day,week,month'])['mode'];
        \App\Models\Setting::set('activity_chart_mode', $mode);
        \Illuminate\Support\Facades\Cache::forget('activity_chart_hour');
        \Illuminate\Support\Facades\Cache::forget('activity_chart_day');
        \Illuminate\Support\Facades\Cache::forget('activity_chart_week');
        \Illuminate\Support\Facades\Cache::forget('activity_chart_month');
        return response()->json(['ok' => true]);
    })->name('admin.dashboard.activity-mode');

    Route::get('dashboard/activity-chart', function () {
        $mode = \App\Models\Setting::get('activity_chart_mode', 'hour');
        $chart = [];
        try {
            if ($mode === 'hour') {
                $data = \App\Models\ActivityLog::where('created_at', '>=', now()->subHours(24))
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as period, COUNT(*) as count")
                    ->groupBy('period')->pluck('count', 'period')->toArray();
                for ($i = 23; $i >= 0; $i--) {
                    $key = now()->subHours($i)->format('Y-m-d H:00:00');
                    $chart[] = ['label' => now()->subHours($i)->format('H:00'), 'count' => $data[$key] ?? 0];
                }
            } elseif ($mode === 'day') {
                $data = \App\Models\ActivityLog::where('created_at', '>=', now()->subDays(30))
                    ->selectRaw("DATE(created_at) as period, COUNT(*) as count")
                    ->groupBy('period')->pluck('count', 'period')->toArray();
                for ($i = 29; $i >= 0; $i--) {
                    $key = now()->subDays($i)->format('Y-m-d');
                    $chart[] = ['label' => now()->subDays($i)->format('d/m'), 'count' => $data[$key] ?? 0];
                }
            } elseif ($mode === 'week') {
                $data = \App\Models\ActivityLog::where('created_at', '>=', now()->subWeeks(12))
                    ->selectRaw("DATE(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY)) as period, COUNT(*) as count")
                    ->groupBy('period')->pluck('count', 'period')->toArray();
                for ($i = 11; $i >= 0; $i--) {
                    $d = now()->subWeeks($i)->startOfWeek();
                    $key = $d->format('Y-m-d');
                    $chart[] = ['label' => 'S' . $d->weekOfYear, 'count' => $data[$key] ?? 0];
                }
            } elseif ($mode === 'month') {
                $data = \App\Models\ActivityLog::where('created_at', '>=', now()->subMonths(12))
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as count")
                    ->groupBy('period')->pluck('count', 'period')->toArray();
                for ($i = 11; $i >= 0; $i--) {
                    $key = now()->subMonths($i)->format('Y-m');
                    $chart[] = ['label' => now()->subMonths($i)->format('M'), 'count' => $data[$key] ?? 0];
                }
            }
        } catch (\Throwable $e) {}
        return response()->json(['mode' => $mode, 'chart' => $chart]);
    })->name('admin.dashboard.activity-chart');

    // Timesheets
    Route::get('timesheets', [App\Http\Controllers\Admin\TimeEntryController::class, 'index'])->name('admin.timesheets');
    Route::get('time-entries/pending', [App\Http\Controllers\Admin\TimeEntryController::class, 'pending'])->name('admin.time-entries.pending');
    Route::post('time-entries/{entry}/approve', [App\Http\Controllers\Admin\TimeEntryController::class, 'approve'])->name('admin.time-entries.approve');
    Route::post('time-entries/{entry}/reject', [App\Http\Controllers\Admin\TimeEntryController::class, 'reject'])->name('admin.time-entries.reject');

    // Dev portal settings
    Route::get('settings/dev-portal', [App\Http\Controllers\Admin\DevPortalSettingsController::class, 'index'])->name('admin.settings.dev-portal');
    Route::put('settings/dev-portal', [App\Http\Controllers\Admin\DevPortalSettingsController::class, 'update'])->name('admin.settings.dev-portal.update');

    // Bulk actions (MUST be before resource routes)
    Route::patch('leads/bulk-status', [App\Http\Controllers\Admin\LeadController::class, 'bulkUpdateStatus'])->name('admin.leads.bulk-status');
    Route::post('leads/bulk-delete', [App\Http\Controllers\Admin\LeadController::class, 'bulkDelete'])->name('admin.leads.bulk-delete');

    Route::resource('leads', App\Http\Controllers\Admin\LeadController::class)->names([
        'index' => 'admin.leads.index',
        'create' => 'admin.leads.create',
        'store' => 'admin.leads.store',
        'show' => 'admin.leads.show',
        'edit' => 'admin.leads.edit',
        'update' => 'admin.leads.update',
        'destroy' => 'admin.leads.destroy',
    ]);

    Route::resource('clients', App\Http\Controllers\Admin\ClientController::class)->names('admin.clients');
    Route::resource('projects', App\Http\Controllers\Admin\ProjectController::class)->names('admin.projects');

    Route::patch('leads/{lead}/status', [App\Http\Controllers\Admin\LeadController::class, 'updateStatus'])->name('admin.leads.update-status');
    Route::patch('projects/{project}/status', [App\Http\Controllers\Admin\ProjectController::class, 'updateStatus'])->name('admin.projects.update-status');
    Route::patch('projects/{project}/github', [App\Http\Controllers\Admin\ProjectController::class, 'updateGithub'])->name('admin.projects.update-github');
    Route::post('projects/{project}/send-email', [App\Http\Controllers\Admin\ProjectController::class, 'sendEmail'])->name('admin.projects.send-email');
    Route::post('projects/{project}/co-owners', [App\Http\Controllers\Admin\ProjectController::class, 'addCoOwner'])->name('admin.projects.co-owners.store');
    Route::delete('projects/{project}/co-owners/{userId}', [App\Http\Controllers\Admin\ProjectController::class, 'removeCoOwner'])->whereNumber('userId')->name('admin.projects.co-owners.destroy');
    Route::post('projects/{project}/payouts', [App\Http\Controllers\Admin\ProjectController::class, 'storePayout'])->name('admin.projects.payouts.store');
    Route::patch('payouts/{payout}', [App\Http\Controllers\Admin\ProjectController::class, 'updatePayout'])->name('admin.payouts.update');
    Route::delete('payouts/{payout}', [App\Http\Controllers\Admin\ProjectController::class, 'destroyPayout'])->name('admin.payouts.destroy');
    Route::get('calendar', [App\Http\Controllers\Admin\CalendarController::class, 'index'])->name('admin.calendar');
    Route::get('revenue', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'global'])->name('admin.revenue');
    Route::get('projects/{project}/budget', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'index'])->name('admin.projects.budget');
    Route::post('projects/{project}/budget', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'store'])->name('admin.projects.budget.store');
    Route::put('projects/{project}/budget/{line}', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'update'])->name('admin.projects.budget.update');
    Route::delete('projects/{project}/budget/{line}', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'destroy'])->name('admin.projects.budget.destroy');
    Route::resource('partners', App\Http\Controllers\Admin\PartnerController::class)->names('admin.partners');

    // Notes (global — works on any entity)
    Route::post('notes', [App\Http\Controllers\Admin\NoteController::class, 'store'])->name('admin.notes.store');
    Route::patch('notes/{note}/pin', [App\Http\Controllers\Admin\NoteController::class, 'togglePin'])->name('admin.notes.toggle-pin');
    Route::delete('notes/{note}', [App\Http\Controllers\Admin\NoteController::class, 'destroy'])->name('admin.notes.destroy');

    // Quotes
    Route::post('quotes/upload-external', [App\Http\Controllers\Admin\QuoteController::class, 'storeExternal'])->name('admin.quotes.store-external');
    Route::resource('quotes', App\Http\Controllers\Admin\QuoteController::class)->names('admin.quotes');
    Route::post('quotes/{quote}/send', [App\Http\Controllers\Admin\QuoteController::class, 'send'])->name('admin.quotes.send');
    Route::post('quotes/{quote}/accept', [App\Http\Controllers\Admin\QuoteController::class, 'accept'])->name('admin.quotes.accept');
    Route::post('quotes/{quote}/reject', [App\Http\Controllers\Admin\QuoteController::class, 'reject'])->name('admin.quotes.reject');
    Route::post('quotes/{quote}/duplicate', [App\Http\Controllers\Admin\QuoteController::class, 'duplicate'])->name('admin.quotes.duplicate');
    Route::post('quotes/{quote}/create-invoice', [App\Http\Controllers\Admin\QuoteController::class, 'createInvoice'])->name('admin.quotes.create-invoice');
    Route::get('quotes/{quote}/pdf', [App\Http\Controllers\Admin\QuoteController::class, 'downloadPdf'])->name('admin.quotes.pdf');
    Route::get('quotes/{quote}/pdf/preview', [App\Http\Controllers\Admin\QuoteController::class, 'previewPdf'])->name('admin.quotes.pdf.preview');

    // Audit Log
    Route::get('audit-log', [App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('admin.audit-log');

    // Email Templates
    Route::get('settings/email-templates', [App\Http\Controllers\Admin\EmailTemplateController::class, 'index'])->name('admin.email-templates.index');
    Route::put('settings/email-templates/{emailTemplate}', [App\Http\Controllers\Admin\EmailTemplateController::class, 'update'])->name('admin.email-templates.update');
    Route::patch('settings/email-templates/{emailTemplate}/toggle', [App\Http\Controllers\Admin\EmailTemplateController::class, 'toggleActive'])->name('admin.email-templates.toggle');

    // Prospecting Email Templates (used by partners on /partner/prospecting)
    Route::get('settings/prospecting-email-templates', [App\Http\Controllers\Admin\ProspectingEmailTemplateController::class, 'index'])->name('admin.prospecting-email-templates.index');
    Route::post('settings/prospecting-email-templates', [App\Http\Controllers\Admin\ProspectingEmailTemplateController::class, 'store'])->name('admin.prospecting-email-templates.store');
    Route::put('settings/prospecting-email-templates/{prospectingEmailTemplate}', [App\Http\Controllers\Admin\ProspectingEmailTemplateController::class, 'update'])->name('admin.prospecting-email-templates.update');
    Route::delete('settings/prospecting-email-templates/{prospectingEmailTemplate}', [App\Http\Controllers\Admin\ProspectingEmailTemplateController::class, 'destroy'])->name('admin.prospecting-email-templates.destroy');
    Route::patch('settings/prospecting-email-templates/{prospectingEmailTemplate}/toggle', [App\Http\Controllers\Admin\ProspectingEmailTemplateController::class, 'toggleActive'])->name('admin.prospecting-email-templates.toggle');

    // Partner FAQs (visibles côté partenaire dans /partner/help)
    Route::get('settings/partner-faqs', [App\Http\Controllers\Admin\PartnerFaqController::class, 'index'])->name('admin.partner-faqs.index');
    Route::post('settings/partner-faqs', [App\Http\Controllers\Admin\PartnerFaqController::class, 'store'])->name('admin.partner-faqs.store');
    Route::put('settings/partner-faqs/{partnerFaq}', [App\Http\Controllers\Admin\PartnerFaqController::class, 'update'])->name('admin.partner-faqs.update');
    Route::delete('settings/partner-faqs/{partnerFaq}', [App\Http\Controllers\Admin\PartnerFaqController::class, 'destroy'])->name('admin.partner-faqs.destroy');
    Route::patch('settings/partner-faqs/{partnerFaq}/toggle', [App\Http\Controllers\Admin\PartnerFaqController::class, 'toggleActive'])->name('admin.partner-faqs.toggle');

    // Email Signature Settings
    Route::get('settings/email-signature', [App\Http\Controllers\Admin\EmailSignatureController::class, 'index'])->name('admin.email-signature.index');
    Route::put('settings/email-signature', [App\Http\Controllers\Admin\EmailSignatureController::class, 'update'])->name('admin.email-signature.update');
    Route::post('settings/email-signature/logo', [App\Http\Controllers\Admin\EmailSignatureController::class, 'uploadLogo'])->name('admin.email-signature.upload-logo');
    Route::delete('settings/email-signature/logo', [App\Http\Controllers\Admin\EmailSignatureController::class, 'deleteLogo'])->name('admin.email-signature.delete-logo');

    // Financial Simulator
    Route::get('simulator', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'index'])->name('admin.simulator.index');
    Route::get('simulator/create', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'create'])->name('admin.simulator.create');
    Route::post('simulator', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'store'])->name('admin.simulator.store');
    Route::get('simulator/{simulation}', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'show'])->name('admin.simulator.show');
    Route::put('simulator/{simulation}', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'update'])->name('admin.simulator.update');
    Route::delete('simulator/{simulation}', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'destroy'])->name('admin.simulator.destroy');
    Route::post('simulator/{simulation}/duplicate', [App\Http\Controllers\Admin\FinancialSimulatorController::class, 'duplicate'])->name('admin.simulator.duplicate');

    // Signature
    Route::get('signature', [App\Http\Controllers\Admin\SignatureController::class, 'show'])->name('admin.signature.show');
    Route::post('signature', [App\Http\Controllers\Admin\SignatureController::class, 'store'])->name('admin.signature.store');
    Route::delete('signature', [App\Http\Controllers\Admin\SignatureController::class, 'destroy'])->name('admin.signature.destroy');

    // Invoices
    Route::patch('invoices/bulk-status', [App\Http\Controllers\Admin\InvoiceController::class, 'bulkUpdateStatus'])->name('admin.invoices.bulk-status');
    Route::post('invoices/bulk-delete', [App\Http\Controllers\Admin\InvoiceController::class, 'bulkDelete'])->name('admin.invoices.bulk-delete');
    Route::post('invoices/upload-external', [App\Http\Controllers\Admin\InvoiceController::class, 'storeExternal'])->name('admin.invoices.store-external');
    Route::resource('invoices', App\Http\Controllers\Admin\InvoiceController::class)->names('admin.invoices');
    Route::post('invoices/{invoice}/send', [App\Http\Controllers\Admin\InvoiceController::class, 'send'])->name('admin.invoices.send');
    Route::post('invoices/{invoice}/duplicate', [App\Http\Controllers\Admin\InvoiceController::class, 'duplicate'])->name('admin.invoices.duplicate');
    Route::post('invoices/{invoice}/record-payment', [App\Http\Controllers\Admin\InvoiceController::class, 'recordPayment'])->name('admin.invoices.record-payment');
    Route::get('invoices/{invoice}/pdf', [App\Http\Controllers\Admin\InvoiceController::class, 'downloadPdf'])->name('admin.invoices.pdf');
    Route::get('invoices/{invoice}/pdf/preview', [App\Http\Controllers\Admin\InvoiceController::class, 'previewPdf'])->name('admin.invoices.pdf.preview');
    Route::post('invoices/{invoice}/credit-note', [App\Http\Controllers\Admin\InvoiceController::class, 'createCreditNote'])->name('admin.invoices.credit-note');

    // Commissions
    Route::get('commissions', [App\Http\Controllers\Admin\CommissionController::class, 'index'])->name('admin.commissions.index');
    Route::get('commissions/{commission}', [App\Http\Controllers\Admin\CommissionController::class, 'show'])->name('admin.commissions.show');
    Route::patch('commissions/{commission}/confirm', [App\Http\Controllers\Admin\CommissionController::class, 'confirm'])->name('admin.commissions.confirm');
    Route::patch('commissions/{commission}/schedule', [App\Http\Controllers\Admin\CommissionController::class, 'schedule'])->name('admin.commissions.schedule');
    Route::patch('commissions/{commission}/pay', [App\Http\Controllers\Admin\CommissionController::class, 'pay'])->name('admin.commissions.pay');
    Route::delete('commissions/{commission}', [App\Http\Controllers\Admin\CommissionController::class, 'destroy'])->name('admin.commissions.destroy');

    // Recurring Services
    Route::resource('services', App\Http\Controllers\Admin\RecurringServiceController::class)->names('admin.services');
    Route::post('services/{service}/renew', [App\Http\Controllers\Admin\RecurringServiceController::class, 'renew'])->name('admin.services.renew');
    Route::patch('services/{service}/status', [App\Http\Controllers\Admin\RecurringServiceController::class, 'updateStatus'])->name('admin.services.updateStatus');

    // Portfolio
    Route::get('portfolio', [App\Http\Controllers\Admin\PortfolioController::class, 'index'])->name('admin.portfolio.index');
    Route::get('portfolio/{projet}/edit', [App\Http\Controllers\Admin\PortfolioController::class, 'edit'])->name('admin.portfolio.edit');
    Route::put('portfolio/{projet}', [App\Http\Controllers\Admin\PortfolioController::class, 'update'])->name('admin.portfolio.update');
    Route::post('portfolio/{projet}/images', [App\Http\Controllers\Admin\PortfolioController::class, 'uploadImage'])->name('admin.portfolio.upload-image');
    Route::delete('portfolio/images/{image}', [App\Http\Controllers\Admin\PortfolioController::class, 'deleteImage'])->name('admin.portfolio.delete-image');
    Route::patch('portfolio/{projet}/toggle', [App\Http\Controllers\Admin\PortfolioController::class, 'togglePublished'])->name('admin.portfolio.toggle');
    Route::post('portfolio/{projet}/logo', [App\Http\Controllers\Admin\PortfolioController::class, 'uploadLogo'])->name('admin.portfolio.upload-logo');
    Route::delete('portfolio/{projet}/logo', [App\Http\Controllers\Admin\PortfolioController::class, 'deleteLogo'])->name('admin.portfolio.delete-logo');
    Route::patch('portfolio/{projet}/add', [App\Http\Controllers\Admin\PortfolioController::class, 'addToPortfolio'])->name('admin.portfolio.add');

    // SaaS Products
    Route::resource('products', App\Http\Controllers\Admin\ProductController::class)->names('admin.products')->except(['show']);
    Route::post('products/{product}/logo', [App\Http\Controllers\Admin\ProductController::class, 'uploadLogo'])->name('admin.products.logo');
    Route::post('products/{product}/cover', [App\Http\Controllers\Admin\ProductController::class, 'uploadCover'])->name('admin.products.cover');
    Route::patch('products/{product}/toggle', [App\Http\Controllers\Admin\ProductController::class, 'togglePublished'])->name('admin.products.toggle');

    // Posts (News & Blog)
    Route::resource('posts', App\Http\Controllers\Admin\PostController::class)->names('admin.posts');

    // Messages (Ticker)
    Route::resource('messages', App\Http\Controllers\Admin\MessageController::class)->only(['index', 'store', 'update', 'destroy'])->names('admin.messages');

    // Dynamic Pages
    Route::resource('pages', App\Http\Controllers\Admin\PageController::class)->names('admin.pages');

    // Public Services (landing page)
    Route::resource('settings/public-services', App\Http\Controllers\Admin\PublicServiceController::class)->names('admin.public-services')->except(['create', 'edit', 'show']);
    Route::post('settings/public-services/reorder', [App\Http\Controllers\Admin\PublicServiceController::class, 'reorder'])->name('admin.public-services.reorder');

    // Branding & Social Media
    Route::get('settings/branding', [App\Http\Controllers\Admin\BrandingController::class, 'index'])->name('admin.branding.index');
    Route::put('settings/branding/social', [App\Http\Controllers\Admin\BrandingController::class, 'updateSocial'])->name('admin.branding.social');
    Route::put('settings/branding/info', [App\Http\Controllers\Admin\BrandingController::class, 'updateBranding'])->name('admin.branding.info');
    Route::post('settings/branding/logo', [App\Http\Controllers\Admin\BrandingController::class, 'uploadLogo'])->name('admin.branding.logo');
    Route::delete('settings/branding/logo', [App\Http\Controllers\Admin\BrandingController::class, 'deleteLogo'])->name('admin.branding.logo.delete');
    Route::put('settings/branding/cold-call-script', [App\Http\Controllers\Admin\BrandingController::class, 'updateColdCallScript'])->name('admin.branding.cold-call-script');

    // Brochure
    Route::get('settings/brochure', [App\Http\Controllers\Admin\BrochureController::class, 'index'])->name('admin.brochure.index');
    Route::post('settings/brochure', [App\Http\Controllers\Admin\BrochureController::class, 'upload'])->name('admin.brochure.upload');
    Route::delete('settings/brochure', [App\Http\Controllers\Admin\BrochureController::class, 'destroy'])->name('admin.brochure.destroy');
    Route::put('settings/simulator-mode', function (\Illuminate\Http\Request $request) {
        $request->validate(['mode' => 'required|in:enabled,europe_only,disabled']);
        \App\Models\Setting::set('simulator.mode', $request->input('mode'));
        return redirect()->back()->with('success', __('Mode du simulateur mis à jour.'));
    })->name('admin.simulator-mode');

    // Chatbot AI (separate settings page)
    Route::get('settings/chatbot', [App\Http\Controllers\Admin\ChatbotController::class, 'index'])->name('admin.chatbot.index');
    Route::put('settings/chatbot', [App\Http\Controllers\Admin\ChatbotController::class, 'update'])->name('admin.chatbot.update');
    Route::post('settings/chatbot/pdf', [App\Http\Controllers\Admin\ChatbotController::class, 'uploadPdf'])->name('admin.chatbot.pdf');
    Route::get('settings/chatbot/test-api', [App\Http\Controllers\Admin\ChatbotController::class, 'testApi'])->name('admin.chatbot.test');

    // NDA Settings
    Route::get('settings/nda', [App\Http\Controllers\Admin\NdaSettingsController::class, 'index'])->name('admin.nda.index');
    Route::put('settings/nda', [App\Http\Controllers\Admin\NdaSettingsController::class, 'update'])->name('admin.nda.update');
    Route::post('settings/nda/pdf', [App\Http\Controllers\Admin\NdaSettingsController::class, 'uploadPdf'])->name('admin.nda.upload-pdf');
    Route::delete('settings/nda/pdf', [App\Http\Controllers\Admin\NdaSettingsController::class, 'deletePdf'])->name('admin.nda.delete-pdf');

    // Landing Sections
    Route::get('settings/landing-sections', [App\Http\Controllers\Admin\LandingSectionController::class, 'index'])->name('admin.landing-sections.index');
    Route::put('settings/landing-sections/{section}', [App\Http\Controllers\Admin\LandingSectionController::class, 'update'])->name('admin.landing-sections.update');
    Route::post('settings/landing-sections/{section}/image', [App\Http\Controllers\Admin\LandingSectionController::class, 'uploadImage'])->name('admin.landing-sections.upload-image');

    // FAQ
    Route::get('settings/faqs', [App\Http\Controllers\Admin\FaqController::class, 'index'])->name('admin.faqs.index');
    Route::post('settings/faqs', [App\Http\Controllers\Admin\FaqController::class, 'store'])->name('admin.faqs.store');
    Route::put('settings/faqs/{faq}', [App\Http\Controllers\Admin\FaqController::class, 'update'])->name('admin.faqs.update');
    Route::delete('settings/faqs/{faq}', [App\Http\Controllers\Admin\FaqController::class, 'destroy'])->name('admin.faqs.destroy');

    // SEO
    Route::get('settings/seo', [App\Http\Controllers\Admin\SeoController::class, 'index'])->name('admin.seo.index');
    Route::put('settings/seo', [App\Http\Controllers\Admin\SeoController::class, 'update'])->name('admin.seo.update');
    Route::post('settings/seo/og-image', [App\Http\Controllers\Admin\SeoController::class, 'uploadOgImage'])->name('admin.seo.upload-og-image');

    // Commission Rates
    Route::get('settings/commission-rates', [App\Http\Controllers\Admin\CommissionRateController::class, 'index'])->name('admin.commission-rates.index');
    Route::put('settings/commission-rates', [App\Http\Controllers\Admin\CommissionRateController::class, 'update'])->name('admin.commission-rates.update');

    // Document Templates
    Route::get('settings/document-templates', [App\Http\Controllers\Admin\DocumentTemplateController::class, 'index'])->name('admin.document-templates.index');
    Route::put('settings/document-templates/{template}', [App\Http\Controllers\Admin\DocumentTemplateController::class, 'update'])->name('admin.document-templates.update');
    Route::patch('settings/document-templates/{template}/toggle', [App\Http\Controllers\Admin\DocumentTemplateController::class, 'toggleActive'])->name('admin.document-templates.toggle');
    Route::get('settings/document-templates/{template}/preview', [App\Http\Controllers\Admin\DocumentTemplateController::class, 'preview'])->name('admin.document-templates.preview');

    // Project Attachments (external documents)
    Route::post('projects/{project}/attachments', [App\Http\Controllers\Admin\ProjectAttachmentController::class, 'store'])->name('admin.projects.attachments.store');
    Route::get('projects/{project}/attachments/{document}/download', [App\Http\Controllers\Admin\ProjectAttachmentController::class, 'download'])->name('admin.projects.attachments.download');
    Route::patch('projects/{project}/attachments/{document}/toggle', [App\Http\Controllers\Admin\ProjectAttachmentController::class, 'toggleVisibility'])->name('admin.projects.attachments.toggle');
    Route::delete('projects/{project}/attachments/{document}', [App\Http\Controllers\Admin\ProjectAttachmentController::class, 'destroy'])->name('admin.projects.attachments.destroy');

    // Project Technical Documentation (wiki)
    Route::get('projects/{project}/docs', [App\Http\Controllers\Admin\ProjectDocController::class, 'index'])->name('admin.projects.docs');
    Route::post('projects/{project}/docs', [App\Http\Controllers\Admin\ProjectDocController::class, 'store'])->name('admin.projects.docs.store');
    Route::put('project-docs/{doc}', [App\Http\Controllers\Admin\ProjectDocController::class, 'update'])->name('admin.projects.docs.update');
    Route::patch('project-docs/{doc}/toggle', [App\Http\Controllers\Admin\ProjectDocController::class, 'toggleVisibility'])->name('admin.projects.docs.toggle');
    Route::delete('project-docs/{doc}', [App\Http\Controllers\Admin\ProjectDocController::class, 'destroy'])->name('admin.projects.docs.destroy');

    // Project Documents
    Route::get('projects/{project}/documents', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'index'])->name('admin.projects.documents');
    Route::post('projects/{project}/documents/generate', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'generate'])->name('admin.projects.documents.generate');
    Route::put('projects/{project}/documents/{document}', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'update'])->name('admin.projects.documents.update');
    Route::post('projects/{project}/documents/{document}/admin-sign', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'adminSign'])->name('admin.projects.documents.admin-sign');
    Route::post('projects/{project}/documents/{document}/send', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'sendToClient'])->name('admin.projects.documents.send');
    Route::get('projects/{project}/documents/{document}/pdf', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'downloadPdf'])->name('admin.projects.documents.pdf');
    Route::get('projects/{project}/documents/{document}/pdf/preview', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'previewPdf'])->name('admin.projects.documents.pdf.preview');
    Route::delete('projects/{project}/documents/{document}', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'destroy'])->name('admin.projects.documents.destroy');

    // Exports
    Route::get('exports/invoices/pdf', [App\Http\Controllers\Admin\ExportController::class, 'invoicesPdf'])->name('admin.exports.invoices.pdf');
    Route::get('exports/invoices/csv', [App\Http\Controllers\Admin\ExportController::class, 'invoicesCsv'])->name('admin.exports.invoices.csv');
    Route::get('exports/leads/pdf', [App\Http\Controllers\Admin\ExportController::class, 'leadsPdf'])->name('admin.exports.leads.pdf');
    Route::get('exports/leads/csv', [App\Http\Controllers\Admin\ExportController::class, 'leadsCsv'])->name('admin.exports.leads.csv');
    Route::get('exports/commissions/pdf', [App\Http\Controllers\Admin\ExportController::class, 'commissionsPdf'])->name('admin.exports.commissions.pdf');
    Route::get('exports/commissions/csv', [App\Http\Controllers\Admin\ExportController::class, 'commissionsCsv'])->name('admin.exports.commissions.csv');
    Route::get('exports/quotes/csv', [App\Http\Controllers\Admin\ExportController::class, 'quotesCsv'])->name('admin.exports.quotes.csv');
    Route::get('exports/payments/csv', [App\Http\Controllers\Admin\ExportController::class, 'paymentsCsv'])->name('admin.exports.payments.csv');
    Route::get('exports/payments/pdf', [App\Http\Controllers\Admin\ExportController::class, 'paymentsPdf'])->name('admin.exports.payments.pdf');
    Route::get('exports/monthly-report', [App\Http\Controllers\Admin\ExportController::class, 'monthlyReport'])->name('admin.exports.monthly-report');

    // Purchase Orders
    Route::get('purchase-orders/{po}/pdf', [App\Http\Controllers\Admin\PurchaseOrderController::class, 'downloadPdf'])->name('admin.purchase-orders.pdf');
    Route::get('purchase-orders/{po}/pdf/preview', [App\Http\Controllers\Admin\PurchaseOrderController::class, 'previewPdf'])->name('admin.purchase-orders.pdf.preview');

    // Team Management
    Route::get('team', [App\Http\Controllers\Admin\TeamController::class, 'index'])->name('admin.team');
    Route::post('team', [App\Http\Controllers\Admin\TeamController::class, 'store'])->name('admin.team.store');
    Route::patch('team/{user}/approve', [App\Http\Controllers\Admin\TeamController::class, 'approve'])->name('admin.team.approve');
    Route::delete('team/{user}/reject', [App\Http\Controllers\Admin\TeamController::class, 'reject'])->name('admin.team.reject');
    Route::patch('team/{user}/kb-approve', [App\Http\Controllers\Admin\TeamController::class, 'approveKbAccess'])->name('admin.team.kb-approve');
    Route::patch('team/{user}/kb-reject', [App\Http\Controllers\Admin\TeamController::class, 'rejectKbAccess'])->name('admin.team.kb-reject');
    Route::patch('team/{user}/toggle', [App\Http\Controllers\Admin\TeamController::class, 'toggleActive'])->name('admin.team.toggle');
    Route::post('team/{user}/send-credentials', [App\Http\Controllers\Admin\TeamController::class, 'sendCredentials'])->name('admin.team.send-credentials');
    Route::patch('team/{user}/hourly-rate', [App\Http\Controllers\Admin\TeamController::class, 'updateHourlyRate'])->name('admin.team.hourly-rate');

    // Support Tickets
    // Testimonials management
    Route::get('settings/testimonials', function () {
        return \Inertia\Inertia::render('Admin/Settings/Testimonials', [
            'testimonials' => \App\Models\Testimonial::with('user:id,name,email,company_name,avatar')->latest()->get(),
        ]);
    })->name('admin.testimonials.index');
    Route::patch('testimonials/{testimonial}/approve', function (\App\Models\Testimonial $testimonial) {
        $testimonial->update(['status' => 'approved', 'show_on_landing' => true]);
        return back()->with('success', 'Témoignage approuvé.');
    })->name('admin.testimonials.approve');
    Route::patch('testimonials/{testimonial}/reject', function (\App\Models\Testimonial $testimonial) {
        $testimonial->update(['status' => 'rejected', 'show_on_landing' => false]);
        return back()->with('success', 'Témoignage rejeté.');
    })->name('admin.testimonials.reject');
    Route::patch('testimonials/{testimonial}/toggle-landing', function (\App\Models\Testimonial $testimonial) {
        $testimonial->update(['show_on_landing' => !$testimonial->show_on_landing]);
        return back();
    })->name('admin.testimonials.toggle');
    Route::delete('testimonials/{testimonial}', function (\App\Models\Testimonial $testimonial) {
        $testimonial->delete();
        return back()->with('success', 'Témoignage supprimé.');
    })->name('admin.testimonials.destroy');

    Route::get('support', [App\Http\Controllers\Admin\SupportController::class, 'index'])->name('admin.support.index');
    Route::get('support/{ticket}', [App\Http\Controllers\Admin\SupportController::class, 'show'])->name('admin.support.show');
    Route::post('support/{ticket}/reply', [App\Http\Controllers\Admin\SupportController::class, 'reply'])->name('admin.support.reply');
    Route::patch('support/{ticket}/status', [App\Http\Controllers\Admin\SupportController::class, 'updateStatus'])->name('admin.support.status');
    Route::delete('support/{ticket}', [App\Http\Controllers\Admin\SupportController::class, 'destroy'])->name('admin.support.destroy');
});

require __DIR__ . '/auth.php';
