import { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import AdminEditButton from '@/Components/landing/AdminEditButton';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Product {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    features: string[] | null;
    tech_stack: string[] | null;
    pricing_monthly: string | null;
    pricing_yearly: string | null;
    pricing_custom: boolean;
    status: string;
    live_url: string | null;
    demo_url: string | null;
    logo_path: string | null;
    cover_image_path: string | null;
    target_audience: string | null;
    is_featured: boolean;
    launched_at: string | null;
}

interface Props {
    products: Product[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    in_development: { label: 'In Development', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    beta: { label: 'Beta', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    launched: { label: 'Launched', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export default function SaaS({ products }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const [filter, setFilter] = useState<'all' | 'launched' | 'upcoming'>('all');
    const [view, setView] = useState<'immersive' | 'grid'>('immersive');

    const filtered = products.filter(p => {
        if (filter === 'launched') return p.status === 'launched';
        if (filter === 'upcoming') return p.status !== 'launched';
        return true;
    });

    const countLaunched = products.filter(p => p.status === 'launched').length;
    const countUpcoming = products.filter(p => p.status !== 'launched').length;

    return (
        <PublicLayout title={t('Products')}>
            <style>{`
                @keyframes heroFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes heroScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .hero-anim { opacity: 0; animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .hero-d1 { animation-delay: 0.1s; }
                .hero-d2 { animation-delay: 0.25s; }
                .hero-d3 { animation-delay: 0.4s; }
                .card-anim { opacity: 0; animation: heroScale 0.6s ease-out forwards; }
            `}</style>

            {/* Hero */}
            <section className="relative bg-gray-950 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-gray-950 to-gray-950" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs font-medium mb-6 hero-anim hero-d1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        SaaS
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 hero-anim hero-d2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                        {t('Our Products')}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto hero-anim hero-d3">
                        {t('SaaS solutions we build and maintain. Ready to deploy.')}
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-gray-50 dark:bg-gray-950 py-16 sm:py-24 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Filter tabs + View toggle */}
                    {products.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 hero-anim" style={{ animationDelay: '0.5s' }}>
                            <div className="inline-flex bg-white dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800 shadow-sm max-w-full overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                                {([
                                    { key: 'all' as const, label: t('Tous'), count: products.length },
                                    { key: 'launched' as const, label: t('Opérationnels'), count: countLaunched },
                                    { key: 'upcoming' as const, label: t('En construction'), count: countUpcoming },
                                ]).map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(tab.key)}
                                        className={`px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                                            filter === tab.key
                                                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                        <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                                            filter === tab.key
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                                        }`}>{tab.count}</span>
                                    </button>
                                ))}
                            </div>

                            {/* View toggle */}
                            <div className="inline-flex bg-white dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800 shadow-sm">
                                <button onClick={() => setView('immersive')} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${view === 'immersive' ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`} title={t('Vue immersive')}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                                </button>
                                <button onClick={() => setView('grid')} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${view === 'grid' ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`} title={t('Vue grille')}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {filtered.length === 0 ? (
                        <div className="text-center py-20 reveal">
                            <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">{t('No products available yet.')}</p>
                        </div>
                    ) : view === 'immersive' ? (
                        <div className="space-y-8">
                            {filtered.map((product, idx) => {
                                const status = statusConfig[product.status] || statusConfig.in_development;
                                const isLaunched = product.status === 'launched';
                                const features = Array.isArray(product.features) ? product.features : (typeof product.features === 'string' ? JSON.parse(product.features) : []);
                                const pricingMonthly = product.pricing_monthly ? Number(product.pricing_monthly) : null;

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group relative block rounded-3xl overflow-hidden card-anim"
                                        style={{ animationDelay: `${0.1 + idx * 0.2}s`, minHeight: '380px' }}
                                    >
                                        <AdminEditButton href={`/admin/products/${product.id}/edit`} />

                                        {/* Full background */}
                                        <div className="absolute inset-0">
                                            {product.cover_image_path ? (
                                                <img src={`/storage/${product.cover_image_path}`} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        </div>

                                        {/* Content overlay */}
                                        <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[380px]">
                                            {/* Left: Info */}
                                            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 max-w-2xl">
                                                {/* Status + Featured */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${status.bg} ${status.text} ${status.border}`}>
                                                        {product.status === 'in_development' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5" />}
                                                        {t(status.label)}
                                                    </span>
                                                    {product.is_featured && (
                                                        <span className="px-2.5 py-1 bg-amber-400/90 text-amber-900 text-[10px] font-bold rounded-full">{t('Featured')}</span>
                                                    )}
                                                </div>

                                                {/* Logo + Name */}
                                                <div className="flex items-center gap-4 mb-2">
                                                    {product.logo_path && (
                                                        <img src={`/storage/${product.logo_path}`} alt="" className="w-14 h-14 rounded-2xl object-contain bg-white/10 backdrop-blur-sm border border-white/10 p-1.5 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                                            {product.name}
                                                        </h2>
                                                        <p className="text-xs italic text-white/30 tracking-wide mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
                                                            by <span className="font-semibold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">NA Innovations</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tagline */}
                                                {product.tagline && (
                                                    <p className="text-white/60 text-base md:text-lg leading-relaxed mt-3 max-w-lg">{product.tagline}</p>
                                                )}

                                                {/* Features pills */}
                                                {features.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-6">
                                                        {features.slice(0, 4).map((feature, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs font-medium rounded-full backdrop-blur-sm">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {features.length > 4 && (
                                                            <span className="px-3 py-1.5 text-violet-300 text-xs font-semibold">+{features.length - 4}</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Bottom row: Price + CTA */}
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8">
                                                    {isLaunched ? (
                                                        <span className="inline-flex items-center gap-2 px-7 py-3 bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/30 group-hover:scale-105" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                                            {t('Discover').toUpperCase()}
                                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-7 py-3 border border-white/20 text-white text-sm font-bold rounded-full transition-all duration-300 group-hover:border-violet-400/50 group-hover:text-violet-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                                            {t('Learn More').toUpperCase()}
                                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                        </span>
                                                    )}
                                                    {pricingMonthly && (
                                                        <div className="text-white/40">
                                                            <span className="text-xs uppercase tracking-wider">{isLaunched ? t('From') : t('Starting from')}</span>
                                                            <div>
                                                                <span className="text-2xl font-bold text-white">{formatCurrency(pricingMonthly)}</span>
                                                                <span className="text-sm text-white/40 ml-1">/{t('mo')}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {product.pricing_custom && (
                                                        <span className="text-sm text-white/40 italic">{t('Custom pricing')}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Target audience tag */}
                                            {product.target_audience && (
                                                <div className="hidden md:flex items-end p-8">
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{t('Target')}</p>
                                                        <p className="text-sm text-white/50 font-medium">{product.target_audience}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        /* Grid view */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((product, idx) => {
                                const status = statusConfig[product.status] || statusConfig.in_development;
                                const isLaunched = product.status === 'launched';
                                const pricingMonthly = product.pricing_monthly ? Number(product.pricing_monthly) : null;

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group relative rounded-2xl overflow-hidden card-anim border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                                    >
                                        {/* Cover */}
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            {product.cover_image_path ? (
                                                <img src={`/storage/${product.cover_image_path}`} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Logo centered */}
                                            {product.logo_path && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <img src={`/storage/${product.logo_path}`} alt="" className="max-h-12 max-w-28 object-contain drop-shadow-2xl brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                                                </div>
                                            )}

                                            {/* Status */}
                                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${status.bg} ${status.text} ${status.border}`}>
                                                {product.status === 'in_development' && <span className="inline-block w-1 h-1 rounded-full bg-amber-400 animate-pulse mr-1" />}
                                                {t(status.label)}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                {product.name}
                                            </h2>
                                            <p className="text-[10px] italic text-violet-400/60 mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
                                                by <span className="font-semibold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">NA Innovations</span>
                                            </p>
                                            {product.tagline && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{product.tagline}</p>
                                            )}

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                {pricingMonthly ? (
                                                    <div>
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(pricingMonthly)}</span>
                                                        <span className="text-xs text-gray-400 ml-1">/{t('mo')}</span>
                                                    </div>
                                                ) : product.pricing_custom ? (
                                                    <span className="text-xs text-gray-400 italic">{t('Custom')}</span>
                                                ) : (
                                                    <span className="text-xs text-amber-500 font-medium">{t('Coming Soon')}</span>
                                                )}
                                                <span className="text-xs font-bold text-violet-500 group-hover:text-violet-400 flex items-center gap-1 transition-colors">
                                                    {t('Details')}
                                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
