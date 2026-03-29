import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import SearchableSelect from '@/Components/ui/SearchableSelect';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    projects: any[];
    availableProjects: any[];
    publishedCount: number;
}

export default function PortfolioIndex({ projects, availableProjects, publishedCount }: Props) {
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState('');

    const handleAddProject = (projectId: string) => {
        if (projectId) {
            router.patch(`/admin/portfolio/${projectId}/add`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Portfolio" header="Portfolio">
            <Head title="Portfolio" />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Portfolio</h1>
                    <p className="text-amber-100 text-sm">{t('Gérez les projets affichés sur votre site vitrine')}</p>
                    <p className="text-white/80 text-xs mt-2">{publishedCount} {t('publiés')} / {projects.length} {t('au total')}</p>
                </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <svg className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25" />
                    </svg>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucun projet dans le portfolio.')}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Ajoutez un projet ci-dessous pour commencer.')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    {projects.map((project: any) => {
                        const portfolio = project.portfolio_project;
                        const firstImage = portfolio?.images?.[0];
                        const techStack = portfolio?.tech_stack || [];
                        const isPublished = portfolio?.is_published;
                        const isFeatured = portfolio?.is_featured;

                        return (
                            <div key={project.id} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group transition-all hover:shadow-lg ${!isPublished ? 'opacity-60' : ''}`}>
                                {/* Image */}
                                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    {firstImage ? (
                                        <img src={`/storage/${firstImage.image_path}`} alt={project.nom_societe} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : project.image ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <img src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`} alt={project.nom_societe} className="max-h-16 max-w-32 object-contain opacity-40" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                            <span className="text-3xl font-black text-gray-200 dark:text-gray-500">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                        </div>
                                    )}
                                    {isFeatured && (
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                            {t('Mis en avant')}
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${isPublished ? 'bg-emerald-500 text-white' : 'bg-gray-800/70 text-gray-300'}`}>
                                            {isPublished ? t('Publié') : t('Brouillon')}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        {project.image ? (
                                            <img src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`} alt="" className="w-8 h-8 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 flex-shrink-0" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{project.nom_societe}</h3>
                                            {portfolio?.category && (
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500">{portfolio.category} {portfolio?.duration_days ? `· ${portfolio.duration_days}j` : ''}</p>
                                            )}
                                        </div>
                                    </div>

                                    {portfolio?.excerpt && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{portfolio.excerpt}</p>
                                    )}

                                    {/* Tech stack */}
                                    {techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {techStack.slice(0, 5).map((tech: string) => (
                                                <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{tech}</span>
                                            ))}
                                            {techStack.length > 5 && <span className="text-[10px] text-gray-400">+{techStack.length - 5}</span>}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
                                        <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                                            {portfolio?.images?.length > 0 && <span>{portfolio.images.length} images</span>}
                                            {portfolio?.live_url && (
                                                <a href={portfolio.live_url} target="_blank" rel="noopener" className="hover:text-teal-500 transition-colors flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                                    Live
                                                </a>
                                            )}
                                        </div>
                                        <Link href={`/admin/portfolio/${project.id}/edit`} className="text-xs text-teal-500 hover:text-teal-600 font-semibold">{t('Modifier')} →</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add project */}
            {availableProjects.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Ajouter un projet au portfolio')}</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <SearchableSelect
                                value={selectedProject}
                                onChange={setSelectedProject}
                                placeholder={t('Sélectionner un projet...')}
                                searchPlaceholder={t('Rechercher un projet...')}
                                options={[
                                    { value: '', label: t('Sélectionner un projet...') },
                                    ...availableProjects.map((p: any) => ({
                                        value: String(p.id),
                                        label: p.nom_societe,
                                        sublabel: p.client?.company_name || undefined,
                                        icon: p.image ? (
                                            <img src={p.image.startsWith('http') ? p.image : `/storage/${p.image}`} alt="" className="w-7 h-7 rounded-lg object-contain bg-gray-100 dark:bg-gray-700" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{(p.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                            </div>
                                        ),
                                    })),
                                ]}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => { if (selectedProject) handleAddProject(selectedProject); }}
                            disabled={!selectedProject}
                            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-30 transition-all"
                        >
                            {t('Ajouter')}
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
