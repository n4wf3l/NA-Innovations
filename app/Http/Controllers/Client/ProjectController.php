<?php

namespace App\Http\Controllers\Client;

use App\Models\Document;
use App\Models\Projet;
use App\Models\ProjectDocument;
use App\Models\Quote;
use App\Models\Invoice;
use App\Models\User;
use App\Models\RecurringService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $projects = Auth::user()->clientProjects()
            ->with('developer')
            ->latest('updated_at')
            ->get();

        return Inertia::render('Client/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function show(Projet $project)
    {
        if ($project->client_id != Auth::id()) {
            abort(403);
        }

        $user = Auth::user();
        $clientScope = fn($q) => $q->where('client_id', $user->id)->orWhere('client_email', $user->email);

        $project->load([
            'developer',
            'timelineEvents' => fn($q) => $q->latest()->take(30),
        ]);

        // Documents: quotes linked to this project or lead
        $quotes = Quote::where(function ($q) use ($project) {
                $q->where('projet_id', $project->id);
                if ($project->lead_id) {
                    $q->orWhere('lead_id', $project->lead_id);
                }
            })
            ->where($clientScope)
            ->with('items')
            ->latest()
            ->get();

        // Finances: invoices linked to this project or quotes
        $invoices = Invoice::where(function ($q) use ($project, $quotes) {
                $q->where('projet_id', $project->id);
                if ($quotes->isNotEmpty()) {
                    $q->orWhereIn('quote_id', $quotes->pluck('id'));
                }
            })
            ->where($clientScope)
            ->with('payments')
            ->latest()
            ->get();

        // Recurring services linked to project
        $services = RecurringService::where('projet_id', $project->id)->get();

        // Public notes (not private)
        $notes = $project->notes()
            ->where('is_private', false)
            ->with('user')
            ->latest()
            ->get();

        // Documents légaux (exclure les brouillons)
        $projectDocuments = $project->projectDocuments()
            ->where('status', '!=', 'draft')
            ->with(['template', 'adminSigner'])
            ->latest()
            ->get();

        // External documents (attachments) visible to client
        $attachments = $project->documents()
            ->where('is_client_visible', true)
            ->with('uploader')
            ->latest()
            ->get();

        // Technical documentation visible to client
        $techDocs = $project->projectDocs()
            ->where('is_client_visible', true)
            ->with('author')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return Inertia::render('Client/Projects/Show', [
            'project' => $project,
            'quotes' => $quotes,
            'invoices' => $invoices,
            'services' => $services,
            'notes' => $notes,
            'projectDocuments' => $projectDocuments,
            'attachments' => $attachments,
            'techDocs' => $techDocs,
            'hasTestimonial' => \App\Models\Testimonial::where('user_id', auth()->id())->exists(),
        ]);
    }

    /**
     * Client adds a comment/note to their project.
     */
    public function addComment(Request $request, Projet $project)
    {
        if ($project->client_id != Auth::id()) {
            abort(403);
        }

        $request->validate(['content' => 'required|string|max:2000']);

        $project->notes()->create([
            'user_id' => Auth::id(),
            'content' => $request->input('content'),
            'is_private' => false,
            'is_pinned' => false,
        ]);

        // Also create a timeline event
        $project->timelineEvents()->create([
            'user_id' => Auth::id(),
            'event_type' => 'comment',
            'title' => 'Client comment',
            'description' => $request->input('content'),
        ]);

        // Notify admins
        $clientName = Auth::user()->name;
        NotificationService::sendToAdmins('client-comment', [
            'client_name' => $clientName,
            'project_name' => $project->nom_societe,
            'comment' => $request->input('content'),
        ], actionUrl: "/admin/projects/{$project->id}");

        // Notify assigned developer
        if ($project->developer_id) {
            $dev = User::find($project->developer_id);
            if ($dev) {
                NotificationService::send($dev, 'client-comment', [
                    'client_name' => $clientName,
                    'project_name' => $project->nom_societe,
                    'comment' => $request->input('content'),
                ], transactional: true, actionUrl: "/dev/projects/{$project->id}");
            }
        }

        return redirect()->back()->with('success', 'Comment added.');
    }

    /**
     * View technical documentation visible to the client.
     */
    public function docs(Projet $project)
    {
        if ($project->client_id != Auth::id()) {
            abort(403);
        }

        $docs = $project->projectDocs()
            ->where('is_client_visible', true)
            ->with('author')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return Inertia::render('Client/Projects/Docs', [
            'project' => $project,
            'docs' => $docs,
        ]);
    }

    /**
     * Download an external attachment visible to the client.
     */
    public function downloadAttachment(Projet $project, Document $document)
    {
        $user = auth()->user();

        if ($project->client_id !== $user->id) {
            abort(403);
        }

        if (!$document->is_client_visible) {
            abort(403);
        }

        if ($document->documentable_id !== $project->id || $document->documentable_type !== Projet::class) {
            abort(403);
        }

        if (!Storage::disk('local')->exists($document->file_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($document->file_path, $document->original_filename);
    }
}
