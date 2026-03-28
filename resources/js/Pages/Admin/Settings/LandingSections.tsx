import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface SectionData {
    id: number;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    button_text: string | null;
    button_url: string | null;
    background_image: string | null;
    is_active: boolean;
    sort_order: number;
    metadata: Record<string, any> | null;
}

interface Props {
    sections: SectionData[];
}

export default function LandingSections({ sections }: Props) {
    const { t } = useTranslation();
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [forms, setForms] = useState<Record<number, Partial<SectionData>>>({});
    const [saving, setSaving] = useState<number | null>(null);
    const [uploading, setUploading] = useState<number | null>(null);

    const getForm = (section: SectionData) => {
        return forms[section.id] || {
            title: section.title || '',
            subtitle: section.subtitle || '',
            description: section.description || '',
            button_text: section.button_text || '',
            button_url: section.button_url || '',
            is_active: section.is_active,
        };
    };

    const updateForm = (sectionId: number, field: string, value: any) => {
        setForms(prev => ({
            ...prev,
            [sectionId]: {
                ...getFormById(sectionId),
                [field]: value,
            },
        }));
    };

    const getFormById = (sectionId: number) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return {};
        return getForm(section);
    };

    const handleSave = (section: SectionData) => {
        setSaving(section.id);
        const formData = getForm(section);
        router.put(`/admin/settings/landing-sections/${section.id}`, formData, {
            onFinish: () => setSaving(null),
        });
    };

    const handleImageUpload = (section: SectionData, file: File) => {
        setUploading(section.id);
        const formData = new FormData();
        formData.append('background_image', file);
        router.post(`/admin/settings/landing-sections/${section.id}/image`, formData, {
            onFinish: () => setUploading(null),
        });
    };

    const sectionLabels: Record<string, string> = {
        hero: 'Section Hero (page d\'accueil)',
        cta: 'Section CTA (appel à l\'action)',
        about: 'Section À propos',
    };

    return (
        <AdminLayout title={t('Sections Landing Page')} header={t('Sections Landing Page')}>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Sections de la Landing Page')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('Gérez le contenu des différentes sections de votre page d\'accueil.')}
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                        <p className="text-sm text-green-700 dark:text-green-300">{flash.success}</p>
                    </div>
                )}

                {sections.map((section) => {
                    const form = getForm(section);
                    return (
                        <div key={section.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {sectionLabels[section.section_key] || section.section_key}
                                    </h3>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{section.section_key}</span>
                                </div>
                                <button
                                    onClick={() => updateForm(section.id, 'is_active', !form.is_active)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        form.is_active ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        form.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Titre')}</label>
                                        <input
                                            type="text"
                                            value={form.title || ''}
                                            onChange={(e) => updateForm(section.id, 'title', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Sous-titre')}</label>
                                        <input
                                            type="text"
                                            value={form.subtitle || ''}
                                            onChange={(e) => updateForm(section.id, 'subtitle', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Description')}</label>
                                    <textarea
                                        value={form.description || ''}
                                        onChange={(e) => updateForm(section.id, 'description', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Texte du bouton')}</label>
                                        <input
                                            type="text"
                                            value={form.button_text || ''}
                                            onChange={(e) => updateForm(section.id, 'button_text', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('URL du bouton')}</label>
                                        <input
                                            type="text"
                                            value={form.button_url || ''}
                                            onChange={(e) => updateForm(section.id, 'button_url', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Background image upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Image de fond')}</label>
                                    <div className="flex items-center gap-4">
                                        {section.background_image && (
                                            <img
                                                src={`/storage/${section.background_image}`}
                                                alt="Background"
                                                className="h-20 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            />
                                        )}
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            {uploading === section.id ? t('Envoi...') : t('Changer l\'image')}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(section, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => handleSave(section)}
                                        disabled={saving === section.id}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                                    >
                                        {saving === section.id ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                {t('Enregistrement...')}
                                            </>
                                        ) : t('Enregistrer')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {sections.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">{t('Aucune section configurée. Exécutez les seeders pour créer les sections par défaut.')}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
