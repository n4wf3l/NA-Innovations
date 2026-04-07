import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

interface ActivityPoint { label: string; count: number; }

interface TopBarProps {
    title?: string;
    onMenuClick: () => void;
    right?: React.ReactNode;
    activityChart?: ActivityPoint[];
}

const modeLabels: Record<string, { short: string; desc: string }> = {
    hour: { short: '24h', desc: '24 dernières heures' },
    day: { short: '30j', desc: '30 derniers jours' },
    week: { short: '12s', desc: '12 dernières semaines' },
    month: { short: '12m', desc: '12 derniers mois' },
};

export default function TopBar({ title, onMenuClick, right, activityChart: initialChart }: TopBarProps) {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;
    const [chartMode, setChartMode] = useState<string>(pageProps.activityChartMode || 'hour');
    const [chartData, setChartData] = useState<ActivityPoint[]>(initialChart || []);
    const [hover, setHover] = useState<{ x: number; top: number; label: string; count: number; peak: number; total: number } | null>(null);
    const [showModeMenu, setShowModeMenu] = useState(false);
    const [changingMode, setChangingMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const modeBtnRef = useRef<HTMLButtonElement>(null);

    // Fetch chart data on mount and when mode changes from props
    useEffect(() => {
        if (pageProps.activityChartMode == null) return; // not admin
        fetch('/admin/dashboard/activity-chart')
            .then(r => r.json())
            .then(data => {
                setChartData(data.chart || []);
                setChartMode(data.mode || 'hour');
            })
            .catch(() => {});
    }, []);

    const hasChart = chartData && chartData.length > 1;

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!chartData || chartData.length < 2 || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const xRatio = (e.clientX - rect.left) / rect.width;
        const idx = Math.min(Math.max(Math.round(xRatio * (chartData.length - 1)), 0), chartData.length - 1);
        const d = chartData[idx];
        const peak = Math.max(...chartData.map(p => p.count));
        const total = chartData.reduce((s, p) => s + p.count, 0);
        setHover({ x: e.clientX, top: rect.bottom, label: d.label, count: d.count, peak, total });
    }, [chartData]);

    const changeMode = (mode: string) => {
        setShowModeMenu(false);
        setChangingMode(true);
        setChartMode(mode);

        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        // 1. Save the mode
        fetch('/admin/dashboard/activity-mode', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify({ mode }),
        })
        // 2. Fetch the new chart data
        .then(() => fetch('/admin/dashboard/activity-chart'))
        .then(r => r.json())
        .then(data => {
            setChartData(data.chart || []);
            setChartMode(data.mode || mode);
        })
        .catch(() => {})
        .finally(() => setChangingMode(false));
    };

    return (<>
        <header ref={containerRef} className="sticky top-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200 topbar-animate relative" style={{ clipPath: 'inset(0 0 -999px 0)' }}>
            {/* Activity sparkline background */}
            {hasChart && (() => {
                const max = Math.max(...chartData.map(d => d.count), 1);
                const w = 1000, h = 56;
                const points = chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * w;
                    const y = h - (d.count / max) * (h * 0.7) - 4;
                    return `${x},${y}`;
                });
                const linePath = `M${points.join(' L')}`;
                const areaPath = `M0,${h} L${points.join(' L')} L${w},${h} Z`;

                let hoverPctX = 0, hoverPctY = 0;
                if (hover && containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const xRatio = (hover.x - rect.left) / rect.width;
                    const idx = Math.min(Math.max(Math.round(xRatio * (chartData.length - 1)), 0), chartData.length - 1);
                    hoverPctX = (idx / (chartData.length - 1)) * 100;
                    hoverPctY = (1 - (chartData[idx].count / max) * 0.7 - 4 / h) * 100;
                }

                return (
                    <div
                        className="absolute inset-0 z-0"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHover(null)}
                    >
                        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
                            <defs>
                                <linearGradient id="topbar-activity-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={hover ? 0.15 : 0.08} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={areaPath} fill="url(#topbar-activity-grad)" className="transition-all duration-300" />
                            <path d={linePath} fill="none" stroke="#10b981" strokeWidth={hover ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" opacity={hover ? 0.4 : 0.15} className="transition-all duration-300" />
                        </svg>

                        {hover && (
                            <>
                                <div className="absolute top-0 bottom-0 w-px" style={{ left: `${hoverPctX}%`, backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(16,185,129,0.4) 3px, rgba(16,185,129,0.4) 6px)' }} />
                                <div className="absolute w-3 h-3 rounded-full bg-emerald-500 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50" style={{ left: `${hoverPctX}%`, top: `${hoverPctY}%` }} />
                                <div className="absolute w-6 h-6 rounded-full border border-emerald-500/30 -translate-x-1/2 -translate-y-1/2" style={{ left: `${hoverPctX}%`, top: `${hoverPctY}%` }} />
                            </>
                        )}
                    </div>
                );
            })()}

            <div className="flex items-center relative z-10">
                <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4 -ml-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                {title && <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h1>}

                {/* Chart mode selector */}
                {(hasChart || changingMode) && (
                    <div className="ml-3">
                        <button
                            ref={modeBtnRef}
                            onClick={() => setShowModeMenu(!showModeMenu)}
                            disabled={changingMode}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-emerald-600/60 dark:text-emerald-400/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                        >
                            {changingMode ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                            )}
                            {modeLabels[chartMode]?.short || '24h'}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {right && <div className="relative z-10">{right}</div>}

            {/* Mode dropdown */}
            {showModeMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModeMenu(false)} />
                    <div
                        className="absolute z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] animate-scale-in"
                        style={{
                            left: modeBtnRef.current ? modeBtnRef.current.offsetLeft : 0,
                            top: '100%',
                            marginTop: 6,
                        }}
                    >
                        {Object.entries(modeLabels).map(([key, { short, desc }]) => (
                            <button
                                key={key}
                                onClick={() => changeMode(key)}
                                className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between gap-4 transition-colors ${
                                    chartMode === key
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <span>{t(desc)}</span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{short}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </header>

        {/* Tooltip via portal */}
        {hover && createPortal(
            <div
                className="fixed z-[9999] pointer-events-none"
                style={{ left: Math.min(hover.x - 80, window.innerWidth - 220), top: hover.top + 8 }}
            >
                <div className="bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-2xl px-4 py-3 text-xs border border-gray-700 dark:border-gray-600 animate-scale-in">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-sm">{hover.label}</span>
                        <span className="text-gray-400 text-[10px]">{t(modeLabels[chartMode]?.desc || '')}</span>
                    </div>
                    <div className="space-y-1 text-gray-300">
                        <div className="flex items-center justify-between gap-8">
                            <span>{t('Actions')}</span>
                            <span className="font-bold text-white">{hover.count}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span>{t('Pic')}</span>
                            <span className="font-semibold text-emerald-400">{hover.peak}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span>{t('Total')}</span>
                            <span className="font-medium">{hover.total}</span>
                        </div>
                    </div>
                    <div className="mt-2 h-1 bg-gray-700 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-200" style={{ width: `${hover.peak > 0 ? (hover.count / hover.peak) * 100 : 0}%` }} />
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>);
}
