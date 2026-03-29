import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { useRef, useEffect } from 'react';

interface Message {
    id: number;
    user_id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
    user?: { id: number; name: string } | null;
}

interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    project?: { id: number; nom_societe: string } | null;
    messages?: Message[];
}

interface Props {
    ticket: Ticket;
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';
const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:bg-white dark:focus:bg-gray-700 transition-all';
const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';

const statusColors: Record<string, string> = {
    open: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    high: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
};

export default function SupportShow({ ticket }: Props) {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const statusLabels: Record<string, string> = {
        open: t('Ouvert'),
        in_progress: t('En cours'),
        resolved: t('Résolu'),
        closed: t('Fermé'),
    };

    const priorityLabels: Record<string, string> = {
        low: t('Basse'),
        medium: t('Moyenne'),
        high: t('Haute'),
    };

    const messages = ticket.messages || [];
    const isClosed = ticket.status === 'closed';

    const form = useForm({
        message: '',
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/client/support/${ticket.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => form.reset('message'),
        });
    };

    return (
        <ClientLayout title={t('Support')}>
            <Head title={`${t('Support')} - ${ticket.subject}`} />

            <div className="space-y-6">
                {/* Back link */}
                <Link
                    href="/client/support"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {t('Retour au support')}
                </Link>

                {/* Ticket header */}
                <div className={card}>
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h2>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    {ticket.project && (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{ticket.project.nom_societe}</span>
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(ticket.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${priorityColors[ticket.priority] || priorityColors.medium}`}>
                                    {priorityLabels[ticket.priority] || ticket.priority}
                                </span>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusColors[ticket.status] || statusColors.open}`}>
                                    {statusLabels[ticket.status] || ticket.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversation */}
                <div className={card}>
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Conversation')}</h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                                {messages.length} {t('message(s)')}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">{t('Aucun message dans cette conversation.')}</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                            msg.is_admin
                                                ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20'
                                                : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold ${
                                                msg.is_admin
                                                    ? 'text-teal-700 dark:text-teal-300'
                                                    : 'text-gray-600 dark:text-gray-300'
                                            }`}>
                                                {msg.is_admin ? (msg.user?.name || t('Équipe support')) : t('Vous')}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                {formatDate(msg.created_at)}
                                            </span>
                                        </div>
                                        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                                            msg.is_admin
                                                ? 'text-teal-800 dark:text-teal-200'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Reply form */}
                {!isClosed ? (
                    <form onSubmit={handleSubmit} className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                <h3 className="font-bold text-gray-900 dark:text-white">{t('Répondre')}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={label}>{t('Votre message')}</label>
                                <textarea
                                    value={form.data.message}
                                    onChange={e => form.setData('message', e.target.value)}
                                    className={`${input} resize-none`}
                                    rows={4}
                                    placeholder={t('Tapez votre message ici...')}
                                    required
                                    maxLength={5000}
                                />
                                {form.errors.message && <p className="mt-1 text-xs text-red-500">{form.errors.message}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                    {form.processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                            {t('Envoi...')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                            {t('Envoyer')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className={`${card} p-6 text-center`}>
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                            {t('Ce ticket est fermé. Vous ne pouvez plus y répondre.')}
                        </p>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
