import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import SignaturePad from '@/Components/ui/SignaturePad';

interface ProjectDocument {
    id: number;
    title: string;
    body: string;
    status: string;
}

interface Project {
    id: number;
    nom_societe?: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    document: ProjectDocument | null;
    project: Project;
}

export default function SignatureModal({ show, onClose, document: doc, project }: Props) {
    const { t } = useTranslation();
    const [signing, setSigning] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);

    const handleSign = () => {
        if (!doc || !signatureData) return;
        setSigning(true);
        router.post(`/admin/projects/${project.id}/documents/${doc.id}/admin-sign`, {
            signature: signatureData,
        }, {
            onFinish: () => setSigning(false),
            onSuccess: () => {
                onClose();
                setSignatureData(null);
            },
            preserveScroll: true,
        });
    };

    if (!show || !doc) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !signing && onClose()} />

            <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">{t('Signer et verrouiller le document')}</h3>
                        <p className="text-white/70 text-xs mt-0.5">{doc.title}</p>
                    </div>
                    <button onClick={() => !signing && onClose()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Warning message */}
                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            {t('En signant, le contenu du document sera verrouillé définitivement. Assurez-vous que le contenu est correct avant de signer.')}
                        </p>
                    </div>

                    {/* Document content preview */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Contenu du document')}</label>
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div
                                className="bg-white dark:bg-gray-900/50 px-6 py-5 prose prose-sm dark:prose-invert max-w-none"
                                style={{ maxHeight: 300, overflowY: 'auto' }}
                                dangerouslySetInnerHTML={{ __html: doc.body }}
                            />
                        </div>
                    </div>

                    {/* Signature pad */}
                    <div>
                        <SignaturePad
                            value={signatureData}
                            onChange={setSignatureData}
                            label={t('Votre signature')}
                            height={180}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={signing}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t('Annuler')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSign}
                        disabled={signing || !signatureData}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                    >
                        {signing ? (
                            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Signature...')}</>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                {t('Signer et verrouiller')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
