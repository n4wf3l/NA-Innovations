import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { useConfirm } from '@/hooks/useConfirm';

interface Product {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    logo_path: string | null;
    cover_image_path: string | null;
    status: string;
    pricing_monthly: string | null;
    pricing_yearly: string | null;
    pricing_custom: boolean;
    is_published: boolean;
    is_featured: boolean;
    target_audience: string | null;
    features: string[] | null;
    tech_stack: string[] | null;
    sort_order: number;
    project?: { id: number; nom_societe: string } | null;
}

interface Props {
    products: Product[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    in_development: { label: 'In Development', bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
    beta: { label: 'Beta', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-400' },
    launched: { label: 'Launched', bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
};

export default function ProductsIndex({ products }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        router.patch(`/admin/products/${id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this product?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/products/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('Products')} header={t('Products')}>
            <Head title={t('Products')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Products')}</h1>
                        <p className="text-purple-100 text-sm">{t('Manage your SaaS products and their public showcase.')}</p>
                        <p className="text-white/80 text-xs mt-2">
                            {products.filter(p => p.is_published).length} {t('Published').toLowerCase()} / {products.length} {t('au total')}
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Add Product')}
                    </Link>
                </div>
            </div>

            {/* Mobile add button */}
            <div className="sm:hidden mb-4">
                <Link href="/admin/products/create" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {t('Add Product')}
                </Link>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <svg className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No products yet.')}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Add your first SaaS product to showcase.')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => {
                        const status = statusConfig[product.status] || statusConfig.in_development;

                        return (
                            <div key={product.id} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group transition-all hover:shadow-lg ${!product.is_published ? 'opacity-60' : ''}`}>
                                {/* Cover / Logo */}
                                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    {product.cover_image_path ? (
                                        <img src={`/storage/${product.cover_image_path}`} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                                            {product.logo_path ? (
                                                <img src={`/storage/${product.logo_path}`} alt={product.name} className="max-h-16 max-w-32 object-contain" />
                                            ) : (
                                                <span className="text-3xl font-black text-violet-200 dark:text-violet-700">{product.name.substring(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                        {t(status.label)}
                                    </div>

                                    {product.is_featured && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                            {t('Featured')}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                                    {product.tagline && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.tagline}</p>
                                    )}

                                    {/* Pricing */}
                                    <div className="mb-3">
                                        {product.pricing_custom ? (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">{t('Custom pricing')}</span>
                                        ) : product.pricing_monthly ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-violet-600 dark:text-violet-400">{formatCurrency(Number(product.pricing_monthly))}</span>
                                                <span className="text-xs text-gray-400">/{t('per month').replace('par ', '')}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">--</span>
                                        )}
                                    </div>

                                    {/* Tech stack */}
                                    {product.tech_stack && product.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {product.tech_stack.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                    {tech}
                                                </span>
                                            ))}
                                            {product.tech_stack.length > 4 && (
                                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">
                                                    +{product.tech_stack.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        {/* Published toggle */}
                                        <button
                                            onClick={() => handleToggle(product.id)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.is_published ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.is_published ? 'translate-x-4' : 'translate-x-1'}`} />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                                                title={t('Edit Product')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                title={t('Delete Product')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <ConfirmDialog />
        </AdminLayout>
    );
}
