import { useState, useRef, useEffect } from 'react';
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
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    leads: PaginatedData<Lead>;
    kanbanLeads: Record<string, Lead[]>;
}

const leadStatuses = [
    { value: 'new', label: 'Nouveau' },
    { value: 'contacted', label: 'Contacté' },
    { value: 'brief_pending', label: 'Brief en attente' },
    { value: 'brief_completed', label: 'Brief complété' },
    { value: 'call_scheduled', label: 'Appel planifié' },
    { value: 'qualified', label: 'Qualifié' },
    { value: 'not_qualified', label: 'Non qualifié' },
    { value: 'quote_draft', label: 'Devis brouillon' },
    { value: 'quote_sent', label: 'Devis envoyé' },
    { value: 'won', label: 'Gagné' },
    { value: 'lost', label: 'Perdu' },
];

export default function LeadsIndex({ leads, kanbanLeads: initialKanban }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [kanbanLeads, setKanbanLeads] = useState(initialKanban);
    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return (params.get('view') as 'table' | 'kanban') || (sessionStorage.getItem('leads_view') as 'table' | 'kanban') || 'table';
        }
        return 'table';
    });
    const switchView = (v: 'table' | 'kanban') => { setView(v); sessionStorage.setItem('leads_view', v); };
    const [exportOpen, setExportOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
    const bulkStatusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
                setExportOpen(false);
            }
            if (bulkStatusRef.current && !bulkStatusRef.current.contains(e.target as Node)) {
                setBulkStatusOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === leads.data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.data.map(l => l.id)));
        }
    };

    const handleBulkStatus = (status: string) => {
        router.patch('/admin/leads/bulk-status', {
            ids: [...selectedIds],
            status,
        } as any, {
            onSuccess: () => {
                setSelectedIds(new Set());
                setBulkStatusOpen(false);
            },
        });
    };

    const handleBulkDelete = async () => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete the selected leads?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.post('/admin/leads/bulk-delete', {
            ids: [...selectedIds],
        } as any, {
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const buildExportUrl = (format: 'pdf' | 'csv') => {
        const params = new URLSearchParams(window.location.search);
        const exportParams = new URLSearchParams();
        if (params.get('status')) exportParams.set('status', params.get('status')!);
        if (params.get('source')) exportParams.set('source', params.get('source')!);
        if (params.get('from')) exportParams.set('from', params.get('from')!);
        if (params.get('to')) exportParams.set('to', params.get('to')!);
        const qs = exportParams.toString();
        return `/admin/exports/leads/${format}${qs ? '?' + qs : ''}`;
    };

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
            header: (
                <input
                    type="checkbox"
                    checked={leads.data.length > 0 && selectedIds.size === leads.data.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                />
            ),
            accessor: (lead: Lead) => (
                <input
                    type="checkbox"
                    checked={selectedIds.has(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        },
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

            {/* Export dropdown */}
            <div className="flex justify-end mb-4">
                <div className="relative" ref={exportRef}>
                    <button
                        onClick={() => setExportOpen(!exportOpen)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        {t('Export')}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {exportOpen && (
                        <div className="absolute right-0 z-20 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <a
                                href={buildExportUrl('pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                {t('Export PDF')}
                            </a>
                            <a
                                href={buildExportUrl('csv')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" /></svg>
                                {t('Export CSV')}
                            </a>
                        </div>
                    )}
                </div>
            </div>

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

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white p-4 shadow-2xl border-t border-gray-700">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">
                            {selectedIds.size} lead(s) {t('selected')}
                        </span>
                        <div className="flex items-center gap-3">
                            {/* Change Status */}
                            <div className="relative" ref={bulkStatusRef}>
                                <button
                                    onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {t('Change Status')}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {bulkStatusOpen && (
                                    <div className="absolute bottom-full mb-2 left-0 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {leadStatuses.map(s => (
                                            <button
                                                key={s.value}
                                                onClick={() => handleBulkStatus(s.value)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Delete */}
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {t('Delete')}
                            </button>

                            {/* Deselect */}
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {t('Deselect')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDialog />
        </AdminLayout>
    );
}
