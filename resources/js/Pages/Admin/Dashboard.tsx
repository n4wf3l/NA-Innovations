import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { PageProps } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    revenueMonth: number;
    activeProjects: number;
    openLeads: number;
    pendingInvoices: number;
    recentLeads: any[];
    overdueInvoices: any[];
    expiringServices: any[];
    pendingCommissions: number;
    projects: any[];
}

const statusBorder: Record<string, string> = {
    planning: 'border-t-violet-500',
    in_progress: 'border-t-blue-500',
    review: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
    on_hold: 'border-t-gray-400',
    cancelled: 'border-t-red-500',
};

export default function Dashboard({ revenueMonth, activeProjects, openLeads, pendingInvoices, recentLeads, overdueInvoices, expiringServices, pendingCommissions, projects }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();

    return (
        <AdminLayout title={t("Dashboard")} header={t("Dashboard")}>
            <Head title={t("Dashboard")} />

            {/* KPIs */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t('Revenue (MTD)')} value={protectedValue(revenueMonth, financialUnlocked)} borderColor="border-l-teal-500" />
                <StatCard label={t('Active Projects')} value={activeProjects} borderColor="border-l-indigo-500" />
                <StatCard label={t('Open Leads')} value={openLeads} borderColor="border-l-violet-500" />
                <StatCard label={t('Pending Invoices')} value={protectedValue(pendingInvoices, financialUnlocked)} borderColor="border-l-emerald-500" />
            </div>

            {/* Quick Actions */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                    { label: t('New Lead'), href: '/admin/leads/create', color: 'border-violet-200 hover:border-violet-400 text-violet-700' },
                    { label: t('New Quote'), href: '/admin/quotes/create', color: 'border-amber-200 hover:border-amber-400 text-amber-700' },
                    { label: t('New Invoice'), href: '/admin/invoices/create', color: 'border-emerald-200 hover:border-emerald-400 text-emerald-700' },
                    { label: t('New Client'), href: '/admin/clients/create', color: 'border-blue-200 hover:border-blue-400 text-blue-700' },
                ].map(a => (
                    <Link key={a.label} href={a.href} className={`bg-white dark:bg-gray-800 border-2 ${a.color} rounded-xl p-4 text-center text-sm font-semibold transition-colors`}>
                        + {a.label}
                    </Link>
                ))}
            </div>

            {/* Projects Boxes */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('Projects')}</h3>
                    <Link href="/admin/projects" className="text-xs text-teal-600 hover:text-teal-700 font-semibold">{t('View all')} &rarr;</Link>
                </div>
                <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {projects.map((project: any) => {
                        const partnerName = project.lead?.referral_partner?.user?.name;
                        return (
                            <Link
                                key={project.id}
                                href={`/admin/projects/${project.id}`}
                                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-t-4 ${statusBorder[project.status] || 'border-t-gray-300'} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group`}
                            >
                                {/* Partner banner - BIG and visible */}
                                {partnerName ? (
                                    <div className="bg-rose-50 dark:bg-rose-900/30 px-4 py-2.5 flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-black text-rose-700">{partnerName.split(' ').map((n: string) => n[0]).join('')}</span>
                                        </div>
                                        <span className="text-sm font-bold text-rose-700 truncate">via {partnerName}</span>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2.5">
                                        <span className="text-xs text-gray-400 dark:text-gray-500">{t('Client direct')}</span>
                                    </div>
                                )}

                                {/* Project info */}
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        {project.image ? (
                                            <img
                                                src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`}
                                                alt={project.nom_societe}
                                                className="w-9 h-9 rounded-lg object-contain bg-white/10 flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                    {(project.nom_societe || '?').substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-teal-700 transition-colors truncate">
                                                {project.nom_societe || 'Untitled Project'}
                                            </h4>
                                            {project.client && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                                    {project.client.company_name || project.client.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="mt-3">
                                        <ProtectedAmount amount={project.budget || 0} className="text-lg font-black text-gray-900 dark:text-white" />
                                    </div>

                                    {/* Developer */}
                                    {project.developer && (
                                        <div className="flex items-center space-x-1.5 mt-2">
                                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-indigo-600">{project.developer.name?.[0]}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{project.developer.name}</span>
                                        </div>
                                    )}

                                    {/* Status - centered at bottom */}
                                    <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 text-center">
                                        <Badge status={project.status} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {projects.length === 0 && (
                        <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <p className="text-gray-400 dark:text-gray-500">{t('No projects yet.')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t('Recent Leads')}</h3>
                        <Link href="/admin/leads" className="text-xs text-teal-600 hover:text-teal-700 font-medium">{t('View all')}</Link>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {recentLeads.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No leads yet.')}</p>
                        ) : recentLeads.map((lead: any) => (
                            <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.first_name} {lead.last_name}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{lead.company_name || lead.email}</p>
                                </div>
                                <Badge status={lead.status} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t('Alerts')}</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {overdueInvoices.length > 0 && overdueInvoices.map((inv: any) => (
                            <div key={inv.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-700">{t('Overdue')}: {inv.invoice_number}</p>
                                    <p className="text-xs text-red-500">{inv.client_name} — <ProtectedAmount amount={inv.amount_due} /></p>
                                </div>
                            </div>
                        ))}
                        {expiringServices.length > 0 && expiringServices.map((svc: any) => (
                            <div key={svc.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-700">{t('Expiring')}: {svc.name}</p>
                                    <p className="text-xs text-amber-500">{svc.expiry_date}</p>
                                </div>
                            </div>
                        ))}
                        {pendingCommissions > 0 && (
                            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm font-medium text-blue-700">{t('Commissions to pay')}: <ProtectedAmount amount={pendingCommissions} /></p>
                            </div>
                        )}
                        {overdueInvoices.length === 0 && expiringServices.length === 0 && pendingCommissions === 0 && (
                            <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                                <p className="font-medium">{t('All clear!')}</p>
                                <p>{t('No urgent alerts at this time.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
