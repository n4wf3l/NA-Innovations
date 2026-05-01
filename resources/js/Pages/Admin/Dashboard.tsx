import { useState, useRef, useEffect, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import OnboardingEmptyState from '@/Components/Admin/OnboardingEmptyState';
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
    activityChart: { hour: string; count: number }[];
    activityNow: number;
    activityPeak: number;
    activityPeakHour: string;
    activityTotal: number;
}

const statusColor: Record<string, { bg: string; ring: string; dot: string }> = {
    planning: { bg: 'bg-violet-500/10 dark:bg-violet-500/20', ring: 'ring-violet-500/20', dot: 'bg-violet-500' },
    in_progress: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', ring: 'ring-blue-500/20', dot: 'bg-blue-500' },
    review: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', ring: 'ring-amber-500/20', dot: 'bg-amber-500' },
    completed: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', ring: 'ring-emerald-500/20', dot: 'bg-emerald-500' },
    on_hold: { bg: 'bg-gray-500/10 dark:bg-gray-500/20', ring: 'ring-gray-500/20', dot: 'bg-gray-400' },
    cancelled: { bg: 'bg-red-500/10 dark:bg-red-500/20', ring: 'ring-red-500/20', dot: 'bg-red-500' },
};

/** Micro sparkline SVG */
function MiniSparkline({ data, color = '#10b981', height = 32 }: { data: number[]; color?: string; height?: number }) {
    if (data.length < 2) return null;
    const max = Math.max(...data, 1);
    const w = 100;
    const coords = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - (v / max) * (height * 0.85) - 2}`);
    const polyPoints = coords.join(' ');
    const area = `M0,${height} L${coords.join(' L')} L${w},${height} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
            <defs>
                <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#spark-${color.replace('#', '')})`} />
            <polyline points={polyPoints} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Ring progress indicator */
function MiniRing({ value, max, color = '#8b5cf6', size = 40 }: { value: number; max: number; color?: string; size?: number }) {
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    const r = (size - 6) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - pct);
    return (
        <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-gray-700" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
        </svg>
    );
}

