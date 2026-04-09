import DevLayout from '@/Layouts/DevLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import GuidedTour, { TourTriggerButton } from '@/Components/ui/GuidedTour';
import { useTour } from '@/hooks/useTour';
import { devDashboardSteps } from '@/data/tourSteps';
import { useConfirm } from '@/hooks/useConfirm';

interface MonthlyCompleted {
    month: string;
    count: number;
}

interface Props {
    myProjects: any[];
    pendingProjects: any[];
    stats: {
        myActive: number;
        myCompleted: number;
        pendingClaim: number;
        totalAssigned: number;
    };
    monthlyCompleted?: MonthlyCompleted[];
    totalBudgetManaged?: number;
    devSettings?: { showEarnings: boolean; requireApproval: boolean; showSkillsMatching: boolean };
    earningsThisMonth?: number;
    earningsLast6Months?: { month: string; amount: number }[];
    pendingApprovalHours?: number;
    skillsMatchedProjects?: any[];
}

export default function DevDashboard({ myProjects, pendingProjects, stats, monthlyCompleted = [], totalBudgetManaged = 0, devSettings, earningsThisMonth = 0, earningsLast6Months = [], pendingApprovalHours = 0, skillsMatchedProjects = [] }: Props) {
    const { t } = useTranslation();
    const tour = useTour('dev_dashboard', devDashboardSteps.length);

    return (
        <DevLayout title={t("Dashboard")}>
            <Head title={t("Developer Dashboard")} />

            <GuidedTour
                steps={devDashboardSteps}
                isActive={tour.isActive}
                currentStep={tour.currentStep}
                onNext={tour.next}
                onPrev={tour.prev}
                onSkip={tour.skip}
                onDismiss={tour.dismiss}
                accentColor="indigo"
            />
            <TourTriggerButton onClick={tour.restart} accentColor="indigo" />

            {/* Hero banner */}
            <div data-tour="hero-banner" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm">{t('Developer workspace')}</p>
                    <h2 className="text-3xl font-black text-white mt-1">{t('Your Projects')}</h2>
                    <p className="text-gray-400 text-sm mt-2">{t('Browse pending projects and claim the ones you want to work on.')}</p>
                </div>
            </div>

            {/* Dev portal extra cards */}
            {(devSettings?.showEarnings || devSettings?.requireApproval || devSettings?.showSkillsMatching) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {devSettings?.showEarnings && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Revenus du mois')}</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{earningsThisMonth.toLocaleString()} €</p>
                            <div className="flex items-end gap-1 mt-3 h-8">
                                {earningsLast6Months.map((m, i) => {
                                    const max = Math.max(...earningsLast6Months.map(x => x.amount), 1);
                                    const h = Math.max(4, Math.round((m.amount / max) * 100));
                                    return <div key={i} title={`${m.month}: ${m.amount}€`} className="flex-1 bg-indigo-400 rounded-sm" style={{ height: `${h}%` }} />;
                                })}
                            </div>
                        </div>
                    )}
                    {devSettings?.requireApproval && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Heures en attente de validation')}</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{pendingApprovalHours} h</p>
                        </div>
                    )}
                    {devSettings?.showSkillsMatching && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Projets correspondant à vos compétences')}</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{skillsMatchedProjects.length}</p>
                            <ul className="mt-2 space-y-1">
                                {skillsMatchedProjects.slice(0, 3).map((p: any) => (
                                    <li key={p.id} className="text-xs">
                                        <Link href={`/dev/projects/${p.id}`} className="text-indigo-500 hover:underline">{p.nom_societe}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Stats grid */}
            <div data-tour="stats-grid" className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.myActive}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('My Active')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.myCompleted}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Completed')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.pendingClaim}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Pending Claim')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalAssigned}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Total Assigned')}</p>
                </div>
            </div>

            {/* Monthly Completed & Budget */}
            <div data-tour="monthly-chart" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                {/* Monthly Completed Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">{t('Completed Projects (6 months)')}</h3>
                    {monthlyCompleted.length > 0 ? (() => {
                        const maxVal = Math.max(...monthlyCompleted.map(m => m.count), 1);
                        const chartHeight = 120;
                        const barWidth = 40;
                        const gap = 20;
                        const svgWidth = monthlyCompleted.length * (barWidth + gap);
                        return (
                            <div className="overflow-x-auto">
                                <svg width={svgWidth} height={chartHeight + 40} className="mx-auto">
                                    {monthlyCompleted.map((m, i) => {
                                        const x = i * (barWidth + gap) + gap / 2;
                                        const h = (m.count / maxVal) * chartHeight;
                                        return (
                                            <g key={i}>
                                                <rect
                                                    x={x} y={chartHeight - h}
                                                    width={barWidth} height={h}
                                                    rx={6} className="fill-indigo-400 dark:fill-indigo-500"
                                                />
                                                {m.count > 0 && (
                                                    <text
                                                        x={x + barWidth / 2} y={chartHeight - h - 6}
                                                        textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-xs" fontSize={11}
                                                    >
                                                        {m.count}
                                                    </text>
                                                )}
                                                <text
                                                    x={x + barWidth / 2} y={chartHeight + 20}
                                                    textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize={10}
                                                >
                                                    {m.month}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        );
                    })() : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('No data yet.')}</p>
                    )}
                </div>

                {/* Total Budget Managed */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-2">{t('Budget Managed')}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                        <ProtectedAmount amount={totalBudgetManaged} />
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('Total across all projects')}</p>
                </div>
            </div>

            {/* Pending Projects */}
            <div data-tour="pending-projects" className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('Pending Projects')}</h3>
                    <Link href="/dev/projects?tab=pending" className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">{t('View all')} &rarr;</Link>
                </div>
                {pendingProjects.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </div>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('No pending projects right now')}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Check back later for new projects to claim')}</p>
                    </div>
                ) : (
                    <div className="stagger-children grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {pendingProjects.map((project: any) => (
                            <PendingProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            {/* My Projects */}
            <div data-tour="my-projects">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('My Projects')}</h3>
                    <Link href="/dev/projects?tab=my" className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">{t('View all')} &rarr;</Link>
                </div>
                {myProjects.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('No projects claimed yet')}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Claim a pending project above to get started')}</p>
                    </div>
                ) : (
                    <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-700">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Project')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t('Client')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('Budget')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Status')}</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {myProjects.map((project: any) => (
                                    <tr key={project.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.nom_societe || 'Untitled'}</p>
                                            <p className="text-xs text-gray-400">{formatProjectType(project.type_site) !== '--' ? formatProjectType(project.type_site) : project.langage_programmation || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{project.client?.name || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.budget ? <ProtectedAmount amount={project.budget} /> : '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={project.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dev/projects/${project.id}`} className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">{t('View')} &rarr;</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DevLayout>
    );
}

function PendingProjectCard({ project }: { project: any }) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const { post, processing } = useForm({});
    const partnerName = project.lead?.referral_partner?.user?.name;

    async function handleClaim(e: React.FormEvent) {
        e.preventDefault();
        const ok = await confirm({
            title: t('Claim Project'),
            message: t('Are you sure you want to claim "{{name}}"?', { name: project.nom_societe }),
            confirmText: t('Claim'),
            variant: 'info',
        });
        if (!ok) return;
        post(`/dev/projects/${project.id}/claim`);
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{project.nom_societe || 'Untitled Project'}</h4>
                    {project.client && (
                        <p className="text-xs text-gray-400 mt-0.5">{t('Client')}: {project.client.name}</p>
                    )}
                </div>
                <Badge status={project.status} />
            </div>

            <div className="space-y-2 flex-1">
                {project.budget && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t('Budget')}: <ProtectedAmount amount={project.budget} />
                    </div>
                )}
                {project.type_site && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
                        {formatProjectType(project.type_site)}
                    </div>
                )}
                {partnerName && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        {t('Referred by')}: {partnerName}
                    </div>
                )}
                {project.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{project.description}</p>
                )}
            </div>

            <div className="mt-4 flex items-center space-x-2">
                <form onSubmit={handleClaim} className="flex-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? t('Claiming...') : t('Claim Project')}
                    </button>
                </form>
                <Link
                    href={`/dev/projects/${project.id}`}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    {t('Details')}
                </Link>
            </div>
            <ConfirmDialog />
        </div>
    );
}
