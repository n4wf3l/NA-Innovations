import AdminLayout from '@/Layouts/AdminLayout';
import AdminManagementTabs from '@/Components/Admin/AdminManagementTabs';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    brochure: {
        file_path: string;
        url: string;
        updated_at: string;
    };
}

export default function BrochureSettings({ brochure }: Props) {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasBrochure = !!brochure.file_path;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        router.post('/admin/settings/brochure', { brochure: file }, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleDelete = () => {
        if (!confirm(t('Supprimer la brochure actuelle ?'))) return;
        setDeleting(true);
        router.delete('/admin/settings/brochure', {
            preserveScroll: true,
            onFinish: () => setDeleting(false),
        });
    };

    const formattedDate = brochure.updated_at
        ? new Date(brochure.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';

    return (
        <AdminLayout title={t('Brochure')} header={t('Brochure')}>
            <Head title={t('Brochure')} />

            <AdminManagementTabs active="brochure" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{t('Brochure commerciale')}</h1>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                {t('Uploadez un PDF de présentation de vos services. Il sera téléchargeable depuis la page Contact du site public.')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-5">
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('Fichier actuel')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('Format accepté : PDF uniquement, 10 Mo maximum.')}</p>
                    </div>

                    {hasBrochure ? (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">brochure.pdf</p>
                                {formattedDate && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Mise à jour le')} {formattedDate}</p>
                                )}
                            </div>
                            <a
                                href={brochure.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                                {t('Aperçu')}
                            </a>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                            >
                                {deleting ? t('Suppression...') : t('Supprimer')}
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl">
                            <p className="text-sm text-amber-800 dark:text-amber-200">{t('Aucune brochure uploadée pour le moment.')}</p>
                        </div>
                    )}

                    <div>
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
                                        <svg className="animate-spin w-5 h-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                            {hasBrochure ? t('Remplacer la brochure') : t('Choisir un fichier PDF')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
