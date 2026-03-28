import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface SentEmailItem {
    id: number; subject: string; recipient_email: string; body: string;
    status: string; sent_at: string; sender?: { name: string };
}

interface Props {
    project: any;
    emailTemplate?: { subject: string; body: string; variables?: string[] } | null;
    sentEmails: SentEmailItem[];
    showModal: boolean;
    setShowModal: (v: boolean) => void;
}

export default function EmailModalSection({ project, emailTemplate, sentEmails, showModal, setShowModal }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {/* Sent Emails */}
            {sentEmails.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("Emails sent")}</h3>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{sentEmails.length}</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {sentEmails.map(email => (
                            <SentEmailRow key={email.id} email={email} />
                        ))}
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showModal && project.client && createPortal(
                <EmailModalInner
                    project={project}
                    template={emailTemplate}
                    onClose={() => setShowModal(false)}
                />,
                document.body
            )}
        </>
    );
}

function SentEmailRow({ email }: { email: SentEmailItem }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const timeAgo = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h`;
        const days = Math.floor(hrs / 24);
        return `${days}j`;
    };

    return (
        <div className="px-5 py-3">
            <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{email.subject}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {t('To')}: {email.recipient_email} {email.sender && <span>- {t('by')} {email.sender.name}</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            email.status === 'sent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            email.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        }`}>{email.status}</span>
                        <span className="text-xs text-gray-400">{timeAgo(email.sent_at)}</span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </button>
            {expanded && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: email.body }} />
                </div>
            )}
        </div>
    );
}

function EmailModalInner({ project, template, onClose }: {
    project: any;
    template?: { subject: string; body: string; variables?: string[] } | null;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const form = useForm({
        recipient_email: project.client?.email || '',
        subject: template?.subject || `Update - ${project.nom_societe}`,
        body: template?.body || '',
    });
    const [preview, setPreview] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/admin/projects/${project.id}/send-email`, {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    const insertVariable = (v: string) => {
        form.setData('body', form.data.body + `{{ ${v} }}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">{t('Send email')}</h2>
                        <p className="text-sm text-teal-100">{project.nom_societe}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Recipient */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Recipient')}</label>
                        <input
                            type="email"
                            value={form.data.recipient_email}
                            onChange={e => form.setData('recipient_email', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        {form.errors.recipient_email && <p className="text-xs text-red-500 mt-1">{form.errors.recipient_email}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Subject')}</label>
                        <input
                            type="text"
                            value={form.data.subject}
                            onChange={e => form.setData('subject', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        {form.errors.subject && <p className="text-xs text-red-500 mt-1">{form.errors.subject}</p>}
                    </div>

                    {/* Variables */}
                    {template?.variables && Array.isArray(template.variables) && template.variables.length > 0 && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Available variables')}</label>
                            <div className="flex flex-wrap gap-1.5">
                                {(Array.isArray(template.variables) ? template.variables : []).map(v => (
                                    <button key={v} type="button" onClick={() => insertVariable(v)}
                                        className="px-2.5 py-1 text-xs font-mono bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-md hover:bg-teal-100 dark:hover:bg-teal-500/20 border border-teal-200 dark:border-teal-700 transition-colors">
                                        {'{{ ' + v + ' }}'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('Body')}</label>
                            <button type="button" onClick={() => setPreview(!preview)}
                                className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                                {preview ? t('Edit') : t('Preview')}
                            </button>
                        </div>
                        {preview ? (
                            <div className="min-h-[200px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.data.body }} />
                            </div>
                        ) : (
                            <textarea
                                value={form.data.body}
                                onChange={e => form.setData('body', e.target.value)}
                                rows={10}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                            />
                        )}
                        {form.errors.body && <p className="text-xs text-red-500 mt-1">{form.errors.body}</p>}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">{t('Cancel')}</button>
                        <button type="submit" disabled={form.processing}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 flex items-center gap-2">
                            {form.processing ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            )}
                            {t('Send')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
