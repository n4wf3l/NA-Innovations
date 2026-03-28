import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';

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
    is_featured: boolean;
    duration_days: number | null;
    testimonial_text: string | null;
    testimonial_author: string | null;
    testimonial_role: string | null;
    images: PortfolioImage[];
    projet?: { nom_societe: string; type_site: string; lieu: string };
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
    const [lightboxImage, setLightboxImage] = useState<PortfolioImage | null>(null);
    const contentSection = useInView();
    const gallerySection = useInView();

    const heroImage = project.images.length > 0 ? project.images[0] : null;
    const galleryImages = project.images.length > 1 ? project.images.slice(1) : project.images;

    const contentSections = [
        { title: 'Context', content: project.context },
        { title: 'Challenge', content: project.challenge },
        { title: 'Solution', content: project.solution },
        { title: 'Results', content: project.results },
    ].filter(s => s.content);

    return (
        <PublicLayout title={project.title}>
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

                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .slide-in-left {
                    animation: slideInLeft 0.7s ease-out forwards;
                    opacity: 0;
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .slide-in-right {
                    animation: slideInRight 0.7s ease-out forwards;
                    opacity: 0;
                }

                @keyframes galleryFadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .gallery-animate {
                    animation: galleryFadeIn 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>

            {/* Full-width Hero Image */}
            <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
                {heroImage ? (
                    <img
                        src={`/storage/${heroImage.image_path}`}
                        alt={heroImage.alt_text || project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                {/* Hero content */}
                <div className="relative z-10 flex flex-col justify-end h-full min-h-[60vh] max-w-7xl mx-auto px-4 pb-12 md:pb-20">
                    {/* Back link */}
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 self-start bebas text-lg"
                        style={{ letterSpacing: '2px' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        {t('Back to Projects').toUpperCase()}
                    </Link>

                    {project.category && (
                        <span className="inline-block px-4 py-1.5 bg-teal-400 text-gray-900 text-sm font-bold rounded-full bebas mb-4 self-start" style={{ letterSpacing: '1px' }}>
                            {project.category}
                        </span>
                    )}

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white bebas fade-in-up" style={{ letterSpacing: '3px' }}>
                        {project.title}
                    </h1>

                    <OriginalLanguageBadge light className="mt-4" />
                    {project.excerpt && (
                        <p className="mt-4 text-lg md:text-xl text-white/70 max-w-3xl fade-in-up" style={{ animationDelay: '200ms' }}>
                            {project.excerpt}
                        </p>
                    )}
                </div>
            </section>

            {/* Two-column Layout */}
            <section className="bg-gray-100 py-16 md:py-24" ref={contentSection.ref}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Left Column (2/3) */}
                        <div className={`lg:w-2/3 space-y-12 ${contentSection.isVisible ? 'slide-in-left' : 'opacity-0'}`}>
                            {/* Project meta */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-8">
                                {project.client_logo && (
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                                        <img src={`/storage/${project.client_logo}`} alt={project.client_name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                                {project.client_name && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Client</span>
                                        <span className="text-gray-900 font-semibold">{project.client_name}</span>
                                    </div>
                                )}
                                {project.category && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Category</span>
                                        <span className="text-gray-900 font-semibold">{project.category}</span>
                                    </div>
                                )}
                                {project.duration_days && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">{t('Duration')}</span>
                                        <span className="text-gray-900 font-semibold">{project.duration_days} {t('days')}</span>
                                    </div>
                                )}
                                {project.projet?.type_site && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Type</span>
                                        <span className="text-gray-900 font-semibold">{project.projet.type_site}</span>
                                    </div>
                                )}
                                {project.projet?.lieu && (
                                    <div>
                                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Location</span>
                                        <span className="text-gray-900 font-semibold">{project.projet.lieu}</span>
                                    </div>
                                )}
                            </div>

                            {/* Content sections */}
                            {contentSections.map((section, index) => (
                                <div key={section.title} className="fade-in-up" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bebas mb-4" style={{ letterSpacing: '1px' }}>
                                        {section.title}
                                    </h2>
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                        {section.content}
                                    </div>
                                </div>
                            ))}

                            {/* Features grid */}
                            {project.features && project.features.length > 0 && (
                                <div className="fade-in-up" style={{ animationDelay: `${(contentSections.length + 1) * 150}ms` }}>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bebas mb-6" style={{ letterSpacing: '1px' }}>
                                        {t('Key Features')}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {project.features.map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-400/10 flex items-center justify-center mt-0.5">
                                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700">{feature}</span>
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
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="text-xl font-bold text-gray-900 bebas mb-4" style={{ letterSpacing: '1px' }}>
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
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="text-xl font-bold text-gray-900 bebas mb-4" style={{ letterSpacing: '1px' }}>
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-700 rounded-full border border-teal-100"
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

                            {/* Testimonial */}
                            {project.testimonial_text && (
                                <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-4 left-4 text-teal-400/20 text-8xl font-serif leading-none select-none pointer-events-none">"</div>
                                    <div className="relative z-10">
                                        <p className="text-white/80 italic leading-relaxed text-lg mb-6 pt-8">
                                            {project.testimonial_text}
                                        </p>
                                        <div className="border-t border-white/10 pt-4">
                                            {project.testimonial_author && (
                                                <p className="font-bold text-white">{project.testimonial_author}</p>
                                            )}
                                            {project.testimonial_role && (
                                                <p className="text-teal-400 text-sm">{project.testimonial_role}</p>
                                            )}
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
                <section className="bg-white py-16 md:py-24" ref={gallerySection.ref}>
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className={`text-5xl md:text-6xl font-bold text-gray-900 bebas mb-12 text-center transition-all duration-700 ${gallerySection.isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ letterSpacing: '2px' }}>
                            {t('Gallery')}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

            {/* Navigation */}
            <section className="bg-gray-100 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Previous project */}
                        <div className="flex-1 text-left">
                            {previousProject ? (
                                <Link
                                    href={`/projects/${previousProject.slug}`}
                                    className="group inline-flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors"
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
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-600 font-bold rounded-full hover:border-teal-400 hover:text-teal-500 transition-all duration-300 bebas text-lg"
                            style={{ letterSpacing: '2px' }}
                        >
                            {t('All Projects').toUpperCase()}
                        </Link>

                        {/* Next project */}
                        <div className="flex-1 text-right">
                            {nextProject ? (
                                <Link
                                    href={`/projects/${nextProject.slug}`}
                                    className="group inline-flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors justify-end"
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
