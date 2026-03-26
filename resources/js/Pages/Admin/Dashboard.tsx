import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface Props {
    revenueMonth: number;
    activeProjects: number;
    openLeads: number;
    pendingInvoices: number;
    recentLeads: any[];
    overdueInvoices: any[];
    expiringServices: any[];
    pendingCommissions: number;
}

export default function Dashboard({ revenueMonth, activeProjects, openLeads, pendingInvoices, recentLeads, overdueInvoices, expiringServices, pendingCommissions }: Props) {
    return (
        <AdminLayout title="Dashboard" header="Dashboard">
            <Head title="Dashboard" />

            {/* KPIs */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Revenue (MTD)" value={formatCurrency(revenueMonth)} borderColor="border-l-teal-500" />
                <StatCard label="Active Projects" value={activeProjects} borderColor="border-l-indigo-500" />
                <StatCard label="Open Leads" value={openLeads} borderColor="border-l-violet-500" />
                <StatCard label="Pending Invoices" value={formatCurrency(pendingInvoices)} borderColor="border-l-emerald-500" />
            </div>

            {/* Quick Actions */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'New Lead', href: '/admin/leads/create', color: 'border-violet-200 hover:border-violet-400 text-violet-700' },
                    { label: 'New Quote', href: '/admin/quotes/create', color: 'border-amber-200 hover:border-amber-400 text-amber-700' },
                    { label: 'New Invoice', href: '/admin/invoices/create', color: 'border-emerald-200 hover:border-emerald-400 text-emerald-700' },
                    { label: 'New Client', href: '/admin/clients/create', color: 'border-blue-200 hover:border-blue-400 text-blue-700' },
                ].map(a => (
                    <Link key={a.label} href={a.href} className={`bg-white border-2 ${a.color} rounded-xl p-4 text-center text-sm font-semibold transition-colors`}>
                        + {a.label}
                    </Link>
                ))}
            </div>

            <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Leads</h3>
                        <Link href="/admin/leads" className="text-xs text-teal-600 hover:text-teal-700 font-medium">View all</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentLeads.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-gray-400">No leads yet.</p>
                        ) : recentLeads.map((lead: any) => (
                            <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                                    <p className="text-xs text-gray-400">{lead.company_name || lead.email}</p>
                                </div>
                                <Badge status={lead.status} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h3 className="font-semibold text-gray-900">Alerts</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {overdueInvoices.length > 0 && overdueInvoices.map((inv: any) => (
                            <div key={inv.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-700">Overdue: {inv.invoice_number}</p>
                                    <p className="text-xs text-red-500">{inv.client_name} -- {formatCurrency(inv.amount_due)}</p>
                                </div>
                            </div>
                        ))}
                        {expiringServices.length > 0 && expiringServices.map((svc: any) => (
                            <div key={svc.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-700">Expiring: {svc.name}</p>
                                    <p className="text-xs text-amber-500">{svc.expiry_date}</p>
                                </div>
                            </div>
                        ))}
                        {pendingCommissions > 0 && (
                            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm font-medium text-blue-700">Commissions to pay: {formatCurrency(pendingCommissions)}</p>
                            </div>
                        )}
                        {overdueInvoices.length === 0 && expiringServices.length === 0 && pendingCommissions === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                <p className="font-medium">All clear!</p>
                                <p>No urgent alerts at this time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
