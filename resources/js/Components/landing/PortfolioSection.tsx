import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import AdminEditButton from '@/Components/landing/AdminEditButton';

interface PortfolioProject {
    id: number;
    projet_id?: number;
    title: string;
    slug: string;
    client_name: string;
    client_logo: string | null;
    excerpt: string;
    category: string | null;
    tech_stack: string[];
    tags: string[];
    live_url: string | null;
    is_featured: boolean;
    duration_days: number | null;
    images: { id: number; image_path: string; alt_text: string; caption: string | null }[];
    projet?: { nom_societe: string; type_site: string; lieu: string; image: string | null };
}

interface Props {
    portfolio: PortfolioProject[];
    featuredProjects: PortfolioProject[];
    regularProjects: PortfolioProject[];
    sectionRef: React.RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export default function PortfolioSection({ portfolio, featuredProjects, regularProjects, sectionRef, isVisible }: Props) {
    const { t } = useTranslation();

    return (
        <section id="section-portfolio" className="py-20 bg-gray-100 dark:bg-gray-800 scroll-mt-2" ref={sectionRef} data-section-theme="light">
            <div className="max-w-7xl mx-auto px-4">
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
                    <h2 className="text-7xl md:text-9xl font-semibold text-black dark:text-white bebas" style={{ letterSpacing: '2px' }}>{t('Our Work')}</h2>
                    <hr className="mt-6 border-black/20 dark:border-white/20 max-w-md mx-auto" />
                    <OriginalLanguageBadge className="mt-4 justify-center" />
                </div>

                {portfolio.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="inline-block p-8 rounded-2xl bg-white/60 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                            <p className="text-2xl text-gray-400 bebas" style={{ letterSpacing: '2px' }}>{t('Portfolio coming soon')}</p>
                            <p className="text-gray-400 mt-2 text-sm">{t('We are preparing something special.')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {featuredProjects.map((project, index) => (
                            <Link key={project.id} href={`/projects/${project.slug}`}
                                className={`group block relative overflow-hidden rounded-2xl ${isVisible ? 'portfolio-card-animate' : 'opacity-0'}`}
                                style={{ animationDelay: `${index * 200}ms`, minHeight: '480px' }}>
                                <AdminEditButton href={`/admin/portfolio/${project.projet_id || project.id}/edit`} />
                                {project.images.length > 0 ? (
                                    <img src={`/storage/${project.images[0].image_path}`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                                )}
                                <div className="absolute inset-0 bg-black/60" />
                                {(() => {
                                    const logo = project.client_logo || project.projet?.image;
                                    return logo ? (
                                        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-[1] transition-all duration-700 group-hover:translate-x-[-10px] group-hover:scale-105">
                                            <img src={`/storage/${logo}`} alt={project.client_name} loading="lazy" className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-contain drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    ) : null;
                                })()}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                                {project.category && (
                                    <span className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-teal-400 text-gray-900 text-sm font-bold rounded-full bebas" style={{ letterSpacing: '1px' }}>{project.category}</span>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10 max-w-[65%]">
                                    <h3 className="text-4xl md:text-5xl font-bold text-white bebas mb-3 transition-colors duration-300 group-hover:text-teal-300" style={{ letterSpacing: '2px' }}>{project.title}</h3>
                                    {project.excerpt && <p className="text-white/70 text-lg mb-6 line-clamp-3">{project.excerpt}</p>}
                                    {project.tech_stack && project.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.tech_stack.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-full backdrop-blur-sm border border-white/10">{tech}</span>
                                            ))}
                                        </div>
                                    )}
                                    <span className="inline-flex items-center gap-2 text-white font-bold bebas text-lg opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0" style={{ letterSpacing: '2px' }}>
                                        {t('View Project').toUpperCase()}
                                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                    </span>
                                </div>
                            </Link>
                        ))}

                        {regularProjects.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularProjects.map((project, index) => (
                                    <Link key={project.id} href={`/projects/${project.slug}`}
                                        className={`group block relative overflow-hidden rounded-2xl ${isVisible ? 'portfolio-card-animate' : 'opacity-0'}`}
                                        style={{ animationDelay: `${(featuredProjects.length + index) * 150 + 200}ms`, minHeight: '360px' }}>
                                        <AdminEditButton href={`/admin/portfolio/${project.projet_id || project.id}/edit`} />
                                        {project.images.length > 0 ? (
                                            <img src={`/storage/${project.images[0].image_path}`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                                        )}
                                        <div className="absolute inset-0 bg-black/60" />
                                        {(() => {
                                            const logo = project.client_logo || project.projet?.image;
                                            return logo ? (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1] transition-all duration-700 group-hover:translate-x-[-5px] group-hover:scale-105">
                                                    <img src={`/storage/${logo}`} alt={project.client_name} loading="lazy" className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-contain drop-shadow-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>
                                            ) : null;
                                        })()}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                                        {project.category && (
                                            <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-teal-400 text-gray-900 text-xs font-bold rounded-full bebas" style={{ letterSpacing: '1px' }}>{project.category}</span>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                            <h3 className="text-2xl font-bold text-white bebas mb-2 transition-colors duration-300 group-hover:text-teal-300" style={{ letterSpacing: '1px' }}>{project.title}</h3>
                                            {project.tech_stack && project.tech_stack.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded-full backdrop-blur-sm border border-white/10">{tech}</span>
                                                    ))}
                                                    {project.tech_stack.length > 4 && (
                                                        <span className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded-full backdrop-blur-sm border border-white/10">+{project.tech_stack.length - 4}</span>
                                                    )}
                                                </div>
                                            )}
                                            <span className="inline-flex items-center gap-2 text-white font-bold bebas text-sm opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0" style={{ letterSpacing: '2px' }}>
                                                {t('View Project').toUpperCase()}
                                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {portfolio.length > 0 && (
                    <div className="text-center mt-16">
                        <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-full hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300 bebas" style={{ letterSpacing: '2px' }}>
                            {t('View All Projects').toUpperCase()}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
