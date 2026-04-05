import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent, useRef } from 'react';
import SearchableSelect from '@/Components/ui/SearchableSelect';

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
    video_url: string | null;
    show_video: boolean;
    logo_path: string | null;
    cover_image_path: string | null;
    target_audience: string | null;
    project_id: number | null;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    launched_at: string | null;
}

interface Props {
    product: Product;
    projects: { id: number; nom_societe: string }[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-400 placeholder-gray-400 dark:placeholder-gray-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = input.trim();
            if (trimmed && !value.includes(trimmed)) {
                onChange([...value, trimmed]);
            }
            setInput('');
        }
    };

    const remove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                        {tag}
                        <button type="button" onClick={() => remove(i)} className="text-violet-400 hover:text-violet-600 dark:hover:text-violet-200">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );
}

export default function ProductEdit({ product, projects }: Props) {
    const { t } = useTranslation();
    const logoInput = useRef<HTMLInputElement>(null);
    const coverInput = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        tagline: product.tagline || '',
        description: product.description || '',
        features: product.features || [],
        tech_stack: product.tech_stack || [],
        pricing_monthly: product.pricing_monthly || '',
        pricing_yearly: product.pricing_yearly || '',
        pricing_custom: product.pricing_custom,
        status: product.status,
        live_url: product.live_url || '',
        demo_url: product.demo_url || '',
        video_url: product.video_url || '',
        show_video: product.show_video || false,
        target_audience: product.target_audience || '',
        project_id: product.project_id ? String(product.project_id) : '',
        is_published: product.is_published,
        is_featured: product.is_featured,
        sort_order: product.sort_order,
        launched_at: product.launched_at ? product.launched_at.substring(0, 10) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const formData = new FormData();
            formData.append('logo', e.target.files[0]);
            router.post(`/admin/products/${product.id}/logo`, formData, { preserveScroll: true });
        }
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const formData = new FormData();
            formData.append('cover', e.target.files[0]);
            router.post(`/admin/products/${product.id}/cover`, formData, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title={t('Edit Product')} header={t('Edit Product')}>
            <Head title={`${t('Edit Product')} - ${product.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/products" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('Edit Product')} - {product.name}</h1>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Logo */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <label className={labelClass}>{t('Logo')}</label>
                        <div className="flex items-center gap-4 mt-2">
                            {product.logo_path ? (
                                <img src={`/storage/${product.logo_path}`} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-gray-200 dark:border-gray-600" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-300 dark:text-gray-500">{product.name.substring(0, 2)}</span>
                                </div>
                            )}
                            <input ref={logoInput} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            <button type="button" onClick={() => logoInput.current?.click()} className="px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">
                                {t('Upload')}
                            </button>
                        </div>
                    </div>

                    {/* Cover */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <label className={labelClass}>{t('Cover Image')}</label>
                        <div className="mt-2">
                            {product.cover_image_path ? (
                                <img src={`/storage/${product.cover_image_path}`} alt="Cover" className="w-full h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-600 mb-2" />
                            ) : (
                                <div className="w-full h-24 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 flex items-center justify-center mb-2">
                                    <span className="text-xs text-gray-400">{t('Cover Image')}</span>
                                </div>
                            )}
                            <input ref={coverInput} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                            <button type="button" onClick={() => coverInput.current?.click()} className="px-3 py-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">
                                {t('Upload')}
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('Description')}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t('Name')} *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>{t('Status')} *</label>
                                <SearchableSelect
                                    value={data.status}
                                    onChange={(val) => setData('status', val)}
                                    options={[
                                        { value: 'in_development', label: t('In Development') },
                                        { value: 'beta', label: t('Beta') },
                                        { value: 'launched', label: t('Launched') },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className={labelClass}>Tagline</label>
                            <input type="text" value={data.tagline} onChange={e => setData('tagline', e.target.value)} className={inputClass} maxLength={500} />
                        </div>

                        <div className="mt-4">
                            <label className={labelClass}>{t('Description')}</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className={`${inputClass} min-h-[200px]`} />
                        </div>

                        <div className="mt-4">
                            <label className={labelClass}>{t('Target audience')}</label>
                            <input type="text" value={data.target_audience} onChange={e => setData('target_audience', e.target.value)} className={inputClass} maxLength={500} />
                        </div>
                    </div>

                    {/* Features & Tech */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('Features')} & {t('Tech Stack')}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>{t('Features')}</label>
                                <TagInput value={data.features} onChange={v => setData('features', v)} placeholder={t('Add a feature...')} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('Tech Stack')}</label>
                                <TagInput value={data.tech_stack} onChange={v => setData('tech_stack', v)} placeholder={t('Add a technology...')} />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('Pricing')}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t('Monthly')} (EUR)</label>
                                <input type="number" step="0.01" min="0" value={data.pricing_monthly} onChange={e => setData('pricing_monthly', e.target.value)} className={inputClass} disabled={data.pricing_custom} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('Yearly')} (EUR)</label>
                                <input type="number" step="0.01" min="0" value={data.pricing_yearly} onChange={e => setData('pricing_yearly', e.target.value)} className={inputClass} disabled={data.pricing_custom} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setData('pricing_custom', !data.pricing_custom)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${data.pricing_custom ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${data.pricing_custom ? 'translate-x-4' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{t('Custom pricing')} ({t('Contact us for pricing')})</span>
                        </div>
                    </div>

                    {/* Links & Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">URLs & {t('Settings')}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Live URL</label>
                                <input type="url" value={data.live_url} onChange={e => setData('live_url', e.target.value)} className={inputClass} placeholder="https://" />
                            </div>
                            <div>
                                <label className={labelClass}>Demo URL</label>
                                <input type="url" value={data.demo_url} onChange={e => setData('demo_url', e.target.value)} className={inputClass} placeholder="https://" />
                            </div>
                            <div>
                                <label className={labelClass}>Video YouTube</label>
                                <input type="url" value={data.video_url} onChange={e => setData('video_url', e.target.value)} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <input type="checkbox" checked={!!data.show_video} onChange={e => setData('show_video', e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-teal-500 focus:ring-teal-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Afficher la vidéo sur la page produit</span>
                            </div>
                            <div>
                                <label className={labelClass}>{t('Link to Project')}</label>
                                <SearchableSelect
                                    value={data.project_id}
                                    onChange={(val) => setData('project_id', val)}
                                    placeholder={t('None')}
                                    options={projects.map(p => ({ value: String(p.id), label: p.nom_societe }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('Launch date')}</label>
                                <input type="date" value={data.launched_at} onChange={e => setData('launched_at', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('Sort order')}</label>
                                <input type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className={inputClass} />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${data.is_published ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${data.is_published ? 'translate-x-4' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Published')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('is_featured', !data.is_featured)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${data.is_featured ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${data.is_featured ? 'translate-x-4' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Featured')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/products" className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            {t('Cancel')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {processing ? '...' : t('Save')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
