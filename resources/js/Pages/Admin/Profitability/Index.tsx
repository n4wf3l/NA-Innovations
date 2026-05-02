import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface ProjectRow {
    id: number;
    name: string;
    status: string;
    client_name: string | null;
    client_id: number | null;
    developer_name: string | null;
    developer_id: number | null;
    partner_name: string | null;
    partner_id: number | null;
    budget: number;
    revenue: number;
    dev_cost: number;
    commission: number;
    margin: number;
    margin_pct: number | null;
}

interface ClientRow {
    id: number;
    name: string;
    projects_count: number;
    revenue: number;
    dev_cost: number;
    commission: number;
    margin: number;
    margin_pct: number | null;
}

interface DevRow {
    id: number;
    name: string;
    hourly_rate: number;
    hours_approved: number;
    total_cost: number;
    revenue_on_projects: number;
    contribution_margin: number;
}

interface PartnerRow {
    id: number;
    name: string;
    revenue_brought: number;
    commission_paid: number;
    commission_pending: number;
    commission_blocked: number;
    net_margin: number;
    commission_rate_effective: number | null;
}

interface Props {
    summary: {
        revenue: number;
        dev_cost: number;
        commissions: number;
        margin: number;
        margin_pct: number | null;
    };
    projects: ProjectRow[];
    clients: ClientRow[];
    developers: DevRow[];
    partners: PartnerRow[];
}

const fmt = (n: number) => n.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pct = (n: number | null) => n === null ? '-' : `${n}%`;

type Tab = 'projects' | 'clients' | 'developers' | 'partners';

