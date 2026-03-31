import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

interface SimulationSummary {
    id: number;
    name: string;
    product_name: string | null;
    monthly_price: string;
    time_horizon: number;
    team_member_count: number;
    updated_at: string;
    total_projected_revenue: number;
    total_profit: number;
    break_even_month: number | null;
}

interface Props {
    simulations: SimulationSummary[];
}

export default function SimulatorIndex({ simulations }: Props) {
    const { t } = useTranslation();

    const handleDelete = (id: number) => {
        if (confirm(t('Supprimer cette simulation ?'))) {
            router.delete(`/admin/simulator/${id}`);
        }
    };

    return (
        <AdminLayout header={t('Simulateur financier')}>
            <Head title={t('Simulateur financier')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <p className="text-indigo-200 text-xs font-medium tracking-wider uppercase mb-1">{t('Finance')}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Simulateur financier')}</h1>
                        <p className="text-indigo-200 text-sm">{t('Évaluez la rentabilité de vos projets SaaS avant de les lancer.')}</p>
                    </div>
                    <Link
                        href="/admin/simulator/create"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Nouvelle simulation')}
                    </Link>
                </div>
            </div>

            {simulations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zM9.75 6.75h4.5a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25z" /></svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">{t('Aucune simulation')}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t('Créez votre première simulation financière pour évaluer un projet SaaS.')}</p>
                    <Link href="/admin/simulator/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Nouvelle simulation')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {simulations.map(sim => (
                        <div key={sim.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 group">
                            <Link href={`/admin/simulator/${sim.id}`} className="block p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{sim.name}</h3>
                                        {sim.product_name && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sim.product_name}</p>}
                                    </div>
                                    <span className="text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{sim.time_horizon} {t('mois')}</span>
                                </div>

                                {/* KPIs */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 text-center">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Revenu')}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(sim.total_projected_revenue)}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 text-center">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Profit')}</p>
                                        <p className={`text-sm font-bold ${sim.total_profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(sim.total_profit)}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 text-center">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Break-even')}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{sim.break_even_month ? `${t('Mois')} ${sim.break_even_month}` : '—'}</p>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                    <span>{sim.team_member_count} {t('membres')} · {formatCurrency(Number(sim.monthly_price))}/{t('mo')}</span>
                                    <span>{new Date(sim.updated_at).toLocaleDateString()}</span>
                                </div>
                            </Link>

                            {/* Actions */}
                            <div className="flex border-t border-gray-50 dark:border-gray-700">
                                <button onClick={() => router.post(`/admin/simulator/${sim.id}/duplicate`)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    {t('Dupliquer')}
                                </button>
                                <div className="w-px bg-gray-50 dark:bg-gray-700" />
                                <button onClick={() => handleDelete(sim.id)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    {t('Supprimer')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
