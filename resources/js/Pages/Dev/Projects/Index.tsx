import DevLayout from '@/Layouts/DevLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { cn, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    pendingProjects: any[];
    myProjects: any[];
    tab: string;
}

export default function ProjectsIndex({ pendingProjects, myProjects, tab }: Props) {
    const { t } = useTranslation();
    const activeTab = tab || 'pending';

    function switchTab(newTab: string) {
        router.get('/dev/projects', { tab: newTab }, { preserveState: true, preserveScroll: true });
    }

    return (
        <DevLayout title={t("Projects")}>
            <Head title={t("Projects")} />

            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
                <button
                    onClick={() => switchTab('pending')}
                    className={cn(
                        'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                        activeTab === 'pending'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                >
                    {t('Pending')}
                    {pendingProjects.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                            {pendingProjects.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => switchTab('my')}
                    className={cn(
                        'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                        activeTab === 'my'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                >
                    {t('My Projects')}
                    {myProjects.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
                            {myProjects.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Pending Tab */}
            {activeTab === 'pending' && (
                <div key={activeTab} className="animate-tab-in">
                    {pendingProjects.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("No pending projects")}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("All projects are currently assigned. Check back later.")}</p>
                        </div>
                    ) : (
                        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {pendingProjects.map((project: any) => (
                                <PendingProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* My Projects Tab */}
            {activeTab === 'my' && (
                <div key={activeTab} className="animate-tab-in">
                    {myProjects.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("No projects yet")}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("Claim a pending project to get started.")}</p>
                            <button
                                onClick={() => switchTab('pending')}
                                className="mt-4 px-5 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
                            >
                                {t('Browse Pending Projects')}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-700">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Project')}</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t('Client')}</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('Budget')}</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('Start Date')}</th>
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
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <p className="text-sm text-gray-500">{project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}</p>
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
            )}
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
                {project.langage_programmation && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                        {project.langage_programmation}
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
