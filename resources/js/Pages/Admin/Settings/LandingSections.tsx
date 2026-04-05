import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

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
        hero: t('Hero (page d\'accueil)'),
        cta: t('Appel à l\'action (CTA)'),
        about: t('À propos'),
        process: t('Notre processus'),
        terms: t('Conditions générales'),
        privacy: t('Politique de confidentialité'),
        services: t('Services'),
        testimonials: t('Témoignages'),
        faq: t('FAQ'),
        contact: t('Contact'),
        portfolio: t('Portfolio'),
        blog: t('Blog'),
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
                                    <RichTextEditor
                                        value={form.description || ''}
                                        onChange={(html) => updateForm(section.id, 'description', html)}
                                        placeholder={t('Section content...')}
                                        minHeight={150}
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

                                {/* Mini Preview */}
                                <details className="group">
                                    <summary className="cursor-pointer flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {t('Aperçu')}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </summary>
                                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner">
                                        {/* Miniature browser chrome */}
                                        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <div className="flex-1 mx-2 bg-white dark:bg-gray-600 rounded px-2 py-0.5 text-[8px] text-gray-400 font-mono">nainnovations.be</div>
                                        </div>
                                        {/* Section preview */}
                                        <div className="relative" style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
                                            <div className={`p-6 ${
                                                section.section_key === 'hero' ? 'bg-gray-900 text-center' :
                                                section.section_key === 'cta' ? 'bg-gray-900 text-center' :
                                                section.section_key === 'process' ? 'bg-gray-900' :
                                                'bg-white dark:bg-gray-800'
                                            }`} style={{ minHeight: 120 }}>
                                                {section.background_image && (
                                                    <div className="absolute inset-0 opacity-20">
                                                        <img src={`/storage/${section.background_image}`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="relative z-10">
                                                    {(form.title || section.title) && (
                                                        <h3 className={`font-bold mb-1 ${
                                                            ['hero', 'cta'].includes(section.section_key) ? 'text-white text-lg' : 'text-gray-900 dark:text-white text-base'
                                                        }`}>{form.title || section.title}</h3>
                                                    )}
                                                    {(form.subtitle || section.subtitle) && (
                                                        <p className={`text-xs mb-2 ${
                                                            ['hero', 'cta'].includes(section.section_key) ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                                        }`}>{form.subtitle || section.subtitle}</p>
                                                    )}
                                                    {(form.description || section.description) && (
                                                        <div className={`text-xs leading-relaxed line-clamp-3 ${
                                                            ['hero', 'cta'].includes(section.section_key) ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                                                        }`} dangerouslySetInnerHTML={{ __html: (form.description || section.description || '').substring(0, 200) }} />
                                                    )}
                                                    {(form.button_text || section.button_text) && (
                                                        <div className="mt-3">
                                                            <span className="inline-block px-3 py-1 bg-teal-500 text-white text-[10px] font-bold rounded-full">
                                                                {form.button_text || section.button_text}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {section.section_key === 'process' && section.metadata?.steps && (
                                                        <div className="flex items-center gap-2 mt-3">
                                                            {(section.metadata.steps as any[]).map((step: any, i: number) => (
                                                                <div key={i} className="flex items-center gap-1">
                                                                    <div className="w-5 h-5 rounded-full bg-teal-500 text-white text-[8px] flex items-center justify-center font-bold">{i + 1}</div>
                                                                    <span className="text-[8px] text-gray-400">{step.title}</span>
                                                                    {i < (section.metadata!.steps as any[]).length - 1 && <div className="w-4 h-px bg-gray-600" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {!form.is_active && (
                                                    <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center rounded-b-xl">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Désactivé')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </details>

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
