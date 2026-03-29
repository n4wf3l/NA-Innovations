import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useConfirm } from '@/hooks/useConfirm';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    project: any;
    portfolio: any;
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-amber-400 focus:ring-amber-400 placeholder-gray-400 dark:placeholder-gray-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const categories = [
    'Site vitrine',
    'E-commerce',
    'Application web',
    'Application mobile',
    'Plateforme SaaS',
    'Blog',
    'Portfolio',
    'Autre',
];

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
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                        {tag}
                        <button type="button" onClick={() => remove(i)} className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-200">
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

function computeDurationDays(startDate: string | null, endDate: string | null): number | null {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
}

export default function PortfolioEdit({ project, portfolio }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();

    const autoDuration = computeDurationDays(project.start_date, project.end_date);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        title: portfolio.title || '',
        excerpt: portfolio.excerpt || '',
        category: portfolio.category || '',
        live_url: portfolio.live_url || '',
        duration_days: portfolio.duration_days || autoDuration || '',
        context: portfolio.context || '',
        challenge: portfolio.challenge || '',
        solution: portfolio.solution || '',
        results: portfolio.results || '',
        tech_stack: portfolio.tech_stack || [],
        features: portfolio.features || [],
        tags: portfolio.tags || [],
        testimonial_text: portfolio.testimonial_text || '',
        testimonial_author: portfolio.testimonial_author || '',
        testimonial_role: portfolio.testimonial_role || '',
        is_published: portfolio.is_published || false,
        is_featured: portfolio.is_featured || false,
        sort_order: portfolio.sort_order || 0,
    });

    const images: any[] = portfolio.images || [];

    const excerptLength = (data.excerpt || '').length;
    const excerptColor = excerptLength > 450 ? 'text-red-500' : excerptLength > 350 ? 'text-amber-500' : 'text-emerald-500';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/portfolio/${project.id}`, { forceFormData: true });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt_text', project.nom_societe || '');

        router.post(`/admin/portfolio/${project.id}/images`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });

        e.target.value = '';
    };

    const handleDeleteImage = async (imageId: number) => {
        const ok = await confirm({
            title: t('Supprimer'),
            message: t('Êtes-vous sûr de vouloir supprimer cette image ?'),
            confirmText: t('Supprimer'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/portfolio/images/${imageId}`, {
            preserveScroll: true,
        });
    };

    const firstImage = images[0];
    const previewImage = firstImage
        ? `/storage/${firstImage.image_path}`
        : null;

    return (
        <AdminLayout title={t('Modifier le portfolio')} header={t('Modifier le portfolio')}>
            <Head title={t('Modifier le portfolio')} />

            <div className="mb-6">
                <Link href="/admin/portfolio" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    &larr; {t('Retour au portfolio')}
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Colonne gauche (2/3) ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Section 1 : Présentation */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Présentation')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>{t('Titre')} *</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} required />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Extrait')}</label>
                                    <textarea
                                        value={data.excerpt}
                                        onChange={e => setData('excerpt', e.target.value)}
                                        maxLength={500}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Résumé court du projet pour la carte de portfolio...')}
                                    />
                                    <p className={`mt-1 text-xs ${excerptColor}`}>{excerptLength}/500</p>
                                    {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>{t('Catégorie')}</label>
                                        <SearchableSelect
                                            value={data.category}
                                            onChange={(val) => setData('category', val)}
                                            placeholder={t('Sélectionner...')}
                                            options={categories.map(cat => ({ value: cat, label: cat }))}
                                        />
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t('URL live')}</label>
                                        <input type="url" value={data.live_url} onChange={e => setData('live_url', e.target.value)} className={inputClass} placeholder="https://..." />
                                        {errors.live_url && <p className="mt-1 text-sm text-red-600">{errors.live_url}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Durée (jours)')}</label>
                                    <input
                                        type="number"
                                        value={data.duration_days}
                                        onChange={e => setData('duration_days', e.target.value ? parseInt(e.target.value) : '' as any)}
                                        className={inputClass}
                                        min={1}
                                        placeholder={autoDuration ? `${t('Calculé automatiquement')} : ${autoDuration} ${t('jours')}` : ''}
                                    />
                                    {errors.duration_days && <p className="mt-1 text-sm text-red-600">{errors.duration_days}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2 : Galerie d'images */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Galerie d'images")}</h3>

                            <div className="mb-4">
                                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl cursor-pointer transition-colors">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Ajouter une image')}</span>
                                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('JPG, PNG, WebP — max 5 Mo')}</p>
                            </div>

                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {images.map((img: any, index: number) => (
                                        <div key={img.id} className="relative group">
                                            <img
                                                src={`/storage/${img.image_path}`}
                                                alt={img.alt_text || project.nom_societe}
                                                className="w-full aspect-video object-cover rounded-xl"
                                            />
                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full">
                                                    {t('Image principale')}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(img.id)}
                                                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl">
                                    <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25" />
                                    </svg>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('Ajoutez des captures d\'écran de votre projet')}</p>
                                </div>
                            )}
                        </div>

                        {/* Section 3 : Détails du projet */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Détails du projet')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>{t('Contexte')}</label>
                                    <textarea
                                        value={data.context}
                                        onChange={e => setData('context', e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Quel était le besoin du client ?')}
                                    />
                                    {errors.context && <p className="mt-1 text-sm text-red-600">{errors.context}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Défi')}</label>
                                    <textarea
                                        value={data.challenge}
                                        onChange={e => setData('challenge', e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Quelles étaient les difficultés ?')}
                                    />
                                    {errors.challenge && <p className="mt-1 text-sm text-red-600">{errors.challenge}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Solution')}</label>
                                    <textarea
                                        value={data.solution}
                                        onChange={e => setData('solution', e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Comment avez-vous résolu le problème ?')}
                                    />
                                    {errors.solution && <p className="mt-1 text-sm text-red-600">{errors.solution}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Résultats')}</label>
                                    <textarea
                                        value={data.results}
                                        onChange={e => setData('results', e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Quels résultats concrets ?')}
                                    />
                                    {errors.results && <p className="mt-1 text-sm text-red-600">{errors.results}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 4 : Stack technique & Fonctionnalités */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Stack technique & Fonctionnalités')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>{t('Stack technique')}</label>
                                    <TagInput
                                        value={data.tech_stack}
                                        onChange={v => setData('tech_stack', v)}
                                        placeholder={t('Ex: React, Laravel, MySQL...')}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Fonctionnalités clés')}</label>
                                    <TagInput
                                        value={data.features}
                                        onChange={v => setData('features', v)}
                                        placeholder={t('Ex: Authentification, Paiement en ligne...')}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Tags')}</label>
                                    <TagInput
                                        value={data.tags}
                                        onChange={v => setData('tags', v)}
                                        placeholder={t('Ex: SaaS, Belgique, PME...')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5 : Témoignage client */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Témoignage client')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>{t('Citation')}</label>
                                    <textarea
                                        value={data.testimonial_text}
                                        onChange={e => setData('testimonial_text', e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                        placeholder={t('Le témoignage du client...')}
                                    />
                                    {errors.testimonial_text && <p className="mt-1 text-sm text-red-600">{errors.testimonial_text}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>{t('Nom')}</label>
                                        <input type="text" value={data.testimonial_author} onChange={e => setData('testimonial_author', e.target.value)} className={inputClass} />
                                        {errors.testimonial_author && <p className="mt-1 text-sm text-red-600">{errors.testimonial_author}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t('Rôle')}</label>
                                        <input type="text" value={data.testimonial_role} onChange={e => setData('testimonial_role', e.target.value)} className={inputClass} placeholder={t('Ex: CEO de TipTong')} />
                                        {errors.testimonial_role && <p className="mt-1 text-sm text-red-600">{errors.testimonial_role}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 6 : Publication */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Publication')}</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={e => setData('is_published', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t('Publier sur le site')}</span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Le projet sera visible sur la page portfolio publique')}</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={e => setData('is_featured', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t('Mettre en avant')}</span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Affiché en priorité sur la page d\'accueil')}</p>
                                    </div>
                                </label>
                                <div>
                                    <label className={labelClass}>{t("Ordre d'affichage")}</label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={e => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className={inputClass}
                                        min={0}
                                    />
                                    {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex items-center justify-end gap-3">
                            <Link href="/admin/portfolio" className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                {t('Annuler')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {processing && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {t('Enregistrer')}
                            </button>
                        </div>
                    </div>

                    {/* ── Colonne droite (1/3) ── */}
                    <div className="space-y-6">

                        {/* Aperçu */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t('Aperçu')}</h3>
                            </div>
                            {/* Preview card */}
                            <div className="p-4">
                                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                    {/* Image */}
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        {previewImage ? (
                                            <img src={previewImage} alt={data.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                                <span className="text-3xl font-black text-gray-200 dark:text-gray-500">
                                                    {(data.title || project.nom_societe || '?').substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            {project.image ? (
                                                <img
                                                    src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`}
                                                    alt=""
                                                    className="w-6 h-6 rounded-md object-contain bg-gray-50 dark:bg-gray-700 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{data.title || project.nom_societe}</h4>
                                                {data.category && <p className="text-[10px] text-gray-400 dark:text-gray-500">{data.category}</p>}
                                            </div>
                                        </div>
                                        {data.excerpt && (
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{data.excerpt}</p>
                                        )}
                                        {data.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {data.tech_stack.slice(0, 4).map((tech: string) => (
                                                    <span key={tech} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{tech}</span>
                                                ))}
                                                {data.tech_stack.length > 4 && <span className="text-[9px] text-gray-400">+{data.tech_stack.length - 4}</span>}
                                            </div>
                                        )}
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${data.is_published ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                            {data.is_published ? t('Publié') : t('Brouillon')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logo client */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t('Logo client')}</h3>
                            </div>
                            <div className="p-5">
                                {portfolio.client_logo ? (
                                    <div className="space-y-3">
                                        <div className="w-full h-24 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center p-4">
                                            <img src={`/storage/${portfolio.client_logo}`} alt="Logo" className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={async () => { const ok = await confirm({ title: t('Supprimer'), message: t('Supprimer le logo ?'), confirmText: t('Supprimer'), variant: 'danger' }); if (ok) router.delete(`/admin/portfolio/${project.id}/logo`, { preserveScroll: true }); }}
                                            className="w-full py-2 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                                        >
                                            {t('Supprimer le logo')}
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-teal-400 transition group">
                                        <svg className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-teal-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Uploader un logo')}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const fd = new FormData();
                                            fd.append('client_logo', file);
                                            router.post(`/admin/portfolio/${project.id}/logo`, fd, { forceFormData: true, preserveScroll: true });
                                            e.target.value = '';
                                        }} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Infos projet */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t('Infos projet')}</h3>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('Client')}</span>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">{project.client?.company_name || project.client?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('Développeur')}</span>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">{project.developer?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('Statut')}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        project.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                        project.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                        project.status === 'review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {project.status || '-'}
                                    </span>
                                </div>
                                {project.budget && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('Budget')}</span>
                                        <span className="text-xs font-medium text-gray-900 dark:text-white">{parseFloat(project.budget).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}</span>
                                    </div>
                                )}
                                {(project.start_date || project.end_date) && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('Dates')}</span>
                                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                                            {project.start_date ? new Date(project.start_date).toLocaleDateString('fr-BE') : '?'}
                                            {' → '}
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString('fr-BE') : '?'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ConfirmDialog />
        </AdminLayout>
    );
}