export default function Dashboard({ revenueMonth, revenueLastMonth, revenueChange, activeProjects, openLeads, newLeadsThisMonth, leadsChange, wonThisMonth, wonLastMonth, pendingInvoices, recentLeads, overdueInvoices, expiringServices, pendingCommissions, projects, dashboardPrefs: initialPrefs, notifyAdminEmails: initialNotifyEmails, activityChart = [], activityNow = 0, activityPeak = 0, activityPeakHour = '--', activityTotal = 0 }: Props) {
    const { financialUnlocked, auth } = usePage<PageProps>().props;
    const { t } = useTranslation();

    // Show onboarding empty-state when the tenant is fresh (no data anywhere)
    const isFreshTenant = activeProjects === 0
        && openLeads === 0
        && newLeadsThisMonth === 0
        && pendingInvoices === 0
        && wonThisMonth === 0
        && wonLastMonth === 0
        && (projects?.length ?? 0) === 0
        && (recentLeads?.length ?? 0) === 0;

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [prefs, setPrefs] = useState<DashboardPrefs>(initialPrefs);
    const [notifyEmails, setNotifyEmails] = useState(initialNotifyEmails ?? true);
    const [saving, setSaving] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePref = (key: keyof DashboardPrefs) => {
        if (key === 'kpis') return;
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const savePrefs = async () => {
        setSaving(true);
        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';
            await fetch('/admin/dashboard/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                body: JSON.stringify({ dashboard_layout: prefs, notify_admin_emails: notifyEmails }),
            });
            setSettingsOpen(false);
        } catch { /* silently fail */ } finally { setSaving(false); }
    };

    const sectionLabels: Record<keyof DashboardPrefs, string> = {
        kpis: 'KPIs',
        quick_actions: t('Quick Actions'),
        projects: t('Projects'),
        recent_leads: t('Recent Leads'),
        alerts: t('Alerts'),
    };

    const TrendBadge = ({ value }: { value: number }) => {
        if (value === 0) return null;
        const isUp = value > 0;
        return (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                <svg className={`w-3 h-3 ${isUp ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                {isUp ? '+' : ''}{value}%
            </span>
        );
    };

    // Separate active vs completed projects
    const activeProjectsList = useMemo(() => projects.filter((p: any) => !['completed', 'cancelled'].includes(p.status)), [projects]);
    const completedProjectsList = useMemo(() => projects.filter((p: any) => p.status === 'completed'), [projects]);
    const alertCount = overdueInvoices.length + expiringServices.length + (pendingCommissions > 0 ? 1 : 0);

    // Fake sparkline data derived from revenue for visual effect
    const revenueSparkline = useMemo(() => {
        const base = revenueLastMonth || revenueMonth * 0.8;
        return Array.from({ length: 7 }, (_, i) => Math.max(0, base * (0.7 + Math.random() * 0.6) * (i < 6 ? 1 : revenueMonth / Math.max(base, 1))));
    }, [revenueMonth, revenueLastMonth]);

    // Glass card base class
    const glass = 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-lg shadow-gray-200/30 dark:shadow-black/30';
    const glassCompact = 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-md shadow-gray-200/20 dark:shadow-black/20';

    return (
        <AdminLayout title={t("Dashboard")} header={t("Dashboard")}>
            <Head title={t("Dashboard")} />

            {isFreshTenant && <OnboardingEmptyState name={auth?.user?.name ?? ''} />}

            {/* Settings gear */}
            <div className="flex justify-end mb-5 relative" ref={settingsRef}>
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className={`p-2.5 rounded-2xl transition-all ${settingsOpen ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-2 ring-violet-500/20' : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-white/50 dark:border-gray-700/50 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm'}`}
                    title={t('Dashboard Settings')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {settingsOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-72 ${glass} z-50 p-5`}>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Dashboard Sections')}</h4>
                        <div className="space-y-3">
                            {(Object.keys(sectionLabels) as Array<keyof DashboardPrefs>).map(key => (
                                <label key={key} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{sectionLabels[key]}</span>
                                    <button type="button" onClick={() => togglePref(key)} disabled={key === 'kpis'}
                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${prefs[key] ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'} ${key === 'kpis' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${prefs[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Notifications')}</h4>
                            <label className="flex items-center justify-between cursor-pointer mb-3">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Receive email notifications')}</span>
                                <button type="button" onClick={() => setNotifyEmails(!notifyEmails)}
                                    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${notifyEmails ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${notifyEmails ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                            <button onClick={savePrefs} disabled={saving} className="w-full px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                                {saving ? t('Saving...') : t('Save')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ BENTO KPIs ═══ */}
            {prefs.kpis !== false && (
                <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Revenue — hero card with sparkline */}
                    <div className={`${glass} p-6 relative overflow-hidden col-span-2 lg:col-span-1`}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <TrendBadge value={revenueChange} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('Revenue (MTD)')}</p>
                            <div className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{protectedValue(revenueMonth, financialUnlocked)}</div>
                            {financialUnlocked && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{t('vs last month')}</p>}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 opacity-60">
                            <MiniSparkline data={revenueSparkline} color="#14b8a6" height={40} />
                        </div>
                    </div>

                    {/* Active Projects — with ring */}
                    <div className={`${glass} p-6`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('Active Projects')}</p>
                                <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">{activeProjects}</div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                                    <span className="text-indigo-500 dark:text-indigo-400 font-bold">{wonThisMonth}</span> {t('won this month')}
                                </p>
                            </div>
                            <MiniRing value={activeProjects} max={activeProjects + completedProjectsList.length} color="#6366f1" size={44} />
                        </div>
                    </div>

                    {/* Open Leads */}
                    <div className={`${glass} p-6`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                            </div>
                            <TrendBadge value={leadsChange} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('Open Leads')}</p>
                        <div className="mt-1 text-3xl font-black text-gray-900 dark:text-white">{openLeads}</div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            <span className="text-violet-500 dark:text-violet-400 font-bold">+{newLeadsThisMonth}</span> {t('this month')}
                        </p>
                    </div>

                    {/* Pending Invoices */}
                    <div className={`${glass} p-6`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t('Pending Invoices')}</p>
                        <div className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{protectedValue(pendingInvoices, financialUnlocked)}</div>
                        {financialUnlocked && pendingCommissions > 0 && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">{protectedValue(pendingCommissions, financialUnlocked)} {t('commissions pending')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ QUICK ACTIONS ═══ */}
            {prefs.quick_actions !== false && (
                <div className="stagger-children flex flex-wrap gap-2.5 mb-7">
                    {[
                        { label: t('New Lead'), href: '/admin/leads/create', icon: 'M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z', primary: true, gradient: 'from-violet-500 to-purple-600' },
                        { label: t('New Quote'), href: '/admin/quotes/create', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                        { label: t('New Invoice'), href: '/admin/invoices/create', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75' },
                        { label: t('New Client'), href: '/admin/clients/create', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
                    ].map(a => (
                        <Link
                            key={a.label}
                            href={a.href}
                            className={a.primary
                                ? `inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${a.gradient} text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all`
                                : `inline-flex items-center gap-2 px-4 py-2.5 ${glassCompact} text-sm font-semibold text-gray-700 dark:text-gray-300 hover:-translate-y-0.5 transition-all`
                            }
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
                            {a.label}
                        </Link>
                    ))}
                </div>
            )}

            {/* ═══ BENTO GRID: Projects + Leads + Alerts ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT: Active Projects — 2 cols wide */}
                {prefs.projects !== false && (
                    <div className="lg:col-span-2 space-y-5">
                        {/* Active projects — large cards */}
                        {activeProjectsList.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Active Projects')}</h3>
                                        <span className="text-[11px] font-bold text-white bg-blue-500 rounded-full px-2 py-0.5">{activeProjectsList.length}</span>
                                    </div>
                                    <Link href="/admin/projects" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors">{t('View all')} &rarr;</Link>
                                </div>
                                <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {activeProjectsList.slice(0, 4).map((project: any) => {
                                        const partnerName = project.lead?.referral_partner?.user?.name;
                                        const sc = statusColor[project.status] || statusColor.planning;
                                        return (
                                            <Link key={project.id} href={`/admin/projects/${project.id}`} className={`${glassCompact} p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group`}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {project.image ? (
                                                            <img src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`} alt={project.nom_societe} className="w-10 h-10 rounded-xl object-contain bg-gray-50 dark:bg-gray-700/50 flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{project.nom_societe}</h4>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{project.client?.company_name || project.client?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${sc.bg}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                        <Badge status={project.status} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <ProtectedAmount amount={project.budget || 0} className="text-lg font-black" />
                                                    <div className="flex items-center gap-2">
                                                        {partnerName && (
                                                            <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full truncate max-w-[100px]">via {partnerName.split(' ')[0]}</span>
                                                        )}
                                                        {project.developer && (
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center" title={project.developer.name}>
                                                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">{project.developer.name?.[0]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Completed projects — compact list */}
                        {completedProjectsList.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Completed')}</h3>
                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-full px-2 py-0.5">{completedProjectsList.length}</span>
                                </div>
                                <div className={`${glass} divide-y divide-gray-100 dark:divide-gray-700/50 overflow-hidden`}>
                                    {completedProjectsList.slice(0, 5).map((project: any) => (
                                        <Link key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {project.image ? (
                                                    <img src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`} alt={project.nom_societe} className="w-7 h-7 rounded-lg object-contain flex-shrink-0" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white truncate">{project.nom_societe}</span>
                                            </div>
                                            <ProtectedAmount amount={project.budget || 0} className="text-sm font-bold" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {projects.length === 0 && (
                            <div className={`${glass} p-12 text-center`}>
                                <p className="text-gray-400 dark:text-gray-500">{t('No projects yet.')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* RIGHT: Leads + Alerts stacked — 1 col */}
                <div className="space-y-5">
                    {/* Recent Leads */}
                    {prefs.recent_leads !== false && (
                        <div className={`${glass} overflow-hidden`}>
                            <div className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Recent Leads')}</h3>
                                </div>
                                <Link href="/admin/leads" className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-violet-500 font-medium transition-colors">{t('View all')}</Link>
                            </div>
                            <div className="divide-y divide-gray-100/70 dark:divide-gray-700/50">
                                {recentLeads.length === 0 ? (
                                    <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No leads yet.')}</p>
                                ) : recentLeads.map((lead: any) => (
                                    <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-white/40 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">{(lead.first_name?.[0] || '?').toUpperCase()}{(lead.last_name?.[0] || '').toUpperCase()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{lead.first_name} {lead.last_name}</p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{lead.company_name || lead.email}</p>
                                            </div>
                                        </div>
                                        <Badge status={lead.status} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {prefs.alerts !== false && (
                        <div className={`${glass} overflow-hidden`}>
                            <div className="px-5 py-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Alerts')}</h3>
                                {alertCount > 0 && (
                                    <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{alertCount}</span>
                                )}
                            </div>
                            <div className="px-4 pb-4 space-y-2">
                                {overdueInvoices.length > 0 && overdueInvoices.map((inv: any) => (
                                    <div key={inv.id} className="flex items-center gap-3 p-3 bg-red-50/80 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-red-700 dark:text-red-400 truncate">{t('Overdue')}: {inv.invoice_number}</p>
                                            <p className="text-[11px] text-red-500 dark:text-red-400/70 truncate">{inv.client_name} — <ProtectedAmount amount={inv.amount_due} /></p>
                                        </div>
                                    </div>
                                ))}
                                {expiringServices.length > 0 && expiringServices.map((svc: any) => (
                                    <div key={svc.id} className="flex items-center gap-3 p-3 bg-amber-50/80 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 truncate">{t('Expiring')}: {svc.name}</p>
                                            <p className="text-[11px] text-amber-500 dark:text-amber-400/70">{svc.expiry_date}</p>
                                        </div>
                                    </div>
                                ))}
                                {pendingCommissions > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-blue-50/80 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75" /></svg>
                                        </div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">{t('Commissions to pay')}: <ProtectedAmount amount={pendingCommissions} /></p>
                                    </div>
                                )}
                                {alertCount === 0 && (
                                    <div className="text-center py-6">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('All clear!')}</p>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500">{t('No urgent alerts at this time.')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
