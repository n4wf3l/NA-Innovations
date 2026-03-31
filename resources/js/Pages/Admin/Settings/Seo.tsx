import { useState, useRef } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface Props {
    seoSettings: Record<string, string>;
}

interface PageSeo {
    key: string;
    label: string;
    titleKey: string;
    descriptionKey: string;
    ogImageKey: string;
    url: string;
}

const pages: PageSeo[] = [
    { key: 'home', label: 'Accueil', titleKey: 'seo.home_title', descriptionKey: 'seo.home_description', ogImageKey: 'seo.home_og_image', url: 'https://nainnovations.be/' },
    { key: 'projects', label: 'Portfolio', titleKey: 'seo.projects_title', descriptionKey: 'seo.projects_description', ogImageKey: 'seo.projects_og_image', url: 'https://nainnovations.be/projects' },
    { key: 'contact', label: 'Contact', titleKey: 'seo.contact_title', descriptionKey: 'seo.contact_description', ogImageKey: 'seo.contact_og_image', url: 'https://nainnovations.be/contact' },
    { key: 'about', label: 'À propos', titleKey: 'seo.about_title', descriptionKey: 'seo.about_description', ogImageKey: 'seo.about_og_image', url: 'https://nainnovations.be/about' },
];

export default function Seo({ seoSettings }: Props) {
    const { t } = useTranslation();
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [form, setForm] = useState<Record<string, string>>({ ...seoSettings });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(pages[0].key);

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
        router.put('/admin/settings/seo', { settings }, {
            onFinish: () => setSaving(false),
        });
    };

    const charColor = (count: number, max: number) => {
        if (count <= max) return 'text-green-500';
        if (count <= max + 10) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <AdminLayout title={t('SEO')} header={t('SEO')}>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Paramètres SEO')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('Configurez les balises meta title et description pour chaque page publique.')}
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                        <p className="text-sm text-green-700 dark:text-green-300">{flash.success}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                    {pages.map(page => (
                        <button
                            key={page.key}
                            onClick={() => setActiveTab(page.key)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === page.key
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {page.label}
                        </button>
                    ))}
                </div>

                {/* Active tab content */}
                <div key={activeTab} className="animate-tab-in">
                    {pages.filter(p => p.key === activeTab).map((page) => {
                        const titleValue = form[page.titleKey] || '';
                        const descValue = form[page.descriptionKey] || '';

                        return (
                            <div key={page.key} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in">
                                <div className="p-6 space-y-4">
                                    {/* Title */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('Titre SEO')}</label>
                                            <span className={`text-xs font-medium ${charColor(titleValue.length, 60)}`}>
                                                {titleValue.length}/60
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={titleValue}
                                            onChange={(e) => updateField(page.titleKey, e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Titre de la page (recommandé < 60 caractères)"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('Meta description')}</label>
                                            <span className={`text-xs font-medium ${charColor(descValue.length, 160)}`}>
                                                {descValue.length}/160
                                            </span>
                                        </div>
                                        <textarea
                                            value={descValue}
                                            onChange={(e) => updateField(page.descriptionKey, e.target.value)}
                                            rows={2}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Description de la page (recommandé < 160 caractères)"
                                        />
                                    </div>

                                    {/* OG Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Image de partage (og:image)')}</label>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{t('Image affichée lors du partage sur Facebook, LinkedIn, Twitter, WhatsApp. Recommandé : 1200×630px.')}</p>
                                        <div className="flex items-center gap-4">
                                            {form[page.ogImageKey] ? (
                                                <img src={`/storage/${form[page.ogImageKey]}`} alt="OG" className="w-32 h-[67px] rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                                            ) : (
                                                <div className="w-32 h-[67px] rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25" /></svg>
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                    id={`og-image-${page.key}`}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const fd = new FormData();
                                                        fd.append('page', page.key);
                                                        fd.append('image', file);
                                                        router.post('/admin/settings/seo/og-image', fd, { preserveScroll: true, forceFormData: true });
                                                    }}
                                                />
                                                <label htmlFor={`og-image-${page.key}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                                    {form[page.ogImageKey] ? t('Changer') : t('Ajouter')}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Google Preview */}
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-medium">{t('Aperçu Google')}</p>
                                        <div className="space-y-1">
                                            <p className="text-blue-600 dark:text-blue-400 text-lg font-medium leading-tight truncate cursor-pointer hover:underline">
                                                {titleValue || 'Titre de la page'}
                                            </p>
                                            <p className="text-green-700 dark:text-green-500 text-sm truncate">
                                                {page.url}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                {descValue || 'Description de la page qui apparaîtra dans les résultats de recherche Google.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Social Preview */}
                                    {form[page.ogImageKey] && (
                                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-medium">{t('Aperçu réseaux sociaux')}</p>
                                            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                                <img src={`/storage/${form[page.ogImageKey]}`} alt="OG Preview" className="w-full aspect-[1200/630] object-cover" />
                                                <div className="p-3 bg-white dark:bg-gray-800">
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase">{page.url.replace('https://', '')}</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">{titleValue || 'Titre'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{descValue || 'Description'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                {t('Enregistrement...')}
                            </>
                        ) : t('Enregistrer tout')}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
