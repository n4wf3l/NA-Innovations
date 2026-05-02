import AdminLayout from '@/Layouts/AdminLayout';
import AdminManagementTabs from '@/Components/Admin/AdminManagementTabs';
import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
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

interface SignatureData {
    enabled: string;
    logo_path: string;
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    linkedin: string;
    instagram: string;
    github: string;
    color: string;
}

interface Props {
    templates: EmailTemplate[];
    signature: SignatureData;
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

const EMAIL_FLOWS = [
    { section: 'Guests (non-connected visitors)', rows: [
        { trigger: 'Contact form submitted', recipient: 'Guest', template: 'contact-confirmation', type: 'transactional' },
        { trigger: 'Quote request submitted', recipient: 'Guest', template: 'quote-request-confirmation', type: 'transactional' },
        { trigger: 'Price simulator submitted', recipient: 'Guest', template: 'simulator-confirmation', type: 'transactional' },
        { trigger: 'Contact form received', recipient: 'Admin', template: 'contact-form-admin', type: 'transactional' },
        { trigger: 'Lead outreach by partner', recipient: 'Prospect', template: 'partner-lead-outreach', type: 'transactional' },
        { trigger: 'Lead submitted by partner', recipient: 'Prospect', template: 'lead-confirmation', type: 'transactional' },
    ]},
    { section: 'Clients', rows: [
        { trigger: 'Client account created', recipient: 'Client', template: 'client-welcome', type: 'transactional' },
        { trigger: 'Quote sent', recipient: 'Client', template: 'quote-sent', type: 'transactional' },
        { trigger: 'Invoice sent', recipient: 'Client', template: 'invoice-sent', type: 'transactional' },
        { trigger: 'Payment received', recipient: 'Client', template: 'payment-received', type: 'transactional' },
        { trigger: 'Invoice overdue (CRON)', recipient: 'Client', template: 'invoice-overdue', type: 'transactional' },
        { trigger: 'Project status changed', recipient: 'Client', template: 'project-status-update', type: 'informational' },
        { trigger: 'Project completed', recipient: 'Client', template: 'project-completed', type: 'informational' },
        { trigger: 'Legal document sent', recipient: 'Client', template: 'document-sent', type: 'transactional' },
    ]},
    { section: 'Partners', rows: [
        { trigger: 'Account approved', recipient: 'Partner', template: 'account-approved', type: 'transactional' },
        { trigger: 'Account rejected', recipient: 'Partner', template: 'account-rejected', type: 'transactional' },
        { trigger: 'Registration confirmed', recipient: 'Partner', template: 'registration-confirmation', type: 'transactional' },
        { trigger: 'Commission earned', recipient: 'Partner', template: 'commission-earned', type: 'informational' },
    ]},
    { section: 'Developers', rows: [
        { trigger: 'Account approved', recipient: 'Dev', template: 'account-approved', type: 'transactional' },
        { trigger: 'Client comment on project', recipient: 'Dev', template: 'client-comment', type: 'informational' },
    ]},
    { section: 'Admins', rows: [
        { trigger: 'Quote accepted by client', recipient: 'Admins', template: 'admin-quote-accepted', type: 'transactional' },
        { trigger: 'Quote rejected by client', recipient: 'Admins', template: 'admin-quote-rejected', type: 'transactional' },
        { trigger: 'Quote viewed by client', recipient: 'Admins', template: 'quote-viewed-admin', type: 'informational' },
        { trigger: 'New registration pending', recipient: 'Admins', template: 'registration-pending-admin', type: 'informational' },
        { trigger: 'Client comment on project', recipient: 'Admins', template: 'client-comment', type: 'informational' },
        { trigger: 'New lead from partner', recipient: 'Admins', template: 'new-lead-admin', type: 'informational' },
    ]},
];

export default function EmailTemplates({ templates, signature }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'templates' | 'signature'>('templates');
    const [showOverview, setShowOverview] = useState(false);
    const [editing, setEditing] = useState<EmailTemplate | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', subject: '', body: '', is_active: true });
    const [previewMode, setPreviewMode] = useState(false);

    // Signature state
    const [sigForm, setSigForm] = useState<SignatureData>(signature);
    const [sigSaving, setSigSaving] = useState(false);
    const [sigUploading, setSigUploading] = useState(false);
    const sigFileRef = useRef<HTMLInputElement>(null);

    const updateSig = (key: keyof SignatureData, value: string) => setSigForm(prev => ({ ...prev, [key]: value }));
    const saveSig = () => { setSigSaving(true); router.put('/admin/settings/email-signature', sigForm, { preserveScroll: true, onFinish: () => setSigSaving(false) }); };
    const uploadSigLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setSigUploading(true); const fd = new FormData(); fd.append('logo', f); router.post('/admin/settings/email-signature/logo', fd, { preserveScroll: true, onFinish: () => setSigUploading(false) }); };
    const deleteSigLogo = () => router.delete('/admin/settings/email-signature/logo', { preserveScroll: true });
    const sigLogoUrl = sigForm.logo_path ? (sigForm.logo_path.startsWith('http') ? sigForm.logo_path : `/storage/${sigForm.logo_path}`) : null;

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

