import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';

interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    admin_reply: string | null;
    replied_at: string | null;
    created_at: string;
    client?: { id: number; name: string; email: string } | null;
    project?: { id: number; nom_societe: string } | null;
    replier?: { id: number; name: string } | null;
}

interface Props {
    tickets: {
        data: Ticket[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: {
        total: number;
        open: number;
        in_progress: number;
        resolved: number;
    };
    filters: {
        status?: string;
        priority?: string;
    };
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';

const statusColors: Record<string, string> = {
    open: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const priorityDot: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500',
};

export default function SupportIndex({ tickets, stats, filters }: Props) {
    const { t } = useTranslation();

    const statusFilters = [
        { value: '', label: t('Tous') },
        { value: 'open', label: t('Ouvert') },
        { value: 'in_progress', label: t('En cours') },
        { value: 'resolved', label: t('Résolu') },
        { value: 'closed', label: t('Fermé') },
    ];

    const priorityFilters = [
        { value: '', label: t('Toutes') },
        { value: 'high', label: t('Haute') },
        { value: 'medium', label: t('Moyenne') },
        { value: 'low', label: t('Basse') },
    ];

    const statusLabels: Record<string, string> = {
        open: t('Ouvert'),
        in_progress: t('En cours'),
        resolved: t('Résolu'),
        closed: t('Fermé'),
    };

    const priorityLabels: Record<string, string> = {
        high: t('Haute'),
        medium: t('Moyenne'),
        low: t('Basse'),
    };

    const applyFilter = (key: string, value: string) => {
        const params: Record<string, string> = { ...filters };
        if (value) {
            params[key] = value;
        } else {
            delete params[key];
        }
        router.get('/admin/support', params, { preserveState: true, replace: true });
    };

    const timeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('maintenant');
        if (diffMins < 60) return `${diffMins}min`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 30) return `${diffDays}j`;
        return formatDate(dateStr);
    };

    return (
        <AdminLayout title={t('Support')} header={t('Support')}>
            <Head title={t('Support')} />

            <div className="space-y-6">
                {/* Stats KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`${card} p-5`}>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Total')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                    </div>
                    <div className={`${card} p-5 border-l-4 border-l-red-500`}>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{t('Ouvert')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.open}</p>
                    </div>
                    <div className={`${card} p-5 border-l-4 border-l-amber-500`}>
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('En cours')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.in_progress}</p>
                    </div>
                    <div className={`${card} p-5 border-l-4 border-l-emerald-500`}>
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{t('Résolu')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolved}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className={`${card} p-4`}>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Status filter pills */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2">{t('Statut')}</span>
                            {statusFilters.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => applyFilter('status', f.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        (filters.status || '') === f.value
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                        {/* Priority filter pills */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2">{t('Priorité')}</span>
                            {priorityFilters.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => applyFilter('priority', f.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        (filters.priority || '') === f.value
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tickets list */}
                <div className={card}>
                    {tickets.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucun ticket de support.')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {tickets.data.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/admin/support/${ticket.id}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                >
                                    {/* Priority dot */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${priorityDot[ticket.priority] || priorityDot.medium}`} title={priorityLabels[ticket.priority] || ticket.priority} />
                                    </div>

                                    {/* Subject + meta */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            {ticket.subject}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            {ticket.client && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.client.name}</span>
                                            )}
                                            {ticket.project && (
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    · {ticket.project.nom_societe}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {ticket.admin_reply && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 uppercase">
                                                {t('Répondu')}
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[ticket.status] || statusColors.open}`}>
                                            {statusLabels[ticket.status] || ticket.status}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 w-12 text-right">
                                        {timeAgo(ticket.created_at)}
                                    </span>

                                    {/* Chevron */}
                                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {tickets.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-center gap-1">
                            {tickets.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        link.active
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : link.url
                                              ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
