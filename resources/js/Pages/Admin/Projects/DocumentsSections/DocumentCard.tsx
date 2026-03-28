import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';

interface ProjectDocument {
    id: number;
    title: string;
    body: string;
    status: 'draft' | 'pending_admin_signature' | 'pending_client' | 'viewed' | 'countersigned' | 'rejected';
    template_name?: string;
    category?: string;
    rejection_reason?: string;
    admin_signature?: string | null;
    client_signature?: string | null;
    document_reference?: string | null;
    content_locked_at?: string | null;
    pdf_hash?: string | null;
    admin_signed_at?: string | null;
    client_signed_at?: string | null;
    admin_signed_ip?: string | null;
    client_signed_ip?: string | null;
    admin_signer_name?: string | null;
    client_signer_name?: string | null;
    created_at: string;
}

interface Project {
    id: number;
    nom_societe?: string;
    client?: { id: number; name: string; email?: string };
}

const categoryIcons: Record<string, string> = {
    legal: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    delivery: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    project: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
};

const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
    pending_admin_signature: { label: 'Signature admin', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    pending_client: { label: 'En attente client', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    viewed: { label: 'Consulté', color: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    countersigned: { label: 'Contresigné', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    rejected: { label: 'Refusé', color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' },
};

function isDocumentSigned(status: string): boolean {
    return ['pending_client', 'viewed', 'countersigned'].includes(status);
}

interface Props {
    document: ProjectDocument;
    project: Project;
    onSign: (doc: ProjectDocument) => void;
    onEdit: (doc: ProjectDocument) => void;
    onSend: (doc: ProjectDocument) => void;
    onDelete: (doc: ProjectDocument) => void;
}

export default function DocumentCard({ document: doc, project, onSign, onEdit, onSend, onDelete }: Props) {
    const { t } = useTranslation();
    const status = statusConfig[doc.status] || statusConfig.draft;
    const cat = doc.category || 'project';
    const signed = isDocumentSigned(doc.status);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    cat === 'legal' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400' :
                    cat === 'delivery' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400' :
                    'bg-teal-50 dark:bg-teal-500/10 text-teal-500 dark:text-teal-400'
                }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat] || categoryIcons.project} />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{doc.title}</h3>
                                {signed && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        {t('Contenu verrouillé')}
                                    </span>
                                )}
                                {doc.status === 'countersigned' && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {t('Signé par les deux parties')}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {doc.document_reference && (
                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-1.5 py-0.5 rounded">{doc.document_reference}</span>
                                )}
                                {doc.template_name && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{doc.template_name}</span>
                                )}
                                <span className="text-xs text-gray-300 dark:text-gray-600">
                                    {formatDate(doc.created_at)}
                                </span>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${status.color}`}>
                            {t(status.label)}
                        </span>
                    </div>

                    {/* Rejection reason */}
                    {doc.status === 'rejected' && doc.rejection_reason && (
                        <div className="bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2 mb-3">
                            <p className="text-xs text-red-600 dark:text-red-400">
                                <span className="font-bold">{t('Raison du refus')} :</span> {doc.rejection_reason}
                            </p>
                        </div>
                    )}

                    {/* Draft: HTML preview */}
                    {doc.status === 'draft' && (
                        <div className="mt-3 mb-3">
                            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div
                                    className="bg-gray-50 dark:bg-gray-900/50 px-5 py-4 prose prose-sm dark:prose-invert max-w-none"
                                    style={{ maxHeight: 250, overflowY: 'auto' }}
                                    dangerouslySetInnerHTML={{ __html: doc.body }}
                                />
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                {t('Une fois signé, le contenu sera verrouillé et ne pourra plus être modifié.')}
                            </p>
                        </div>
                    )}

                    {/* Signed documents: PDF iframe preview */}
                    {signed && (
                        <div className="mt-3 mb-3">
                            <iframe
                                src={`/admin/projects/${project.id}/documents/${doc.id}/pdf/preview`}
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                                style={{ height: 400 }}
                            />
                        </div>
                    )}

                    {/* Countersigned: Signature details */}
                    {doc.status === 'countersigned' && (
                        <div className="mt-3 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('Signature administrateur')}</p>
                                    {doc.admin_signer_name && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300">{t('Signataire')} : {doc.admin_signer_name}</p>
                                    )}
                                    {doc.admin_signed_at && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('Date')} : {formatDate(doc.admin_signed_at)}</p>
                                    )}
                                    {doc.admin_signed_ip && (
                                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">{t('IP')} : {doc.admin_signed_ip}</p>
                                    )}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('Signature client')}</p>
                                    {doc.client_signer_name && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300">{t('Signataire')} : {doc.client_signer_name}</p>
                                    )}
                                    {doc.client_signed_at && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('Date')} : {formatDate(doc.client_signed_at)}</p>
                                    )}
                                    {doc.client_signed_ip && (
                                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">{t('IP')} : {doc.client_signed_ip}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('Intégrité du document')}</p>
                                {doc.pdf_hash && (
                                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 break-all">{t('SHA-256')} : {doc.pdf_hash}</p>
                                )}
                                {doc.content_locked_at && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Contenu verrouillé le')} : {formatDate(doc.content_locked_at)}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {doc.status === 'draft' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onEdit(doc)}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                                    </svg>
                                    {t('Modifier')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSign(doc)}
                                    className="px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    {t('Signer et verrouiller')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(doc)}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    {t('Supprimer')}
                                </button>
                            </>
                        )}

                        {(doc.status === 'pending_client' || doc.status === 'viewed') && (
                            <>
                                <a
                                    href={`/admin/projects/${project.id}/documents/${doc.id}/pdf`}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    {t('Télécharger PDF')}
                                </a>
                                {doc.status === 'pending_client' && (
                                    <button
                                        type="button"
                                        onClick={() => onSend(doc)}
                                        className="px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors flex items-center gap-1.5"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                        {t('Envoyer')}
                                    </button>
                                )}
                            </>
                        )}

                        {doc.status === 'countersigned' && (
                            <a
                                href={`/admin/projects/${project.id}/documents/${doc.id}/pdf`}
                                className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                {t('Télécharger PDF')}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
