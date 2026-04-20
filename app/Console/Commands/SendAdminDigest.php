<?php

namespace App\Console\Commands;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Projet;
use App\Models\Quote;
use App\Models\RecurringService;
use App\Models\Scopes\UserAdminTenantScope;
use App\Models\User;
use App\Services\NotificationService;
use App\Support\CurrentAdmin;
use Illuminate\Console\Command;

class SendAdminDigest extends Command
{
    protected $signature = 'nai:admin-digest {--force : Send even if all metrics are zero}';
    protected $description = 'Envoie à chaque admin actif un digest quotidien de ce qui s\'est passé dans son tenant.';

    public function handle(CurrentAdmin $ctx): int
    {
        $ctx->clear();

        $admins = User::withoutGlobalScope(UserAdminTenantScope::class)
            ->where('role', 'admin')
            ->where('is_active', true)
            ->whereNotNull('approved_at')
            ->get();

        $this->info("Processing {$admins->count()} admin(s)...");

        foreach ($admins as $admin) {
            $ctx->set($admin->id);

            $metrics = $this->collectMetrics();
            $total = array_sum(array_map(fn ($v) => is_numeric($v) ? (int) $v : 0, $metrics));

            if ($total === 0 && !$this->option('force')) {
                $this->line("  {$admin->name}: rien à signaler, skip.");
                continue;
            }

            $this->sendDigest($admin, $metrics);
            $this->line("  {$admin->name}: digest envoyé ({$total} items actionnables).");
        }

        $ctx->clear();
        return self::SUCCESS;
    }

    protected function collectMetrics(): array
    {
        $now = now();
        $startOfWeek = $now->copy()->startOfWeek();
        $last24h = $now->copy()->subHours(24);
        $in7days = $now->copy()->addDays(7);

        $overdueInvoices = Invoice::where('status', 'overdue')->count();
        $overdueAmount = (float) Invoice::where('status', 'overdue')->sum('amount_due');

        return [
            'pending_quotes' => Quote::whereIn('status', ['sent', 'viewed'])->count(),
            'overdue_invoices' => $overdueInvoices,
            'overdue_amount' => $overdueAmount,
            'projects_in_review' => Projet::where('status', 'review')
                ->where('updated_at', '>=', $startOfWeek)
                ->count(),
            'services_expiring_7d' => RecurringService::where('status', 'active')
                ->whereNotNull('expiry_date')
                ->whereBetween('expiry_date', [$now, $in7days])
                ->count(),
            'new_leads_24h' => Lead::where('created_at', '>=', $last24h)->count(),
            'payments_24h_count' => Payment::where('status', 'confirmed')
                ->where('created_at', '>=', $last24h)
                ->count(),
            'payments_24h_amount' => (float) Payment::where('status', 'confirmed')
                ->where('created_at', '>=', $last24h)
                ->sum('amount'),
            'commissions_pending' => Commission::whereIn('status', ['confirmed', 'scheduled'])->count(),
        ];
    }

    protected function sendDigest(User $admin, array $metrics): void
    {
        $vars = [
            'admin_name' => $admin->name,
            'date' => now()->translatedFormat('l d F Y'),
            'pending_quotes' => $metrics['pending_quotes'],
            'overdue_invoices' => $metrics['overdue_invoices'],
            'overdue_amount' => number_format($metrics['overdue_amount'], 2, ',', '.'),
            'projects_in_review' => $metrics['projects_in_review'],
            'services_expiring_7d' => $metrics['services_expiring_7d'],
            'new_leads_24h' => $metrics['new_leads_24h'],
            'payments_24h_count' => $metrics['payments_24h_count'],
            'payments_24h_amount' => number_format($metrics['payments_24h_amount'], 2, ',', '.'),
            'commissions_pending' => $metrics['commissions_pending'],
            'dashboard_url' => url('/admin/dashboard'),
        ];

        NotificationService::send(
            $admin,
            'admin-daily-digest',
            $vars,
            transactional: true,
            actionUrl: '/admin/dashboard',
        );
    }
}