            <AdminManagementTabs active="emails" />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <p className="text-violet-200 text-xs font-medium tracking-wider uppercase mb-1">{t('System')} / {t('Settings')}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Email Templates')}</h1>
                        <p className="text-violet-200 text-sm">{t('Customize the emails sent to clients, partners and your team.')}</p>
                    </div>
                    <button
                        onClick={() => setShowOverview(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
                        {t('Email Overview')}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                <button onClick={() => setActiveTab('templates')} className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'templates' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t('Modèles')}
                </button>
                <button onClick={() => setActiveTab('signature')} className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'signature' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t('Signature')}
                    <span className={`w-2 h-2 rounded-full ${sigForm.enabled === '1' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                </button>
            </div>

            {activeTab === 'templates' && (<div key="templates" className="animate-tab-in"><>
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

                            {/* Body - editor or preview */}
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
            {/* Email Overview Modal */}
            </></div>)}

            {/* Tab: Signature */}
            {activeTab === 'signature' && (
                <div key="signature" className="animate-tab-in">
                <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="space-y-5">
                        {/* Toggle */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Signature active')}</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('Ajoutée automatiquement à tous les emails.')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={sigForm.enabled === '1'} onChange={e => updateSig('enabled', e.target.checked ? '1' : '0')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                            </label>
                        </div>

                        {/* Logo */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">{t('Logo')}</h3>
                            <div className="flex items-center gap-4">
                                {sigLogoUrl ? (
                                    <div className="relative group">
                                        <img src={sigLogoUrl} alt="Logo" className="h-14 w-auto rounded-lg border border-gray-200 dark:border-gray-600 object-contain bg-white p-1" />
                                        <button onClick={deleteSigLogo} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                ) : (
                                    <div className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z" /></svg>
                                    </div>
                                )}
                                <div>
                                    <input ref={sigFileRef} type="file" accept="image/*" onChange={uploadSigLogo} className="hidden" />
                                    <button onClick={() => sigFileRef.current?.click()} disabled={sigUploading} className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
                                        {sigUploading ? t('Upload...') : t('Changer le logo')}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1">PNG/SVG, 200×60px</p>
                                </div>
                            </div>
                        </div>

                        {/* Info fields */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Informations')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Nom')}</label><input type="text" value={sigForm.name} onChange={e => updateSig('name', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Titre')}</label><input type="text" value={sigForm.title} onChange={e => updateSig('title', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                            </div>
                            <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Entreprise')}</label><input type="text" value={sigForm.company} onChange={e => updateSig('company', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Téléphone')}</label><input type="text" value={sigForm.phone} onChange={e => updateSig('phone', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Email')}</label><input type="email" value={sigForm.email} onChange={e => updateSig('email', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Site web')}</label><input type="text" value={sigForm.website} onChange={e => updateSig('website', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Adresse')}</label><input type="text" value={sigForm.address} onChange={e => updateSig('address', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">LinkedIn</label><input type="url" value={sigForm.linkedin} onChange={e => updateSig('linkedin', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="URL" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Instagram</label><input type="url" value={sigForm.instagram} onChange={e => updateSig('instagram', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="URL" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">GitHub</label><input type="url" value={sigForm.github} onChange={e => updateSig('github', e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="URL" /></div>
                            </div>
                            {/* Color */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('Couleur accent')}</label>
                                <div className="flex gap-2 items-center">
                                    {['#0d9488','#3b82f6','#8b5cf6','#ef4444','#f59e0b','#10b981','#6366f1','#111827'].map(hex => (
                                        <button key={hex} onClick={() => updateSig('color', hex)} className={`w-7 h-7 rounded-full border-2 transition-all ${sigForm.color === hex ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: hex }} />
                                    ))}
                                    <input type="color" value={sigForm.color} onChange={e => updateSig('color', e.target.value)} className="w-7 h-7 rounded-full cursor-pointer border border-gray-200 dark:border-gray-600" />
                                </div>
                            </div>
                        </div>

                        <button onClick={saveSig} disabled={sigSaving} className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-teal-500/20">
                            {sigSaving ? t('Enregistrement...') : t('Enregistrer la signature')}
                        </button>
                    </div>

                    {/* Live preview */}
                    <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">{t('Aperçu')}</h3>
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
                                <p className="text-[10px] text-gray-400"><span className="font-semibold text-gray-500">From:</span> {sigForm.name} &lt;{sigForm.email}&gt;</p>
                                <p className="text-[10px] text-gray-400"><span className="font-semibold text-gray-500">Subject:</span> {t('Votre devis est prêt')}</p>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-sm text-gray-600 mb-4">{t('Bonjour,')}<br /><br />{t('Veuillez trouver ci-joint votre devis.')}<br /><br />{t('Cordialement,')}</p>
                                {sigForm.enabled === '1' && (
                                    <div style={{ borderTop: `2px solid ${sigForm.color}`, paddingTop: 16, marginTop: 16 }}>
                                        <table cellPadding={0} cellSpacing={0} style={{ fontFamily: 'Arial, sans-serif' }}>
                                            <tbody><tr>
                                                {sigLogoUrl && <td style={{ paddingRight: 16, verticalAlign: 'top' }}><img src={sigLogoUrl} alt="Logo" style={{ height: 50, width: 'auto' }} /></td>}
                                                <td style={{ verticalAlign: 'top', borderLeft: sigLogoUrl ? `2px solid ${sigForm.color}20` : 'none', paddingLeft: sigLogoUrl ? 16 : 0 }}>
                                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{sigForm.name}</p>
                                                    {sigForm.title && <p style={{ margin: '2px 0 0', fontSize: 12, color: sigForm.color, fontWeight: 600 }}>{sigForm.title}</p>}
                                                    {sigForm.company && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>{sigForm.company}</p>}
                                                    <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
                                                        {sigForm.phone && <span>T. {sigForm.phone}<br /></span>}
                                                        {sigForm.email && <span>E. {sigForm.email}<br /></span>}
                                                        {sigForm.website && <span>W. {sigForm.website}<br /></span>}
                                                        {sigForm.address && <span>A. {sigForm.address}</span>}
                                                    </div>
                                                    {(sigForm.linkedin || sigForm.instagram || sigForm.github) && (
                                                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                                            {sigForm.linkedin && <a href={sigForm.linkedin} style={{ color: sigForm.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a>}
                                                            {sigForm.instagram && <a href={sigForm.instagram} style={{ color: sigForm.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>Instagram</a>}
                                                            {sigForm.github && <a href={sigForm.github} style={{ color: sigForm.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>GitHub</a>}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr></tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t('Aperçu en temps réel')}</p>
                    </div>
                </div>
                </div>
            )}

            {showOverview && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowOverview(false)} />
                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-5xl rounded-2xl shadow-2xl my-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 rounded-t-2xl flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">{t('Email Overview')}</h2>
                                <p className="text-violet-200 text-sm mt-0.5">{t('All automated emails sent by the platform')}</p>
                            </div>
                            <button onClick={() => setShowOverview(false)} className="text-white/70 hover:text-white p-1">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-gray-500 dark:text-gray-400">{t('Transactional')} - {t('always sent, cannot be disabled by user')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span className="text-gray-500 dark:text-gray-400">{t('Informational')} - {t('user can disable in preferences')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">{t('Template disabled')} = {t('email will NOT be sent')}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-6">
                            {EMAIL_FLOWS.map(section => {
                                return (
                                    <div key={section.section}>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{section.section}</h3>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                                                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('Trigger')}</th>
                                                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('Recipient')}</th>
                                                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('Template')}</th>
                                                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('Type')}</th>
                                                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">{t('Status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.rows.map((row, i) => {
                                                        // Find if the template exists and is active
                                                        const tpl = templates.find(t => t.slug === row.template && t.locale === filterLocale);
                                                        const isActive = tpl ? tpl.is_active : row.template.includes('(direct)');
                                                        const isDirect = row.template.includes('(direct)');

                                                        return (
                                                            <tr key={i} className={`border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${!isActive && !isDirect ? 'opacity-50' : ''}`}>
                                                                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.trigger}</td>
                                                                <td className="px-4 py-2.5">
                                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{row.recipient}</span>
                                                                </td>
                                                                <td className="px-4 py-2.5">
                                                                    <code className="text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded">{row.template}</code>
                                                                </td>
                                                                <td className="px-4 py-2.5">
                                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                                        row.type === 'transactional'
                                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                    }`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${row.type === 'transactional' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                                        {row.type}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2.5 text-center">
                                                                    {isDirect ? (
                                                                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{t('Always')}</span>
                                                                    ) : isActive ? (
                                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                                            ON
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500">
                                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                            OFF
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {t('Toggle templates ON/OFF using the switch on each template card. Disabled templates will not send emails.')}
                            </p>
                            <button onClick={() => setShowOverview(false)} className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                {t('Close')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
