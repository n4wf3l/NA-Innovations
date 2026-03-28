import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface DocumentTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    body: string;
    available_variables: string[];
    requires_signature: boolean;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    templates: DocumentTemplate[];
}

const categoryColors: Record<string, string> = {
    legal: 'from-rose-500 to-pink-600',
    project: 'from-teal-500 to-emerald-600',
    delivery: 'from-blue-500 to-indigo-600',
};

const categoryIcons: Record<string, string> = {
    legal: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    project: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    delivery: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

export default function DocumentTemplates({ templates }: Props) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<DocumentTemplate | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', body: '', requires_signature: false });
    const [previewMode, setPreviewMode] = useState(false);
    const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});

    const categoryLabels: Record<string, string> = {
        legal: t('Juridique'),
        project: t('Projet'),
        delivery: t('Livraison'),
    };

    const openEditor = (tpl: DocumentTemplate) => {
        setEditing(tpl);
        setEditForm({ name: tpl.name, body: tpl.body, requires_signature: tpl.requires_signature });
        setPreviewMode(false);
    };

    const closeEditor = () => { setEditing(null); };

    const refreshIframe = (id: number) => {
        const iframe = iframeRefs.current[id];
        if (iframe) {
            const src = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = src; }, 50);
        }
    };

    const handleSave = () => {
        if (!editing) return;
        setSaving(true);
        const editingId = editing.id;
        router.put(`/admin/settings/document-templates/${editing.id}`, editForm, {
            onFinish: () => setSaving(false),
            onSuccess: () => {
                closeEditor();
                setTimeout(() => refreshIframe(editingId), 300);
            },
            preserveScroll: true,
        });
    };

    const handleToggle = (tpl: DocumentTemplate) => {
        router.patch(`/admin/settings/document-templates/${tpl.id}/toggle`, {}, { preserveScroll: true });
    };

    const grouped = templates.reduce<Record<string, DocumentTemplate[]>>((acc, tpl) => {
        const cat = tpl.category || 'project';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tpl);
        return acc;
    }, {});

    const categoryOrder = ['legal', 'project', 'delivery'];
    const sortedCategories = Object.entries(grouped).sort(
        ([a], [b]) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
    );

    return (
        <AdminLayout title={t('Settings')} header={t('Settings')}>
            <Head title={t('Modèles de documents')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <p className="text-teal-200 text-xs font-medium tracking-wider uppercase mb-1">{t('Système')} / {t('Settings')}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Modèles de documents')}</h1>
                    <p className="text-teal-200 text-sm">{t('Gérez les modèles utilisés pour générer les documents projet (contrats, NDA, PV, etc.).')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end mb-6">
                <p className="text-sm text-gray-400 dark:text-gray-500">{templates.length} {t('modèles')}</p>
            </div>

            {/* Template cards by category */}
            <div className="space-y-10">
                {sortedCategories.map(([category, tpls]) => (
                    <div key={category}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[category] || categoryColors.project} flex items-center justify-center flex-shrink-0`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[category] || categoryIcons.project} />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{categoryLabels[category] || category}</h2>
                            <span className="text-xs text-gray-400 dark:text-gray-500">({tpls.length})</span>
                        </div>

                        <div className="space-y-6">
                            {tpls.map(tpl => (
                                <div
                                    key={tpl.id}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                                        tpl.is_active
                                            ? 'border-gray-100 dark:border-gray-700'
                                            : 'border-gray-100 dark:border-gray-700 opacity-50'
                                    }`}
                                >
                                    {/* Color bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${categoryColors[category] || categoryColors.project}`} />

                                    <div className="p-6">
                                        {/* Header row: name, slug, badges, toggle */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{tpl.name}</h3>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{tpl.slug}</span>
                                                </div>
                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        category === 'legal' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                        category === 'delivery' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                        'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                                    }`}>
                                                        {categoryLabels[category] || category}
                                                    </span>
                                                    {tpl.requires_signature && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                            </svg>
                                                            {t('Signature requise')}
                                                        </span>
                                                    )}
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        tpl.is_active
                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {tpl.is_active ? t('Actif') : t('Inactif')}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Active toggle */}
                                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                                                <input
                                                    type="checkbox"
                                                    checked={tpl.is_active}
                                                    onChange={() => handleToggle(tpl)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500" />
                                            </label>
                                        </div>

                                        {/* PDF Preview */}
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Aperçu PDF')}</p>
                                            <iframe
                                                ref={el => { iframeRefs.current[tpl.id] = el; }}
                                                src={`/admin/settings/document-templates/${tpl.id}/preview`}
                                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                                                style={{ height: 500 }}
                                                title={tpl.name}
                                            />
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => openEditor(tpl)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                                {t('Modifier le contenu')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => refreshIframe(tpl.id)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                                </svg>
                                                {t('Actualiser l\'aperçu')}
                                            </button>
                                        </div>

                                        {/* Variables */}
                                        {Array.isArray(tpl.available_variables) && tpl.available_variables.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Variables disponibles')}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {tpl.available_variables.map(v => (
                                                        <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">{`{{ ${v} }}`}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {templates.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('Aucun modèle')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Aucun modèle de document configuré.')}</p>
                </div>
            )}

            {/* Editor Modal */}
            {editing && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !saving && closeEditor()} />

                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                        {/* Header */}
                        <div className={`px-6 py-4 bg-gradient-to-r ${categoryColors[editing.category] || categoryColors.project} rounded-t-2xl flex items-center justify-between`}>
                            <div>
                                <h3 className="text-lg font-bold text-white">{editing.name}</h3>
                                <p className="text-white/70 text-xs font-mono mt-0.5">{editing.slug}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Preview toggle */}
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        previewMode
                                            ? 'bg-white text-gray-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    {previewMode ? t('Modifier') : t('Aperçu')}
                                </button>
                                <button onClick={() => !saving && closeEditor()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Template name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Nom')}</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            {/* Available variables */}
                            {Array.isArray(editing.available_variables) && editing.available_variables.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Variables disponibles')}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {editing.available_variables.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => {
                                                    setEditForm(f => ({ ...f, body: f.body + `{{ ${v} }}` }));
                                                }}
                                                className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors cursor-pointer border border-teal-200 dark:border-teal-500/20"
                                                title={t('Cliquer pour insérer')}
                                            >
                                                {`{{ ${v} }}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body -- editor or preview */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    {previewMode ? t('Aperçu') : t('Contenu du document')}
                                </label>
                                {previewMode ? (
                                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="bg-gray-100 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-gray-800 px-8 py-6 prose prose-sm dark:prose-invert max-w-none"
                                            style={{ minHeight: 200 }}
                                            dangerouslySetInnerHTML={{ __html: editForm.body }}
                                        />
                                    </div>
                                ) : (
                                    <RichTextEditor
                                        value={editForm.body}
                                        onChange={body => setEditForm(f => ({ ...f, body }))}
                                        placeholder={t('Rédigez le contenu du template ici...')}
                                        minHeight={300}
                                    />
                                )}
                            </div>

                            {/* Requires signature toggle */}
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.requires_signature}
                                        onChange={e => setEditForm(f => ({ ...f, requires_signature: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                                </label>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Signature requise')}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={saving}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                            >
                                {saving ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Enregistrement...')}</>
                                ) : t('Enregistrer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
