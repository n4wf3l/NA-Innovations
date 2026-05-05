import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionNav from '@/Components/landing/SectionNav';

interface PortfolioProject {
    id: number;
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
}

function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1, ...options });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

export default function Projects({ portfolio }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>(portfolio);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const gridSection = useInView();

    const categories = ['All', ...Array.from(new Set(portfolio.map(p => p.category).filter(Boolean))) as string[]];

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            if (activeFilter === 'All') {
                setFilteredProjects(portfolio);
            } else {
                setFilteredProjects(portfolio.filter(p => p.category === activeFilter));
            }
            setIsTransitioning(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [activeFilter, portfolio]);

    return (
        <PublicLayout title="Our Work" description="Discover our portfolio of projects crafted with precision, creativity, and cutting-edge technology.">
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up {
                    animation: fadeInUp 0.7s ease-out forwards;
                    opacity: 0;
                }

                @keyframes projectCardIn {
                    from { opacity: 0; transform: translateY(50px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .project-card-animate {
                    animation: projectCardIn 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>

            {/* Hero Section */}
            <section className="bg-gray-900 py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center" aria-hidden="true">
                    <span className="text-[20vw] font-bold text-white bebas whitespace-nowrap">PORTFOLIO</span>
                </div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bold text-white bebas fade-in-up" style={{ letterSpacing: '3px' }}>
                        {t('Our Work')}
                    </h1>
                    <OriginalLanguageBadge light className="mt-4 justify-center" />
                    <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '200ms' }}>
                        Discover our portfolio of projects crafted with precision, creativity, and cutting-edge technology.
                    </p>
                </div>
            </section>

            {/* Filter Bar + Grid */}
            <section id="section-projects" className="bg-gray-100 dark:bg-gray-800 py-16 md:py-24 scroll-mt-20" ref={gridSection.ref}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Category Filter Pills */}
                    {categories.length > 1 && (
                        <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-700 ${gridSection.isVisible ? 'fade-in-up' : 'opacity-0'}`}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveFilter(category)}
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold bebas text-sm sm:text-lg transition-all duration-300 ${
                                        activeFilter === category
                                            ? 'bg-teal-400 text-gray-900 shadow-lg shadow-teal-400/20'
                                            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:text-teal-500'
                                    }`}
                                    style={{ letterSpacing: '1px' }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Projects Grid */}
                    <div
                        className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                    >
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-24">
                                <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <p className="text-3xl text-gray-400 dark:text-gray-500 bebas" style={{ letterSpacing: '2px' }}>{t('No projects found')}</p>
                                <p className="text-gray-400 dark:text-gray-500 mt-2">Try selecting a different category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                                {filteredProjects.map((project, index) => {
                                    const isTall = project.is_featured || index % 5 === 0;
                                    return (
                                        <Link
                                            key={project.id}
                                            href={`/projects/${project.slug}`}
                                            className={`group block relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ${
                                                gridSection.isVisible ? 'project-card-animate' : 'opacity-0'
                                            } ${isTall ? 'md:row-span-2 min-h-[360px] md:min-h-[520px]' : 'min-h-[260px] md:min-h-[340px]'}`}
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                            }}
                                        >
                                            {/* Background image */}
                                            {project.images.length > 0 ? (
                                                <img src={`/storage/${project.images[0].image_path}`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                                            )}

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-black/60" />

                                            {/* Centered logo */}
                                            {(() => {
                                                const logo = project.client_logo || project.projet?.image;
                                                return logo ? (
                                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 z-[1]" style={{ paddingBottom: '60px' }}>
                                                        <img src={`/storage/${logo}`} alt={project.client_name} loading="lazy" className={`object-contain drop-shadow-2xl ${isTall ? 'max-w-[220px] max-h-[160px]' : 'max-w-[150px] max-h-[110px]'}`} />
                                                    </div>
                                                ) : null;
                                            })()}

                                            {/* Bottom gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                            {/* Category badge */}
                                            {project.category && (
                                                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-teal-400 text-gray-900 text-xs font-bold rounded-full bebas" style={{ letterSpacing: '1px' }}>
                                                    {project.category}
                                                </span>
                                            )}

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                                <h3 className={`font-bold text-white bebas mb-1 transition-colors duration-300 group-hover:text-teal-300 ${isTall ? 'text-3xl md:text-4xl' : 'text-2xl'}`} style={{ letterSpacing: '1px' }}>
                                                    {project.title}
                                                </h3>

                                                {project.client_name && (
                                                    <p className="text-white/60 text-sm mb-3">{project.client_name}</p>
                                                )}

                                                {/* Tech stack pills */}
                                                {project.tech_stack && project.tech_stack.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {project.tech_stack.slice(0, isTall ? 6 : 3).map((tech, i) => (
                                                            <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded-full backdrop-blur-sm border border-white/10">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {project.tech_stack.length > (isTall ? 6 : 3) && (
                                                            <span className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded-full backdrop-blur-sm border border-white/10">
                                                                +{project.tech_stack.length - (isTall ? 6 : 3)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* View Project CTA */}
                                                <span className="inline-flex items-center gap-2 text-white font-bold bebas text-sm opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0" style={{ letterSpacing: '2px' }}>
                                                    {t('View Project').toUpperCase()}
                                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="section-cta" className="py-20 bg-gray-900 relative overflow-hidden scroll-mt-20">
                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center" aria-hidden="true">
                    <span className="text-[20vw] font-bold text-white bebas whitespace-nowrap">LET'S BUILD</span>
                </div>
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold text-white bebas mb-6" style={{ letterSpacing: '2px' }}>
                        {t('Have a project in mind?')}
                    </h2>
                    <p className="text-lg text-gray-400 mb-10">
                        {t("Let's discuss your next big idea.")}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-teal-400 text-gray-900 text-2xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] bebas"
                        style={{ letterSpacing: '3px' }}
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        {t('Start Your Project').toUpperCase()}
                    </Link>
                </div>
            </section>

            <SectionNav sections={[
                { id: 'section-projects', label: 'Projects' },
                { id: 'section-cta', label: 'Get Started' },
            ]} />
        </PublicLayout>
    );
}
