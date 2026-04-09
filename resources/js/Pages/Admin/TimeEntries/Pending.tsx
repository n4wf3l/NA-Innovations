import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface Entry {
    id: number;
    date: string;
    hours: number | string;
    description: string;
    project?: { id: number; nom_societe: string };
    user?: { id: number; name: string };
}

interface Props {
    entries: { data: Entry[]; links?: any[] };
}

export default function PendingTimeEntries({ entries }: Props) {
    const { t } = useTranslation();

    const approve = (id: number) => router.post(`/admin/time-entries/${id}/approve`, {}, { preserveScroll: true });
    const reject = (id: number) => {
        const reason = window.prompt(t('Raison du refus ?')) || '';
        router.post(`/admin/time-entries/${id}/reject`, { reason }, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('Validation des heures')} header={t('Validation des heures')}>
            <Head title={t('Validation des heures')} />

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Entrées en attente de validation')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Date')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Développeur')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Projet')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Heures')}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Description')}</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {entries.data.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">{t('Aucune entrée en attente')}</td></tr>
                            )}
                            {entries.data.map(e => (
                                <tr key={e.id}>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{new Date(e.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{e.user?.name || '—'}</td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{e.project?.nom_societe || '—'}</td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{e.hours}</td>
                                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400 max-w-md truncate">{e.description}</td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        <button onClick={() => approve(e.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600">{t('Approuver')}</button>
                                        <button onClick={() => reject(e.id)} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600">{t('Rejeter')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
