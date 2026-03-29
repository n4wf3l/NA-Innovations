import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Log {
    id: number;
    user_id: number;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    properties: { url?: string; method?: string; route?: string; role?: string };
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: { id: number; name: string; role: string };
}

interface Props {
    logs: { data: Log[]; current_page: number; last_page: number; total: number };
    users: { id: number; name: string; role: string }[];
    actions: string[];
}

const actionColors: Record<string, string> = {
    login: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    logout: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    page_view: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    create: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    update: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    delete: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const roleColors: Record<string, string> = {
    admin: 'text-teal-600 dark:text-teal-400',
    developer: 'text-indigo-600 dark:text-indigo-400',
    referral_partner: 'text-rose-600 dark:text-rose-400',
    client: 'text-emerald-600 dark:text-emerald-400',
};

const actionLabels: Record<string, string> = {
    page_view: 'Vue de page',
    login: 'Connexion',
    logout: 'Déconnexion',
    create: 'Création',
    update: 'Modification',
    delete: 'Suppression',
};

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function shortModel(type: string | null) {
    if (!type) return '';
    return type.split('\\').pop() || '';
}

function parseDevice(ua: string | null): string {
    if (!ua) return '--';
    if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile';
    if (/Tablet|iPad/i.test(ua)) return 'Tablet';
    return 'Desktop';
}

export default function AuditLogIndex({ logs, users, actions }: Props) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        user_id: '',
        role: '',
        action: '',
        search: '',
        from: '',
        to: '',
    });

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (filters.user_id) params.user_id = filters.user_id;
        if (filters.role) params.role = filters.role;
        if (filters.action) params.action = filters.action;
        if (filters.search) params.search = filters.search;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;
        router.get('/admin/audit-log', params, { preserveState: true });
    };

    const clearFilters = () => {
        setFilters({ user_id: '', role: '', action: '', search: '', from: '', to: '' });
        router.get('/admin/audit-log', {}, { preserveState: true });
    };

    // Group logs by date
    const grouped: Record<string, Log[]> = {};
    logs.data.forEach(log => {
        const date = formatFullDate(log.created_at);
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(log);
    });

    const selectClass = 'bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-400';

    const getActionLabel = (action: string): string => {
        return actionLabels[action] || action;
    };

    return (
        <AdminLayout title={t('Audit Log')} header={t('Audit Log')}>
            <Head title={t('Audit Log')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <p className="text-gray-400 text-xs font-medium tracking-wider uppercase mb-1">{t('System')}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Audit Log')}</h1>
                    <p className="text-gray-400 text-sm">{t('Track all user activity across the platform')} -- {logs.total} {t('results')}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('Search')}</label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder={t('Name, URL...')}
                            className={selectClass + ' w-full'}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('User')}</label>
                        <SearchableSelect
                            value={filters.user_id}
                            onChange={(val) => setFilters(f => ({ ...f, user_id: val }))}
                            placeholder={t('All')}
                            options={users.map(u => ({ value: String(u.id), label: u.name }))}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('Role')}</label>
                        <SearchableSelect
                            value={filters.role}
                            onChange={(val) => setFilters(f => ({ ...f, role: val }))}
                            placeholder={t('All')}
                            options={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'client', label: 'Client' },
                                { value: 'developer', label: t('Developer') },
                                { value: 'referral_partner', label: t('Partner') },
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('Action')}</label>
                        <SearchableSelect
                            value={filters.action}
                            onChange={(val) => setFilters(f => ({ ...f, action: val }))}
                            placeholder={t('All')}
                            options={actions.map(a => ({ value: a, label: getActionLabel(a) }))}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('From')}</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                            className={selectClass}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('To')}</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                            className={selectClass}
                        />
                    </div>
                    <button onClick={applyFilters} className="px-4 py-2 bg-violet-500 text-white text-sm font-semibold rounded-lg hover:bg-violet-600 transition-colors">{t('Filter')}</button>
                    <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{t('Reset')}</button>
                </div>
            </div>

            {/* Logs grouped by date */}
            {logs.data.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No activity yet.')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([date, entries]) => (
                        <div key={date}>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">{date}</p>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {entries.map(log => (
                                        <div key={log.id} className="flex items-center px-5 py-3 gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            {/* Time */}
                                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-12 flex-shrink-0">{formatTime(log.created_at)}</span>

                                            {/* Action badge */}
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex-shrink-0 w-20 text-center ${actionColors[log.action] || actionColors.other}`}>
                                                {log.action === 'page_view' ? 'view' : log.action}
                                            </span>

                                            {/* User */}
                                            <div className="flex items-center gap-2 min-w-[140px] flex-shrink-0">
                                                <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{log.user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?'}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{log.user?.name || `User #${log.user_id}`}</p>
                                                    <p className={`text-[10px] font-semibold ${roleColors[log.user?.role || ''] || 'text-gray-400'}`}>{log.user?.role?.replace('_', ' ') || ''}</p>
                                                </div>
                                            </div>

                                            {/* URL / details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">
                                                    {log.properties?.url || '--'}
                                                </p>
                                                {log.subject_type && (
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{shortModel(log.subject_type)} #{log.subject_id}</p>
                                                )}
                                            </div>

                                            {/* IP + Device */}
                                            <div className="text-right flex-shrink-0 hidden lg:block">
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{log.ip_address || '--'}</p>
                                                <p className="text-[10px] text-gray-300 dark:text-gray-600">{parseDevice(log.user_agent)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                            {Array.from({ length: logs.last_page }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => router.get('/admin/audit-log', { ...filters, page }, { preserveState: true })}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                        page === logs.current_page
                                            ? 'bg-violet-500 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
