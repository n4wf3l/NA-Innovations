import { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { useBranding } from '@/hooks/useBranding';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface TeamMember { name: string; role: string; monthly_salary: number; }
interface InfraItem { name: string; cost: number; frequency: 'monthly' | 'yearly'; }
interface PriceTier { from_month: number; price: number; label: string; }
interface HistoryEntry { date: string; user: string; changes: string[]; snapshot: any; }
interface ProductOption { id: number; name: string; pricing_monthly: string | null; }
interface Simulation {
    id: number; name: string; product_id: number | null; product_name: string | null; infra_items?: InfraItem[];
    monthly_price: string; client_growth: any; team_members: TeamMember[];
    infra_cost_monthly: string; commission_rate: string; time_horizon: number; notes: string | null;
    initial_investment?: string; price_tiers?: PriceTier[]; shared_with_devs?: number[]; history?: HistoryEntry[];
}
interface ProjectionPoint { month: number; clients: number; revenue: number; total_cost: number; profit: number; cumulative: number; }

interface Props {
    simulation: Simulation | null;
    products: ProductOption[];
    projection?: { months: ProjectionPoint[]; break_even_month: number | null; total_revenue: number; total_costs: number; total_profit: number; };
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';
const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

function Hint({ children }: { children: React.ReactNode }) {
    return <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{children}</p>;
}

function SectionTitle({ title, hint }: { title: string; hint: string }) {
    return (
        <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{hint}</p>
        </div>
    );
}

export default function SimulatorShow({ simulation, products }: Props) {
    const { t } = useTranslation();
    const { companyName } = useBranding();
    const isNew = !simulation;

    const [name, setName] = useState(simulation?.name || '');
    const [productId, setProductId] = useState<number | null>(simulation?.product_id || null);
    const [productName, setProductName] = useState(simulation?.product_name || '');
    const [monthlyPrice, setMonthlyPrice] = useState(Number(simulation?.monthly_price || 29));
    const [growthMode, setGrowthMode] = useState<'rate' | 'manual'>(
        simulation?.client_growth?.initial_clients !== undefined ? 'rate' : 'manual'
    );
    const [initialClients, setInitialClients] = useState(simulation?.client_growth?.initial_clients ?? 5);
    const [growthRate, setGrowthRate] = useState(simulation?.client_growth?.monthly_growth_rate ?? 15);
    const [manualClients, setManualClients] = useState<number[]>(
        Array.isArray(simulation?.client_growth) ? simulation.client_growth : [5, 8, 12, 18, 25, 35, 50, 70, 95, 130, 175, 230]
    );
    const [team, setTeam] = useState<TeamMember[]>(simulation?.team_members || [{ name: 'Dev 1', role: 'developer', monthly_salary: 2500 }]);
    const [infraItems, setInfraItems] = useState<InfraItem[]>(simulation?.infra_items || [{ name: 'Hébergement', cost: 25, frequency: 'monthly' }, { name: 'Nom de domaine', cost: 15, frequency: 'yearly' }]);
    const infraCost = infraItems.reduce((sum, item) => sum + (item.frequency === 'yearly' ? item.cost / 12 : item.cost), 0);
    const [initialInvestment, setInitialInvestment] = useState(Number(simulation?.initial_investment || 0));
    const [priceTiers, setPriceTiers] = useState<PriceTier[]>(simulation?.price_tiers || []);
    const [commissionRate, setCommissionRate] = useState(Number(simulation?.commission_rate || 0));
    const [timeHorizon, setTimeHorizon] = useState(simulation?.time_horizon || 12);
    const [notes, setNotes] = useState(simulation?.notes || '');
    const [sharedWithDevs, setSharedWithDevs] = useState<number[]>(simulation?.shared_with_devs || []);
    const [saving, setSaving] = useState(false);
    const [activeSimTab, setActiveSimTab] = useState<'simulation' | 'history'>('simulation');

    // Auto-fill price when selecting a product
    const handleProductSelect = (id: string) => {
        const pid = id ? Number(id) : null;
        setProductId(pid);
        if (pid) {
            const p = products.find(pr => pr.id === pid);
            if (p?.pricing_monthly) setMonthlyPrice(Number(p.pricing_monthly));
            setProductName(p?.name || '');
        }
    };

    // Compute projection client-side in real-time
    const projection = useMemo(() => {
        const months: ProjectionPoint[] = [];
        let cumulative = -initialInvestment;
        const teamCost = team.reduce((sum, m) => sum + (m.monthly_salary || 0), 0);
        let breakEven: number | null = null;
        const sortedTiers = [...priceTiers].sort((a, b) => a.from_month - b.from_month);

        for (let i = 0; i < timeHorizon; i++) {
            const monthNum = i + 1;
            const clients = growthMode === 'manual'
                ? (manualClients[i] ?? manualClients[manualClients.length - 1] ?? 0)
                : Math.round(initialClients * Math.pow(1 + growthRate / 100, i));

            // Find applicable price tier
            let price = monthlyPrice;
            for (const tier of sortedTiers) {
                if (monthNum >= tier.from_month) price = tier.price;
            }

            const revenue = clients * price;
            const commCost = revenue * commissionRate / 100;
            const totalCost = teamCost + infraCost + commCost;
            const profit = revenue - totalCost;
            cumulative += profit;
            if (breakEven === null && cumulative > 0) breakEven = monthNum;
            months.push({ month: monthNum, clients, revenue: Math.round(revenue * 100) / 100, total_cost: Math.round(totalCost * 100) / 100, profit: Math.round(profit * 100) / 100, cumulative: Math.round(cumulative * 100) / 100 });
        }
        return { months, break_even_month: breakEven, initial_investment: initialInvestment, total_revenue: months.reduce((s, m) => s + m.revenue, 0), total_costs: months.reduce((s, m) => s + m.total_cost, 0) + initialInvestment, total_profit: cumulative };
    }, [monthlyPrice, team, infraCost, commissionRate, timeHorizon, growthMode, manualClients, initialClients, growthRate, initialInvestment, priceTiers]);

    const handleSave = () => {
        setSaving(true);
        const data = {
            name: name || t('Sans titre'),
            product_id: productId,
            product_name: productName || null,
            monthly_price: monthlyPrice,
            client_growth: growthMode === 'rate' ? { initial_clients: initialClients, monthly_growth_rate: growthRate } : manualClients.slice(0, timeHorizon),
            team_members: team,
            infra_cost_monthly: Math.round(infraCost * 100) / 100,
            infra_items: infraItems,
            initial_investment: initialInvestment,
            price_tiers: priceTiers,
            commission_rate: commissionRate,
            shared_with_devs: sharedWithDevs,
            time_horizon: timeHorizon,
            notes: notes || null,
        };

        if (isNew) {
            router.post('/admin/simulator', data, { onFinish: () => setSaving(false) });
        } else {
            router.put(`/admin/simulator/${simulation.id}`, data, { onFinish: () => setSaving(false), preserveScroll: true });
        }
    };

    const addTeamMember = () => setTeam([...team, { name: `Dev ${team.length + 1}`, role: 'developer', monthly_salary: 2500 }]);
    const removeTeamMember = (i: number) => setTeam(team.filter((_, idx) => idx !== i));
    const updateTeamMember = (i: number, field: keyof TeamMember, value: any) => {
        const updated = [...team]; updated[i] = { ...updated[i], [field]: value }; setTeam(updated);
    };

    // ─── Export functions ───

    const handleExportCSV = () => {
        const BOM = '\uFEFF';
        const headers = [t('Mois'), t('Clients'), t('Revenu'), t('Coûts'), t('Profit'), t('Cumulatif')];
        const rows = projection.months.map(m => [m.month, m.clients, m.revenue.toFixed(2), m.total_cost.toFixed(2), m.profit.toFixed(2), m.cumulative.toFixed(2)]);

        // Summary section
        const summary = [
            '', '',
            [t('SIMULATION'), name || t('Sans titre')],
            [t('Produit'), productName || '-'],
            [t('Prix / client / mois'), `${monthlyPrice} €`],
            [t('Horizon'), `${timeHorizon} ${t('mois')}`],
            [t('Équipe'), team.map(m => `${m.name} (${m.monthly_salary}€)`).join(', ')],
            [t('Coût équipe / mois'), `${team.reduce((s, m) => s + m.monthly_salary, 0)} €`],
            [t('Infrastructure / mois'), `${infraCost.toFixed(2)} €`],
            ...(infraItems.length > 0 ? infraItems.map(item => [`  ${item.name}`, `${item.cost}€/${item.frequency === 'yearly' ? t('an') : t('mois')}`]) : []),
            [t('Commission'), `${commissionRate}%`],
            '',
            [t('RÉSULTATS')],
            [t('Revenu total'), `${projection.total_revenue.toFixed(2)} €`],
            [t('Coûts totaux'), `${projection.total_costs.toFixed(2)} €`],
            [t('Profit net'), `${projection.total_profit.toFixed(2)} €`],
            [t('Break-even'), projection.break_even_month ? `${t('Mois')} ${projection.break_even_month}` : '-'],
            '', '',
        ];

        const csv = BOM + [...summary.map(r => Array.isArray(r) ? r.join(';') : ''), headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation-${(name || 'export').replace(/\s+/g, '-').toLowerCase()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const teamCost = team.reduce((s, m) => s + m.monthly_salary, 0);
        const fc = (n: number) => new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(n);

        printWindow.document.write(`<!DOCTYPE html><html><head><title>${name || t('Simulation')}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; padding: 40px; font-size: 12px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; }
            .header h1 { font-size: 22px; font-weight: 800; color: #1e1b4b; }
            .header .meta { text-align: right; color: #6b7280; font-size: 11px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
            .kpi { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
            .kpi .value { font-size: 18px; font-weight: 800; color: #111; }
            .kpi .label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
            .kpi.green .value { color: #059669; }
            .kpi.red .value { color: #dc2626; }
            .section { margin-bottom: 20px; }
            .section h2 { font-size: 13px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
            .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background: #f9fafb; text-align: left; padding: 6px 8px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
            td { padding: 5px 8px; border-bottom: 1px solid #f3f4f6; }
            tr.break-even { background: #eef2ff; font-weight: 600; }
            .profit-pos { color: #059669; }
            .profit-neg { color: #dc2626; }
            .info-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #f3f4f6; }
            .info-row .label { color: #6b7280; }
            .info-row .val { font-weight: 600; }
            .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 10px; }
            @media print { body { padding: 20px; } }
        </style></head><body>
        <div class="header">
            <div>
                <h1>${name || t('Simulation financière')}</h1>
                <p style="color:#6b7280;margin-top:4px">${productName || ''}</p>
            </div>
            <div class="meta">
                <strong>${companyName}</strong><br>
                ${new Date().toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
                ${t('Horizon')}: ${timeHorizon} ${t('mois')}
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi"><div class="value">${fc(projection.total_revenue)}</div><div class="label">${t('Revenu total')}</div></div>
            <div class="kpi"><div class="value">${fc(projection.total_costs)}</div><div class="label">${t('Coûts totaux')}</div></div>
            <div class="kpi ${projection.total_profit >= 0 ? 'green' : 'red'}"><div class="value">${fc(projection.total_profit)}</div><div class="label">${t('Profit net')}</div></div>
            <div class="kpi"><div class="value">${projection.break_even_month ? `${t('Mois')} ${projection.break_even_month}` : '-'}</div><div class="label">Break-even</div></div>
        </div>

        <div class="two-col">
            <div class="section">
                <h2>${t('Paramètres')}</h2>
                <div class="info-row"><span class="label">${t('Prix / client')}</span><span class="val">${fc(monthlyPrice)}/mo</span></div>
                <div class="info-row"><span class="label">${t('Croissance')}</span><span class="val">${growthMode === 'rate' ? `${initialClients} ${t('clients')} +${growthRate}%/mo` : t('Manuel')}</span></div>
                <div class="info-row"><span class="label">${t('Commission')}</span><span class="val">${commissionRate}%</span></div>
                <div class="info-row"><span class="label">${t('Coût équipe')}</span><span class="val">${fc(teamCost)}/mo</span></div>
                <div class="info-row"><span class="label">${t('Infrastructure')}</span><span class="val">${fc(infraCost)}/mo</span></div>
            </div>
            <div class="section">
                <h2>${t('Équipe')} (${team.length})</h2>
                ${team.map(m => `<div class="info-row"><span class="label">${m.name} <small>(${m.role})</small></span><span class="val">${fc(m.monthly_salary)}/mo</span></div>`).join('')}
                ${infraItems.length > 0 ? `<h2 style="margin-top:12px">${t('Infrastructure')}</h2>` + infraItems.map(item => `<div class="info-row"><span class="label">${item.name}</span><span class="val">${fc(item.cost)}/${item.frequency === 'yearly' ? t('an') : t('mois')}</span></div>`).join('') : ''}
            </div>
        </div>

        <div class="section">
            <h2>${t('Projection mois par mois')}</h2>
            <table>
                <thead><tr><th>${t('Mois')}</th><th>${t('Clients')}</th><th>${t('Revenu')}</th><th>${t('Coûts')}</th><th>${t('Profit')}</th><th>${t('Cumulatif')}</th></tr></thead>
                <tbody>
                    ${projection.months.map(m => `<tr class="${m.month === projection.break_even_month ? 'break-even' : ''}">
                        <td>${t('Mois')} ${m.month}${m.month === projection.break_even_month ? ' ← BREAK-EVEN' : ''}</td>
                        <td>${m.clients}</td>
                        <td>${fc(m.revenue)}</td>
                        <td>${fc(m.total_cost)}</td>
                        <td class="${m.profit >= 0 ? 'profit-pos' : 'profit-neg'}">${fc(m.profit)}</td>
                        <td class="${m.cumulative >= 0 ? 'profit-pos' : 'profit-neg'}">${fc(m.cumulative)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>

        ${notes ? `<div class="section"><h2>${t('Notes')}</h2><p style="color:#6b7280">${notes}</p></div>` : ''}

        <div class="footer">${t('Simulation financière générée par')} ${companyName} - ${new Date().toLocaleDateString('fr-BE')}</div>
        </body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
    };

    const handleExportPDF = () => {
        // Use the same print template but trigger save as PDF via print dialog
        handlePrint();
    };

    // ─── Chart dimensions ───
    const chartW = 600, chartH = 200, chartPad = 40;

    const maxRevenue = Math.max(...projection.months.map(m => Math.max(m.revenue, m.total_cost)), 1);
    const revenuePath = projection.months.map((m, i) => {
        const x = chartPad + (i / (timeHorizon - 1)) * (chartW - chartPad * 2);
        const y = chartH - chartPad - (m.revenue / maxRevenue) * (chartH - chartPad * 2);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    const costPath = projection.months.map((m, i) => {
        const x = chartPad + (i / (timeHorizon - 1)) * (chartW - chartPad * 2);
        const y = chartH - chartPad - (m.total_cost / maxRevenue) * (chartH - chartPad * 2);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    return (
        <AdminLayout header={isNew ? t('Nouvelle simulation') : name}>
            <Head title={isNew ? t('Nouvelle simulation') : name} />

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/simulator" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    {t('Toutes les simulations')}
                </Link>
                <div className="flex items-center gap-2">
                    {/* Export buttons */}
                    {!isNew && (
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
                            <button onClick={handlePrint} className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5" title={t('Imprimer')}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
                                {t('Imprimer')}
                            </button>
                            <button onClick={handleExportCSV} className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5" title="Excel/CSV">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375" /></svg>
                                CSV
                            </button>
                            <button onClick={handleExportPDF} className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5" title="PDF">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                PDF
                            </button>
                        </div>
                    )}
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20">
                        {saving ? t('Enregistrement...') : isNew ? t('Créer la simulation') : t('Enregistrer')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ─── LEFT: Inputs ─── */}
                <div className="xl:col-span-1 space-y-4">
                    {/* Name */}
                    <div className={`${card} p-5`}>
                        <label className={labelClass}>{t('Nom de la simulation')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder={t('Ex: Cabs SaaS - Scénario optimiste')} />
                        <Hint>{t('Donnez un nom descriptif pour retrouver cette simulation. Ex: "Cabs - Pessimiste", "RestaurantOS - 100 clients".')}</Hint>
                    </div>

                    {/* Product + Price */}
                    <div className={`${card} p-5 space-y-3`}>
                        <SectionTitle title={t('Produit & Tarification')} hint={t('Liez un produit existant pour auto-remplir le prix, ou entrez un nom libre pour un projet hypothétique.')} />
                        <div>
                            <label className={labelClass}>{t('Produit (optionnel)')}</label>
                            <SearchableSelect
                                options={products.map(p => ({ value: String(p.id), label: p.name }))}
                                value={productId ? String(productId) : ''}
                                onChange={handleProductSelect}
                                placeholder={t('Sélectionner un produit...')}
                            />
                        </div>
                        {!productId && (
                            <div>
                                <label className={labelClass}>{t('Ou nom libre')}</label>
                                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className={inputClass} placeholder="Ex: RestaurantOS" />
                            </div>
                        )}
                        <div>
                            <label className={labelClass}>{t('Prix mensuel / client')}</label>
                            <div className="relative">
                                <input type="number" min={0} step={0.01} value={monthlyPrice} onChange={e => setMonthlyPrice(Number(e.target.value))} className={`${inputClass} pr-10`} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€/mo</span>
                            </div>
                            <Hint>{t('Le montant que chaque client paie par mois. Le revenu = clients × ce prix.')}</Hint>
                        </div>
                    </div>

                    {/* Client Growth */}
                    <div className={`${card} p-5`}>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t('Croissance clients')}</label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                <button onClick={() => setGrowthMode('rate')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${growthMode === 'rate' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>{t('Taux')}</button>
                                <button onClick={() => setGrowthMode('manual')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${growthMode === 'manual' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>{t('Manuel')}</button>
                            </div>
                        </div>
                        <Hint>{growthMode === 'rate'
                            ? t('Mode Taux : le nombre de clients augmente automatiquement chaque mois selon le pourcentage indiqué. Ex: 5 clients initiaux + 15%/mois = 5, 6, 7, 8, 9...')
                            : t('Mode Manuel : entrez le nombre exact de clients prévu pour chaque mois. Utile si vous avez un plan de prospection précis.')
                        }</Hint>

                        {growthMode === 'rate' ? (
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                    <label className={labelClass}>{t('Clients initiaux')}</label>
                                    <input type="number" min={0} value={initialClients} onChange={e => setInitialClients(Number(e.target.value))} className={inputClass} />
                                    <Hint>{t('Combien de clients au mois 1 (lancement).')}</Hint>
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Croissance / mois')}</label>
                                    <div className="relative">
                                        <input type="number" min={0} max={200} value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} className={`${inputClass} pr-8`} />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                                    </div>
                                    <Hint>{t('10-20% = croissance modérée. 30%+ = croissance agressive.')}</Hint>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scroll mt-3">
                                {Array.from({ length: timeHorizon }).map((_, i) => (
                                    <div key={i}>
                                        <label className="text-[10px] text-gray-400">M{i + 1}</label>
                                        <input type="number" min={0} value={manualClients[i] ?? 0}
                                            onChange={e => { const v = [...manualClients]; v[i] = Number(e.target.value); setManualClients(v); }}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Team */}
                    <div className={`${card} p-5`}>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t('Équipe')}</label>
                            <button onClick={addTeamMember} className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">+ {t('Ajouter')}</button>
                        </div>
                        <Hint>{t('Les personnes qui travailleront sur ce projet. Le coût total de l\'équipe est déduit du revenu chaque mois. Incluez-vous si vous travaillez dessus.')}</Hint>
                        <div className="space-y-2 mt-3">
                            {team.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                                    <input type="text" value={m.name} onChange={e => updateTeamMember(i, 'name', e.target.value)} className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white" placeholder={t('Nom')} />
                                    <select value={m.role} onChange={e => updateTeamMember(i, 'role', e.target.value)} className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white">
                                        <option value="developer">Dev</option>
                                        <option value="designer">Design</option>
                                        <option value="manager">Manager</option>
                                        <option value="other">{t('Autre')}</option>
                                    </select>
                                    <div className="relative">
                                        <input type="number" min={0} value={m.monthly_salary} onChange={e => updateTeamMember(i, 'monthly_salary', Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white pr-6" />
                                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">€</span>
                                    </div>
                                    {team.length > 1 && (
                                        <button onClick={() => removeTeamMember(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Costs + Horizon */}
                    <div className={`${card} p-5 space-y-3`}>
                        <SectionTitle title={t('Coûts & Horizon')} hint={t('Les coûts fixes déduits du revenu pour calculer le profit.')} />

                        {/* Infra items list */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('Infrastructure & Services')}</label>
                                <button onClick={() => setInfraItems([...infraItems, { name: '', cost: 0, frequency: 'monthly' }])} className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">+ {t('Ajouter')}</button>
                            </div>
                            <Hint>{t('Listez chaque coût : hébergement, domaine, API, outils. Les coûts annuels sont divisés par 12.')}</Hint>
                            <div className="space-y-2 mt-2">
                                {infraItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                                        <input type="text" value={item.name} onChange={e => { const v = [...infraItems]; v[i] = { ...v[i], name: e.target.value }; setInfraItems(v); }}
                                            className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white" placeholder={t('Ex: Hébergement')} />
                                        <div className="relative">
                                            <input type="number" min={0} step={0.01} value={item.cost} onChange={e => { const v = [...infraItems]; v[i] = { ...v[i], cost: Number(e.target.value) }; setInfraItems(v); }}
                                                className="w-20 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white pr-6" />
                                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">€</span>
                                        </div>
                                        <select value={item.frequency} onChange={e => { const v = [...infraItems]; v[i] = { ...v[i], frequency: e.target.value as 'monthly' | 'yearly' }; setInfraItems(v); }}
                                            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white">
                                            <option value="monthly">{t('/mois')}</option>
                                            <option value="yearly">{t('/an')}</option>
                                        </select>
                                        <button onClick={() => setInfraItems(infraItems.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {infraItems.length > 0 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-[11px] text-gray-400">{t('Total mensuel infrastructure')}</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{formatCurrency(Math.round(infraCost * 100) / 100)}/mo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Initial investment */}
                        <div>
                            <label className={labelClass}>{t('Investissement initial (one-time)')}</label>
                            <div className="relative">
                                <input type="number" min={0} value={initialInvestment} onChange={e => setInitialInvestment(Number(e.target.value))} className={`${inputClass} pr-8`} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                            </div>
                            <Hint>{t('Coût de développement, design, marketing de lancement. Déduit du cumulatif dès le mois 1. 0 si aucun.')}</Hint>
                        </div>

                        {/* Price tiers */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className={labelClass}>{t('Paliers de prix')}</label>
                                <button onClick={() => setPriceTiers([...priceTiers, { from_month: priceTiers.length > 0 ? (priceTiers[priceTiers.length - 1].from_month + 6) : 7, price: monthlyPrice + 10, label: '' }])} className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">+ {t('Ajouter')}</button>
                            </div>
                            <Hint>{t('Changez le prix à partir d\'un mois donné. Ex: 19€ les 6 premiers mois, puis 29€. Le prix de base s\'applique avant le premier palier.')}</Hint>
                            {priceTiers.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {priceTiers.map((tier, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{t('Mois')}</span>
                                                <input type="number" min={2} max={36} value={tier.from_month} onChange={e => { const v = [...priceTiers]; v[i] = { ...v[i], from_month: Number(e.target.value) }; setPriceTiers(v); }}
                                                    className="w-14 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white text-center" />
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                            <div className="relative flex-1">
                                                <input type="number" min={0} step={0.01} value={tier.price} onChange={e => { const v = [...priceTiers]; v[i] = { ...v[i], price: Number(e.target.value) }; setPriceTiers(v); }}
                                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white pr-10" />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">€/mo</span>
                                            </div>
                                            <input type="text" value={tier.label} onChange={e => { const v = [...priceTiers]; v[i] = { ...v[i], label: e.target.value }; setPriceTiers(v); }}
                                                className="w-24 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-white" placeholder={t('Label')} />
                                            <button onClick={() => setPriceTiers(priceTiers.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Commission */}
                        <div>
                            <label className={labelClass}>{t('Commission sur revenu')}</label>
                            <div className="relative">
                                <input type="number" min={0} max={100} value={commissionRate} onChange={e => setCommissionRate(Number(e.target.value))} className={`${inputClass} pr-8`} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                            <Hint>{t('% du revenu reversé (ex: frais Stripe 2.9%, commission partenaire). 0 si aucun.')}</Hint>
                        </div>
                        <div>
                            <label className={labelClass}>{t('Horizon de simulation')}</label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                {[6, 12, 24, 36].map(h => (
                                    <button key={h} onClick={() => setTimeHorizon(h)} className={`flex-1 py-2 text-xs font-medium rounded-md transition ${timeHorizon === h ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                        {h} {t('mois')}
                                    </button>
                                ))}
                            </div>
                            <Hint>{t('Sur combien de mois simuler. 12 mois est standard, 36 mois pour une vision long terme.')}</Hint>
                        </div>
                        <div>
                            <label className={labelClass}>{t('Notes')}</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} placeholder={t('Hypothèses, conditions, rappels...')} />
                            <Hint>{t('Notez vos hypothèses pour vous en souvenir plus tard. Ex: "Prix basé sur le marché belge, sans marketing payant".')}</Hint>
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT: Results ─── */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Tabs: Simulation | Historique */}
                    {!isNew && (
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                            <button onClick={() => setActiveSimTab('simulation')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSimTab === 'simulation' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{t('Résultats')}</button>
                            <button onClick={() => setActiveSimTab('history')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeSimTab === 'history' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                                {t('Historique')}
                                {(simulation?.history?.length ?? 0) > 0 && <span className="text-[10px] bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">{simulation?.history?.length}</span>}
                            </button>
                        </div>
                    )}

                    {/* History tab */}
                    {activeSimTab === 'history' && simulation?.history && (
                        <div key="history" className="animate-tab-in">
                            <div className={`${card} p-6`}>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{t('Historique des modifications')}</h3>
                                {simulation.history.length === 0 ? (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucune modification enregistrée.')}</p>
                                ) : (
                                    <div className="relative pl-6 space-y-4">
                                        <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
                                        {[...simulation.history].reverse().map((entry, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-800" />
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{entry.user}</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(entry.date).toLocaleString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {entry.changes.map((c: string) => (
                                                            <span key={c} className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">{c}</span>
                                                        ))}
                                                    </div>
                                                    {entry.snapshot && (
                                                        <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                                                            <span>{t('Prix')}: {entry.snapshot.monthly_price}€</span>
                                                            <span>{t('Équipe')}: {entry.snapshot.team_count}</span>
                                                            <span>{t('Infra')}: {entry.snapshot.infra_cost}€</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results tab */}
                    {activeSimTab === 'simulation' && (<div key="simulation" className="animate-tab-in space-y-4">

                    {/* KPIs */}
                    <div className={`grid grid-cols-2 ${initialInvestment > 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3`}>
                        {initialInvestment > 0 && (
                            <div className={`${card} p-4 text-center`}>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('Investissement')}</p>
                                <p className="text-xl font-black text-red-500">{formatCurrency(initialInvestment)}</p>
                            </div>
                        )}
                        <div className={`${card} p-4 text-center`}>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('Revenu total')}</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(projection.total_revenue)}</p>
                        </div>
                        <div className={`${card} p-4 text-center`}>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('Coûts totaux')}</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(projection.total_costs)}</p>
                        </div>
                        <div className={`${card} p-4 text-center`}>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('Profit net')}</p>
                            <p className={`text-xl font-black ${projection.total_profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(projection.total_profit)}</p>
                        </div>
                        <div className={`${card} p-4 text-center`}>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('Break-even')}</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{projection.break_even_month ? `${t('Mois')} ${projection.break_even_month}` : '-'}</p>
                        </div>
                    </div>

                    {/* Revenue vs Costs Chart */}
                    <div className={`${card} p-5`}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('Revenu vs Coûts')}</h3>
                        <div className="overflow-x-auto">
                            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ minWidth: 400 }}>
                                {/* Grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map(p => {
                                    const y = chartH - chartPad - p * (chartH - chartPad * 2);
                                    return <line key={p} x1={chartPad} y1={y} x2={chartW - chartPad} y2={y} stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth={1} />;
                                })}
                                {/* Revenue line */}
                                <path d={revenuePath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                                {/* Cost line */}
                                <path d={costPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" strokeLinecap="round" />
                                {/* Break-even line */}
                                {projection.break_even_month && (
                                    <line
                                        x1={chartPad + ((projection.break_even_month - 1) / (timeHorizon - 1)) * (chartW - chartPad * 2)}
                                        y1={chartPad / 2}
                                        x2={chartPad + ((projection.break_even_month - 1) / (timeHorizon - 1)) * (chartW - chartPad * 2)}
                                        y2={chartH - chartPad}
                                        stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 4"
                                    />
                                )}
                                {/* Labels */}
                                <text x={chartW - chartPad} y={chartPad / 2 + 4} textAnchor="end" className="fill-emerald-500 text-[10px] font-semibold">{t('Revenu')}</text>
                                <text x={chartW - chartPad} y={chartPad / 2 + 16} textAnchor="end" className="fill-red-400 text-[10px] font-semibold">{t('Coûts')}</text>
                                {/* X axis month labels */}
                                {projection.months.filter((_, i) => i % Math.ceil(timeHorizon / 8) === 0 || i === timeHorizon - 1).map(m => (
                                    <text key={m.month} x={chartPad + ((m.month - 1) / (timeHorizon - 1)) * (chartW - chartPad * 2)} y={chartH - 8} textAnchor="middle" className="fill-gray-400 text-[10px]">M{m.month}</text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Monthly Profit Bars */}
                    <div className={`${card} p-5`}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('Profit mensuel')}</h3>
                        <div className="flex items-end gap-1 h-32">
                            {projection.months.map(m => {
                                const maxAbs = Math.max(...projection.months.map(x => Math.abs(x.profit)), 1);
                                const h = Math.abs(m.profit) / maxAbs * 100;
                                return (
                                    <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                        <div className={`w-full max-w-[20px] rounded-t transition-all duration-200 group-hover:opacity-80 ${m.profit >= 0 ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-red-400 dark:bg-red-500'}`} style={{ height: `${Math.max(h, 2)}%` }} />
                                        <span className="absolute -top-5 text-[9px] font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{formatCurrency(m.profit)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-gray-400">M1</span>
                            <span className="text-[10px] text-gray-400">M{timeHorizon}</span>
                        </div>
                    </div>

                    {/* Clients growth */}
                    <div className={`${card} p-5`}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('Évolution clients')}</h3>
                        <div className="flex items-end gap-1 h-24">
                            {projection.months.map(m => {
                                const maxC = Math.max(...projection.months.map(x => x.clients), 1);
                                const h = (m.clients / maxC) * 100;
                                return (
                                    <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                        <div className="w-full max-w-[20px] bg-indigo-400 dark:bg-indigo-500 rounded-t transition-all duration-200 group-hover:bg-indigo-500" style={{ height: `${Math.max(h, 2)}%` }} />
                                        <span className="absolute -top-5 text-[9px] font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{m.clients}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-gray-400">M1: {projection.months[0]?.clients}</span>
                            <span className="text-[10px] text-gray-400">M{timeHorizon}: {projection.months[projection.months.length - 1]?.clients}</span>
                        </div>
                    </div>

                    {/* Data table */}
                    <details className={`${card} overflow-hidden`}>
                        <summary className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            {t('Détail mois par mois')}
                        </summary>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <th className="px-3 py-2 text-left text-gray-500 font-medium">{t('Mois')}</th>
                                        <th className="px-3 py-2 text-right text-gray-500 font-medium">{t('Clients')}</th>
                                        <th className="px-3 py-2 text-right text-gray-500 font-medium">{t('Revenu')}</th>
                                        <th className="px-3 py-2 text-right text-gray-500 font-medium">{t('Coûts')}</th>
                                        <th className="px-3 py-2 text-right text-gray-500 font-medium">{t('Profit')}</th>
                                        <th className="px-3 py-2 text-right text-gray-500 font-medium">{t('Cumulatif')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projection.months.map(m => (
                                        <tr key={m.month} className={`border-t border-gray-50 dark:border-gray-700/50 ${m.month === projection.break_even_month ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''}`}>
                                            <td className="px-3 py-1.5 text-gray-700 dark:text-gray-300 font-medium">
                                                {t('Mois')} {m.month}
                                                {m.month === projection.break_even_month && <span className="ml-1 text-[10px] text-indigo-500 font-bold">← BREAK-EVEN</span>}
                                            </td>
                                            <td className="px-3 py-1.5 text-right text-gray-600 dark:text-gray-400">{m.clients}</td>
                                            <td className="px-3 py-1.5 text-right text-gray-600 dark:text-gray-400">{formatCurrency(m.revenue)}</td>
                                            <td className="px-3 py-1.5 text-right text-gray-600 dark:text-gray-400">{formatCurrency(m.total_cost)}</td>
                                            <td className={`px-3 py-1.5 text-right font-medium ${m.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(m.profit)}</td>
                                            <td className={`px-3 py-1.5 text-right font-medium ${m.cumulative >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(m.cumulative)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                    </div>)}
                </div>
            </div>
        </AdminLayout>
    );
}
