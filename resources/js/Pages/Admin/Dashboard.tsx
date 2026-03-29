import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { PageProps } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface DashboardPrefs {
    kpis: boolean;
    quick_actions: boolean;
    projects: boolean;
    recent_leads: boolean;
    alerts: boolean;
}

interface Props {
    revenueMonth: number;
    revenueLastMonth: number;
    revenueChange: number;
    activeProjects: number;
    openLeads: number;
    newLeadsThisMonth: number;
    leadsChange: number;
    wonThisMonth: number;
    wonLastMonth: number;
    pendingInvoices: number;
    recentLeads: any[];
    overdueInvoices: any[];
    expiringServices: any[];
    pendingCommissions: number;
    projects: any[];
    dashboardPrefs: DashboardPrefs;
    notifyAdminEmails: boolean;
}

const statusBorder: Record<string, string> = {
    planning: 'border-t-violet-500',
    in_progress: 'border-t-blue-500',
    review: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
    on_hold: 'border-t-gray-400',
    cancelled: 'border-t-red-500',
};

export default function Dashboard({ revenueMonth, revenueLastMonth, revenueChange, activeProjects, openLeads, newLeadsThisMonth, leadsChange, wonThisMonth, wonLastMonth, pendingInvoices, recentLeads, overdueInvoices, expiringServices, pendingCommissions, projects, dashboardPrefs: initialPrefs, notifyAdminEmails: initialNotifyEmails }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();

    // Settings panel state
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [prefs, setPrefs] = useState<DashboardPrefs>(initialPrefs);
    const [notifyEmails, setNotifyEmails] = useState(initialNotifyEmails ?? true);
    const [saving, setSaving] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePref = (key: keyof DashboardPrefs) => {
        if (key === 'kpis') return; // KPIs always visible
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const savePrefs = async () => {
        setSaving(true);
        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';
            await fetch('/admin/dashboard/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    dashboard_layout: prefs,
                    notify_admin_emails: notifyEmails,
                }),
            });
            setSettingsOpen(false);
        } catch (e) {
            // silently fail
        } finally {
            setSaving(false);
        }
    };

    const sectionLabels: Record<keyof DashboardPrefs, string> = {
        kpis: 'KPIs',
        quick_actions: t('Quick Actions'),
        projects: t('Projects'),
        recent_leads: t('Recent Leads'),
        alerts: t('Alerts'),
    };

    const TrendBadge = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
        if (value === 0) return null;
        const isUp = value > 0;
        return (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                <svg className={`w-3 h-3 ${isUp ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                {isUp ? '+' : ''}{value}%{suffix}
            </span>
        );
    };

    return (
        <AdminLayout title={t("Dashboard")} header={t("Dashboard")}>
            <Head title={t("Dashboard")} />

            {/* Settings gear button */}
            <div className="flex justify-end mb-4 relative" ref={settingsRef}>
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title={t('Dashboard Settings')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* Settings dropdown */}
                {settingsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Dashboard Sections')}</h4>
                        <div className="space-y-3">
                            {(Object.keys(sectionLabels) as Array<keyof DashboardPrefs>).map(key => (
                                <label key={key} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{sectionLabels[key]}</span>
                                    <button
                                        type="button"
                                        onClick={() => togglePref(key)}
                                        disabled={key === 'kpis'}
                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            prefs[key] ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'
                                        } ${key === 'kpis' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            prefs[key] ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Notifications')}</h4>
                            <label className="flex items-center justify-between cursor-pointer mb-3">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Receive email notifications')}</span>
                                <button
                                    type="button"
                                    onClick={() => setNotifyEmails(!notifyEmails)}
                                    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        notifyEmails ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        notifyEmails ? 'translate-x-4' : 'translate-x-0'
                                    }`} />
                                </button>
                            </label>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={savePrefs}
                                disabled={saving}
                                className="w-full px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? t('Saving...') : t('Save')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* KPIs with trends (always visible) */}
            {prefs.kpis !== false && (
                <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-l-teal-500 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{t('Revenue (MTD)')}</p>
                        <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{protectedValue(revenueMonth, financialUnlocked)}</div>
                        {financialUnlocked && (
                            <div className="mt-1.5 flex items-center gap-2">
                                <TrendBadge value={revenueChange} />
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('vs last month')}</span>
                            </div>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-l-indigo-500 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{t('Active Projects')}</p>
                        <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{activeProjects}</div>
                        <div className="mt-1.5">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{wonThisMonth} {t('won this month')}{wonLastMonth > 0 ? ` (${wonLastMonth} ${t('last month')})` : ''}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-l-violet-500 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{t('Open Leads')}</p>
                        <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{openLeads}</div>
                        <div className="mt-1.5 flex items-center gap-2">
                            <TrendBadge value={leadsChange} />
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">+{newLeadsThisMonth} {t('this month')}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 border-l-emerald-500 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{t('Pending Invoices')}</p>
                        <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{protectedValue(pendingInvoices, financialUnlocked)}</div>
                        {financialUnlocked && pendingCommissions > 0 && (
                            <div className="mt-1.5">
                                <span className="text-[10px] text-amber-500 font-medium">{protectedValue(pendingCommissions, financialUnlocked)} {t('commissions pending')}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {prefs.quick_actions !== false && (
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
            )}

            {/* Projects Boxes */}
            {prefs.projects !== false && (
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
            )}

            <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                {prefs.recent_leads !== false && (
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
                )}

                {/* Alerts */}
                {prefs.alerts !== false && (
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
                )}
            </div>
        </AdminLayout>
    );
}
