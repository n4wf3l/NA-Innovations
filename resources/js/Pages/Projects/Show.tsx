import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { formatProjectType } from '@/lib/utils';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface PortfolioImage {
    id: number;
    image_path: string;
    alt_text: string;
    caption: string | null;
}

interface PortfolioProject {
    id: number;
    title: string;
    slug: string;
    client_name: string;
    client_logo: string | null;
    excerpt: string;
    context: string | null;
    challenge: string | null;
    solution: string | null;
    results: string | null;
    features: string[] | null;
    category: string | null;
    tech_stack: string[];
    tags: string[];
    live_url: string | null;
    video_url: string | null;
    show_video: boolean;
    is_featured: boolean;
    duration_days: number | null;
    testimonial_text: string | null;
    testimonial_author: string | null;
    testimonial_role: string | null;
    images: PortfolioImage[];
    projet?: { nom_societe: string; type_site: string; lieu: string; image?: string };
}

interface Props {
    project: PortfolioProject;
    nextProject?: { slug: string; title: string } | null;
    previousProject?: { slug: string; title: string } | null;
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

function Lightbox({ image, onClose }: { image: PortfolioImage; onClose: () => void }) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="max-w-5xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <img
                    src={`/storage/${image.image_path}`}
                    alt={image.alt_text || ''}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
                {image.caption && (
                    <p className="text-white/70 text-center mt-4 text-sm">{image.caption}</p>
                )}
            </div>
        </div>,
        document.body
    );
}

