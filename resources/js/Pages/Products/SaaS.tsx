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
    products: Product[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    in_development: { label: 'In Development', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    beta: { label: 'Beta', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    launched: { label: 'Launched', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export default function SaaS({ products }: Props) {
    const { t } = useTranslation();

    return (
        <PublicLayout title={t('Products')}>
            {/* Hero */}
            <section className="relative bg-gray-950 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-gray-950 to-gray-950" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs font-medium mb-6">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        SaaS
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                        {t('Our Products')}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('SaaS solutions we build and maintain. Ready to deploy.')}
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-gray-50 dark:bg-gray-950 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">{t('No products available yet.')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {products.map((product) => {
                                const status = statusConfig[product.status] || statusConfig.in_development;
                                const isLaunched = product.status === 'launched';
                                const features = product.features || [];
                                const pricingMonthly = product.pricing_monthly ? Number(product.pricing_monthly) : null;

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-800 hover:-translate-y-1 duration-300"
                                    >
                                        {/* Cover */}
                                        <div className="relative aspect-[21/9] overflow-hidden">
                                            {product.cover_image_path ? (
                                                <img src={`/storage/${product.cover_image_path}`} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
                                                    {product.logo_path ? (
                                                        <img src={`/storage/${product.logo_path}`} alt={product.name} className="relative max-h-16 max-w-40 object-contain drop-shadow-lg" />
                                                    ) : (
                                                        <span className="relative text-4xl font-black text-white/20">{product.name}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Status badge */}
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${status.bg} ${status.text} ${status.border}`}>
                                                {product.status === 'in_development' && (
                                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5" />
                                                )}
                                                {t(status.label)}
                                            </div>

                                            {product.is_featured && (
                                                <div className="absolute top-4 right-4 px-2.5 py-1 bg-amber-400/90 text-amber-900 text-[10px] font-bold rounded-full backdrop-blur-sm">
                                                    {t('Featured')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start gap-4 mb-4">
                                                {product.logo_path && (
                                                    <img src={`/storage/${product.logo_path}`} alt="" className="w-12 h-12 rounded-xl object-contain border border-gray-100 dark:border-gray-800 flex-shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                        {product.name}
                                                    </h2>
                                                    {product.tagline && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{product.tagline}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features (first 5) */}
                                            {features.length > 0 && (
                                                <div className="mb-4 space-y-1.5">
                                                    {features.slice(0, 5).map((feature, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                            <span className="truncate">{feature}</span>
                                                        </div>
                                                    ))}
                                                    {features.length > 5 && (
                                                        <p className="text-xs text-violet-500 font-medium pl-6">+{features.length - 5} {t('more')}...</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Pricing + CTA */}
                                            <div className="flex items-end justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div>
                                                    {product.pricing_custom ? (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t('Contact us for pricing')}</p>
                                                    ) : pricingMonthly ? (
                                                        <div>
                                                            {isLaunched ? (
                                                                <>
                                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(pricingMonthly)}</span>
                                                                    <span className="text-sm text-gray-400 ml-1">/{t('per month').replace('par ', '')}</span>
                                                                </>
                                                            ) : (
                                                                <div>
                                                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{t('Starting from')}</span>
                                                                    <div>
                                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(pricingMonthly)}</span>
                                                                        <span className="text-sm text-gray-400 ml-1">/{t('per month').replace('par ', '')}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-400">{t('Coming Soon')}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    {isLaunched ? (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl group-hover:bg-violet-700 transition-colors">
                                                            {t('Get Started')}
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-xl group-hover:bg-gray-800 dark:group-hover:bg-gray-600 transition-colors">
                                                            {t('Notify Me')}
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Target audience */}
                                            {product.target_audience && (
                                                <div className="mt-3 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-400 truncate">{product.target_audience}</span>
                                                </div>
                                            )}
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
