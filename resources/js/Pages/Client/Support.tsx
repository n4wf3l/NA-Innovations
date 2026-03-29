import ClientLayout from '@/Layouts/ClientLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { useMemo } from 'react';

interface Props {
    tickets: any[];
    projects: any[];
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';
const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:bg-white dark:focus:bg-gray-700 transition-all';
const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';

const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    high: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
};

const statusColors: Record<string, string> = {
    open: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const statusOrder: Record<string, number> = {
    open: 0,
    in_progress: 1,
    resolved: 2,
    closed: 3,
};

export default function Support({ tickets, projects }: Props) {
    const { t } = useTranslation();

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

    // Sort tickets: open first, then in_progress, resolved, closed. Within same status, latest first.
    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            const statusDiff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
            if (statusDiff !== 0) return statusDiff;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [tickets]);

    const form = useForm({
        subject: '',
        message: '',
        project_id: '' as string | number,
        priority: 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/client/support', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const getLastMessage = (ticket: any) => {
        if (!ticket.messages || ticket.messages.length === 0) return null;
        return ticket.messages[ticket.messages.length - 1];
    };

    return (
        <ClientLayout title={t("Support")}>
            <Head title={t("Support")} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* New ticket form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Nouvelle demande')}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={label}>{t('Sujet')}</label>
                                <input
                                    type="text"
                                    value={form.data.subject}
                                    onChange={e => form.setData('subject', e.target.value)}
                                    className={input}
                                    placeholder={t('Décrivez brièvement votre demande...')}
                                    required
                                    maxLength={255}
                                />
                                {form.errors.subject && <p className="mt-1 text-xs text-red-500">{form.errors.subject}</p>}
                            </div>

                            <div>
                                <label className={label}>{t('Message')}</label>
                                <textarea
                                    value={form.data.message}
                                    onChange={e => form.setData('message', e.target.value)}
                                    className={`${input} resize-none`}
                                    rows={5}
                                    placeholder={t('Décrivez votre problème ou question en détail...')}
                                    required
                                    maxLength={5000}
                                />
                                {form.errors.message && <p className="mt-1 text-xs text-red-500">{form.errors.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={label}>{t('Projet')} <span className="text-gray-300 dark:text-gray-600 font-normal normal-case">({t('optional')})</span></label>
                                    <select
                                        value={form.data.project_id}
                                        onChange={e => form.setData('project_id', e.target.value)}
                                        className={input}
                                    >
                                        <option value="">{t('Aucun')}</option>
                                        {projects.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.nom_societe}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={label}>{t('Priorité')}</label>
                                    <select
                                        value={form.data.priority}
                                        onChange={e => form.setData('priority', e.target.value)}
                                        className={input}
                                    >
                                        <option value="low">{t('Basse')}</option>
                                        <option value="medium">{t('Moyenne')}</option>
                                        <option value="high">{t('Haute')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                    {form.processing ? (
                                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Envoi...')}</>
                                    ) : (
                                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>{t('Envoyer')}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tickets list */}
                <div className="lg:col-span-2">
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Mes demandes')}</h3>
                            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{tickets.length} {t('ticket(s)')}</span>
                        </div>

                        {sortedTickets.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                                <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucune demande pour le moment.')}</p>
                                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Utilisez le formulaire pour créer votre première demande.')}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {sortedTickets.map((ticket: any) => {
                                    const lastMsg = getLastMessage(ticket);
                                    const messageCount = ticket.messages?.length || 0;

                                    return (
                                        <Link
                                            key={ticket.id}
                                            href={`/client/support/${ticket.id}`}
                                            className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ticket.subject}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(ticket.created_at)}</span>
                                                        {ticket.project && (
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">{ticket.project.nom_societe}</span>
                                                        )}
                                                        {messageCount > 0 && (
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                {messageCount} {t('message(s)')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {lastMsg && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 truncate">
                                                            <span className="font-semibold">
                                                                {lastMsg.is_admin ? (lastMsg.user?.name || t('Équipe support')) : t('Vous')}:
                                                            </span>{' '}
                                                            {lastMsg.message.length > 100
                                                                ? lastMsg.message.substring(0, 100) + '...'
                                                                : lastMsg.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${priorityColors[ticket.priority] || priorityColors.medium}`}>
                                                        {priorityLabels[ticket.priority] || ticket.priority}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[ticket.status] || statusColors.open}`}>
                                                        {statusLabels[ticket.status] || ticket.status}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
