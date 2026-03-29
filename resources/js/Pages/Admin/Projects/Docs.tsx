import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useConfirm } from '@/hooks/useConfirm';
import { formatDate } from '@/lib/utils';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface ProjectDoc {
    id: number;
    title: string;
    content: string;
    category: string | null;
    is_client_visible: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    author?: { id: number; name: string };
}

interface Props {
    project: { id: number; nom_societe: string };
    docs: ProjectDoc[];
}

const categoryColors: Record<string, string> = {
    architecture: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    api: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    deployment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    database: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    setup: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const categoryLabels: Record<string, string> = {
    architecture: 'Architecture',
    api: 'API',
    deployment: 'Deployment',
    database: 'Database',
    setup: 'Setup',
    other: 'Other',
};

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';

export default function ProjectDocs({ project, docs }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState<ProjectDoc | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const form = useForm({
        title: '',
        content: '',
        category: 'other',
        is_client_visible: false,
    });

    function openCreate() {
        setEditingDoc(null);
        form.reset();
        form.setData({ title: '', content: '', category: 'other', is_client_visible: false });
        setShowModal(true);
    }

    function openEdit(doc: ProjectDoc) {
        setEditingDoc(doc);
        form.setData({
            title: doc.title,
            content: doc.content,
            category: doc.category || 'other',
            is_client_visible: doc.is_client_visible,
        });
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingDoc) {
            form.put(`/admin/project-docs/${editingDoc.id}`, {
                preserveScroll: true,
                onSuccess: () => { setShowModal(false); form.reset(); setEditingDoc(null); },
            });
        } else {
            form.post(`/admin/projects/${project.id}/docs`, {
                preserveScroll: true,
                onSuccess: () => { setShowModal(false); form.reset(); },
            });
        }
    }

    function handleToggle(doc: ProjectDoc) {
        router.patch(`/admin/project-docs/${doc.id}/toggle`, {}, { preserveScroll: true });
    }

    async function handleDelete(doc: ProjectDoc) {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this documentation?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/project-docs/${doc.id}`, { preserveScroll: true });
    }

    // Group docs by category
    const grouped: Record<string, ProjectDoc[]> = {};
    docs.forEach(doc => {
        const cat = doc.category || 'other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(doc);
    });

    const categoryOrder = ['architecture', 'api', 'deployment', 'database', 'setup', 'other'];
    const sortedCategories = categoryOrder.filter(c => grouped[c]);

    return (
        <AdminLayout title={`${t('Documentation')} - ${project.nom_societe}`} header={t('Technical Documentation')}>
            <Head title={`${t('Documentation')} - ${project.nom_societe}`} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/admin/projects" className="hover:text-gray-700 dark:hover:text-gray-200">{t('Projects')}</Link>
                    <span>/</span>
                    <Link href={`/admin/projects/${project.id}`} className="hover:text-gray-700 dark:hover:text-gray-200">{project.nom_societe}</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">{t('Documentation')}</span>
                </div>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    {t('Add Documentation')}
                </button>
            </div>

            {/* Docs list grouped by category */}
            {docs.length === 0 ? (
                <div className={`${card} px-6 py-16 text-center`}>
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-14.524A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.524v14.524" /></svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('No documentation yet')}</p>
                    <button onClick={openCreate} className="mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                        {t('Add your first documentation')}
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedCategories.map(cat => (
                        <div key={cat}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${categoryColors[cat] || categoryColors.other}`}>
                                    {t(categoryLabels[cat] || cat)}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">({grouped[cat].length})</span>
                            </div>
                            <div className="space-y-3">
                                {grouped[cat].map(doc => (
                                    <div key={doc.id} className={card}>
                                        <div className="px-6 py-4 flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                                                    className="text-left w-full"
                                                >
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                        {doc.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        {doc.author && (
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                {doc.author.name}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {formatDate(doc.updated_at)}
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {/* Visibility toggle */}
                                                <button
                                                    onClick={() => handleToggle(doc)}
                                                    title={doc.is_client_visible ? t('Visible to client') : t('Hidden from client')}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        doc.is_client_visible
                                                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {doc.is_client_visible ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                    )}
                                                </button>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => openEdit(doc)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                    title={t('Edit')}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(doc)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                    title={t('Delete')}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Expanded content */}
                                        {expandedId === doc.id && (
                                            <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                                                <div
                                                    className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                                    dangerouslySetInnerHTML={{ __html: doc.content }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingDoc ? t('Edit Documentation') : t('Add Documentation')}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('Title')}</label>
                                <input
                                    type="text"
                                    value={form.data.title}
                                    onChange={e => form.setData('title', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
                                    placeholder={t('Documentation title')}
                                    required
                                />
                                {form.errors.title && <p className="text-xs text-red-500 mt-1">{form.errors.title}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('Category')}</label>
                                <select
                                    value={form.data.category}
                                    onChange={e => form.setData('category', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
                                >
                                    <option value="architecture">{t('Architecture')}</option>
                                    <option value="api">{t('API')}</option>
                                    <option value="deployment">{t('Deployment')}</option>
                                    <option value="database">{t('Database')}</option>
                                    <option value="setup">{t('Setup')}</option>
                                    <option value="other">{t('Other')}</option>
                                </select>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('Content')}</label>
                                <RichTextEditor
                                    value={form.data.content}
                                    onChange={val => form.setData('content', val)}
                                    placeholder={t('Write your documentation here...')}
                                    minHeight={300}
                                />
                                {form.errors.content && <p className="text-xs text-red-500 mt-1">{form.errors.content}</p>}
                            </div>

                            {/* Visible to client toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Visible to client')}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('When enabled, the client can view this documentation')}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => form.setData('is_client_visible', !form.data.is_client_visible)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        form.data.is_client_visible ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        form.data.is_client_visible ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                                >
                                    {form.processing ? t('Saving...') : editingDoc ? t('Update') : t('Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            <ConfirmDialog />
        </AdminLayout>
    );
}
