import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/hooks/useConfirm';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface BudgetLine {
    id: number; label: string; type: string; amount: number; frequency: string;
    trigger: string; start_date: string | null; end_date: string | null;
    is_confirmed: boolean; notes: string | null; sort_order: number;
}
interface ProjectionPoint {
    month: string; income: number; expense: number; net: number; cumulative: number;
}
interface Props {
    project: any;
    budgetLines: BudgetLine[];
    projection: ProjectionPoint[];
    breakEvenMonth: string | null;
    actualIncome: number;
    actualExpenses: number;
    until: string;
    allProjects: { id: number; nom_societe: string; status: string }[];
    selectedProjectIds: number[];
}

const freqLabels: Record<string, string> = { one_time: 'One-time', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual' };
const triggerLabels: Record<string, string> = { immediate: 'Immediate', from_date: 'From date', on_project_completed: 'On completion' };

export default function ProjectBudget({ project, budgetLines, projection, breakEvenMonth, actualIncome, actualExpenses, until, allProjects, selectedProjectIds }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [showModal, setShowModal] = useState(false);
    const [editLine, setEditLine] = useState<BudgetLine | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const lastPoint = projection[projection.length - 1];
    const incomeLines = budgetLines.filter(l => l.type === 'income');
    const expenseLines = budgetLines.filter(l => l.type === 'expense');

    const handleUntilChange = (val: string) => {
        router.get(`/admin/projects/${project.id}/budget`, { until: val, projects: selectedProjectIds.join(',') }, { preserveState: true });
    };

    const openAdd = () => { setEditLine(null); setShowModal(true); };
    const openEdit = (line: BudgetLine) => { setEditLine(line); setShowModal(true); };
    const handleDelete = async (line: BudgetLine) => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/projects/${project.id}/budget/${line.id}`, { preserveScroll: true });
    };

    // Generate month options for the selector
    const monthOptions: { value: string; label: string }[] = [];
    for (let i = 1; i <= 24; i++) {
        const d = new Date(); d.setMonth(d.getMonth() + i);
        monthOptions.push({ value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }) });
    }

    return (
        <AdminLayout title={`${project.nom_societe} - Budget`} header={t('Budget & Projections')}>
            <Head title={`Budget - ${project.nom_societe}`} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-teal-200 text-xs font-medium tracking-wider uppercase mb-1">
                            <Link href="/admin/projects" className="hover:text-white">{t('Projects')}</Link> / <Link href={`/admin/projects/${project.id}`} className="hover:text-white">{project.nom_societe}</Link> / Budget
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Budget & Projections')}</h1>
                    </div>
                    <SearchableSelect
                        value={until}
                        onChange={(val) => handleUntilChange(val)}
                        options={monthOptions}
                    />
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label={t('Actual Income')} value={actualIncome} color="emerald" icon="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <KpiCard label={t('Actual Expenses')} value={actualExpenses} color="red" icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75" />
                <KpiCard label={t('Projected Total')} value={lastPoint?.cumulative ?? 0} color={lastPoint?.cumulative >= 0 ? 'teal' : 'red'} icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                <KpiCard label={breakEvenMonth ? `${t('Break-even')}: ${breakEvenMonth}` : t('No break-even')} value={breakEvenMonth ? 0 : -1} color={breakEvenMonth ? 'teal' : 'gray'} icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" isText />
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('Financial Projection')}</h3>
                <ProjectionChart projection={projection} breakEvenMonth={breakEvenMonth} />
            </div>

            {/* Budget Lines */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">{t('Budget Lines')}</h3>
                    <button onClick={openAdd} className="px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600 transition-colors">+ {t('Add')}</button>
                </div>

                {/* Income section */}
                {incomeLines.length > 0 && (
                    <div>
                        <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{t('Income')}</span>
                        </div>
                        {incomeLines.map(line => <BudgetRow key={line.id} line={line} onEdit={openEdit} onDelete={handleDelete} />)}
                    </div>
                )}

                {/* Expense section */}
                {expenseLines.length > 0 && (
                    <div>
                        <div className="px-6 py-2 bg-red-50 dark:bg-red-500/10">
                            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">{t('Expenses')}</span>
                        </div>
                        {expenseLines.map(line => <BudgetRow key={line.id} line={line} onEdit={openEdit} onDelete={handleDelete} />)}
                    </div>
                )}

                {budgetLines.length === 0 && (
                    <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No budget lines yet. Add income and expenses to see projections.')}</div>
                )}
            </div>

            {/* Monthly detail (collapsible) */}
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
                                        <td className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-400">{p.income > 0 ? formatCurrency(p.income) : '--'}</td>
                                        <td className="px-6 py-3 text-right text-red-500">{p.expense > 0 ? formatCurrency(p.expense) : '--'}</td>
                                        <td className={`px-6 py-3 text-right font-medium ${p.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{formatCurrency(p.net)}</td>
                                        <td className={`px-6 py-3 text-right font-bold ${p.cumulative >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>{formatCurrency(p.cumulative)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && <BudgetLineModal projectId={project.id} line={editLine} onClose={() => setShowModal(false)} />}
            <ConfirmDialog />
        </AdminLayout>
    );
}

// ── KPI Card ──
function KpiCard({ label, value, color, icon, isText }: { label: string; value: number; color: string; icon: string; isText?: boolean }) {
    const colors: Record<string, string> = { emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500', red: 'bg-red-50 dark:bg-red-500/10 text-red-500', teal: 'bg-teal-50 dark:bg-teal-500/10 text-teal-500', gray: 'bg-gray-50 dark:bg-gray-700 text-gray-400' };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
            </div>
            {isText ? (
                <p className="text-lg font-black text-gray-900 dark:text-white">{label}</p>
            ) : (
                <>
                    <p className="text-2xl font-black text-gray-900 dark:text-white"><ProtectedAmount amount={value} /></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{label}</p>
                </>
            )}
        </div>
    );
}

// ── Budget Row ──
function BudgetRow({ line, onEdit, onDelete }: { line: BudgetLine; onEdit: (l: BudgetLine) => void; onDelete: (l: BudgetLine) => void }) {
    const { t } = useTranslation();
    return (
        <div className={`flex items-center justify-between px-6 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 ${!line.is_confirmed ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{line.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{formatCurrency(line.amount)}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{freqLabels[line.frequency]}</span>
                        {line.is_confirmed ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{t('Confirmed')}</span>
                        ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-dashed border-amber-300 dark:border-amber-500/50 text-amber-600 dark:text-amber-400">{t('Estimated')}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(line)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">{t('Edit')}</button>
                <button onClick={() => onDelete(line)} className="text-xs text-red-400 hover:text-red-500">{t('Delete')}</button>
            </div>
        </div>
    );
}

// ── SVG Chart ──
function ProjectionChart({ projection, breakEvenMonth }: { projection: ProjectionPoint[]; breakEvenMonth: string | null }) {
    if (projection.length < 2) return <div className="py-8 text-center text-sm text-gray-400">Not enough data</div>;

    const W = 800, H = 300, PX = 50, PY = 30;
    const chartW = W - PX * 2, chartH = H - PY * 2;

    const allVals = projection.flatMap(p => [p.cumulative, 0]);
    const maxV = Math.max(...allVals, 1);
    const minV = Math.min(...allVals, 0);
    const range = maxV - minV || 1;

    const x = (i: number) => PX + (i / (projection.length - 1)) * chartW;
    const y = (v: number) => PY + chartH - ((v - minV) / range) * chartH;

    const cumulLine = projection.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.cumulative).toFixed(1)}`).join(' ');
    const zeroY = y(0);

    // Fill area
    const fillAbove = `${cumulLine} L${x(projection.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${x(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

    // Grid lines
    const gridCount = 5;
    const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
        const val = minV + (range / gridCount) * i;
        return { y: y(val), label: formatCurrency(val) };
    });

    const breakIdx = projection.findIndex(p => p.month === breakEvenMonth);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
            {/* Grid */}
            {gridLines.map((g, i) => (
                <g key={i}>
                    <line x1={PX} y1={g.y} x2={W - PX} y2={g.y} stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeDasharray="4 4" />
                    <text x={PX - 8} y={g.y + 4} textAnchor="end" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9">{g.label}</text>
                </g>
            ))}

            {/* Zero line */}
            <line x1={PX} y1={zeroY} x2={W - PX} y2={zeroY} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" />

            {/* Fill */}
            <path d={fillAbove} className="fill-teal-500/10 dark:fill-teal-400/10" />

            {/* Cumulative line */}
            <path d={cumulLine} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {projection.map((p, i) => (
                <g key={p.month}>
                    <circle cx={x(i)} cy={y(p.cumulative)} r="4" fill={p.cumulative >= 0 ? '#14b8a6' : '#ef4444'} stroke="white" strokeWidth="2" className="dark:stroke-gray-800" />
                    {/* X label */}
                    {i % Math.max(1, Math.floor(projection.length / 12)) === 0 && (
                        <text x={x(i)} y={H - 5} textAnchor="middle" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9">
                            {new Date(p.month + '-01').toLocaleDateString('fr-BE', { month: 'short' })}
                        </text>
                    )}
                </g>
            ))}

            {/* Break-even marker */}
            {breakIdx >= 0 && (
                <g>
                    <line x1={x(breakIdx)} y1={PY} x2={x(breakIdx)} y2={H - PY} stroke="#14b8a6" strokeDasharray="6 3" strokeWidth="1" />
                    <rect x={x(breakIdx) - 50} y={PY - 2} width="100" height="16" rx="4" fill="#14b8a6" />
                    <text x={x(breakIdx)} y={PY + 10} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Break-even</text>
                </g>
            )}
        </svg>
    );
}

// ── Modal ──
function BudgetLineModal({ projectId, line, onClose }: { projectId: number; line: BudgetLine | null; onClose: () => void }) {
    const { t } = useTranslation();
    const form = useForm({
        label: line?.label || '',
        type: line?.type || 'income',
        amount: line?.amount ? String(line.amount) : '',
        frequency: line?.frequency || 'monthly',
        trigger: line?.trigger || 'immediate',
        start_date: line?.start_date?.substring(0, 10) || '',
        end_date: line?.end_date?.substring(0, 10) || '',
        is_confirmed: line?.is_confirmed ?? false,
        notes: line?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (line) {
            form.put(`/admin/projects/${projectId}/budget/${line.id}`, { onSuccess: onClose, preserveScroll: true });
        } else {
            form.post(`/admin/projects/${projectId}/budget`, { onSuccess: onClose, preserveScroll: true });
        }
    };

    const inputC = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-400';

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose} />
            <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl animate-modal">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{line ? t('Edit') : t('Add')} {t('Budget Line')}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Label')} *</label>
                        <input type="text" value={form.data.label} onChange={e => form.setData('label', e.target.value)} className={inputC} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Type')}</label>
                            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                <button type="button" onClick={() => form.setData('type', 'income')} className={`flex-1 py-2.5 text-xs font-bold transition-colors ${form.data.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-500'}`}>{t('Income')}</button>
                                <button type="button" onClick={() => form.setData('type', 'expense')} className={`flex-1 py-2.5 text-xs font-bold transition-colors ${form.data.type === 'expense' ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-500'}`}>{t('Expense')}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Amount')} *</label>
                            <input type="number" value={form.data.amount} onChange={e => form.setData('amount', e.target.value)} className={inputC} step="0.01" min="0" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Frequency')}</label>
                            <SearchableSelect
                                value={form.data.frequency}
                                onChange={(val) => form.setData('frequency', val)}
                                options={[
                                    { value: 'one_time', label: t('One-time') },
                                    { value: 'monthly', label: t('Monthly') },
                                    { value: 'quarterly', label: t('Quarterly') },
                                    { value: 'annual', label: t('Annual') },
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Trigger')}</label>
                            <SearchableSelect
                                value={form.data.trigger}
                                onChange={(val) => form.setData('trigger', val)}
                                options={[
                                    { value: 'immediate', label: t('Immediate') },
                                    { value: 'from_date', label: t('From date') },
                                    { value: 'on_project_completed', label: t('On completion') },
                                ]}
                            />
                        </div>
                    </div>
                    {form.data.trigger === 'from_date' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Start Date')}</label>
                                <input type="date" value={form.data.start_date} onChange={e => form.setData('start_date', e.target.value)} className={inputC} required />
                            </div>
                            {form.data.frequency !== 'one_time' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('End Date')}</label>
                                    <input type="date" value={form.data.end_date} onChange={e => form.setData('end_date', e.target.value)} className={inputC} />
                                </div>
                            )}
                        </div>
                    )}
                    <label className="flex items-center gap-3 cursor-pointer py-2">
                        <input type="checkbox" checked={form.data.is_confirmed} onChange={e => form.setData('is_confirmed', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{t('Confirmed')}</span>
                    </label>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Notes')}</label>
                        <textarea value={form.data.notes} onChange={e => form.setData('notes', e.target.value)} rows={2} className={inputC} />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">{t('Cancel')}</button>
                        <button type="submit" disabled={form.processing} className="px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors">
                            {form.processing ? t('Saving...') : t('Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
