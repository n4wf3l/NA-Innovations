import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface Props {
    ndaMode: 'text' | 'pdf';
    ndaText: string;
    ndaPdfPath: string | null;
}

export default function NdaSettings({ ndaMode, ndaText, ndaPdfPath }: Props) {
    const { t } = useTranslation();
    const [mode, setMode] = useState(ndaMode);
    const [text, setText] = useState(ndaText);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(false);

    const saveText = () => {
        setSaving(true);
        router.put('/admin/settings/nda', { nda_mode: mode, nda_text: text }, {
            onFinish: () => setSaving(false),
        });
    };

    const uploadPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('nda_pdf', file);
        router.post('/admin/settings/nda/pdf', fd, {
            forceFormData: true,
            onFinish: () => setUploading(false),
        });
    };

    const deletePdf = () => {
        router.delete('/admin/settings/nda/pdf', { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('NDA Settings')} header={t('Settings')}>
            <Head title={t('NDA Settings')} />

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 mb-6">
                <h1 className="text-2xl font-bold text-white">{t('Accord de Non-Divulgation (NDA)')}</h1>
                <p className="text-violet-200 text-sm mt-1">{t('Configurez le NDA que les partenaires doivent signer pour accéder à la Knowledge Base')}</p>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => setMode('text')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        mode === 'text'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'text' ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Option 1 : Texte éditable')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('Éditez le NDA directement avec l\'éditeur de texte')}</p>
                        </div>
                    </div>
                    {mode === 'text' && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            {t('Mode actif')}
                        </div>
                    )}
                </button>

                <button
                    onClick={() => setMode('pdf')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        mode === 'pdf'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'pdf' ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Option 2 : PDF personnalisé')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('Uploadez votre propre document NDA en PDF')}</p>
                        </div>
                    </div>
                    {mode === 'pdf' && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            {t('Mode actif')}
                        </div>
                    )}
                </button>
            </div>

            {/* Text Mode */}
            {mode === 'text' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white">{t('Contenu du NDA')}</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPreview(!preview)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    preview
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {preview ? t('Éditer') : t('Aperçu')}
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {preview ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
                        ) : (
                            <RichTextEditor value={text} onChange={setText} />
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                        <button
                            onClick={saveText}
                            disabled={saving}
                            className="px-6 py-2.5 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 shadow-lg shadow-violet-500/20"
                        >
                            {saving ? t('Enregistrement...') : t('Enregistrer')}
                        </button>
                    </div>
                </div>
            )}

            {/* PDF Mode */}
            {mode === 'pdf' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4">{t('Document PDF')}</h2>

                    {ndaPdfPath ? (
                        <div className="space-y-4">
                            {/* PDF Preview */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <iframe
                                    src={`/storage/${ndaPdfPath}`}
                                    className="w-full rounded-t-xl"
                                    style={{ height: '500px' }}
                                    title="NDA PDF"
                                />
                                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">NDA.pdf</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={`/storage/${ndaPdfPath}`} target="_blank" className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            {t('Télécharger')}
                                        </a>
                                        <button onClick={deletePdf} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                            {t('Supprimer')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Replace */}
                            <div>
                                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl cursor-pointer transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                                    {t('Remplacer le PDF')}
                                    <input type="file" accept=".pdf" onChange={uploadPdf} className="hidden" />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                                uploading ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10' : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/5'
                            }`}
                            onClick={() => document.getElementById('nda-pdf-input')?.click()}
                        >
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="w-8 h-8 text-violet-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    <p className="text-sm font-medium text-violet-600">{t('Upload en cours...')}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0H9.75m3-6.75H9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Glissez votre PDF ici ou cliquez pour sélectionner')}</p>
                                    <p className="text-xs text-gray-400">{t('PDF uniquement — max 10 Mo')}</p>
                                </div>
                            )}
                            <input id="nda-pdf-input" type="file" accept=".pdf" onChange={uploadPdf} className="hidden" />
                        </div>
                    )}

                    {/* Save mode button */}
                    {!ndaPdfPath && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={saveText}
                                disabled={saving}
                                className="px-6 py-2.5 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 shadow-lg shadow-violet-500/20"
                            >
                                {saving ? t('Enregistrement...') : t('Enregistrer le mode')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('Comment ça fonctionne')}</h3>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                        {t('Le partenaire accède à la page Prospection')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                        {t('Il voit le NDA (texte ou PDF selon votre choix) et doit le signer')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                        {t('Sa signature, nom et IP sont enregistrés. Vous recevez une notification.')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                        {t('Vous approuvez ou refusez depuis la page Équipe')}
                    </li>
                </ul>
            </div>
        </AdminLayout>
    );
}
