import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { Lead, PaginatedData } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface Props {
    leads: PaginatedData<Lead>;
    kanbanLeads: Record<string, Lead[]>;
}

export default function LeadsIndex({ leads, kanbanLeads }: Props) {
    const [view, setView] = useState<'table' | 'kanban'>('table');

    const allLeads = Object.values(kanbanLeads).flat();
    const totalLeads = allLeads.length;
    const wonLeads = (kanbanLeads['won'] || []).length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = allLeads.filter(l => l.status !== 'lost').reduce((sum, l) => sum + (l.estimated_budget || 0), 0);

    const kanbanColumns = [
        { key: 'new', label: 'New', color: 'border-t-violet-500' },
        { key: 'contacted', label: 'Contacted', color: 'border-t-blue-500' },
        { key: 'qualified', label: 'Qualified', color: 'border-t-cyan-500' },
        { key: 'quote_sent', label: 'Quote Sent', color: 'border-t-amber-500' },
        { key: 'won', label: 'Won', color: 'border-t-emerald-500' },
        { key: 'lost', label: 'Lost', color: 'border-t-red-500' },
    ];

    const tableColumns = [
        {
            header: 'Name',
            accessor: (lead: Lead) => (
                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-violet-600">
                    {lead.first_name} {lead.last_name}
                </Link>
            ),
        },
        { header: 'Email', accessor: (lead: Lead) => <span className="text-gray-500">{lead.email}</span> },
        { header: 'Company', accessor: (lead: Lead) => <span className="text-gray-500">{lead.company_name || '--'}</span> },
        { header: 'Status', accessor: (lead: Lead) => <Badge status={lead.status} /> },
        { header: 'Source', accessor: (lead: Lead) => <span className="text-gray-500 capitalize">{lead.source.replace(/_/g, ' ')}</span> },
        { header: 'Budget', accessor: (lead: Lead) => <span className="text-gray-700">{lead.estimated_budget ? formatCurrency(lead.estimated_budget) : '--'}</span>, className: 'text-right' },
        { header: 'Partner', accessor: (lead: Lead) => <span className="text-gray-500">{lead.referral_partner?.user?.name || '--'}</span> },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (lead: Lead) => (
                <span>
                    <Link href={`/admin/leads/${lead.id}`} className="text-gray-400 hover:text-violet-600 mr-2">View</Link>
                    <Link href={`/admin/leads/${lead.id}/edit`} className="text-gray-400 hover:text-gray-600">Edit</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Leads" header="Leads">
            <Head title="Leads" />

            <ModuleBanner
                breadcrumb="Business / Leads"
                title="Sales Pipeline"
                description="Manage your sales pipeline. Track prospects from first contact to closed deal."
                gradient="from-violet-600 to-purple-600"
                icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                actionHref="/admin/leads/create"
                actionLabel="New Lead"
            />

            {/* KPIs */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Leads" value={totalLeads} borderColor="border-l-violet-500" />
                <StatCard label="Won" value={wonLeads} borderColor="border-l-emerald-500" />
                <StatCard label="Conversion" value={`${conversionRate}%`} borderColor="border-l-blue-500" />
                <StatCard label="Pipeline Value" value={formatCurrency(pipelineValue)} borderColor="border-l-amber-500" />
            </div>

            {/* View toggle */}
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={() => setView('table')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300')}>
                    Table
                </button>
                <button onClick={() => setView('kanban')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300')}>
                    Kanban
                </button>
            </div>

            {/* Table View */}
            {view === 'table' && (
                <>
                    {leads.data.length === 0 ? (
                        <EmptyState title="No leads yet" description="Add your first lead to get started." actionHref="/admin/leads/create" actionLabel="New Lead" borderColor="border-t-violet-500" />
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

            {/* Kanban View */}
            {view === 'kanban' && (
                <div className="stagger-children flex overflow-x-auto space-x-4 pb-4">
                    {kanbanColumns.map(col => (
                        <div key={col.key} className="min-w-[280px] w-[280px] flex-shrink-0">
                            <div className={`bg-gray-100 rounded-lg border-t-4 ${col.color}`}>
                                <div className="px-3 py-2.5 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700">{col.label}</h4>
                                    <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                        {(kanbanLeads[col.key] || []).length}
                                    </span>
                                </div>
                                <div className="px-3 pb-3 space-y-2 min-h-[200px]">
                                    {(kanbanLeads[col.key] || []).map(lead => (
                                        <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
                                            <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                                            {lead.company_name && <p className="text-xs text-gray-400 mt-0.5">{lead.company_name}</p>}
                                            {lead.estimated_budget && <p className="text-xs text-gray-500 mt-1 font-medium">{formatCurrency(lead.estimated_budget)}</p>}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
