import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface TimeEntryItem {
    id: number;
    date: string;
    hours: string;
    description: string;
    task_category: string | null;
    is_billable: boolean;
    project: { id: number; nom_societe: string } | null;
    user: { id: number; name: string } | null;
}

interface Props {
    entries: {
        data: TimeEntryItem[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        project_id?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
    };
    projects: { id: number; nom_societe: string }[];
    developers: { id: number; name: string }[];
    summary: {
        total_hours: number;
        total_billable: number;
        by_project: Record<string, number>;
        by_developer: Record<string, number>;
    };
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';
const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 transition-all';

const categoryLabels: Record<string, string> = {
    development: 'Development',
    design: 'Design',
    meeting: 'Meeting',
    testing: 'Testing',
    deployment: 'Deployment',
    other: 'Other',
};

const categoryColors: Record<string, string> = {
    development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    design: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    meeting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    testing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    deployment: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function TimesheetsIndex({ entries, filters, projects, developers, summary }: Props) {
    const { t } = useTranslation();
    const [localFilters, setLocalFilters] = useState({
        project_id: filters.project_id || '',
        user_id: filters.user_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (localFilters.project_id) params.project_id = localFilters.project_id;
        if (localFilters.user_id) params.user_id = localFilters.user_id;
        if (localFilters.date_from) params.date_from = localFilters.date_from;
        if (localFilters.date_to) params.date_to = localFilters.date_to;
        router.get('/admin/timesheets', params, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({ project_id: '', user_id: '', date_from: '', date_to: '' });
        router.get('/admin/timesheets', {}, { preserveState: true });
    };

    return (
        <AdminLayout title={t('Timesheets')}>
            <Head title={t('Timesheets')} />

            {/* Banner */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('Timesheets')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Track developer time entries across all projects')}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={card}>
                    <div className="p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Total Hours')}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{summary.total_hours}h</p>
                    </div>
                </div>
                <div className={card}>
                    <div className="p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Billable Hours')}</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{summary.total_billable}h</p>
                    </div>
                </div>
                <div className={card}>
                    <div className="p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Non-Billable')}</p>
                        <p className="text-2xl font-black text-gray-500 mt-1">{(summary.total_hours - summary.total_billable).toFixed(2)}h</p>
                    </div>
                </div>
                <div className={card}>
                    <div className="p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Projects Tracked')}</p>
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{Object.keys(summary.by_project).length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`${card} mb-6`}>
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('Project')}</label>
                            <SearchableSelect
                                value={localFilters.project_id}
                                onChange={(val) => setLocalFilters(f => ({ ...f, project_id: val }))}
                                placeholder={t('All Projects')}
                                options={projects.map(p => ({ value: String(p.id), label: p.nom_societe }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('Developer')}</label>
                            <SearchableSelect
                                value={localFilters.user_id}
                                onChange={(val) => setLocalFilters(f => ({ ...f, user_id: val }))}
                                placeholder={t('All Developers')}
                                options={developers.map(d => ({ value: String(d.id), label: d.name }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('From')}</label>
                            <input type="date" className={input} value={localFilters.date_from} onChange={e => setLocalFilters(f => ({ ...f, date_from: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('To')}</label>
                            <input type="date" className={input} value={localFilters.date_to} onChange={e => setLocalFilters(f => ({ ...f, date_to: e.target.value }))} />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={applyFilters} className="px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-colors">{t('Filter')}</button>
                            <button onClick={clearFilters} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{t('Clear')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Table */}
                <div className={`lg:col-span-2 ${card}`}>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Time Entries')}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Date')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Developer')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Project')}</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Hours')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Category')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Description')}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Billable')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">{t('No time entries found.')}</td>
                                    </tr>
                                )}
                                {entries.data.map(entry => (
                                    <tr key={entry.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">{formatDate(entry.date)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{entry.user?.name || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{entry.project?.nom_societe || '-'}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right whitespace-nowrap">{entry.hours}h</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {entry.task_category && (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[entry.task_category] || categoryColors.other}`}>
                                                    {t(categoryLabels[entry.task_category] || entry.task_category)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{entry.description}</td>
                                        <td className="px-4 py-3 text-center">
                                            {entry.is_billable ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{t('Yes')}</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">{t('No')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {entries.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <p className="text-xs text-gray-400">{t('Page')} {entries.current_page} / {entries.last_page}</p>
                            <div className="flex space-x-1">
                                {entries.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-indigo-500 text-white'
                                                : link.url
                                                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Breakdown Sidebar */}
                <div className="space-y-6">
                    {/* By Project */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Hours by Project')}</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {Object.entries(summary.by_project).length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-2">{t('No data')}</p>
                            )}
                            {Object.entries(summary.by_project).sort((a, b) => b[1] - a[1]).map(([name, hours]) => (
                                <div key={name} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate mr-2">{name}</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{hours}h</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* By Developer */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Hours by Developer')}</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {Object.entries(summary.by_developer).length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-2">{t('No data')}</p>
                            )}
                            {Object.entries(summary.by_developer).sort((a, b) => b[1] - a[1]).map(([name, hours]) => (
                                <div key={name} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate mr-2">{name}</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{hours}h</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
