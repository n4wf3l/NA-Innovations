import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { protectedValue } from '@/Components/ui/ProtectedAmount';
import { useTranslation } from 'react-i18next';

// ─── Types ───────────────────────────────────────────────────────

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

interface TopClient {
    client_name: string;
    client_company: string | null;
    total_revenue: number;
    invoice_count: number;
}

interface ProjectionPoint {
    month: string;
    income: number;
    expense: number;
    net: number;
    cumulative: number;
}

// ─── MiniSparkline ──────────────────────────────────────────────

export function MiniSparkline({ data, color = '#14b8a6', width = 80, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const px = 2;
    const py = 2;
    const w = width - px * 2;
    const h = height - py * 2;

    const points = data.map((v, i) => {
        const x = px + (i / (data.length - 1)) * w;
        const y = py + h - ((v - min) / range) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p}`).join(' ');
    const fillPath = `${linePath} L${(px + w).toFixed(1)},${(py + h).toFixed(1)} L${px.toFixed(1)},${(py + h).toFixed(1)} Z`;

    return (
        <svg width={width} height={height} className="inline-block">
            <path d={fillPath} fill={color} opacity="0.1" />
            <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={parseFloat(points[points.length - 1].split(',')[0])} cy={parseFloat(points[points.length - 1].split(',')[1])} r="2" fill={color} />
        </svg>
    );
}

// ─── RevenueBarChart ─────────────────────────────────────────────

export function RevenueBarChart({ data, unlocked }: { data: RevenueMonth[]; unlocked: boolean }) {
    const { t } = useTranslation();
    const [hover, setHover] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">{t('No data available')}</div>;
    }

    const W = 900, H = 340, PX = 50, PY = 30, PB = 50;
    const chartW = W - PX * 2;
    const chartH = H - PY - PB;

    const maxVal = Math.max(...data.map(d => Math.max(d.income, d.invoiced)), 1);
    const barGroupW = chartW / data.length;
    const barW = Math.min(barGroupW * 0.35, 36);

    const fmtShort = (v: number) => {
        if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
        return `${v.toFixed(0)}`;
    };

    const gridCount = 5;
    const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
        const val = (maxVal / gridCount) * i;
        const y = PY + chartH - (val / maxVal) * chartH;
        return { y, label: fmtShort(val) + ' \u20AC' };
    });

    const hp = hover !== null ? data[hover] : null;
    const prevHp = hover !== null && hover > 0 ? data[hover - 1] : null;
    const hpMomChange = hp && prevHp && prevHp.income > 0
        ? ((hp.income - prevHp.income) / prevHp.income * 100).toFixed(1)
        : null;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }} onMouseLeave={() => setHover(null)}>
                <defs>
                    <linearGradient id="barGradientIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="barGradientInvoiced" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line x1={PX} y1={g.y} x2={W - PX} y2={g.y} stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeDasharray="3 3" />
                        <text x={PX - 6} y={g.y + 3} textAnchor="end" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9" fontFamily="monospace">{g.label}</text>
                    </g>
                ))}

                {/* Zero baseline */}
                <line x1={PX} y1={PY + chartH} x2={W - PX} y2={PY + chartH} stroke="currentColor" className="text-gray-200 dark:text-gray-600" strokeWidth="1" />

                {data.map((d, i) => {
                    const cx = PX + barGroupW * i + barGroupW / 2;
                    const incomeH = maxVal > 0 ? (d.income / maxVal) * chartH : 0;
                    const invoicedH = maxVal > 0 ? (d.invoiced / maxVal) * chartH : 0;
                    const incomeY = PY + chartH - incomeH;
                    const invoicedY = PY + chartH - invoicedH;
                    const monthLabel = new Date(d.month + '-01').toLocaleDateString('fr-BE', { month: 'short' });
                    const isHovered = hover === i;
                    const gap = 2;

                    return (
                        <g key={d.month} onMouseEnter={() => setHover(i)} style={{ cursor: 'pointer' }}>
                            {/* Hover zone */}
                            <rect x={PX + barGroupW * i} y={PY} width={barGroupW} height={chartH} fill="transparent" />

                            {/* Invoiced bar (left) */}
                            {d.invoiced > 0 && (
                                <rect
                                    x={cx - barW - gap / 2}
                                    y={invoicedY}
                                    width={barW}
                                    height={Math.max(invoicedH, 1)}
                                    rx="3"
                                    fill={unlocked ? 'url(#barGradientInvoiced)' : 'currentColor'}
                                    className={unlocked ? '' : 'text-gray-200 dark:text-gray-600'}
                                    opacity={isHovered ? 1 : 0.8}
                                />
                            )}

                            {/* Income bar (right) */}
                            {d.income > 0 && (
                                <rect
                                    x={cx + gap / 2}
                                    y={incomeY}
                                    width={barW}
                                    height={Math.max(incomeH, 1)}
                                    rx="3"
                                    fill={unlocked ? 'url(#barGradientIncome)' : 'currentColor'}
                                    className={unlocked ? '' : 'text-gray-200 dark:text-gray-600'}
                                    opacity={isHovered ? 1 : 0.8}
                                />
                            )}

                            {/* Value label */}
                            {!isHovered && (
                                <text x={cx} y={Math.min(incomeY, invoicedY) - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontWeight="bold">
                                    {unlocked ? (d.income > 0 ? fmtShort(d.income) + ' \u20AC' : '') : (d.income > 0 ? '\u2022\u2022\u2022\u2022' : '')}
                                </text>
                            )}

                            {/* X axis label */}
                            <text x={cx} y={H - PB + 16} textAnchor="middle" className="text-gray-400 dark:text-gray-500 fill-current" fontSize="9" fontWeight={isHovered ? 'bold' : 'normal'}>{monthLabel}</text>
                            {(i === 0 || d.month.endsWith('-01')) && (
                                <text x={cx} y={H - PB + 28} textAnchor="middle" className="text-gray-300 dark:text-gray-600 fill-current" fontSize="8">{d.month.slice(0, 4)}</text>
                            )}
                        </g>
                    );
                })}

                {/* Hover crosshair */}
                {hover !== null && (
                    <line
                        x1={PX + barGroupW * hover + barGroupW / 2}
                        y1={PY}
                        x2={PX + barGroupW * hover + barGroupW / 2}
                        y2={PY + chartH}
                        stroke="currentColor"
                        className="text-gray-300 dark:text-gray-600"
                        strokeDasharray="4 2"
                        strokeWidth="1"
                    />
                )}

                {/* Legend */}
                <g transform={`translate(${W - PX - 240}, ${PY - 15})`}>
                    <rect x="0" y="0" width="10" height="10" rx="2" fill="url(#barGradientIncome)" />
                    <text x="14" y="9" className="text-gray-500 dark:text-gray-400 fill-current" fontSize="9">{t('Received')}</text>
                    <rect x="80" y="0" width="10" height="10" rx="2" fill="url(#barGradientInvoiced)" />
                    <text x="94" y="9" className="text-gray-500 dark:text-gray-400 fill-current" fontSize="9">{t('Invoiced')}</text>
                </g>
            </svg>

            {/* Tooltip */}
            {hp && hover !== null && unlocked && (
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-xs pointer-events-none z-10" style={{ minWidth: 200 }}>
                    <p className="font-bold text-gray-900 dark:text-white mb-2">
                        {new Date(hp.month + '-01').toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' })}
                    </p>
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-emerald-600">{t('Received')}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(hp.income)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-teal-500">{t('Invoiced')}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(hp.invoiced)}</span>
                        </div>
                        {hp.invoiced > 0 && hp.income > 0 && (
                            <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-1 mt-1">
                                <span className="text-gray-500">{t('Collection rate')}</span>
                                <span className={`font-bold ${hp.income >= hp.invoiced ? 'text-emerald-600' : 'text-amber-500'}`}>
                                    {(hp.income / hp.invoiced * 100).toFixed(0)}%
                                </span>
                            </div>
                        )}
                        {hpMomChange !== null && (
                            <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-1 mt-1">
                                <span className="text-gray-500">{t('vs previous month')}</span>
                                <span className={`font-bold ${parseFloat(hpMomChange) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {parseFloat(hpMomChange) >= 0 ? '+' : ''}{hpMomChange}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── LeadConversionCard ──────────────────────────────────────────

export function LeadConversionCard({ data }: { data: LeadSource[] }) {
    const { t } = useTranslation();

    const sourceLabels: Record<string, string> = {
        referral: 'Parrainage', organic: 'Organique', website_contact: 'Site web',
        social_media: 'Réseaux sociaux', word_of_mouth: 'Bouche-à-oreille',
        advertising: 'Publicité', other: 'Autre', unknown: 'Inconnu',
    };

    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-gray-500">{t('No data available')}</p>;
    }

    return (
        <div className="space-y-3">
            {data.map((s) => (
                <div key={s.source}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sourceLabels[s.source] || s.source}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{s.won}/{s.total} - {s.rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all" style={{ width: `${Math.min(s.rate, 100)}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── ProjectStatusCard ───────────────────────────────────────────

export function ProjectStatusCard({ data }: { data: Record<string, number> }) {
    const { t } = useTranslation();

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        planning: { label: 'Planification', color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-400 dark:bg-gray-500' },
        in_progress: { label: 'En cours', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500 dark:bg-blue-400' },
        review: { label: 'Révision', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500 dark:bg-amber-400' },
        completed: { label: 'Terminé', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500 dark:bg-emerald-400' },
        on_hold: { label: 'En pause', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500 dark:bg-orange-400' },
        cancelled: { label: 'Annulé', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500 dark:bg-red-400' },
    };

    const entries = Object.entries(data || {});
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    const maxCount = Math.max(...entries.map(([, count]) => count), 1);

    if (entries.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-gray-500">{t('No data available')}</p>;
    }

    return (
        <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{total} {t('projects total')}</p>
            <div className="space-y-3">
                {entries.map(([status, count]) => {
                    const cfg = statusConfig[status] || { label: status, color: 'text-gray-500', bg: 'bg-gray-400' };
                    return (
                        <div key={status}>
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{count}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full ${cfg.bg} rounded-full transition-all`} style={{ width: `${(count / maxCount) * 100}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── TopClientsCard ──────────────────────────────────────────────

export function TopClientsCard({ data, unlocked }: { data: TopClient[]; unlocked: boolean }) {
    const { t } = useTranslation();

    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-gray-500">{t('No data available')}</p>;
    }

    const maxRevenue = Math.max(...data.map(c => c.total_revenue), 1);

    return (
        <div className="space-y-3">
            {data.map((client, i) => (
                <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                        <div className="min-w-0 flex-1 mr-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {client.client_name}
                                {client.client_company && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({client.client_company})</span>
                                )}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {protectedValue(client.total_revenue, unlocked)}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                                ({client.invoice_count} {t('inv.')})
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 dark:bg-teal-400 rounded-full transition-all" style={{ width: `${(client.total_revenue / maxRevenue) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
