import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface ApiStatus {
    status: 'active' | 'no_key' | 'invalid_key' | 'quota_exceeded' | 'error';
    message: string;
}

interface Props {
    settings: {
        enabled: boolean;
        knowledge_text: string;
        pdf_filename: string;
        api_status: ApiStatus;
    };
}

export default function Chatbot({ settings }: Props) {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(settings.enabled);
    const [knowledgeText, setKnowledgeText] = useState(settings.knowledge_text);
    const [saving, setSaving] = useState(false);
    const [apiStatus, setApiStatus] = useState<ApiStatus>(settings.api_status);
    const [testingApi, setTestingApi] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [pdfFilename, setPdfFilename] = useState(settings.pdf_filename);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.put('/admin/settings/chatbot', {
            enabled,
            knowledge_text: knowledgeText,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleTestApi = async () => {
        setTestingApi(true);
        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') || '' : '';
            const response = await fetch('/admin/settings/chatbot/test-api', {
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            });
            if (response.ok) {
                const data = await response.json();
                setApiStatus(data);
            }
        } catch {
            setApiStatus({ status: 'error', message: 'Connexion impossible' });
        } finally {
            setTestingApi(false);
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingFile(true);
        const formData = new FormData();
        formData.append('pdf', file);
        router.post('/admin/settings/chatbot/pdf', formData as any, {
            preserveScroll: true,
            onSuccess: () => {
                setPdfFilename(file.name);
            },
            onFinish: () => {
                setUploadingFile(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'no_key': return 'bg-gray-400';
            case 'invalid_key': return 'bg-red-500';
            case 'quota_exceeded': return 'bg-amber-500';
            default: return 'bg-red-500';
        }
    };

    const statusLabel = (status: string) => {
        switch (status) {
            case 'active': return t('Actif');
            case 'no_key': return t('Aucune clé');
            case 'invalid_key': return t('Clé invalide');
            case 'quota_exceeded': return t('Quota dépassé');
            default: return t('Erreur');
        }
    };

    return (
        <AdminLayout title={t('Chatbot IA')} header={t('Chatbot IA')}>
            <Head title={t('Chatbot IA')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 mb-8">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/20" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
                </div>
                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{t('Chatbot IA')}</h1>
                        <p className="text-blue-100 text-sm mt-1">{t('Configurez l\'assistant IA pour vos visiteurs')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Main settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* API Status Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {t('Statut API OpenAI')}
                        </h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${statusColor(apiStatus.status)} animate-pulse`} />
                                <div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{statusLabel(apiStatus.status)}</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{apiStatus.message}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleTestApi}
                                disabled={testingApi}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
                            >
                                {testingApi ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                    </svg>
                                )}
                                {t('Tester l\'API')}
                            </button>
                        </div>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Activation du chatbot')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {enabled ? t('Le chatbot est visible pour les visiteurs') : t('Le chatbot est masqué pour les visiteurs')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEnabled(!enabled)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${enabled ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Knowledge Base */}
                    <form onSubmit={handleSave}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                {t('Base de connaissances')}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {t('Collez le contenu que l\'IA doit utiliser pour répondre aux questions des visiteurs. L\'IA répondra UNIQUEMENT sur la base de ce texte.')}
                            </p>
                            <textarea
                                value={knowledgeText}
                                onChange={e => setKnowledgeText(e.target.value)}
                                rows={16}
                                maxLength={50000}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors font-mono text-sm"
                                placeholder={t('Collez ici les informations sur votre entreprise, vos services, vos tarifs...')}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {knowledgeText.length.toLocaleString()} / 50 000 {t('caractères')}
                                </p>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    {saving ? t('Enregistrement...') : t('Enregistrer')}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* PDF/TXT Upload */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            {t('Importer un fichier')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {t('Importez un fichier PDF ou TXT. Les fichiers TXT remplaceront la base de connaissances.')}
                        </p>

                        {pdfFilename && (
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span className="text-sm text-amber-700 dark:text-amber-400">{t('Fichier actuel')} : {pdfFilename}</span>
                            </div>
                        )}

                        <label
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                uploadingFile
                                    ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5'
                            }`}
                        >
                            {uploadingFile ? (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span className="text-sm text-gray-500">{t('Importation en cours...')}</span>
                                </div>
                            ) : (
                                <>
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Cliquez pour sélectionner un fichier PDF ou TXT')}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Max 5 Mo')}</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploadingFile}
                            />
                        </label>
                    </div>
                </div>

                {/* Right column: Preview */}
                <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Aperçu')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('Voici comment la section apparaît sur la page d\'accueil')}</p>

                        {/* Mini preview */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                            <div className="bg-gray-900 p-6 text-center">
                                <p className="text-white text-sm font-bold mb-3">{t('Ne cherchez plus, demandez ici')}</p>
                                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                    <svg className="w-4 h-4 text-teal-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <span className="text-gray-500 text-xs flex-1 text-left">{t('Posez une question...')}</span>
                                    <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">AI</span>
                                </div>
                                <p className="mt-2 text-[10px] text-gray-600">{t('3 questions gratuites par jour')}</p>
                            </div>
                        </div>

                        {!enabled && (
                            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-xs text-amber-700 dark:text-amber-400">{t('Le chatbot est actuellement désactivé')}</span>
                            </div>
                        )}

                        {!knowledgeText && enabled && (
                            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-xs text-red-700 dark:text-red-400">{t('La base de connaissances est vide. Le chatbot ne sera pas visible.')}</span>
                            </div>
                        )}
                    </div>

                    {/* Info card */}
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-6">
                        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">{t('Comment fonctionne le chatbot')}</h3>
                        <ul className="space-y-2 text-xs text-indigo-700 dark:text-indigo-400">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                                {t('Les visiteurs peuvent poser 3 questions par jour')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                                {t('L\'IA répond uniquement avec la base de connaissances')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                                {t('Le chatbot se masque automatiquement si l\'API est indisponible')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                                {t('Les réponses sont en français, anglais ou néerlandais selon la question')}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
