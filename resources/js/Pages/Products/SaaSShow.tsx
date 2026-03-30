import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

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
    product: Product;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    in_development: { label: 'In Development', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    beta: { label: 'Beta', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    launched: { label: 'Launched', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export default function SaaSShow({ product }: Props) {
    const { t } = useTranslation();
    const status = statusConfig[product.status] || statusConfig.in_development;
    const isLaunched = product.status === 'launched';
    const features = product.features || [];
    const techStack = product.tech_stack || [];
    const pricingMonthly = product.pricing_monthly ? Number(product.pricing_monthly) : null;
    const pricingYearly = product.pricing_yearly ? Number(product.pricing_yearly) : null;

    const yearlySavings = pricingMonthly && pricingYearly
        ? Math.round((1 - pricingYearly / (pricingMonthly * 12)) * 100)
        : 0;

    return (
        <PublicLayout title={product.name}>
            <style>{`
                @keyframes prodReveal { from { opacity: 0; } to { opacity: 1; } }
                @keyframes prodZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
                @keyframes prodTitle { from { opacity: 0; transform: translateY(50px) scale(0.95); filter: blur(8px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
                @keyframes prodLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes prodMeta { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {/* Cinematic Hero */}
            <section className="relative bg-black overflow-hidden" style={{ minHeight: '100vh' }}>
                <div className="absolute inset-0" style={{ animation: 'prodZoom 6s ease-out forwards' }}>
                    {product.cover_image_path ? (
                        <>
                            <img src={`/storage/${product.cover_image_path}`} alt="" className="w-full h-full object-cover" style={{ animation: 'prodReveal 1.2s ease-out forwards', opacity: 0 }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-gray-950 to-purple-950" />
                            <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        </>
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                {/* Corner accents */}
                <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-violet-400/30 opacity-0" style={{ animation: 'prodMeta 0.6s ease-out 1.2s forwards' }} />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-violet-400/30 opacity-0" style={{ animation: 'prodMeta 0.6s ease-out 1.4s forwards' }} />

                <div className="relative z-10 flex flex-col justify-center h-full min-h-[100vh] max-w-7xl mx-auto px-6 md:px-12">
                    {/* Breadcrumb */}
                    <Link href="/products" className="absolute top-8 left-6 md:left-12 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-lg opacity-0" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px', animation: 'prodMeta 0.6s ease-out 0.4s forwards' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        {t('Products').toUpperCase()}
                    </Link>

                    {/* Logo */}
                    {product.logo_path && (
                        <div className="mb-8 opacity-0" style={{ animation: 'prodMeta 0.8s ease-out 0.6s forwards' }}>
                            <img src={`/storage/${product.logo_path}`} alt={product.name} className="h-16 md:h-20 w-auto object-contain brightness-0 invert opacity-80" />
                        </div>
                    )}

                    {/* Status badge */}
                    <span className={`inline-block px-5 py-2 rounded-full text-sm font-semibold border self-start mb-6 opacity-0 ${status.bg} ${status.text} ${status.border}`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px', animation: 'prodMeta 0.6s ease-out 0.8s forwards' }}>
                        {product.status === 'in_development' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5" />}
                        {t(status.label)}
                    </span>

                    {/* Title */}
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-white leading-[0.85] opacity-0" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '4px', animation: 'prodTitle 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards' }}>
                        {product.name}
                    </h1>

                    {/* by NA Innovations */}
                    <p className="mt-3 opacity-0 self-start ml-1" style={{ animation: 'prodMeta 0.6s ease-out 0.9s forwards', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        <span className="text-sm md:text-base italic text-white/30 tracking-wide">by </span>
                        <span className="text-sm md:text-base italic font-semibold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent tracking-wide">NA Innovations</span>
                    </p>

                    {/* Accent line */}
                    <div className="h-[3px] w-32 md:w-48 bg-gradient-to-r from-violet-400 to-purple-400 mt-6 origin-left" style={{ transform: 'scaleX(0)', animation: 'prodLine 0.8s ease-out 1s forwards' }} />

                    {/* Tagline */}
                    {product.tagline && (
                        <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed opacity-0" style={{ animation: 'prodMeta 0.8s ease-out 1.2s forwards' }}>
                            {product.tagline}
                        </p>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-4 mt-10 opacity-0" style={{ animation: 'prodMeta 0.8s ease-out 1.4s forwards' }}>
                        {isLaunched && product.live_url && (
                            <a href={product.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 text-white font-bold rounded-full hover:bg-violet-400 hover:scale-105 transition-all duration-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                {t('Launch App').toUpperCase()}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </a>
                        )}
                        {product.demo_url && (
                            <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:border-violet-400/50 hover:text-violet-300 transition-all duration-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                {t('Demo').toUpperCase()}
                            </a>
                        )}
                    </div>

                    {/* Tech stack */}
                    {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 opacity-0" style={{ animation: 'prodMeta 0.8s ease-out 1.6s forwards' }}>
                            {techStack.map((tech, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-full">{tech}</span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Description — full-width cinematic section */}
            {product.description && (
                <section className="bg-gray-950 py-20 sm:py-28 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500 rounded-full blur-[200px]" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[150px]" />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}>
                            {t('What is')} {product.name}?
                        </h2>
                        <div className="h-[3px] w-24 bg-gradient-to-r from-violet-400 to-purple-400 mx-auto mb-10" />
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
                            {product.description}
                        </p>
                    </div>
                </section>
            )}

            {/* Features — alternating layout */}
            {features.length > 0 && (
                <section className="bg-black py-20 sm:py-28">
                    <div className="max-w-6xl mx-auto px-6 md:px-12">
                        <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}>
                            {t('Everything you need')}
                        </h2>
                        <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">{t('Powerful features built for professionals')}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, i) => (
                                <div key={i} className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-500">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-300">
                                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <p className="text-white font-semibold text-sm">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing — full-width centered */}
            <section className="bg-gray-950 py-20 sm:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
                <div className="relative max-w-5xl mx-auto px-6 md:px-12">
                    <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}>
                        {t('Pricing')}
                    </h2>
                    <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
                        {isLaunched ? t('Choose the plan that fits your business') : t('Pricing available at launch')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* Monthly */}
                        {pricingMonthly && (
                            <div className="relative rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center hover:border-violet-500/50 transition-all duration-300 group">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('Monthly')}</p>
                                <div className="flex items-end justify-center gap-1 mb-6">
                                    <span className="text-5xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(pricingMonthly)}</span>
                                    <span className="text-gray-500 mb-1.5">/{t('mo')}</span>
                                </div>
                                {!isLaunched && <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full mb-4">{t('Coming Soon')}</span>}
                                <a href={isLaunched && product.live_url ? product.live_url : '/contact#quote'} className="block w-full py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-violet-500 hover:border-violet-500 transition-all duration-300">
                                    {isLaunched ? t('Get Started') : t('Notify Me')}
                                </a>
                            </div>
                        )}

                        {/* Yearly */}
                        {pricingYearly && (
                            <div className="relative rounded-2xl border-2 border-violet-500 bg-gradient-to-b from-violet-900/30 to-gray-900/80 p-8 text-center group">
                                {yearlySavings > 0 && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-500/30">
                                        {t('Save')} {yearlySavings}%
                                    </span>
                                )}
                                <p className="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-2">{t('Yearly')}</p>
                                <div className="flex items-end justify-center gap-1 mb-6">
                                    <span className="text-5xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{formatCurrency(pricingYearly)}</span>
                                    <span className="text-gray-400 mb-1.5">/{t('yr')}</span>
                                </div>
                                {pricingMonthly && <p className="text-xs text-gray-500 mb-4">{formatCurrency(pricingYearly / 12)}/{t('mo')} {t('billed annually')}</p>}
                                <a href={isLaunched && product.live_url ? product.live_url : '/contact#quote'} className="block w-full py-3.5 bg-violet-500 text-white font-semibold rounded-xl hover:bg-violet-400 transition-all duration-300 shadow-lg shadow-violet-500/20">
                                    {isLaunched ? t('Get Started') : t('Notify Me')}
                                </a>
                            </div>
                        )}

                        {/* Custom pricing only */}
                        {product.pricing_custom && !pricingMonthly && !pricingYearly && (
                            <div className="md:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/80 p-12 text-center">
                                <p className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>{t('Custom Pricing')}</p>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('Contact us for a tailored quote based on your needs')}</p>
                                <a href="/contact#quote" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 text-white font-bold rounded-full hover:bg-violet-400 transition-all">
                                    {t('Contact Us')}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Tech + Audience + Status */}
            <section className="bg-black py-16">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Tech Stack */}
                        {techStack.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('Tech Stack')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs font-medium rounded-lg">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Target Audience */}
                        {product.target_audience && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('Target Audience')}</h3>
                                <p className="text-white/70 text-sm">{product.target_audience}</p>
                            </div>
                        )}

                        {/* Status */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('Status')}</h3>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                                {product.status === 'in_development' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                                {t(status.label)}
                            </span>
                        </div>
                    </div>

                    {/* Back link */}
                    <div className="mt-16 pt-8 border-t border-gray-800">
                        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-400 transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                            {t('Back to Products').toUpperCase()}
                        </Link>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
