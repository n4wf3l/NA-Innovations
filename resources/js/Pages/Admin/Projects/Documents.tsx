import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';
import { formatDate } from '@/lib/utils';
import { useConfirm } from '@/hooks/useConfirm';

import DocumentCard from './DocumentsSections/DocumentCard';
import GenerateModal from './DocumentsSections/GenerateModal';
import SignatureModal from './DocumentsSections/SignatureModal';

interface DocumentTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    body: string;
    available_variables: string[];
    requires_signature: boolean;
    is_active: boolean;
}

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

interface Client {
    id: number;
    name: string;
    email?: string;
}

interface Project {
    id: number;
    nom_societe?: string;
    client?: Client;
}

interface Props {
    project: Project;
    documents: ProjectDocument[];
    templates: DocumentTemplate[];
}

export default function Documents({ project, documents, templates }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showSignModal, setShowSignModal] = useState<ProjectDocument | null>(null);
    const [showEditModal, setShowEditModal] = useState<ProjectDocument | null>(null);
    const [saving, setSaving] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({ title: '', body: '' });

    const openGenerateModal = () => {
        setShowGenerateModal(true);
    };

    const closeGenerateModal = () => {
        setShowGenerateModal(false);
    };

    const openSignModal = (doc: ProjectDocument) => {
        setShowSignModal(doc);
    };

    const closeSignModal = () => { setShowSignModal(null); };

    const openEditModal = (doc: ProjectDocument) => {
        setEditForm({ title: doc.title, body: doc.body });
        setShowEditModal(doc);
    };

    const closeEditModal = () => { setShowEditModal(null); };

    const handleSaveEdit = () => {
        if (!showEditModal) return;
        setSaving(true);
        router.put(`/admin/projects/${project.id}/documents/${showEditModal.id}`, editForm, {
            onFinish: () => setSaving(false),
            onSuccess: () => closeEditModal(),
            preserveScroll: true,
        });
    };

    const handleDelete = async (doc: ProjectDocument) => {
        const ok = await confirm({
            title: t('Supprimer'),
            message: t('Êtes-vous sûr de vouloir supprimer ce document ?'),
            confirmText: t('Supprimer'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/projects/${project.id}/documents/${doc.id}`, { preserveScroll: true });
    };

    const handleSendToClient = (doc: ProjectDocument) => {
        router.post(`/admin/projects/${project.id}/documents/${doc.id}/send`, {}, { preserveScroll: true });
    };

    const handleRequestResign = (doc: ProjectDocument) => {
        const reason = window.prompt(t('Motif de la re-signature (obligatoire) :'));
        if (!reason || !reason.trim()) return;
        router.post(`/admin/projects/${project.id}/documents/${doc.id}/request-resign`, { reason: reason.trim() }, { preserveScroll: true });
    };

    return (
        <AdminLayout title={project.nom_societe || t('Projet')} header={t('Documents du projet')}>
            <Head title={`${t('Documents')} - ${project.nom_societe || t('Projet')}`} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <div className="flex items-center gap-2 text-teal-200 text-xs font-medium tracking-wider uppercase mb-1">
                        <Link href="/admin/projects" className="hover:text-white transition-colors">{t('Projets')}</Link>
                        <span>/</span>
                        <Link href={`/admin/projects/${project.id}`} className="hover:text-white transition-colors">{project.nom_societe}</Link>
                        <span>/</span>
                        <span>{t('Documents')}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Documents du projet')}</h1>
                    <p className="text-teal-200 text-sm">{project.nom_societe}{project.client ? ` — ${project.client.name}` : ''}</p>
                </div>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between mb-6">
                <Link href={`/admin/projects/${project.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    {t('Retour au projet')}
                </Link>
                <button
                    type="button"
                    onClick={openGenerateModal}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    {t('Générer un document')}
                </button>
            </div>

            {/* Document list */}
            {documents.length > 0 ? (
                <div className="space-y-4">
                    {documents.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            project={project}
                            onSign={openSignModal}
                            onEdit={openEditModal}
                            onSend={handleSendToClient}
                            onDelete={handleDelete}
                            onRequestResign={handleRequestResign}
                        />
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('Aucun document')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('Aucun document n\'a encore été généré pour ce projet.')}</p>
                    <button
                        type="button"
                        onClick={openGenerateModal}
                        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98] inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Générer un document')}
                    </button>
                </div>
            )}

            {/* Generate Document Modal */}
            <GenerateModal
                show={showGenerateModal}
                onClose={closeGenerateModal}
                templates={templates}
                project={project}
            />

            {/* Edit Document Modal */}
            {showEditModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !saving && closeEditModal()} />

                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">{t('Modifier le document')}</h3>
                                <p className="text-white/70 text-xs mt-0.5">{showEditModal.title}</p>
                            </div>
                            <button onClick={() => !saving && closeEditModal()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Titre du document')}</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Contenu du document')}</label>
                                <RichTextEditor
                                    value={editForm.body}
                                    onChange={body => setEditForm(f => ({ ...f, body }))}
                                    placeholder={t('Contenu du document...')}
                                    minHeight={300}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={saving}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={saving || !editForm.title.trim()}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                            >
                                {saving ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Enregistrement...')}</>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {t('Enregistrer')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Sign Modal */}
            <SignatureModal
                show={!!showSignModal}
                onClose={closeSignModal}
                document={showSignModal}
                project={project}
            />
            <ConfirmDialog />
        </AdminLayout>
    );
}
