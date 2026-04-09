import DevLayout from '@/Layouts/DevLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

interface MonthData {
    month: string;
    hours: number;
    logged: number;
    amount: number;
}

interface PendingEntry {
    id: number;
    date: string;
    hours: number | string;
    description: string;
    project?: { id: number; nom_societe: string };
}

interface Props {
    months: MonthData[];
    totalYtd: number;
    hourlyRate: number;
    pendingEntries: PendingEntry[];
}

export default function DevEarnings({ months, totalYtd, hourlyRate, pendingEntries }: Props) {
    const { t } = useTranslation();

    return (
        <DevLayout title={t('Revenus')}>
            <Head title={t('Revenus')} />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Total année en cours')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalYtd)}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Tarif horaire')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(hourlyRate)}/h</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('Entrées en attente')}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{pendingEntries.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Détail mensuel')}</h2>
                    </div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('Mois')}</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('Heures saisies')}</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('Heures facturables')}</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('Montant')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {months.map((m, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{m.month}</td>
                                    <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{m.logged}</td>
                                    <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{m.hours}</td>
                                    <td className="px-6 py-3 text-right text-gray-900 dark:text-white font-bold">{formatCurrency(m.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pendingEntries.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('Heures en attente de validation')}</h2>
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {pendingEntries.map(e => (
                                <li key={e.id} className="px-6 py-3 flex items-center justify-between text-sm">
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-medium">{e.project?.nom_societe || '—'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(e.date).toLocaleDateString()} — {e.description}</p>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-bold">{e.hours} h</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </DevLayout>
    );
}
