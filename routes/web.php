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

Route::get('/', function () {
    $projets = Projet::all();
    $academicProjects = AcademicProjet::all();
    return view('welcome', compact('projets', 'academicProjects'));
});

Route::group(['middleware' => 'web'], function () {
    Route::get('/register', function () {
        abort(403, 'Access Forbidden');
    });
});

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


Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{id}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::delete('/posts/{id}', [PostController::class, 'destroy'])->name('posts.destroy');

Route::get('/dashboard', function () { return redirect()->route('admin.dashboard'); })->middleware(['auth', 'verified'])->name('dashboard');
Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
Route::get('/', [MessageController::class, 'welcomeMessages'])->name('welcome');



Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/send-email', [ContactController::class, 'sendEmail'])->name('send-email');

Route::get('locale/{locale}', [App\Http\Controllers\LocaleController::class, 'switch'])->name('locale.switch');

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
    Route::resource('partners', App\Http\Controllers\Admin\PartnerController::class)->names('admin.partners');

    // Quotes
    Route::resource('quotes', App\Http\Controllers\Admin\QuoteController::class)->names('admin.quotes');
    Route::post('quotes/{quote}/send', [App\Http\Controllers\Admin\QuoteController::class, 'send'])->name('admin.quotes.send');
    Route::post('quotes/{quote}/duplicate', [App\Http\Controllers\Admin\QuoteController::class, 'duplicate'])->name('admin.quotes.duplicate');
    Route::post('quotes/{quote}/create-invoice', [App\Http\Controllers\Admin\QuoteController::class, 'createInvoice'])->name('admin.quotes.create-invoice');
    Route::get('quotes/{quote}/pdf', [App\Http\Controllers\Admin\QuoteController::class, 'downloadPdf'])->name('admin.quotes.pdf');

    // Invoices
    Route::resource('invoices', App\Http\Controllers\Admin\InvoiceController::class)->names('admin.invoices');
    Route::post('invoices/{invoice}/send', [App\Http\Controllers\Admin\InvoiceController::class, 'send'])->name('admin.invoices.send');
    Route::post('invoices/{invoice}/record-payment', [App\Http\Controllers\Admin\InvoiceController::class, 'recordPayment'])->name('admin.invoices.record-payment');
    Route::get('invoices/{invoice}/pdf', [App\Http\Controllers\Admin\InvoiceController::class, 'downloadPdf'])->name('admin.invoices.pdf');

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

    // Posts (News & Blog)
    Route::resource('posts', App\Http\Controllers\Admin\PostController::class)->names('admin.posts');

    // Messages (Ticker)
    Route::resource('messages', App\Http\Controllers\Admin\MessageController::class)->only(['index', 'store', 'update', 'destroy'])->names('admin.messages');
});

require __DIR__ . '/auth.php';
