import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import GuidedTour, { TourTriggerButton } from '@/Components/ui/GuidedTour';
import { useTour } from '@/hooks/useTour';
import { partnerDashboardSteps } from '@/data/tourSteps';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    action_url?: string;
    created_at: string;
}

interface MonthlyLead {
    month: string;
    total: number;
    won: number;
}

interface Props {
    partner: any;
    stats: {
        totalLeads: number;
        wonLeads: number;
        conversionRate: number;
        totalEarned: number;
        totalPaid: number;
        pendingPayout: number;
        estimatedPending: number;
        avgDealSize: number;
        topService: string;
        pipelineCounts: {
            new: number;
            contacted: number;
            brief: number;
            quote: number;
            won: number;
            lost: number;
        };
    };
    recentLeads: any[];
    recentCommissions: any[];
    notifications?: Notification[];
    monthlyLeads?: MonthlyLead[];
    cumulativeEarnings?: number;
}

// Sortable tile wrapper
function DashboardTile({ id, title, collapsed, hidden, onToggleCollapse, onToggleHide, children }: {
    id: string; title: string; collapsed: boolean; hidden: boolean; onToggleCollapse: () => void; onToggleHide: () => void; children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto', opacity: isDragging ? 0.85 : 1 };

    if (hidden) return null;
    return (
        <div ref={setNodeRef} style={style} className={`group/tile transition-shadow duration-200 ${isDragging ? 'shadow-2xl ring-2 ring-rose-500/30 rounded-2xl' : ''}`}>
            {/* Tile control bar - always visible */}
            <div className="flex items-center justify-between mb-2 px-2 py-1.5 opacity-60 hover:opacity-100 group-hover/tile:opacity-100 transition-opacity">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex items-center gap-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 rounded-lg transition-colors" title="Glisser pour réorganiser">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onToggleCollapse} className="p-1.5 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title={collapsed ? 'Ouvrir' : 'Fermer'}>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                    </button>
                    <button onClick={onToggleHide} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Masquer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    </button>
                </div>
            </div>
            <div className={`relative transition-all duration-300 overflow-hidden ${collapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
                {children}
            </div>
            {collapsed && (
                <button onClick={onToggleCollapse} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed flex items-center justify-center gap-1.5 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    {title}
                </button>
            )}
        </div>
    );
}

const TILE_IDS = ['hero', 'stats', 'pipeline', 'charts', 'recent'];
const TILE_LABELS: Record<string, string> = { hero: 'Referral', stats: 'Stats', pipeline: 'Pipeline', charts: 'Performance', recent: 'Activity' };

export default function PartnerDashboard({ partner, stats, recentLeads, recentCommissions, notifications = [], monthlyLeads = [], cumulativeEarnings = 0 }: Props) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const tour = useTour('partner_dashboard', partnerDashboardSteps.length);

    // Dashboard customization
    const [tileOrder, setTileOrder] = useState<string[]>(() => {
        if (typeof window === 'undefined') return TILE_IDS;
        try { const saved = JSON.parse(localStorage.getItem('partner_tile_order') || 'null'); return saved || TILE_IDS; } catch { return TILE_IDS; }
    });
    const [collapsedTiles, setCollapsedTiles] = useState<Record<string, boolean>>(() => {
        if (typeof window === 'undefined') return {};
        try { return JSON.parse(localStorage.getItem('partner_tile_collapsed') || '{}'); } catch { return {}; }
    });
    const [hiddenTiles, setHiddenTiles] = useState<Record<string, boolean>>(() => {
        if (typeof window === 'undefined') return {};
        try { return JSON.parse(localStorage.getItem('partner_tile_hidden') || '{}'); } catch { return {}; }
    });

    const saveTileOrder = (order: string[]) => { setTileOrder(order); localStorage.setItem('partner_tile_order', JSON.stringify(order)); };
    const toggleCollapse = (id: string) => { const n = { ...collapsedTiles, [id]: !collapsedTiles[id] }; setCollapsedTiles(n); localStorage.setItem('partner_tile_collapsed', JSON.stringify(n)); };
    const toggleHide = (id: string) => { const n = { ...hiddenTiles, [id]: !hiddenTiles[id] }; setHiddenTiles(n); localStorage.setItem('partner_tile_hidden', JSON.stringify(n)); };
    const resetLayout = () => { setTileOrder(TILE_IDS); setCollapsedTiles({}); setHiddenTiles({}); localStorage.removeItem('partner_tile_order'); localStorage.removeItem('partner_tile_collapsed'); localStorage.removeItem('partner_tile_hidden'); };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = tileOrder.indexOf(active.id as string);
        const newIdx = tileOrder.indexOf(over.id as string);
        saveTileOrder(arrayMove(tileOrder, oldIdx, newIdx));
    };

    const hiddenCount = Object.values(hiddenTiles).filter(Boolean).length;

    const referralLink = partner.referral_link || `${window.location.origin}?ref=${partner.referral_code}`;

    function copyReferralLink() {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const pipelineStages = [
        { key: 'new', label: t('New'), count: stats.pipelineCounts?.new || 0, color: 'bg-violet-500' },
        { key: 'contacted', label: t('Contacted'), count: stats.pipelineCounts?.contacted || 0, color: 'bg-blue-500' },
        { key: 'brief', label: t('Brief'), count: stats.pipelineCounts?.brief || 0, color: 'bg-indigo-500' },
        { key: 'quote', label: t('Quote'), count: stats.pipelineCounts?.quote || 0, color: 'bg-amber-500' },
        { key: 'won', label: t('Won'), count: stats.pipelineCounts?.won || 0, color: 'bg-emerald-500' },
        { key: 'lost', label: t('Lost'), count: stats.pipelineCounts?.lost || 0, color: 'bg-red-500' },
    ];

    const totalPipelineLeads = pipelineStages.reduce((sum, s) => sum + s.count, 0);

    return (
        <PartnerLayout title={t("Dashboard")}>
            <Head title={t("Partner Dashboard")} />

            <GuidedTour
                steps={partnerDashboardSteps}
                isActive={tour.isActive}
                currentStep={tour.currentStep}
                onNext={tour.next}
                onPrev={tour.prev}
                onSkip={tour.skip}
                onDismiss={tour.dismiss}
                accentColor="rose"
            />
            <TourTriggerButton onClick={tour.restart} accentColor="rose" />

            {/* Hidden tiles bar - appears only when something is hidden */}
            {hiddenCount > 0 && (
                <div className="flex items-center justify-end gap-2 mb-4 flex-wrap">
                    <span className="text-xs text-gray-400">{t('Blocs masqués')} :</span>
                    {TILE_IDS.filter(id => hiddenTiles[id]).map(id => (
                        <button key={id} onClick={() => toggleHide(id)} className="px-2.5 py-1 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {t(TILE_LABELS[id])}
                        </button>
                    ))}
                    <button onClick={resetLayout} className="text-xs text-gray-400 hover:text-rose-500 transition-colors ml-1">
                        {t('Tout réinitialiser')}
                    </button>
                </div>
            )}

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="mb-6 space-y-3">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-4 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{notification.title}</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{notification.message}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                    {notification.action_url && (
                                        <Link href={notification.action_url} className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200">
                                            {t('View details')} &rarr;
                                        </Link>
                                    )}
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === Draggable Tiles === */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tileOrder} strategy={verticalListSortingStrategy}>
            {tileOrder.map(tileId => {
                const tileProps = { id: tileId, title: t(TILE_LABELS[tileId] || tileId), collapsed: !!collapsedTiles[tileId], hidden: !!hiddenTiles[tileId], onToggleCollapse: () => toggleCollapse(tileId), onToggleHide: () => toggleHide(tileId) };

                if (tileId === 'hero') return (
                <DashboardTile key={tileId} {...tileProps}>
            {/* Hero banner */}
            <div data-tour="hero-banner" className="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm">{t('Welcome back')},</p>
                    <h2 className="text-3xl font-black text-white mt-1">{partner.user?.name || 'Partner'}</h2>
                    <div className="mt-4 flex items-center space-x-3">
                        <span className="text-gray-400 text-sm">{t('Your referral code')}:</span>
                        <span className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg font-mono text-sm font-bold text-rose-300 tracking-wider">
                            {partner.referral_code}
                        </span>
                    </div>

                    {/* Copyable Referral Link */}
                    <div className="mt-4">
                        <p className="text-gray-400 text-xs mb-1.5">{t('Your referral link')}:</p>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 font-mono truncate">
                                {referralLink}
                            </div>
                            <button
                                onClick={copyReferralLink}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 flex-shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>{t('Copied!')}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                        </svg>
                                        <span>{t('Copy')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="mt-5 text-xs text-white/30 leading-relaxed max-w-xl">
                        {t('Vous touchez une commission sur chaque client que vous nous apportez. Deux options : soumettez-le directement via "Soumettre un client" (le système sait que c\'est vous), ou partagez ce lien - si quelqu\'un passe par là, il sera automatiquement rattaché à votre compte.')}
                    </p>
                </div>
            </div>

                </DashboardTile>
                );

                if (tileId === 'stats') return (
                <DashboardTile key={tileId} {...tileProps}>
            {/* Stats grid */}
            <div data-tour="stats-grid" className="stagger-children grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Leads Sent')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.wonLeads} <span className="text-lg text-gray-400 font-normal">({stats.conversionRate}%)</span></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Leads Won')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white"><ProtectedAmount amount={stats.totalEarned} /></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Total Earned')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white"><ProtectedAmount amount={stats.pendingPayout} /></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Pending Payout')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white"><ProtectedAmount amount={stats.avgDealSize} /></p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Avg Deal Size')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white truncate">{stats.topService}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{t('Top Service')}</p>
                </div>
            </div>

                </DashboardTile>
                );

                if (tileId === 'pipeline') return (
                <DashboardTile key={tileId} {...tileProps}>
            {/* Pipeline Summary */}
            <div data-tour="pipeline-summary" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">{t('Pipeline Summary')}</h3>
                {totalPipelineLeads > 0 ? (
                    <>
                        {/* Horizontal bar */}
                        <div className="flex rounded-full overflow-hidden h-4 mb-4">
                            {pipelineStages.map((stage) => {
                                const widthPercent = (stage.count / totalPipelineLeads) * 100;
                                if (widthPercent === 0) return null;
                                return (
                                    <div
                                        key={stage.key}
                                        className={`${stage.color} transition-all`}
                                        style={{ width: `${widthPercent}%` }}
                                        title={`${stage.label}: ${stage.count}`}
                                    />
                                );
                            })}
                        </div>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            {pipelineStages.map((stage) => (
                                <div key={stage.key} className="flex items-center space-x-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {stage.label}: <span className="font-bold text-gray-900 dark:text-white">{stage.count}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No leads in the pipeline yet.')}</p>
                )}
            </div>

                </DashboardTile>
                );

                if (tileId === 'charts') return (
                <DashboardTile key={tileId} {...tileProps}>
            {/* Monthly Performance & Cumulative Earnings */}
            <div data-tour="monthly-chart" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Monthly Leads Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">{t('Monthly Leads')}</h3>
                    {monthlyLeads.length > 0 ? (() => {
                        const maxVal = Math.max(...monthlyLeads.map(m => m.total), 1);
                        const chartHeight = 160;
                        const barWidth = 40;
                        const gap = 16;
                        const svgWidth = monthlyLeads.length * (barWidth + gap);
                        return (
                            <div className="overflow-x-auto">
                                <svg width={svgWidth} height={chartHeight + 40} className="mx-auto">
                                    {monthlyLeads.map((m, i) => {
                                        const x = i * (barWidth + gap) + gap / 2;
                                        const totalH = (m.total / maxVal) * chartHeight;
                                        const wonH = (m.won / maxVal) * chartHeight;
                                        return (
                                            <g key={i}>
                                                {/* Total bar */}
                                                <rect
                                                    x={x} y={chartHeight - totalH}
                                                    width={barWidth} height={totalH}
                                                    rx={6} className="fill-rose-200 dark:fill-rose-900/40"
                                                />
                                                {/* Won bar overlay */}
                                                <rect
                                                    x={x} y={chartHeight - wonH}
                                                    width={barWidth} height={wonH}
                                                    rx={6} className="fill-emerald-400 dark:fill-emerald-500"
                                                />
                                                {/* Count label */}
                                                {m.total > 0 && (
                                                    <text
                                                        x={x + barWidth / 2} y={chartHeight - totalH - 6}
                                                        textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-xs" fontSize={11}
                                                    >
                                                        {m.total}
                                                    </text>
                                                )}
                                                {/* Month label */}
                                                <text
                                                    x={x + barWidth / 2} y={chartHeight + 20}
                                                    textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize={10}
                                                >
                                                    {m.month.split(' ')[0]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                                <div className="flex items-center justify-center gap-6 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-sm bg-rose-200 dark:bg-rose-900/40" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('Total')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-500" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('Won')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })() : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('No data yet.')}</p>
                    )}
                </div>

                {/* Cumulative Earnings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-2">{t('Total Paid')}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                        <ProtectedAmount amount={cumulativeEarnings} />
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('Cumulative earnings')}</p>
                </div>
            </div>

                </DashboardTile>
                );

                if (tileId === 'recent') return (
                <DashboardTile key={tileId} {...tileProps}>
            {/* Two columns */}
            <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div data-tour="recent-leads" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Recent Leads')}</h3>
                        <Link href="/partner/leads" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">{t('View all')} &rarr;</Link>
                    </div>
                    {recentLeads.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                            </div>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{t('No leads yet.')}</p>
                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Use the button above to submit your first client')}</p>
                        </div>
                    ) : (
                        <div>
                            {recentLeads.map((lead: any) => (
                                <Link key={lead.id} href={`/partner/leads/${lead.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                            {lead.first_name[0]}{lead.last_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.first_name} {lead.last_name}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{lead.company_name || lead.email}</p>
                                        </div>
                                    </div>
                                    <Badge status={lead.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Commissions */}
                <div data-tour="commissions-card" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Commissions')}</h3>
                        <Link href="/partner/commissions" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">{t('View all')} &rarr;</Link>
                    </div>
                    {recentCommissions.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{t('No commissions yet.')}</p>
                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('Submit clients to start earning')}</p>
                        </div>
                    ) : (
                        <div>
                            {recentCommissions.map((c: any) => (
                                <div key={c.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white"><ProtectedAmount amount={c.commission_amount} /></p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{c.commission_rate}% on <ProtectedAmount amount={c.base_amount} /></p>
                                    </div>
                                    <Badge status={c.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
                </DashboardTile>
                );

                return null;
            })}
            </SortableContext>
            </DndContext>

        </PartnerLayout>
    );
}