export default function Show({ project, nextProject, previousProject }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const [lightboxImage, setLightboxImage] = useState<PortfolioImage | null>(null);
    const contentSection = useInView();
    const gallerySection = useInView();

    const heroImage = project.images.length > 0 ? project.images[0] : null;
    const galleryImages = project.images.length > 1 ? project.images.slice(1) : project.images;

    const sectionIcons: Record<string, JSX.Element> = {
        Context: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
        ),
        Challenge: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        Solution: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        Results: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
    };

    const sectionColors: Record<string, { bg: string; icon: string; border: string }> = {
        Context: { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-500', border: 'border-blue-100 dark:border-blue-500/20' },
        Challenge: { bg: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-500', border: 'border-amber-100 dark:border-amber-500/20' },
        Solution: { bg: 'bg-green-50 dark:bg-green-500/10', icon: 'text-green-500', border: 'border-green-100 dark:border-green-500/20' },
        Results: { bg: 'bg-purple-50 dark:bg-purple-500/10', icon: 'text-purple-500', border: 'border-purple-100 dark:border-purple-500/20' },
    };

    const contentSections = [
        { title: 'Context', content: project.context },
        { title: 'Challenge', content: project.challenge },
        { title: 'Solution', content: project.solution },
        { title: 'Results', content: project.results },
    ].filter(s => s.content);

    return (
        <PublicLayout title={project.title} description={project.excerpt} ogImage={project.images?.[0] ? `/storage/${project.images[0].image_path}` : undefined}>
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }

                @keyframes heroReveal {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes heroZoom {
                    from { transform: scale(1.15); }
                    to { transform: scale(1); }
                }
                @keyframes heroTitleReveal {
                    from { opacity: 0; transform: translateY(60px) scale(0.95); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes heroLineGrow {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                @keyframes heroMetaSlide {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes heroPulseDown {
                    0%, 100% { transform: translateY(0) translateX(-50%); opacity: 0.8; }
                    50% { transform: translateY(10px) translateX(-50%); opacity: 0.4; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up { animation: fadeInUp 0.7s ease-out forwards; opacity: 0; }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .slide-in-left { animation: slideInLeft 0.7s ease-out forwards; opacity: 0; }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .slide-in-right { animation: slideInRight 0.7s ease-out forwards; opacity: 0; }
                @keyframes galleryFadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .gallery-animate { animation: galleryFadeIn 0.6s ease-out forwards; opacity: 0; }
            `}</style>

            {/* Cinematic Fullscreen Hero */}
            <section className="relative overflow-hidden bg-black" style={{ minHeight: '100vh' }}>
                {/* Background image with zoom animation */}
                <div className="absolute inset-0" style={{ animation: 'heroZoom 6s ease-out forwards' }}>
                    {heroImage ? (
                        <img
                            src={`/storage/${heroImage.image_path}`}
                            alt={heroImage.alt_text || project.title}
                            className="w-full h-full object-cover"
                            style={{ animation: 'heroReveal 1.2s ease-out forwards', opacity: 0 }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                    )}
                </div>

                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                {/* Decorative corner accents */}
                <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-teal-400/30 opacity-0" style={{ animation: 'heroMetaSlide 0.6s ease-out 1.2s forwards' }} />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-teal-400/30 opacity-0" style={{ animation: 'heroMetaSlide 0.6s ease-out 1.4s forwards' }} />

                {/* Hero content — vertically centered */}
                <div className="relative z-10 flex flex-col justify-center h-full min-h-[100vh] max-w-7xl mx-auto px-6 md:px-12">
                    {/* Back link */}
                    <Link
                        href="/projects"
                        className="absolute top-8 left-6 md:left-12 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors bebas text-lg opacity-0"
                        style={{ letterSpacing: '2px', animation: 'heroMetaSlide 0.6s ease-out 0.4s forwards' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        {t('Back to Projects').toUpperCase()}
                    </Link>

                    {/* Client logo */}
                    {(project.client_logo || project.projet?.image) && (() => {
                        const logoSrc = project.client_logo || project.projet?.image || '';
                        const src = logoSrc.startsWith('http') ? logoSrc : `/storage/${logoSrc}`;
                        return (
                            <div className="mb-8 opacity-0" style={{ animation: 'heroMetaSlide 0.8s ease-out 0.6s forwards' }}>
                                <img src={src} alt={project.client_name} className="h-14 md:h-20 w-auto object-contain drop-shadow-2xl" />
                            </div>
                        );
                    })()}

                    {/* Category badge */}
                    {project.category && (
                        <span
                            className="inline-block px-5 py-2 bg-teal-400/10 border border-teal-400/30 text-teal-300 text-sm font-bold rounded-full bebas self-start mb-6 opacity-0"
                            style={{ letterSpacing: '2px', animation: 'heroMetaSlide 0.6s ease-out 0.8s forwards' }}
                        >
                            {project.category}
                        </span>
                    )}

                    {/* Title — cinematic reveal */}
                    <h1
                        className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-white bebas leading-[0.85] opacity-0"
                        style={{ letterSpacing: '4px', animation: 'heroTitleReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards' }}
                    >
                        {project.title}
                    </h1>

                    {/* Accent line */}
                    <div
                        className="h-[3px] w-32 md:w-48 bg-gradient-to-r from-teal-400 to-teal-300 mt-8 origin-left"
                        style={{ transform: 'scaleX(0)', animation: 'heroLineGrow 0.8s ease-out 1s forwards' }}
                    />

                    {/* Excerpt */}
                    <OriginalLanguageBadge light className="mt-6 opacity-0" style={{ animation: 'heroMetaSlide 0.6s ease-out 1.1s forwards' } as any} />
                    {project.excerpt && (
                        <p
                            className="mt-4 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed opacity-0"
                            style={{ animation: 'heroMetaSlide 0.8s ease-out 1.2s forwards' }}
                        >
                            {project.excerpt}
                        </p>
                    )}

                    {/* Tech stack pills */}
                    {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 opacity-0" style={{ animation: 'heroMetaSlide 0.8s ease-out 1.4s forwards' }}>
                            {project.tech_stack.map((tech, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Live URL button */}
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-teal-400 text-gray-900 font-bold rounded-full hover:bg-teal-300 hover:scale-105 transition-all duration-300 bebas text-lg self-start opacity-0"
                            style={{ letterSpacing: '2px', animation: 'heroMetaSlide 0.8s ease-out 1.6s forwards' }}
                        >
                            {t('Visit Website').toUpperCase()}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                        </a>
                    )}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 opacity-0" style={{ animation: 'heroPulseDown 2s ease-in-out 2s infinite, heroMetaSlide 0.6s ease-out 2s forwards' }}>
                    <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </section>

            {/* Video Section */}
            {project.show_video && project.video_url && (() => {
                const url = project.video_url;
                let embedId = '';
                const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
                if (match) embedId = match[1];
                if (!embedId) return null;
                return (
                    <section className="bg-gray-950 py-16 md:py-24">
                        <div className="max-w-5xl mx-auto px-4">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-white/5" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${embedId}?rel=0&modestbranding=1`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={project.title}
                                />
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* Two-column Layout */}
            <section className="bg-gray-100 dark:bg-gray-800 py-16 md:py-24 reveal" ref={contentSection.ref}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Left Column (2/3) */}
                        <div className={`lg:w-2/3 space-y-12 ${contentSection.isVisible ? 'slide-in-left' : 'opacity-0'}`}>
                            {/* Project meta */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-8">
                                {(project.client_logo || project.projet?.image) && (() => {
                                    const src = project.client_logo || project.projet?.image || '';
                                    const imgUrl = src.startsWith('http') ? src : `/storage/${src}`;
                                    return (
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 border border-gray-100 dark:border-gray-600 flex items-center justify-center">
                                            <img src={imgUrl} alt={project.client_name} loading="lazy" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    );
                                })()}
                                {project.client_name && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{t('Client')}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{project.client_name}</span>
                                    </div>
                                )}
                                {project.category && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{t('Category')}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{project.category}</span>
                                    </div>
                                )}
                                {project.duration_days && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{t('Duration')}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{project.duration_days} {t('days')}</span>
                                    </div>
                                )}
                                {project.projet?.type_site && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{t('Type')}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{formatProjectType(project.projet.type_site)}</span>
                                    </div>
                                )}
                                {project.projet?.lieu && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{t('Location')}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{project.projet.lieu}</span>
                                    </div>
                                )}
                            </div>

                            {/* Content sections — styled cards with icons */}
                            {contentSections.map((section, index) => {
                                const colors = sectionColors[section.title] || { bg: 'bg-gray-50', icon: 'text-gray-500', border: 'border-gray-100' };
                                const icon = sectionIcons[section.title] || null;
                                return (
                                    <div key={section.title} className={`fade-in-up rounded-2xl border ${colors.border} ${colors.bg} p-6 md:p-8`} style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                                                {icon}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bebas" style={{ letterSpacing: '1px' }}>
                                                {t(section.title)}
                                            </h2>
                                        </div>
                                        <div
                                            className="prose prose-gray dark:prose-invert max-w-none text-lg leading-relaxed pl-[52px] text-gray-600 dark:text-gray-300 prose-a:text-teal-500 prose-a:underline hover:prose-a:text-teal-400"
                                            dangerouslySetInnerHTML={{ __html: section.content || '' }}
                                        />
                                    </div>
                                );
                            })}

                            {/* Features grid */}
                            {project.features && project.features.length > 0 && (
                                <div className="fade-in-up" style={{ animationDelay: `${(contentSections.length + 1) * 150}ms` }}>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bebas mb-6" style={{ letterSpacing: '1px' }}>
                                        {t('Key Features')}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {project.features.map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-400/10 flex items-center justify-center mt-0.5">
                                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column (1/3) */}
                        <div className={`lg:w-1/3 space-y-8 ${contentSection.isVisible ? 'slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                            {/* Tech stack */}
                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white bebas mb-4" style={{ letterSpacing: '1px' }}>
                                        {t('Tech Stack')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white bebas mb-4" style={{ letterSpacing: '1px' }}>
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 text-sm font-medium bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-full border border-teal-100 dark:border-teal-500/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Visit Website button */}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full px-6 py-4 bg-teal-400 text-gray-900 font-bold text-center rounded-xl transition-all duration-300 hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-400/20 bebas text-xl"
                                    style={{ letterSpacing: '2px' }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {t('Visit Website').toUpperCase()}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </span>
                                </a>
                            )}

                            {/* Testimonial — prominent quote block */}
                            {project.testimonial_text && (
                                <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden reveal-scale">
                                    {/* Large quotation mark SVG */}
                                    <svg className="absolute top-4 left-4 w-20 h-20 text-teal-400/10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
                                    </svg>
                                    <div className="relative z-10">
                                        <p className="text-white/90 italic leading-relaxed text-xl mb-6 pt-10 font-light">
                                            "{project.testimonial_text}"
                                        </p>
                                        <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300 font-bold text-sm">
                                                {project.testimonial_author ? project.testimonial_author.split(' ').map(w => w[0]).join('') : '?'}
                                            </div>
                                            <div>
                                                {project.testimonial_author && (
                                                    <p className="font-bold text-white">{project.testimonial_author}</p>
                                                )}
                                                {project.testimonial_role && (
                                                    <p className="text-teal-400 text-sm">{project.testimonial_role}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
                <section className="bg-white dark:bg-gray-900 py-16 md:py-24" ref={gallerySection.ref}>
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className={`text-5xl md:text-6xl font-bold text-gray-900 dark:text-white bebas mb-12 text-center transition-all duration-700 ${gallerySection.isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ letterSpacing: '2px' }}>
                            {t('Gallery')}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-stagger">
                            {galleryImages.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setLightboxImage(image)}
                                    className={`group relative overflow-hidden rounded-xl aspect-video cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
                                        gallerySection.isVisible ? 'gallery-animate' : 'opacity-0'
                                    }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <img
                                        src={`/storage/${image.image_path}`}
                                        alt={image.alt_text || project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                        </svg>
                                    </div>
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white text-sm">{image.caption}</p>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA — Vous avez un projet similaire ? */}
            <section className="py-16 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center" aria-hidden="true">
                    <span className="text-[15vw] font-bold text-white bebas whitespace-nowrap">{t("LET'S TALK")}</span>
                </div>
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white bebas mb-4" style={{ letterSpacing: '2px' }}>
                        {t('You have a similar project?')}
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        {t("Let's discuss your project")}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-teal-400 text-gray-900 text-xl font-bold rounded-full transition-all duration-300 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] hover:scale-105 bebas"
                        style={{ letterSpacing: '2px' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        {t('Free Quote').toUpperCase()}
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <section className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 reveal">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Previous project */}
                        <div className="flex-1 text-left">
                            {previousProject ? (
                                <Link
                                    href={`/projects/${previousProject.slug}`}
                                    className="group inline-flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 bebas" style={{ letterSpacing: '2px' }}>{t('Previous Project')}</span>
                                        <span className="font-semibold">{previousProject.title}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>

                        {/* Back to projects */}
                        <Link
                            href="/projects"
                            className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold rounded-full hover:border-teal-400 hover:text-teal-500 transition-all duration-300 bebas text-lg"
                            style={{ letterSpacing: '2px' }}
                        >
                            {t('All Projects').toUpperCase()}
                        </Link>

                        {/* Next project */}
                        <div className="flex-1 text-right">
                            {nextProject ? (
                                <Link
                                    href={`/projects/${nextProject.slug}`}
                                    className="group inline-flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors justify-end"
                                >
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 bebas" style={{ letterSpacing: '2px' }}>{t('Next Project')}</span>
                                        <span className="font-semibold">{nextProject.title}</span>
                                    </div>
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImage && (
                <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </PublicLayout>
    );
}
