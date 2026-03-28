import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';
import { RevenueBarChart, LeadConversionCard, ProjectStatusCard, TopClientsCard } from './Charts';

interface BudgetLine {
    id: number; label: string; type: string; amount: number; frequency: string;
    trigger: string; start_date: string | null; end_date: string | null;
    is_confirmed: boolean; notes: string | null; project_id: number;
    project?: { id: number; nom_societe: string };
}
interface ProjectionPoint { month: string; income: number; expense: number; net: number; cumulative: number; }
interface ProjectOption { id: number; nom_societe: string; status: string; }
interface TopClient {
    client_name: string;
    client_company: string | null;
    total_revenue: number;
    invoice_count: number;
}
interface RevenueMonth {
    month: string;
    label: string;
    income: number;
    invoiced: number;
}
interface LeadSource {
    source: string;
    total: number;
    won: number;
    rate: number;
}
interface Props {
    projection: ProjectionPoint[];
    breakEvenMonth: string | null;
    actualIncome: number;
    actualExpenses: number;
    until: string;
    allProjects: ProjectOption[];
    selectedProjectIds: number[];
    budgetLines: BudgetLine[];
    revenueByMonth: RevenueMonth[];
    leadsBySource: LeadSource[];
    projectsByStatus: Record<string, number>;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    momChange: number;
    topClients: TopClient[];
    commissionStats: { total_paid: number; total_pending: number; total_all: number };
}

// Frequency labels use t() at render time — see LineRow

