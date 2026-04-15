import AdminLayout from '@/Layouts/AdminLayout';
import AdminManagementTabs from '@/Components/Admin/AdminManagementTabs';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface CvItem {
    id: number;
    name: string;
    size: number;
    created_at: string | null;
}

interface Props {
    cvs: CvItem[];
    maxFiles: number;
    template: {
        subject: string;
        body: string;
    };
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function CvSender({ cvs, maxFiles, template }: Props) {
    const { t } = useTranslation();
    const { props } = usePage<any>();
    const flashSuccess = props?.flash?.success;
    const flashError = props?.flash?.error;

    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subject, setSubject] = useState(template.subject);
    const [body, setBody] = useState(template.body);
    const [savingTemplate, setSavingTemplate] = useState(false);

    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [selectedCvId, setSelectedCvId] = useState<number | ''>(cvs[0]?.id ?? '');
    const [sending, setSending] = useState(false);

    const canUpload = cvs.length < maxFiles;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        router.post('/admin/settings/cv-sender/upload', { cv: file }, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleDelete = (cv: CvItem) => {
        if (!confirm(t('Supprimer le CV « {{name}} » ?', { name: cv.name }))) return;
        setDeletingId(cv.id);
        router.delete(`/admin/settings/cv-sender/${cv.id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    const handleSaveTemplate = (e: FormEvent) => {
        e.preventDefault();
        setSavingTemplate(true);
        router.put('/admin/settings/cv-sender/template', { subject, body }, {
            preserveScroll: true,
            onFinish: () => setSavingTemplate(false),
        });
    };

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCvId) return;
        setSending(true);
        router.post('/admin/settings/cv-sender/send', {
            recipient_email: recipientEmail,
            recipient_name: recipientName,
            cv_id: selectedCvId,
            subject,
            body,
        }, {
            preserveScroll: true,
            onFinish: () => setSending(false),
            onSuccess: () => {
                setRecipientEmail('');
                setRecipientName('');
            },
        });
    };

    return (
        <AdminLayout title={t('Envoi de CV')} header={t('Envoi de CV')}>
            <Head title={t('Envoi de CV')} />

            <AdminManagementTabs active="cv-sender" />

            <div className="space-y-6">
                {flashSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm">
                        {flashSuccess}
                    </div>
                )}
                {flashError && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
                        {flashError}
                    </div>
                )}

                {/* Hero */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{t('Envoi de CV')}</h1>
                            <p className="text-teal-50 text-sm leading-relaxed">
                                {t('Stockez jusqu\'à {{max}} CV au format PDF, personnalisez votre modèle d\'email, et envoyez votre candidature en un clic.', { max: maxFiles })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CV list */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Mes CV ({{count}}/{{max}})', { count: cvs.length, max: maxFiles })}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Format accepté : PDF uniquement, 10 Mo maximum.')}</p>
                        </div>
                    </div>

                    {cvs.length === 0 ? (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl">
                            <p className="text-sm text-amber-800 dark:text-amber-200">{t('Aucun CV enregistré pour le moment.')}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {cvs.map(cv => (
                                <div key={cv.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{cv.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatBytes(cv.size)}</p>
                                    </div>
                                    <a
                                        href={`/admin/settings/cv-sender/${cv.id}/download`}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                                    >
                                        {t('Télécharger')}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(cv)}
                                        disabled={deletingId === cv.id}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === cv.id ? t('Suppression...') : t('Supprimer')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {canUpload ? (
                        <label className="block">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                            <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                                uploading
                                    ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 cursor-wait'
                                    : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                            }`}>
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{t('Upload en cours...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{t('Ajouter un CV')}</span>
                                    </>
                                )}
                            </div>
                        </label>
                    ) : (
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400 text-center">
                            {t('Limite de {{max}} CV atteinte. Supprimez-en un pour en ajouter un nouveau.', { max: maxFiles })}
                        </div>
                    )}
                </div>

                {/* Email template + send */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-5">
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Modèle d\'email')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('Variables disponibles :')} <code className="text-indigo-600 dark:text-indigo-400">{'{{ sender_name }}'}</code>, <code className="text-indigo-600 dark:text-indigo-400">{'{{ recipient_name }}'}</code>, <code className="text-indigo-600 dark:text-indigo-400">{'{{ recipient_email }}'}</code>
                        </p>
                    </div>

                    <form onSubmit={handleSaveTemplate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('Sujet')}</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('Corps du message')}</label>
                            <RichTextEditor value={body} onChange={setBody} />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={savingTemplate}
                                className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                                {savingTemplate ? t('Enregistrement...') : t('Enregistrer le modèle')}
                            </button>
                        </div>
                    </form>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Envoyer à un destinataire')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Saisissez l\'email du destinataire, choisissez le CV à joindre, puis envoyez.')}</p>
                    </div>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('Email du destinataire')} *</label>
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={e => setRecipientEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="recruteur@entreprise.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('Nom du destinataire')}</label>
                                <input
                                    type="text"
                                    value={recipientName}
                                    onChange={e => setRecipientName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder={t('Optionnel')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('CV à joindre')} *</label>
                            <select
                                value={selectedCvId}
                                onChange={e => setSelectedCvId(e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                                disabled={cvs.length === 0}
                            >
                                {cvs.length === 0 ? (
                                    <option value="">{t('Aucun CV disponible')}</option>
                                ) : (
                                    cvs.map(cv => (
                                        <option key={cv.id} value={cv.id}>{cv.name}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={sending || cvs.length === 0 || !selectedCvId}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? t('Envoi en cours...') : t('Envoyer')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
