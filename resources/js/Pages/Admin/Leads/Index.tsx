import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import KanbanBoard, { KanbanColumn } from '@/Components/ui/KanbanBoard';
import { Lead, PaginatedData, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
    leads: PaginatedData<Lead>;
    kanbanLeads: Record<string, Lead[]>;
}

export default function LeadsIndex({ leads, kanbanLeads: initialKanban }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [kanbanLeads, setKanbanLeads] = useState(initialKanban);
    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return (params.get('view') as 'table' | 'kanban') || (sessionStorage.getItem('leads_view') as 'table' | 'kanban') || 'table';
        }
        return 'table';
    });
    const switchView = (v: 'table' | 'kanban') => { setView(v); sessionStorage.setItem('leads_view', v); };

    const allLeads = Object.values(kanbanLeads).flat();
    const totalLeads = allLeads.length;
    const wonLeads = (kanbanLeads['won'] || []).length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = allLeads.filter(l => l.status !== 'lost').reduce((sum, l) => sum + (l.estimated_budget || 0), 0);

    const kanbanColumns = [
        { key: 'new', label: t('New'), color: 'border-t-violet-500' },
        { key: 'contacted', label: t('Contacted'), color: 'border-t-blue-500' },
        { key: 'qualified', label: t('Qualified'), color: 'border-t-cyan-500' },
        { key: 'quote_sent', label: t('Quote Sent'), color: 'border-t-amber-500' },
        { key: 'won', label: t('Won'), color: 'border-t-emerald-500' },
        { key: 'lost', label: t('Lost'), color: 'border-t-red-500' },
    ];

    const tableColumns = [
        {
            header: t('Name'),
            accessor: (lead: Lead) => (
                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-gray-900 dark:text-white hover:text-violet-600">
                    {lead.first_name} {lead.last_name}
                </Link>
            ),
        },
        { header: t('Email'), accessor: (lead: Lead) => <span className="text-gray-500">{lead.email}</span> },
        { header: t('Company'), accessor: (lead: Lead) => <span className="text-gray-500">{lead.company_name || '--'}</span> },
        { header: t('Status'), accessor: (lead: Lead) => <Badge status={lead.status} /> },
        { header: t('Source'), accessor: (lead: Lead) => <span className="text-gray-500 capitalize">{lead.source.replace(/_/g, ' ')}</span> },
        { header: t('Budget'), accessor: (lead: Lead) => <span className="text-gray-700 dark:text-gray-200">{lead.estimated_budget ? <ProtectedAmount amount={lead.estimated_budget} /> : '--'}</span>, className: 'text-right' },
        { header: t('Partner'), accessor: (lead: Lead) => <span className="text-gray-500">{lead.referral_partner?.user?.name || '--'}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (lead: Lead) => (
                <span>
                    <Link href={`/admin/leads/${lead.id}`} className="text-gray-400 hover:text-violet-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/leads/${lead.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Leads")} header={t("Leads")}>
            <Head title={t("Leads")} />

            <ModuleBanner
                breadcrumb="Business / Leads"
                title={t('Sales Pipeline')}
                description={t('Manage your sales pipeline. Track prospects from first contact to closed deal.')}
                gradient="from-violet-600 to-purple-600"
                icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                actionHref="/admin/leads/create"
                actionLabel={t('New Lead')}
            />

            {/* KPIs */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t('Total Leads')} value={totalLeads} borderColor="border-l-violet-500" />
                <StatCard label={t('Won')} value={wonLeads} borderColor="border-l-emerald-500" />
                <StatCard label={t('Conversion')} value={`${conversionRate}%`} borderColor="border-l-blue-500" />
                <StatCard label={t('Pipeline Value')} value={protectedValue(pipelineValue, financialUnlocked)} borderColor="border-l-amber-500" />
            </div>

            {/* View toggle */}
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={() => switchView('table')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'table' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600')}>
                    {t('Table')}
                </button>
                <button onClick={() => switchView('kanban')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'kanban' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600')}>
                    {t('Kanban')}
                </button>
            </div>

            {/* Table View */}
            {view === 'table' && (
                <>
                    {leads.data.length === 0 ? (
                        <EmptyState title={t('No leads yet.')} description={t('Add your first lead to get started.')} actionHref="/admin/leads/create" actionLabel={t('New Lead')} borderColor="border-t-violet-500" />
                    ) : (
                        <>
                            <DataTable
                                columns={tableColumns}
                                data={leads.data}
                                keyExtractor={lead => lead.id}
                            />
                            <div className="mt-2">
                                <Pagination links={leads.links} />
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Kanban View with Drag & Drop */}
            {view === 'kanban' && (
                <KanbanBoard<Lead>
                    columns={kanbanColumns}
                    items={kanbanLeads}
                    keyExtractor={lead => lead.id}
                    onMove={(itemId, fromColumn, toColumn) => {
                        // Optimistic update - move card instantly
                        setKanbanLeads(prev => {
                            const updated = { ...prev };
                            const fromItems = [...(updated[fromColumn] || [])];
                            const toItems = [...(updated[toColumn] || [])];
                            const idx = fromItems.findIndex(l => String(l.id) === String(itemId));
                            if (idx === -1) return prev;
                            const [moved] = fromItems.splice(idx, 1);
                            (moved as any).status = toColumn;
                            toItems.unshift(moved);
                            updated[fromColumn] = fromItems;
                            updated[toColumn] = toItems;
                            return updated;
                        });

                        // Sync with server in background
                        fetch(`/admin/leads/${itemId}/status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                            },
                            body: JSON.stringify({ status: toColumn }),
                        });
                    }}
                    renderCard={(lead, isDragging) => (
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow"
                            onClick={() => !isDragging && (window.location.href = `/admin/leads/${lead.id}`)}
                        >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.first_name} {lead.last_name}</p>
                            {lead.company_name && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lead.company_name}</p>}
                            {lead.estimated_budget && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium"><ProtectedAmount amount={lead.estimated_budget} /></p>}
                        </div>
                    )}
                />
            )}
        </AdminLayout>
    );
}
