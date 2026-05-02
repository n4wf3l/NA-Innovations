import { useState, useEffect } from 'react';
import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import KanbanBoard, { KanbanColumn } from '@/Components/ui/KanbanBoard';
import CustomizableTile from '@/Components/ui/CustomizableTile';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface Prospect {
    id: number | string;
    name: string;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    notes: string | null;
    status: string;
    follow_up_date: string | null;
    follow_up_notified: boolean;
    send_email_reminder: boolean;
    lead_id: number | null;
    created_at: string;
    is_submitted_lead?: boolean;
    lead_status?: string;
}

interface Props {
    kanbanProspects: Record<string, Prospect[]>;
    stats: { total: number; with_follow_up: number; overdue: number; submitted: number; submitted_leads?: number };
    includeLeads?: boolean;
}

const emptyForm = { name: '', email: '', phone: '', company_name: '', notes: '', status: 'a_contacter', follow_up_date: '', send_email_reminder: true };

const kanbanColumns: KanbanColumn[] = [
    { key: 'a_contacter', label: 'À contacter', color: 'border-t-violet-500' },
    { key: 'contacte', label: 'Contacté', color: 'border-t-blue-500' },
    { key: 'interesse', label: 'Intéressé', color: 'border-t-emerald-500' },
    { key: 'pas_maintenant', label: 'Pas maintenant', color: 'border-t-amber-500' },
    { key: 'soumis', label: 'Soumis', color: 'border-t-rose-500' },
];

