<?php
use App\Http\Controllers\Controller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PostController;
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


Route::get('/dashboard/ajouter-projet', [ProjetController::class, 'create'])->name('projets.create');
Route::post('/projets', [ProjetController::class, 'store'])->name('projets.store');
Route::get('/dashboard/ajouter-projet-academique', [AcademicProjetController::class, 'create'])->name('academic_projets.create');
Route::post('/academic_projets', [AcademicProjetController::class, 'store'])->name('academic_projets.store');
Route::get('/academic-projects', [AcademicProjetController::class, 'index'])->name('academic_projects.index');

Route::delete('/projets/{projet}', [ProjetController::class, 'destroy'])->name('projets.destroy');
Route::delete('/academic_projets/{academic_projet}', [AcademicProjetController::class, 'destroy'])->name('academic_projets.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
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



Route::get('/services', function () {
    $services = PublicService::where('is_active', true)->orderBy('sort_order')->get();
    return Inertia::render('Services', ['services' => $services]);
})->name('services');

Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Legal/Privacy');
})->name('privacy');

Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/send-email', [ContactController::class, 'sendEmail'])->name('send-email');
Route::get('/admin/contact-attachments/{filename}', [ContactController::class, 'downloadAttachment'])->middleware('auth')->name('contact.attachment');

Route::get('locale/{locale}', [App\Http\Controllers\LocaleController::class, 'switch'])->name('locale.switch');

// Financial PIN routes (accessible to all authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/financial-pin/verify', [App\Http\Controllers\FinancialPinController::class, 'verify'])->name('financial-pin.verify');
    Route::post('/financial-pin/lock', [App\Http\Controllers\FinancialPinController::class, 'lock'])->name('financial-pin.lock');
    Route::get('/financial-pin/status', [App\Http\Controllers\FinancialPinController::class, 'status'])->name('financial-pin.status');
});

// Developer portal routes
Route::prefix('dev')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Dev\DashboardController::class, 'index'])->name('dev.dashboard');
    Route::get('/projects', [App\Http\Controllers\Dev\ProjectController::class, 'index'])->name('dev.projects.index');
    Route::get('/projects/{project}', [App\Http\Controllers\Dev\ProjectController::class, 'show'])->name('dev.projects.show');
    Route::post('/projects/{project}/claim', [App\Http\Controllers\Dev\ProjectController::class, 'claim'])->name('dev.projects.claim');
});

// Partner portal routes
Route::prefix('partner')->middleware(['auth', 'referral'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Partner\DashboardController::class, 'index'])->name('partner.dashboard');
    Route::get('/leads', [App\Http\Controllers\Partner\LeadController::class, 'index'])->name('partner.leads.index');
    Route::get('/leads/submit', [App\Http\Controllers\Partner\LeadController::class, 'create'])->name('partner.leads.submit');
    Route::post('/leads/submit', [App\Http\Controllers\Partner\LeadController::class, 'store'])->name('partner.leads.store');
    Route::get('/leads/{lead}', [App\Http\Controllers\Partner\LeadController::class, 'show'])->name('partner.leads.show');
    Route::get('/commissions', [App\Http\Controllers\Partner\CommissionController::class, 'index'])->name('partner.commissions.index');
    Route::get('/resources', [App\Http\Controllers\Partner\PageController::class, 'index'])->name('partner.pages.index');
    Route::get('/resources/{slug}', [App\Http\Controllers\Partner\PageController::class, 'show'])->name('partner.pages.show');
    Route::get('/guide', [App\Http\Controllers\Partner\GuideController::class, 'index'])->name('partner.guide');
    Route::get('/profile', [App\Http\Controllers\Partner\ProfileController::class, 'edit'])->name('partner.profile');
    Route::put('/profile', [App\Http\Controllers\Partner\ProfileController::class, 'update'])->name('partner.profile.update');
});

// GitHub OAuth
Route::middleware('auth')->group(function () {
    Route::get('/auth/github/redirect', [App\Http\Controllers\Auth\GitHubController::class, 'redirect'])->name('github.redirect');
    Route::get('/auth/github/callback', [App\Http\Controllers\Auth\GitHubController::class, 'callback'])->name('github.callback');
    Route::post('/auth/github/disconnect', [App\Http\Controllers\Auth\GitHubController::class, 'disconnect'])->name('github.disconnect');
});