export default function Profitability({ summary, projects, clients, developers, partners }: Props) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('projects');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return { projects, clients, developers, partners };
        return {
            projects: projects.filter(r => r.name?.toLowerCase().includes(q) || r.client_name?.toLowerCase().includes(q)),
            clients: clients.filter(r => r.name?.toLowerCase().includes(q)),
            developers: developers.filter(r => r.name?.toLowerCase().includes(q)),
            partners: partners.filter(r => r.name?.toLowerCase().includes(q)),
        };
    }, [search, projects, clients, developers, partners]);

    const marginColor = (m: number) => m > 0 ? 'text-emerald-600 dark:text-emerald-400' : m < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500';

    const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';

    return (
        <AdminLayout title={t('Rentabilité')} header={t('Rentabilité')}>
            <Head title={t('Rentabilité')} />

            {/* Hero summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20 mb-6">
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">{t('Rentabilité globale')}</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                    <div>
                        <p className="text-indigo-200 text-xs">{t('Revenus encaissés')}</p>
                        <p className="text-2xl font-black">{fmt(summary.revenue)}</p>
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs">{t('Coût dev')}</p>
                        <p className="text-2xl font-black">−{fmt(summary.dev_cost)}</p>
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs">{t('Commissions')}</p>
                        <p className="text-2xl font-black">−{fmt(summary.commissions)}</p>
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs">{t('Marge nette')}</p>
                        <p className={`text-2xl font-black ${summary.margin < 0 ? 'text-rose-200' : 'text-emerald-200'}`}>{fmt(summary.margin)}</p>
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs">{t('Marge %')}</p>
                        <p className="text-2xl font-black">{pct(summary.margin_pct)}</p>
                    </div>
                </div>
            </div>

            {/* Tabs + search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
                    {([
                        { key: 'projects' as Tab, label: t('Projets'), count: projects.length },
                        { key: 'clients' as Tab, label: t('Clients'), count: clients.length },
                        { key: 'developers' as Tab, label: t('Développeurs'), count: developers.length },
                        { key: 'partners' as Tab, label: t('Partenaires'), count: partners.length },
                    ]).map(t2 => (
                        <button
                            key={t2.key}
                            type="button"
                            onClick={() => setTab(t2.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${tab === t2.key ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {t2.label} <span className="opacity-70 ml-1">({t2.count})</span>
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('Rechercher...')}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                />
            </div>

            {tab === 'projects' && (
                <div className={card}>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">{t('Projet')}</th>
                                <th className="px-4 py-3">{t('Client')}</th>
                                <th className="px-4 py-3">{t('Dev')}</th>
                                <th className="px-4 py-3 text-right">{t('Revenus')}</th>
                                <th className="px-4 py-3 text-right">{t('Coût dev')}</th>
                                <th className="px-4 py-3 text-right">{t('Commission')}</th>
                                <th className="px-4 py-3 text-right">{t('Marge')}</th>
                                <th className="px-4 py-3 text-right">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.projects.map(r => (
                                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/projects/${r.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">{r.name}</Link>
                                        <p className="text-xs text-gray-400 mt-0.5">{r.status}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.client_name || '-'}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.developer_name || '-'}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">{fmt(r.revenue)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">−{fmt(r.dev_cost)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">−{fmt(r.commission)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${marginColor(r.margin)}`}>{fmt(r.margin)}</td>
                                    <td className={`px-4 py-3 text-right ${marginColor(r.margin)}`}>{pct(r.margin_pct)}</td>
                                </tr>
                            ))}
                            {filtered.projects.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">{t('Aucun projet.')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'clients' && (
                <div className={card}>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">{t('Client')}</th>
                                <th className="px-4 py-3 text-center">{t('Projets')}</th>
                                <th className="px-4 py-3 text-right">{t('Revenus')}</th>
                                <th className="px-4 py-3 text-right">{t('Coût dev')}</th>
                                <th className="px-4 py-3 text-right">{t('Commission')}</th>
                                <th className="px-4 py-3 text-right">{t('Marge')}</th>
                                <th className="px-4 py-3 text-right">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.clients.map(r => (
                                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{r.name}</td>
                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{r.projects_count}</td>
                                    <td className="px-4 py-3 text-right font-mono">{fmt(r.revenue)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">−{fmt(r.dev_cost)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">−{fmt(r.commission)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${marginColor(r.margin)}`}>{fmt(r.margin)}</td>
                                    <td className={`px-4 py-3 text-right ${marginColor(r.margin)}`}>{pct(r.margin_pct)}</td>
                                </tr>
                            ))}
                            {filtered.clients.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">{t('Aucun client.')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'developers' && (
                <div className={card}>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">{t('Développeur')}</th>
                                <th className="px-4 py-3 text-right">{t('Taux')}</th>
                                <th className="px-4 py-3 text-right">{t('Heures validées')}</th>
                                <th className="px-4 py-3 text-right">{t('Coût total')}</th>
                                <th className="px-4 py-3 text-right">{t('Revenus projets')}</th>
                                <th className="px-4 py-3 text-right">{t('Contribution')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.developers.map(r => (
                                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{r.name}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{r.hourly_rate ? `${r.hourly_rate} €/h` : '-'}</td>
                                    <td className="px-4 py-3 text-right font-mono">{r.hours_approved}h</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">{fmt(r.total_cost)}</td>
                                    <td className="px-4 py-3 text-right font-mono">{fmt(r.revenue_on_projects)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${marginColor(r.contribution_margin)}`}>{fmt(r.contribution_margin)}</td>
                                </tr>
                            ))}
                            {filtered.developers.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">{t('Aucun développeur.')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'partners' && (
                <div className={card}>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">{t('Partenaire')}</th>
                                <th className="px-4 py-3 text-right">{t('Revenus apportés')}</th>
                                <th className="px-4 py-3 text-right">{t('Commission payée')}</th>
                                <th className="px-4 py-3 text-right">{t('En attente')}</th>
                                <th className="px-4 py-3 text-right">{t('Bloquée')}</th>
                                <th className="px-4 py-3 text-right">{t('Marge nette')}</th>
                                <th className="px-4 py-3 text-right">{t('Taux effectif')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.partners.map(r => (
                                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{r.name}</td>
                                    <td className="px-4 py-3 text-right font-mono">{fmt(r.revenue_brought)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-500">{fmt(r.commission_paid)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-amber-500">{fmt(r.commission_pending)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-orange-500">{fmt(r.commission_blocked)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${marginColor(r.net_margin)}`}>{fmt(r.net_margin)}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{pct(r.commission_rate_effective)}</td>
                                </tr>
                            ))}
                            {filtered.partners.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">{t('Aucun partenaire.')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
