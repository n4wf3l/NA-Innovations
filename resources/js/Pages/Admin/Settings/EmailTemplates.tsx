import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';
import LocalePicker from '@/Components/ui/LocalePicker';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    locale: string;
    subject: string;
    body: string;
    available_variables: string[];
    category: string;
    is_active: boolean;
}

interface Props {
    templates: EmailTemplate[];
}

const categoryColors: Record<string, string> = {
    lead: 'from-rose-500 to-pink-600',
    quote: 'from-amber-500 to-orange-500',
    invoice: 'from-blue-500 to-indigo-600',
    general: 'from-gray-500 to-gray-600',
};

const categoryIcons: Record<string, string> = {
    lead: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    quote: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    invoice: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
    general: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
};

export default function EmailTemplates({ templates }: Props) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<EmailTemplate | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', subject: '', body: '', is_active: true });
    const [previewMode, setPreviewMode] = useState(false);

    const openEditor = (tpl: EmailTemplate) => {
        setEditing(tpl);
        setEditForm({ name: tpl.name, subject: tpl.subject, body: tpl.body, is_active: tpl.is_active });
        setPreviewMode(false);
    };

    const closeEditor = () => { setEditing(null); };

    const handleSave = () => {
        if (!editing) return;
        setSaving(true);
        router.put(`/admin/settings/email-templates/${editing.id}`, editForm, {
            onFinish: () => setSaving(false),
            onSuccess: () => closeEditor(),
            preserveScroll: true,
        });
    };

    const [filterLocale, setFilterLocale] = useState('fr');

    const handleToggle = (tpl: EmailTemplate) => {
        router.patch(`/admin/settings/email-templates/${tpl.id}/toggle`, {}, { preserveScroll: true });
    };

    const filtered = templates.filter(tpl => tpl.locale === filterLocale);

    const grouped = filtered.reduce<Record<string, EmailTemplate[]>>((acc, tpl) => {
        const cat = tpl.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tpl);
        return acc;
    }, {});

    const categoryLabels: Record<string, string> = {
        lead: t('Leads'),
        quote: t('Quotes'),
        invoice: t('Invoices'),
        general: t('System'),
    };

    return (
        <AdminLayout title={t('Settings')} header={t('Settings')}>
            <Head title={t('Email Templates')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <p className="text-violet-200 text-xs font-medium tracking-wider uppercase mb-1">{t('System')} / {t('Settings')}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Email Templates')}</h1>
                    <p className="text-violet-200 text-sm">{t('Customize the emails sent to clients, partners and your team.')}</p>
                </div>
            </div>

            {/* Language filter */}
            <div className="flex items-center justify-between mb-6">
                <LocalePicker value={filterLocale} onChange={setFilterLocale} label={t('Language')} />
                <p className="text-sm text-gray-400 dark:text-gray-500">{filtered.length} {t('results')}</p>
            </div>

            {/* Template cards by category */}
            <div className="space-y-8">
                {Object.entries(grouped).map(([category, tpls]) => (
                    <div key={category}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[category] || categoryColors.general} flex items-center justify-center flex-shrink-0`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[category] || categoryIcons.general} />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{categoryLabels[category] || category}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {tpls.map(tpl => (
                                <div
                                    key={tpl.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md group ${
                                        tpl.is_active
                                            ? 'border-gray-100 dark:border-gray-700'
                                            : 'border-gray-100 dark:border-gray-700 opacity-50'
                                    }`}
                                >
                                    {/* Color bar */}
                                    <div className={`h-1 bg-gradient-to-r ${categoryColors[category] || categoryColors.general}`} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{tpl.name}</h3>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{tpl.slug} <span className="text-[10px] font-bold uppercase ml-1 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{tpl.locale}</span></p>
                                            </div>
                                            {/* Active toggle */}
                                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
                                                <input
                                                    type="checkbox"
                                                    checked={tpl.is_active}
                                                    onChange={() => handleToggle(tpl)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-violet-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500" />
                                            </label>
                                        </div>

                                        {/* Subject preview */}
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 mb-3">
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('Subject')}</p>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{tpl.subject}</p>
                                        </div>

                                        {/* Variables */}
                                        {Array.isArray(tpl.available_variables) && tpl.available_variables.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {tpl.available_variables.map(v => (
                                                    <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">{`{{ ${v} }}`}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Edit button */}
                                        <button
                                            type="button"
                                            onClick={() => openEditor(tpl)}
                                            className="w-full py-2.5 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            {t('Edit')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Editor Modal */}
            {editing && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !saving && closeEditor()} />

                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                        {/* Header */}
                        <div className={`px-6 py-4 bg-gradient-to-r ${categoryColors[editing.category] || categoryColors.general} rounded-t-2xl flex items-center justify-between`}>
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
                                    {previewMode ? t('Edit') : t('Preview')}
                                </button>
                                <button onClick={() => !saving && closeEditor()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Template name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Name')}</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-400"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Subject')}</label>
                                <input
                                    type="text"
                                    value={editForm.subject}
                                    onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-400"
                                />
                            </div>

                            {/* Available variables */}
                            {Array.isArray(editing.available_variables) && editing.available_variables.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Available Variables')}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {editing.available_variables.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => {
                                                    setEditForm(f => ({ ...f, body: f.body + `{{ ${v} }}` }));
                                                }}
                                                className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors cursor-pointer border border-violet-200 dark:border-violet-500/20"
                                                title={t('Click to insert')}
                                            >
                                                {`{{ ${v} }}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body — editor or preview */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    {previewMode ? t('Preview') : t('Email Body')}
                                </label>
                                {previewMode ? (
                                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        {/* Email preview chrome */}
                                        <div className="bg-gray-100 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">{t('Subject')}:</span> {editForm.subject}
                                            </p>
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
                                        placeholder={t('Write your email content here...')}
                                        minHeight={300}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between rounded-b-2xl">
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_active}
                                        onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500" />
                                </label>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{editForm.is_active ? t('Active') : t('Inactive')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    disabled={saving}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                                >
                                    {saving ? (
                                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Saving...')}</>
                                    ) : t('Save Changes')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