// API endpoints (session auth)
Route::get('/api/projects/{project}/commits', App\Http\Controllers\Api\ProjectCommitsController::class)->middleware('auth')->name('api.projects.commits');

// Client portal routes
Route::prefix('client')->middleware(['auth'])->group(function () {
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

    // Project Attachments (external documents)
    Route::get('projects/{project}/attachments/{document}/download', [App\Http\Controllers\Client\ProjectController::class, 'downloadAttachment'])->name('client.projects.attachments.download');

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
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

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
    Route::get('revenue', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'global'])->name('admin.revenue');
    Route::get('projects/{project}/budget', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'index'])->name('admin.projects.budget');
    Route::post('projects/{project}/budget', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'store'])->name('admin.projects.budget.store');
    Route::put('projects/{project}/budget/{line}', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'update'])->name('admin.projects.budget.update');
    Route::delete('projects/{project}/budget/{line}', [App\Http\Controllers\Admin\ProjectBudgetController::class, 'destroy'])->name('admin.projects.budget.destroy');
    Route::resource('partners', App\Http\Controllers\Admin\PartnerController::class)->names('admin.partners');

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

    // Signature
    Route::get('signature', [App\Http\Controllers\Admin\SignatureController::class, 'show'])->name('admin.signature.show');
    Route::post('signature', [App\Http\Controllers\Admin\SignatureController::class, 'store'])->name('admin.signature.store');
    Route::delete('signature', [App\Http\Controllers\Admin\SignatureController::class, 'destroy'])->name('admin.signature.destroy');

    // Invoices
    Route::post('invoices/upload-external', [App\Http\Controllers\Admin\InvoiceController::class, 'storeExternal'])->name('admin.invoices.store-external');
    Route::resource('invoices', App\Http\Controllers\Admin\InvoiceController::class)->names('admin.invoices');
    Route::post('invoices/{invoice}/send', [App\Http\Controllers\Admin\InvoiceController::class, 'send'])->name('admin.invoices.send');
    Route::post('invoices/{invoice}/record-payment', [App\Http\Controllers\Admin\InvoiceController::class, 'recordPayment'])->name('admin.invoices.record-payment');
    Route::get('invoices/{invoice}/pdf', [App\Http\Controllers\Admin\InvoiceController::class, 'downloadPdf'])->name('admin.invoices.pdf');
    Route::get('invoices/{invoice}/pdf/preview', [App\Http\Controllers\Admin\InvoiceController::class, 'previewPdf'])->name('admin.invoices.pdf.preview');

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

    // Project Documents
    Route::get('projects/{project}/documents', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'index'])->name('admin.projects.documents');
    Route::post('projects/{project}/documents/generate', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'generate'])->name('admin.projects.documents.generate');
    Route::put('projects/{project}/documents/{document}', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'update'])->name('admin.projects.documents.update');
    Route::post('projects/{project}/documents/{document}/admin-sign', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'adminSign'])->name('admin.projects.documents.admin-sign');
    Route::post('projects/{project}/documents/{document}/send', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'sendToClient'])->name('admin.projects.documents.send');
    Route::get('projects/{project}/documents/{document}/pdf', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'downloadPdf'])->name('admin.projects.documents.pdf');
    Route::get('projects/{project}/documents/{document}/pdf/preview', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'previewPdf'])->name('admin.projects.documents.pdf.preview');
    Route::delete('projects/{project}/documents/{document}', [App\Http\Controllers\Admin\ProjectDocumentController::class, 'destroy'])->name('admin.projects.documents.destroy');

    // Team Management
    Route::get('team', [App\Http\Controllers\Admin\TeamController::class, 'index'])->name('admin.team');
    Route::post('team', [App\Http\Controllers\Admin\TeamController::class, 'store'])->name('admin.team.store');
    Route::patch('team/{user}/approve', [App\Http\Controllers\Admin\TeamController::class, 'approve'])->name('admin.team.approve');
    Route::delete('team/{user}/reject', [App\Http\Controllers\Admin\TeamController::class, 'reject'])->name('admin.team.reject');
    Route::patch('team/{user}/toggle', [App\Http\Controllers\Admin\TeamController::class, 'toggleActive'])->name('admin.team.toggle');
});

require __DIR__ . '/auth.php';
