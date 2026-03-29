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
            {/* Hero */}
            <section className="relative bg-gray-950 overflow-hidden">
                <div className="absolute inset-0">
                    {product.cover_image_path ? (
                        <>
                            <img src={`/storage/${product.cover_image_path}`} alt="" className="w-full h-full object-cover opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950" />
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-gray-950 to-purple-950" />
                            <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        </>
                    )}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/products" className="hover:text-violet-400 transition-colors">{t('Products')}</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        <span className="text-gray-400">{product.name}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {product.logo_path && (
                            <img src={`/storage/${product.logo_path}`} alt={product.name} className="w-20 h-20 rounded-2xl object-contain border border-white/10 bg-white/5 backdrop-blur-sm p-2" />
                        )}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                                    {product.name}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                                    {product.status === 'in_development' && (
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5" />
                                    )}
                                    {t(status.label)}
                                </span>
                            </div>
                            {product.tagline && (
                                <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">{product.tagline}</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="bg-gray-50 dark:bg-gray-950 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column (2/3) */}
                        <div className="lg:w-2/3 space-y-8">
                            {/* Description */}
                            {product.description && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('Description')}</h2>
                                    <div
                                        className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed
                                            prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
                                            prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2
                                            prose-p:text-gray-600 dark:prose-p:text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            )}

                            {/* Features Grid */}
                            {features.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('All features')}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                                <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {techStack.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('Tech Stack')}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {techStack.map((tech, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column (1/3) - Sticky Pricing Card */}
                        <div className="lg:w-1/3">
                            <div className="lg:sticky lg:top-24 space-y-6">
                                {/* Pricing Card */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-center">
                                        <h3 className="text-lg font-bold text-white mb-1">{t('Pricing')}</h3>
                                        {product.pricing_custom ? (
                                            <p className="text-violet-200 text-sm">{t('Contact us for pricing')}</p>
                                        ) : isLaunched && pricingMonthly ? (
                                            <div>
                                                <span className="text-4xl font-bold text-white">{formatCurrency(pricingMonthly)}</span>
                                                <span className="text-violet-200 ml-1">/{t('per month').replace('par ', '')}</span>
                                            </div>
                                        ) : pricingMonthly ? (
                                            <div>
                                                <p className="text-amber-300 text-xs font-medium mb-1">{t('Coming Soon')}</p>
                                                <span className="text-3xl font-bold text-white">{formatCurrency(pricingMonthly)}</span>
                                                <span className="text-violet-200 ml-1">/{t('per month').replace('par ', '')}</span>
                                            </div>
                                        ) : (
                                            <p className="text-violet-200">{t('Coming Soon')}</p>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {/* Yearly pricing */}
                                        {!product.pricing_custom && pricingYearly && (
                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('Yearly')}</p>
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(pricingYearly)}</p>
                                                </div>
                                                {yearlySavings > 0 && (
                                                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                                                        {t('Save')} {yearlySavings}%
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* CTA Buttons */}
                                        {isLaunched ? (
                                            <div className="space-y-3">
                                                {product.live_url ? (
                                                    <a href={product.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors">
                                                        {t('Get Started')}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                    </a>
                                                ) : (
                                                    <a href="/contact#quote" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors">
                                                        {t('Get Started')}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                    </a>
                                                )}
                                                {product.demo_url && (
                                                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                        {t('Try Demo')}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        ) : product.pricing_custom ? (
                                            <a href="/contact#quote" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors">
                                                {t('Contact us for pricing')}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                            </a>
                                        ) : (
                                            <div className="space-y-3">
                                                <a href="/contact#quote" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-xl transition-colors">
                                                    {t('Get Notified')}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                                </a>
                                                {product.demo_url && (
                                                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                        {t('Try Demo')}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Target Audience Card */}
                                {product.target_audience && (
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('Target Audience')}</h3>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.target_audience}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Status Card */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('Status')}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('Status')}</span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                                                {t(status.label)}
                                            </span>
                                        </div>
                                        {product.launched_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('Launch date')}</span>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{new Date(product.launched_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {product.live_url && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">URL</span>
                                                <a href={product.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                                                    {t('Visit Platform')}
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Back link */}
                                <Link href="/products" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                                    {t('Back to products')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
