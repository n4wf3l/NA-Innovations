<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Projet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom_societe',
        'type_societe',
        'type_site',
        'lieu',
        'jours_developpement',
        'langage_programmation',
        'etoiles',
        'nombre_collaborateurs',
        'lien',
        'github_repo',
        'github_linked_by',
        'show_commits_to_client',
        'image',
        'client_id',
        'status',
        'description',
        'start_date',
        'end_date',
        'deadline',
        'budget',
        'total_billed',
        'is_portfolio',
        'developer_id',
        'lead_id',
        'preview_url',
        'staging_url',
        'useful_links',
        'client_action_required',
        'client_action_message',
        'current_phase',
        'next_milestone_date',
        'next_milestone_label',
        'estimated_hours',
        'project_credentials',
        'project_env',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'budget' => 'decimal:2',
        'total_billed' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'show_commits_to_client' => 'boolean',
        'deadline' => 'date',
        'is_portfolio' => 'boolean',
        'useful_links' => 'array',
        'client_action_required' => 'boolean',
        'next_milestone_date' => 'date',
        'estimated_hours' => 'decimal:2',
        'project_credentials' => 'encrypted',
        'project_env' => 'encrypted',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function budgetLines()
    {
        return $this->hasMany(ProjectBudgetLine::class, 'project_id');
    }

    public function sentEmails()
    {
        return $this->morphMany(SentEmail::class, 'emailable');
    }

    public function githubLinkedBy()
    {
        return $this->belongsTo(User::class, 'github_linked_by');
    }

    public function developer()
    {
        return $this->belongsTo(User::class, 'developer_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function referralPartner()
    {
        return $this->hasOneThrough(
            \App\Models\ReferralPartner::class,
            \App\Models\Lead::class,
            'id', // leads.id
            'id', // referral_partners.id
            'lead_id', // projets.lead_id
            'referral_partner_id' // leads.referral_partner_id
        );
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    public function recurringServices()
    {
        return $this->hasMany(RecurringService::class);
    }

    public function briefs()
    {
        return $this->hasMany(Brief::class);
    }

    public function portfolioProject()
    {
        return $this->hasOne(PortfolioProject::class);
    }

    public function timelineEvents()
    {
        return $this->morphMany(TimelineEvent::class, 'timelineable');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'notable');
    }

    public function payouts()
    {
        return $this->hasMany(ProjectPayout::class, 'project_id');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function projectDocuments()
    {
        return $this->hasMany(ProjectDocument::class, 'project_id');
    }

    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class, 'project_id');
    }

    public function projectDocs()
    {
        return $this->hasMany(ProjectDoc::class, 'project_id');
    }

    public function milestones()
    {
        return $this->hasMany(ProjectMilestone::class, 'project_id')->orderBy('sort_order');
    }

    public function devMessages()
    {
        return $this->hasMany(DevMessage::class, 'project_id')->orderBy('created_at');
    }
}