export default function ProspectsIndex({ kanbanProspects: initialKanban, stats, includeLeads = false }: Props) {
    const { t } = useTranslation();
    const [kanban, setKanban] = useState(initialKanban);

    // Restore preference on first load
    useEffect(() => {
        try {
            const pref = localStorage.getItem('partner_prospects_include_leads');
            if (pref === '1' && !includeLeads) {
                router.get('/partner/prospects', { include_leads: 1 }, { preserveScroll: true, preserveState: false, replace: true });
            }
        } catch { /* noop */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleIncludeLeads = () => {
        const next = !includeLeads;
        try { localStorage.setItem('partner_prospects_include_leads', next ? '1' : '0'); } catch { /* noop */ }
        router.get('/partner/prospects', next ? { include_leads: 1 } : {}, { preserveScroll: true, preserveState: false });
    };
    const [modal, setModal] = useState<{ mode: 'create' | 'edit'; prospect?: Prospect } | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    // Customizable tiles (everything except the kanban itself)
    const TILE_IDS = ['howto', 'toggle', 'legend', 'stats'];
    const TILE_LABELS: Record<string, string> = { howto: 'Comment ça fonctionne', toggle: 'Inclure leads', legend: 'Légende', stats: 'Statistiques' };
    const [tileOrder, setTileOrder] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem('partner_prospects_tile_order') || 'null') || TILE_IDS; } catch { return TILE_IDS; }
    });
    const [collapsedTiles, setCollapsedTiles] = useState<Record<string, boolean>>(() => {
        try { return JSON.parse(localStorage.getItem('partner_prospects_tile_collapsed') || '{}'); } catch { return {}; }
    });
    const [hiddenTiles, setHiddenTiles] = useState<Record<string, boolean>>(() => {
        try { return JSON.parse(localStorage.getItem('partner_prospects_tile_hidden') || '{}'); } catch { return {}; }
    });
    const saveTileOrder = (order: string[]) => { setTileOrder(order); localStorage.setItem('partner_prospects_tile_order', JSON.stringify(order)); };
    const toggleCollapse = (id: string) => { const n = { ...collapsedTiles, [id]: !collapsedTiles[id] }; setCollapsedTiles(n); localStorage.setItem('partner_prospects_tile_collapsed', JSON.stringify(n)); };
    const toggleHide = (id: string) => { const n = { ...hiddenTiles, [id]: !hiddenTiles[id] }; setHiddenTiles(n); localStorage.setItem('partner_prospects_tile_hidden', JSON.stringify(n)); };
    const resetLayout = () => { setTileOrder(TILE_IDS); setCollapsedTiles({}); setHiddenTiles({}); localStorage.removeItem('partner_prospects_tile_order'); localStorage.removeItem('partner_prospects_tile_collapsed'); localStorage.removeItem('partner_prospects_tile_hidden'); };
    const tileSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const handleTileDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = tileOrder.indexOf(active.id as string);
        const newIdx = tileOrder.indexOf(over.id as string);
        saveTileOrder(arrayMove(tileOrder, oldIdx, newIdx));
    };
    const hiddenCount = Object.values(hiddenTiles).filter(Boolean).length;

    const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); };
    const openEdit = (p: Prospect) => {
        setForm({ name: p.name, email: p.email || '', phone: p.phone || '', company_name: p.company_name || '', notes: p.notes || '', status: p.status, follow_up_date: p.follow_up_date || '', send_email_reminder: p.send_email_reminder });
        setModal({ mode: 'edit', prospect: p });
    };

    const handleSave = () => {
        setSaving(true);
        if (modal?.mode === 'create') {
            router.post('/partner/prospects', form, { onFinish: () => { setSaving(false); setModal(null); } });
        } else if (modal?.prospect) {
            router.put(`/partner/prospects/${modal.prospect.id}`, form, { onFinish: () => { setSaving(false); setModal(null); } });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/partner/prospects/${id}`, { onFinish: () => setDeleteConfirm(null) });
    };

    const isOverdue = (p: Prospect) => p.follow_up_date && new Date(p.follow_up_date) <= new Date() && !p.follow_up_notified && p.status !== 'soumis';

    const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition';
    const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

    return (
        <PartnerLayout title={t('Prospects')}>
            <Head title={t('Prospects')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Mon pipeline')}</h1>
                        <p className="text-violet-200 text-sm">{t('Gérez vos contacts et relances avant de les soumettre.')}</p>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Nouveau prospect')}
                    </button>
                </div>
            </div>

            {/* Hidden tiles bar */}
            {hiddenCount > 0 && (
                <div className="flex items-center justify-end gap-2 mb-4 flex-wrap">
                    <span className="text-xs text-gray-400">{t('Blocs masqués')} :</span>
                    {TILE_IDS.filter(id => hiddenTiles[id]).map(id => (
                        <button key={id} onClick={() => toggleHide(id)} className="px-2.5 py-1 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {t(TILE_LABELS[id])}
                        </button>
                    ))}
                    <button onClick={resetLayout} className="text-xs text-gray-400 hover:text-rose-500 transition-colors ml-1">{t('Tout réinitialiser')}</button>
                </div>
            )}

            <DndContext sensors={tileSensors} collisionDetection={closestCenter} onDragEnd={handleTileDragEnd}>
            <SortableContext items={tileOrder} strategy={verticalListSortingStrategy}>
            {tileOrder.map(tileId => {
                const tileProps = { id: tileId, title: t(TILE_LABELS[tileId] || tileId), collapsed: !!collapsedTiles[tileId], hidden: !!hiddenTiles[tileId], onToggleCollapse: () => toggleCollapse(tileId), onToggleHide: () => toggleHide(tileId) };

                if (tileId === 'howto') return (
                    <CustomizableTile key={tileId} {...tileProps}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6">
                <details>
                    <summary className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{t('Comment ça fonctionne ?')}</span>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('Cliquez pour comprendre le système de parrainage')}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </summary>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5">
                            {[
                                { step: '1', title: t('Trouvez'), desc: t('Vous connaissez quelqu\'un qui a besoin d\'un site, d\'une app ou d\'un service digital ? Ajoutez-le ici.'), color: 'bg-violet-500' },
                                { step: '2', title: t('Suivez'), desc: t('Déplacez-le dans les colonnes selon l\'avancement : contacté, intéressé, pas maintenant...'), color: 'bg-blue-500' },
                                { step: '3', title: t('Relancez'), desc: t('Mettez une date de relance si la personne dit "pas maintenant". On vous rappellera automatiquement.'), color: 'bg-amber-500' },
                                { step: '4', title: t('Soumettez'), desc: t('Quand la personne est prête, soumettez-la comme lead officiel via "Soumettre un client".'), color: 'bg-emerald-500' },
                                { step: '5', title: t('Gagnez'), desc: t('Si le projet aboutit, vous touchez une commission sur le montant facturé. Automatique.'), color: 'bg-rose-500' },
                            ].map(s => (
                                <div key={s.step} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                                    <div className={`w-7 h-7 rounded-full ${s.color} text-white text-xs font-bold flex items-center justify-center mb-2`}>{s.step}</div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">{s.title}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl px-4 py-3">
                            <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                                <strong>{t('En résumé')} :</strong> {t('Ce tableau est votre carnet de contacts personnel. Rien n\'est envoyé à NA Innovations tant que vous ne soumettez pas officiellement le lead. C\'est juste un outil pour vous organiser et ne pas oublier de relancer les bonnes personnes au bon moment.')}
                            </p>
                        </div>
                    </div>
                </details>
            </div>
                    </CustomizableTile>
                );

                if (tileId === 'toggle') return (
                    <CustomizableTile key={tileId} {...tileProps}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Inclure mes leads soumis à NA')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {includeLeads
                                ? t('Vos leads officiellement soumis sont affichés en lecture seule dans le pipeline.')
                                : t('Affichez ici vos leads déjà transmis à NA Innovations pour une vue unifiée.')}
                            {includeLeads && stats.submitted_leads !== undefined && ` (${stats.submitted_leads})`}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={includeLeads}
                    onClick={toggleIncludeLeads}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${includeLeads ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block h-5 w-5 mt-0.5 transform rounded-full bg-white shadow transition-transform ${includeLeads ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
                    </CustomizableTile>
                );

                if (tileId === 'legend') {
                    if (!includeLeads) return null;
                    return (
                    <CustomizableTile key={tileId} {...tileProps}>
                <div className="bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-500/10 dark:to-violet-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t('Comment lire ce pipeline ?')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-3 border border-violet-100 dark:border-violet-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                                        <p className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wide">{t('Vos prospects perso')}</p>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {t('Les colonnes À contacter, Contacté, Intéressé et Pas maintenant sont votre carnet privé. Vous y organisez librement vos contacts par drag & drop. Rien n\'est partagé avec NA Innovations.')}
                                    </p>
                                </div>
                                <div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-3 border border-rose-100 dark:border-rose-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                                        <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">{t('Vos leads soumis')}</p>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {t('Les cartes avec le badge "Soumis à NA" arrivent automatiquement dans la colonne Soumis dès que vous les transmettez via "Soumettre un client". Elles sont en lecture seule - c\'est NA Innovations qui gère leur statut.')}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                                {t('En résumé : vos prospects perso et vos leads soumis cohabitent dans le même tableau, mais restent indépendants. Les uns sont vos pistes, les autres sont les dossiers officiels suivis par NA.')}
                            </p>
                        </div>
                    </div>
                </div>
                    </CustomizableTile>
                    );
                }

                if (tileId === 'stats') return (
                    <CustomizableTile key={tileId} {...tileProps}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                    { label: t('Total'), value: stats.total, color: 'text-gray-900 dark:text-white' },
                    { label: t('Avec relance'), value: stats.with_follow_up, color: 'text-blue-600 dark:text-blue-400' },
                    { label: t('En retard'), value: stats.overdue, color: stats.overdue > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white' },
                    { label: t('Soumis'), value: stats.submitted, color: 'text-emerald-600 dark:text-emerald-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>
                    </CustomizableTile>
                );

                return null;
            })}
            </SortableContext>
            </DndContext>

            {/* Kanban */}
            <KanbanBoard<Prospect>
                columns={kanbanColumns}
                items={kanban}
                keyExtractor={p => p.id}
                onMove={(itemId, fromColumn, toColumn) => {
                    // Submitted leads (id like "lead-123") are read-only
                    if (typeof itemId === 'string' && itemId.startsWith('lead-')) {
                        setWarning(t('Cette carte est gérée par NA Innovations et ne peut pas être déplacée.'));
                        setTimeout(() => setWarning(null), 3500);
                        return false;
                    }
                    setKanban(prev => {
                        const updated = { ...prev };
                        const fromItems = [...(updated[fromColumn] || [])];
                        const toItems = [...(updated[toColumn] || [])];
                        const idx = fromItems.findIndex(p => String(p.id) === String(itemId));
                        if (idx === -1) return prev;
                        const [moved] = fromItems.splice(idx, 1);
                        (moved as any).status = toColumn;
                        toItems.unshift(moved);
                        updated[fromColumn] = fromItems;
                        updated[toColumn] = toItems;
                        return updated;
                    });
                    fetch(`/partner/prospects/${itemId}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' },
                        body: JSON.stringify({ status: toColumn }),
                    });
                }}
                renderCard={(prospect, isDragging) => (
                    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-3 hover:shadow-md transition-shadow group ${prospect.is_submitted_lead ? 'border-rose-200 dark:border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5' : 'border-gray-200 dark:border-gray-700'} ${isOverdue(prospect) ? 'ring-2 ring-red-400/50' : ''}`}>
                        {prospect.is_submitted_lead && (
                            <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-[9px] font-bold uppercase tracking-wide">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                {t('Soumis à NA')}
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-1">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{prospect.name}</p>
                                {prospect.company_name && <p className="text-xs text-gray-400 truncate">{prospect.company_name}</p>}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {prospect.is_submitted_lead ? (
                                    <a href={`/partner/leads/${prospect.lead_id}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors" title={t('Voir le suivi')}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </a>
                                ) : (
                                <>
                                <button onClick={e => { e.stopPropagation(); openEdit(prospect); }} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                                </button>
                                <button onClick={e => { e.stopPropagation(); setDeleteConfirm(prospect.id as number); }} className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                </>
                                )}
                            </div>
                        </div>
                        {/* Contact info */}
                        <div className="flex gap-2 mt-1.5 text-[10px] text-gray-400">
                            {prospect.phone && <span className="flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>{prospect.phone}</span>}
                            {prospect.email && <span className="truncate">{prospect.email}</span>}
                        </div>
                        {/* Follow-up */}
                        {prospect.follow_up_date && (
                            <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-lg ${isOverdue(prospect) ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {isOverdue(prospect) ? t('En retard') + ' - ' : ''}{new Date(prospect.follow_up_date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' })}
                            </div>
                        )}
                        {prospect.notes && <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">{prospect.notes}</p>}
                    </div>
                )}
            />

            {/* Create/Edit Modal */}
            {modal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-backdrop" onClick={() => !saving && setModal(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-4 overflow-hidden animate-modal" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-white">{modal.mode === 'create' ? t('Nouveau prospect') : t('Modifier le prospect')}</h3>
                            <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className={labelClass}>{t('Nom')} *</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder={t('Nom complet ou prénom')} />
                                <p className="text-[10px] text-gray-400 mt-1">{t('Le nom de la personne que vous avez rencontrée.')}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>{t('Email')}</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@..." />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Téléphone')}</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+32..." />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t('Entreprise')}</label>
                                <input type="text" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className={inputClass} placeholder={t('Nom de leur commerce / entreprise')} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('Statut')}</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputClass}>
                                    {kanbanColumns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>{t('Date de relance')}</label>
                                <input type="date" value={form.follow_up_date} onChange={e => setForm({ ...form, follow_up_date: e.target.value })} className={inputClass} />
                                <p className="text-[10px] text-gray-400 mt-1">{t('Si la personne dit "pas maintenant", mettez une date pour recevoir un rappel.')}</p>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.send_email_reminder} onChange={e => setForm({ ...form, send_email_reminder: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
                                <div>
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{t('M\'envoyer un email de rappel')}</span>
                                    <p className="text-[10px] text-gray-400">{t('Recevez un email le jour de la relance en plus de la notification.')}</p>
                                </div>
                            </label>
                            <div>
                                <label className={labelClass}>{t('Notes')}</label>
                                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={inputClass} placeholder={t('Qu\'est-ce qu\'il recherche ? Comment vous le connaissez ?')} />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('Annuler')}</button>
                            <button onClick={handleSave} disabled={saving || !form.name} className="px-5 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-violet-500/20">
                                {saving ? t('Enregistrement...') : modal.mode === 'create' ? t('Ajouter') : t('Enregistrer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete confirm */}
            {deleteConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-backdrop" onClick={() => setDeleteConfirm(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4 p-6 text-center animate-modal" onClick={e => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Supprimer ce prospect ?')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('Cette action est irréversible.')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{t('Annuler')}</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg shadow-red-500/20">{t('Supprimer')}</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {warning && createPortal(
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-tab-in">
                    <div className="flex items-center gap-3 bg-amber-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-amber-500/30 max-w-md">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <span className="text-sm font-semibold">{warning}</span>
                    </div>
                </div>,
                document.body
            )}
        </PartnerLayout>
    );
}
