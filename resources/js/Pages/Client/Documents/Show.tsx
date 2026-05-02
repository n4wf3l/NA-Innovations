import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SignaturePad from '@/Components/ui/SignaturePad';

interface ProjectDocument {
    id: number;
    project_id: number;
    document_reference: string;
    title: string;
    status: string;
    locale: string;
    admin_signed_by: number | null;
    admin_signature_data: string | null;
    admin_signed_at: string | null;
    client_signed_by: number | null;
    client_signature_data: string | null;
    client_signed_at: string | null;
    rejection_reason: string | null;
    sent_at: string | null;
    viewed_at: string | null;
    created_at: string;
    updated_at: string;
    template?: {
        id: number;
        name: string;
        category: string;
    } | null;
    admin_signer?: {
        id: number;
        name: string;
    } | null;
    client_signer?: {
        id: number;
        name: string;
    } | null;
    project: {
        id: number;
        nom_societe: string;
        client?: {
            id: number;
            name: string;
        };
    };
}

interface Props {
    document: ProjectDocument;
    pdfPreviewUrl: string;
}

export default function ClientDocumentShow({ document: doc, pdfPreviewUrl }: Props) {
    const { t } = useTranslation();
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [signing, setSigning] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejecting, setRejecting] = useState(false);
    const [showRejectSection, setShowRejectSection] = useState(false);
    const signatureSectionRef = useRef<HTMLDivElement>(null);

    const needsAction = ['pending_client', 'viewed'].includes(doc.status);

    const handleSign = () => {
        if (!signatureData) return;
        setSigning(true);
        router.post(`/client/documents/${doc.id}/sign`, {
            signature_data: signatureData,
        }, {
            onFinish: () => setSigning(false),
        });
    };

    const handleReject = () => {
        if (!rejectReason.trim()) return;
        setRejecting(true);
        router.post(`/client/documents/${doc.id}/reject`, {
            reason: rejectReason,
        }, {
            onSuccess: () => {
                setRejectReason('');
                setShowRejectSection(false);
            },
            onFinish: () => setRejecting(false),
        });
    };

    const scrollToSignature = () => {
        signatureSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <ClientLayout title={doc.title}>
            <Head title={doc.title} />

            {/* Back link */}
            <Link
                href={`/client/projects/${doc.project.id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-4"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {t('Retour au projet')}
            </Link>

            {/* Action banner - pending_client or viewed */}
            {needsAction && (
                <div className="mb-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-white">{t('Ce document nécessite votre signature')}</h4>
                            <p className="text-teal-100 text-sm mt-1">{t('Lisez le document ci-dessous puis signez en bas de page')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectSection(true);
                                    scrollToSignature();
                                }}
                                className="px-5 py-2.5 border-2 border-red-300 text-white hover:bg-red-500/20 text-sm font-bold rounded-xl transition-colors"
                            >
                                {t('Refuser')}
                            </button>
                            <button
                                onClick={scrollToSignature}
                                className="px-5 py-2.5 bg-white text-teal-700 hover:bg-teal-50 text-sm font-bold rounded-xl transition-colors"
                            >
                                {t('Signer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document info card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
                <div className="px-6 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Référence */}
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t('Référence')}</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{doc.document_reference}</span>
                        </div>

                        {/* Créé le */}
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t('Créé le')}</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(doc.created_at)}</span>
                        </div>

                        {/* Signé par l'agence */}
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t('Signé par l\'agence')}</span>
                            <div className="flex items-center gap-1.5">
                                {doc.admin_signed_at ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{doc.admin_signer?.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 block">{formatDate(doc.admin_signed_at)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('En attente')}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Signé par vous */}
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t('Signé par vous')}</span>
                            <div className="flex items-center gap-1.5">
                                {doc.client_signed_at ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{doc.client_signer?.name}</span>
                                            {doc.client_signed_at && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">{formatDate(doc.client_signed_at)}</span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('En attente')}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countersigned banner */}
            {doc.status === 'countersigned' && (
                <div className="mb-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-green-900 dark:text-green-300">{t('Document signé par les deux parties')}</h4>
                                <div className="flex flex-wrap gap-4 mt-1 text-xs text-green-700 dark:text-green-400/70">
                                    {doc.admin_signer && doc.admin_signed_at && (
                                        <span>{doc.admin_signer.name} - {formatDate(doc.admin_signed_at)}</span>
                                    )}
                                    {doc.client_signer && doc.client_signed_at && (
                                        <span>{doc.client_signer.name} - {formatDate(doc.client_signed_at)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <a
                            href={`/client/documents/${doc.id}/pdf`}
                            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {t('Télécharger PDF')}
                        </a>
                    </div>
                </div>
            )}

            {/* Rejected banner */}
            {doc.status === 'rejected' && (
                <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-900 dark:text-red-300">{t('Document refusé')}</h4>
                                {doc.rejection_reason && (
                                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">{doc.rejection_reason}</p>
                                )}
                            </div>
                        </div>
                        <a
                            href={`/client/documents/${doc.id}/pdf`}
                            className="px-5 py-2.5 border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {t('Télécharger PDF')}
                        </a>
                    </div>
                </div>
            )}

            {/* PDF Preview - THE MAIN CONTENT */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('Document')}</h3>
                    <a
                        href={`/client/documents/${doc.id}/pdf`}
                        className="text-xs text-teal-500 hover:text-teal-600 font-medium flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        {t('Télécharger')}
                    </a>
                </div>
                <iframe
                    src={pdfPreviewUrl}
                    className="w-full bg-gray-100 dark:bg-gray-900"
                    style={{ height: '80vh', minHeight: 600 }}
                    title={doc.title}
                />
            </div>

            {/* Signature section (if action needed) */}
            {needsAction && (
                <div id="signature-section" ref={signatureSectionRef} className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Signer ce document')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Dessinez votre signature ci-dessous pour valider ce document')}</p>
                        </div>
                        <div className="p-6">
                            <SignaturePad
                                value={signatureData}
                                onChange={setSignatureData}
                                label={t('Votre signature')}
                                height={180}
                            />
                            <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={handleSign}
                                    disabled={!signatureData || signing}
                                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                    {signing ? t('Signature en cours...') : t('Confirmer ma signature')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Collapsible reject section */}
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowRejectSection(!showRejectSection)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">{t('Refuser ce document')}</span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${showRejectSection ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {showRejectSection && (
                            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder={t('Indiquez la raison du refus...')}
                                    rows={4}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                                    autoFocus
                                />
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        onClick={handleReject}
                                        disabled={!rejectReason.trim() || rejecting}
                                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
                                    >
                                        {rejecting ? t('Envoi...') : t('Confirmer le refus')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ClientLayout>
    );
}