export default function RevenueIndex({ projection, breakEvenMonth, actualIncome, actualExpenses, until, allProjects, selectedProjectIds, budgetLines, revenueByMonth, leadsBySource, projectsByStatus, thisMonthRevenue, lastMonthRevenue, momChange, topClients, commissionStats }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState<number[]>(selectedProjectIds);
    const [showDetail, setShowDetail] = useState(false);

    const lastPoint = projection[projection.length - 1];
    const incomeLines = budgetLines.filter(l => l.type === 'income');
    const expenseLines = budgetLines.filter(l => l.type === 'expense');

    const handleUntilChange = (val: string) => {
        router.get('/admin/revenue', { until: val, projects: selected.join(',') }, { preserveState: true });
    };

    const toggleProject = (id: number) => {
        const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
        setSelected(next);
    };

    const applyFilter = () => {
        router.get('/admin/revenue', { until, projects: selected.join(',') }, { preserveState: true });
    };

    // Month options
    const monthOptions: { value: string; label: string }[] = [];
    for (let i = 1; i <= 24; i++) {
        const d = new Date(); d.setMonth(d.getMonth() + i);
        monthOptions.push({ value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }) });
    }

    if (!financialUnlocked) {
        return (
            <AdminLayout title={t("Revenue")} header={t("Revenue")}>
                <Head title={t("Revenue")} />
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('Financial data locked')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">{t('Unlock financial data using the PIN button in the top bar to access revenue projections and budget details.')}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {t('Click "Show $" in the top bar')}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={t("Revenue")} header={t("Revenue")}>
            <Head title={t("Revenue")} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-teal-200 text-xs font-medium tracking-wider uppercase mb-1">{t('Finance')}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Revenue & Projections')}</h1>
                        <p className="text-teal-200 text-sm mt-1">{selected.length} {t('Projects')} {t('selected')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                            {t('Filter')}
                        </button>
                        <select value={until} onChange={e => handleUntilChange(e.target.value)} className="bg-white/10 border-0 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-white/30">
                            {monthOptions.map(o => <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Project filter */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Filter by project')}</h4>
                        <div className="flex gap-2">
                            <button onClick={() => setSelected(allProjects.map(p => p.id))} className="text-xs text-teal-500 hover:text-teal-600 font-medium">{t('All')}</button>
                            <button onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-gray-600 font-medium">{t('None')}</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                        {allProjects.map(p => (
                            <label key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selected.includes(p.id) ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30' : 'bg-gray-50 dark:bg-gray-700/50 border border-transparent'}`}>
                                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleProject(p.id)} className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                                <span className="text-sm text-gray-900 dark:text-white truncate">{p.nom_societe}</span>
                            </label>
                        ))}
                    </div>
                    <button onClick={applyFilter} className="px-5 py-2 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors">{t('Apply')}</button>
                </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{protectedValue(actualIncome, financialUnlocked)}</div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Actual Income')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></svg>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{protectedValue(actualExpenses, financialUnlocked)}</div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Actual Expenses')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${(lastPoint?.cumulative ?? 0) >= 0 ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{protectedValue(lastPoint?.cumulative ?? 0, financialUnlocked)}</div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Projected Total')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${breakEvenMonth ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{breakEvenMonth || t('No break-even')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Break-even')}</p>
                </div>
            </div>

            {/* ── Section A : Comparaison mois/mois ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('This month')}</p>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{protectedValue(thisMonthRevenue, financialUnlocked)}</div>
                    {momChange !== 0 && (
                        <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${momChange > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                {momChange > 0
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                }
                            </svg>
                            <span>{momChange > 0 ? '+' : ''}{momChange}%</span>
                        </div>
                    )}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('Last month')}</p>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{protectedValue(lastMonthRevenue, financialUnlocked)}</div>
                </div>
            </div>

            {/* ── Section B : Graphique revenus par mois (SVG) ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('Revenue over the last 12 months')}</h3>
                <RevenueBarChart data={revenueByMonth} unlocked={financialUnlocked} />
            </div>

            {/* ── Section C : 3 cartes analytiques ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Carte 1 : Conversion par source */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('Conversion by source')}</h4>
                    <LeadConversionCard data={leadsBySource} />
                </div>

                {/* Carte 2 : Projets par statut */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('Projects by status')}</h4>
                    <ProjectStatusCard data={projectsByStatus} />
                </div>

                {/* Carte 3 : Top 5 clients */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('Top 5 clients')}</h4>
                    <TopClientsCard data={topClients} unlocked={financialUnlocked} />
                </div>
            </div>

            {/* ── Section D : Commissions ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('Commissions')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('Total paid')}</p>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{protectedValue(commissionStats.total_paid, financialUnlocked)}</div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('Total pending')}</p>
                        <div className="text-lg font-black text-amber-500 dark:text-amber-400">{protectedValue(commissionStats.total_pending, financialUnlocked)}</div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('Total overall')}</p>
                        <div className="text-lg font-black text-gray-900 dark:text-white">{protectedValue(commissionStats.total_all, financialUnlocked)}</div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('Financial Projection')}</h3>
                <ProjectionChart projection={projection} breakEvenMonth={breakEvenMonth} />
            </div>

            {/* Budget lines by project */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">{t('Budget Lines')}</h3>
                </div>
                {incomeLines.length > 0 && (
                    <div>
                        <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{t('Income')} ({incomeLines.length})</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {incomeLines.map(l => <LineRow key={l.id} line={l} />)}
                        </div>
                    </div>
                )}
                {expenseLines.length > 0 && (
                    <div>
                        <div className="px-6 py-2 bg-red-50 dark:bg-red-500/10">
                            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">{t('Expenses')} ({expenseLines.length})</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {expenseLines.map(l => <LineRow key={l.id} line={l} />)}
                        </div>
                    </div>
                )}
                {budgetLines.length === 0 && (
                    <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No budget lines yet. Add income and expenses to see projections.')}</div>
                )}
            </div>

            {/* Monthly detail */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <button onClick={() => setShowDetail(!showDetail)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">{t('Monthly Detail')}</h3>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDetail ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showDetail && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Month')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Income')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Expenses')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Net')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Cumulative')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projection.map(p => (
                                    <tr key={p.month} className={`border-t border-gray-50 dark:border-gray-700 ${p.month === breakEvenMonth ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''}`}>
                                        <td className="px-6 py-3 text-gray-900 dark:text-white font-medium">
                                            {p.month}
                                            {p.month === breakEvenMonth && <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{t('Break-even')}</span>}
                                        </td>
                                        <td className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-400">{p.income > 0 ? <ProtectedAmount amount={p.income} /> : '--'}</td>
                                        <td className="px-6 py-3 text-right text-red-500">{p.expense > 0 ? <ProtectedAmount amount={p.expense} /> : '--'}</td>
                                        <td className={`px-6 py-3 text-right font-medium ${p.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}><ProtectedAmount amount={p.net} /></td>
                                        <td className={`px-6 py-3 text-right font-bold ${p.cumulative >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}><ProtectedAmount amount={p.cumulative} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function LineRow({ line }: { line: BudgetLine }) {
    const { t } = useTranslation();
    return (
        <div className={`flex items-center justify-between px-6 py-3 ${!line.is_confirmed ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{line.label}</p>
                        {line.project && (
                            <Link href={`/admin/projects/${line.project.id}/budget`} className="text-[10px] font-medium text-teal-500 hover:text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-1.5 py-0.5 rounded">{line.project.nom_societe}</Link>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400"><ProtectedAmount amount={line.amount} /></span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{t(line.frequency === 'one_time' ? 'One-time' : line.frequency === 'monthly' ? 'Monthly' : line.frequency === 'quarterly' ? 'Quarterly' : 'Annual')}</span>
                        {line.is_confirmed ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{t('Confirmed')}</span>
                        ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-dashed border-amber-300 dark:border-amber-500/50 text-amber-600 dark:text-amber-400">{t('Estimated')}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectionChart({ projection, breakEvenMonth }: { projection: ProjectionPoint[]; breakEvenMonth: string | null }) {
    const { t } = useTranslation();
    const [hover, setHover] = useState<number | null>(null);

    if (projection.length < 2) return <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">{t('Not enough data for chart')}</div>;

    const W = 900, H = 380, PX = 70, PY = 35, PB = 25;
    const chartW = W - PX * 2, chartH = H - PY - PB;

    const allVals = projection.flatMap(p => [p.cumulative, p.income, -p.expense, 0]);
    const maxV = Math.max(...allVals, 100);
    const minV = Math.min(...allVals, 0);
    const range = maxV - minV || 1;

    const xPos = (i: number) => PX + (i / (projection.length - 1)) * chartW;
    const yPos = (v: number) => PY + chartH - ((v - minV) / range) * chartH;

    const cumulLine = projection.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(p.cumulative).toFixed(1)}`).join(' ');
    const zeroY = yPos(0);
    const fillPath = `${cumulLine} L${xPos(projection.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${xPos(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

    const fmtEuro = (v: number) => {
        if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
        return `${v.toFixed(0)}`;
    };

    const gridCount = 6;
    const step = range / gridCount;
    const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
        const val = minV + step * i;
        return { y: yPos(val), val, label: fmtEuro(val) + ' EUR' };
    });

    const breakIdx = projection.findIndex(p => p.month === breakEvenMonth);
    const labelEvery = Math.max(1, Math.floor(projection.length / 12));
    const barW = Math.min(20, chartW / projection.length * 0.6);

    const hp = hover !== null ? projection[hover] : null;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }} onMouseLeave={() => setHover(null)}>
                {/* Grid */}
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line x1={PX} y1={g.y} x2={W - PX} y2={g.y} stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeDasharray="3 3" />
                        <text x={PX - 8} y={g.y + 3} textAnchor="end" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9" fontFamily="monospace">{g.label}</text>
                    </g>
                ))}

                {/* Zero line */}
                <line x1={PX} y1={zeroY} x2={W - PX} y2={zeroY} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1.5" />
                <text x={PX - 8} y={zeroY + 3} textAnchor="end" className="text-gray-500 dark:text-gray-400 fill-current" fontSize="9" fontWeight="bold">0 EUR</text>

                {/* Income/Expense mini bars */}
                {projection.map((p, i) => (
                    <g key={`bar-${i}`}>
                        {p.income > 0 && (
                            <rect x={xPos(i) - barW / 2 - barW * 0.3} y={yPos(p.income)} width={barW * 0.5} height={Math.max(1, yPos(0) - yPos(p.income))} rx="2" className="fill-emerald-400/30 dark:fill-emerald-500/20" />
                        )}
                        {p.expense > 0 && (
                            <rect x={xPos(i) + barW * 0.05} y={zeroY} width={barW * 0.5} height={Math.max(1, yPos(-p.expense) - zeroY)} rx="2" className="fill-red-400/30 dark:fill-red-500/20" />
                        )}
                    </g>
                ))}

                {/* Fill under cumulative */}
                <path d={fillPath} className="fill-teal-500/10 dark:fill-teal-400/10" />

                {/* Cumulative line */}
                <path d={cumulLine} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data points + labels */}
                {projection.map((p, i) => (
                    <g key={p.month} onMouseEnter={() => setHover(i)} style={{ cursor: 'pointer' }}>
                        {/* Hover zone */}
                        <rect x={xPos(i) - chartW / projection.length / 2} y={PY} width={chartW / projection.length} height={chartH} fill="transparent" />

                        {/* Point */}
                        <circle cx={xPos(i)} cy={yPos(p.cumulative)} r={hover === i ? 6 : 4} fill={p.cumulative >= 0 ? '#14b8a6' : '#ef4444'} stroke="white" strokeWidth="2" className="dark:stroke-gray-800 transition-all" />

                        {/* Value label on every other point */}
                        {i % Math.max(1, Math.ceil(projection.length / 8)) === 0 && (
                            <text x={xPos(i)} y={yPos(p.cumulative) - 10} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="9" fontWeight="bold">{fmtEuro(p.cumulative)} EUR</text>
                        )}

                        {/* X label */}
                        {i % labelEvery === 0 && (
                            <text x={xPos(i)} y={H - 5} textAnchor="middle" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9">
                                {new Date(p.month + '-01').toLocaleDateString('fr-BE', { month: 'short', year: '2-digit' })}
                            </text>
                        )}
                    </g>
                ))}

                {/* Break-even marker */}
                {breakIdx >= 0 && (
                    <g>
                        <line x1={xPos(breakIdx)} y1={PY} x2={xPos(breakIdx)} y2={H - PB} stroke="#14b8a6" strokeDasharray="6 3" strokeWidth="1.5" />
                        <rect x={xPos(breakIdx) - 45} y={PY - 4} width="90" height="18" rx="5" fill="#14b8a6" />
                        <text x={xPos(breakIdx)} y={PY + 9} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{t('Break-even')}</text>
                    </g>
                )}

                {/* Hover line */}
                {hover !== null && (
                    <line x1={xPos(hover)} y1={PY} x2={xPos(hover)} y2={H - PB} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeDasharray="4 2" strokeWidth="1" />
                )}
            </svg>

            {/* Tooltip */}
            {hp && hover !== null && (
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-xs pointer-events-none z-10" style={{ minWidth: 180 }}>
                    <p className="font-bold text-gray-900 dark:text-white mb-2">
                        {new Date(hp.month + '-01').toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' })}
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-emerald-600">{t('Income')}</span><span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(hp.income)}</span></div>
                        <div className="flex justify-between"><span className="text-red-500">{t('Expenses')}</span><span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(hp.expense)}</span></div>
                        <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-1 mt-1"><span className="text-gray-500">Net</span><span className={`font-bold ${hp.net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatCurrency(hp.net)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">{t('Cumulative')}</span><span className={`font-black ${hp.cumulative >= 0 ? 'text-teal-600' : 'text-red-500'}`}>{formatCurrency(hp.cumulative)}</span></div>
                    </div>
                </div>
            )}
        </div>
    );
}

