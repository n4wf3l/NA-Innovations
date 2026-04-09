import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export interface KanbanColumn {
    key: string;
    label: string;
    color: string;
}

interface KanbanBoardProps<T> {
    columns: KanbanColumn[];
    items: Record<string, T[]>;
    keyExtractor: (item: T) => string | number;
    renderCard: (item: T, isDragging: boolean) => React.ReactNode;
    onMove: (itemId: string | number, fromColumn: string, toColumn: string) => void | boolean;
}

function DroppableColumn({ id, label, color, count, children }: {
    id: string; label: string; color: string; count: number; children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div className="min-w-[280px] w-[280px] flex-shrink-0">
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-xl border-t-4 ${color} transition-all duration-200 ${isOver ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-300 scale-[1.01]' : ''}`}>
                <div className="px-3 py-2.5 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</h4>
                    <span className="text-xs bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium shadow-sm dark:shadow-none">{count}</span>
                </div>
                <div ref={setNodeRef} className="px-3 pb-3 space-y-2 min-h-[150px]">
                    {children}
                </div>
            </div>
        </div>
    );
}

function DraggableCard({ id, children }: {
    id: string | number; children: (isDragging: boolean) => React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(id) });

    const wasDragging = useRef(false);

    if (isDragging && !wasDragging.current) {
        wasDragging.current = true;
    }

    const handleClickCapture = (e: React.MouseEvent) => {
        if (wasDragging.current) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => { wasDragging.current = false; }, 0);
        }
    };

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : 'auto',
        position: isDragging ? 'relative' : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClickCapture={handleClickCapture}
            className={`touch-none ${isDragging ? 'cursor-grabbing rotate-1 scale-[1.03] shadow-2xl rounded-xl opacity-90' : 'cursor-grab'}`}
        >
            {children(isDragging)}
        </div>
    );
}

function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
    return createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up">
            <div className="bg-emerald-600 text-white rounded-xl shadow-xl px-5 py-3 flex items-center space-x-2 text-sm font-medium">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{message}</span>
                <button onClick={onDone} className="ml-2 text-emerald-200 hover:text-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>,
        document.body
    );
}

export default function KanbanBoard<T>({ columns, items, keyExtractor, renderCard, onMove }: KanbanBoardProps<T>) {
    const [toast, setToast] = useState<string | null>(null);
    const isDraggingGlobal = useRef(false);
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const [showGhost, setShowGhost] = useState(false);

    // Custom-drawn sticky scrollbar synced with the real kanban container
    useEffect(() => {
        const real = scrollRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!real || !track || !thumb) return;

        const update = () => {
            const overflow = real.scrollWidth > real.clientWidth + 1;
            setShowGhost(overflow);
            if (!overflow) return;
            const trackW = track.clientWidth;
            const ratio = real.clientWidth / real.scrollWidth;
            const thumbW = Math.max(60, trackW * ratio);
            const maxScroll = real.scrollWidth - real.clientWidth;
            const maxThumbPos = trackW - thumbW;
            const pos = maxScroll > 0 ? (real.scrollLeft / maxScroll) * maxThumbPos : 0;
            thumb.style.width = thumbW + 'px';
            thumb.style.left = pos + 'px';
        };

        update();
        real.addEventListener('scroll', update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(real);
        for (const child of Array.from(real.children)) ro.observe(child);
        window.addEventListener('resize', update);

        // Drag the thumb
        let dragging = false;
        let dragStartX = 0;
        let scrollStart = 0;
        const onThumbDown = (e: MouseEvent) => {
            dragging = true;
            dragStartX = e.clientX;
            scrollStart = real.scrollLeft;
            e.preventDefault();
        };
        const onThumbMove = (e: MouseEvent) => {
            if (!dragging) return;
            const trackW = track.clientWidth;
            const thumbW = thumb.clientWidth;
            const maxScroll = real.scrollWidth - real.clientWidth;
            const maxThumbPos = trackW - thumbW;
            const dx = e.clientX - dragStartX;
            const scrollDelta = (dx / maxThumbPos) * maxScroll;
            real.scrollLeft = scrollStart + scrollDelta;
        };
        const onUp = () => { dragging = false; };
        thumb.addEventListener('mousedown', onThumbDown);
        window.addEventListener('mousemove', onThumbMove);
        window.addEventListener('mouseup', onUp);

        // Click on track jumps
        const onTrackClick = (e: MouseEvent) => {
            if (e.target === thumb) return;
            const rect = track.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const trackW = track.clientWidth;
            const ratio = clickX / trackW;
            real.scrollLeft = ratio * (real.scrollWidth - real.clientWidth);
        };
        track.addEventListener('click', onTrackClick);

        return () => {
            real.removeEventListener('scroll', update);
            ro.disconnect();
            window.removeEventListener('resize', update);
            thumb.removeEventListener('mousedown', onThumbDown);
            window.removeEventListener('mousemove', onThumbMove);
            window.removeEventListener('mouseup', onUp);
            track.removeEventListener('click', onTrackClick);
        };
    }, [items, columns]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const findColumn = (itemId: string | number): string | null => {
        for (const [col, colItems] of Object.entries(items)) {
            if (colItems.some(item => String(keyExtractor(item)) === String(itemId))) return col;
        }
        return null;
    };

    const getColumnLabel = (key: string) => columns.find(c => c.key === key)?.label || key;

    const handleDragStart = (_event: DragStartEvent) => {
        isDraggingGlobal.current = true;
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        setTimeout(() => { isDraggingGlobal.current = false; }, 200);

        if (!over) return;

        const fromColumn = findColumn(active.id);
        let toColumn = String(over.id);

        if (!columns.find(c => c.key === toColumn)) {
            toColumn = findColumn(over.id) || toColumn;
        }

        if (fromColumn && toColumn && fromColumn !== toColumn) {
            const result = onMove(active.id, fromColumn, toColumn);
            if (result !== false) {
                setToast(t('Moved to {{column}}', { column: getColumnLabel(toColumn) }));
                setTimeout(() => setToast(null), 3000);
            }
        }
    }, [items, columns, onMove]);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-2 kanban-scroll-hidden">
                    {columns.map(col => (
                        <DroppableColumn
                            key={col.key}
                            id={col.key}
                            label={col.label}
                            color={col.color}
                            count={(items[col.key] || []).length}
                        >
                            {(items[col.key] || []).map(item => (
                                <DraggableCard
                                    key={keyExtractor(item)}
                                    id={keyExtractor(item)}
                                >
                                    {(isDragging) => renderCard(item, isDragging)}
                                </DraggableCard>
                            ))}
                        </DroppableColumn>
                    ))}
                </div>
            </DndContext>

            {/* Sticky ghost scrollbar — rendered via portal to document.body
                so it escapes any ancestor with transform/filter/will-change that
                would otherwise break position: fixed. */}
            {createPortal(
                <div
                    className="kanban-ghost-scroll"
                    style={{ display: showGhost ? 'block' : 'none' }}
                    aria-hidden="true"
                >
                    <div ref={trackRef} className="kanban-ghost-track">
                        <div ref={thumbRef} className="kanban-ghost-thumb" />
                    </div>
                </div>,
                document.body
            )}

            {toast && <SuccessToast message={toast} onDone={() => setToast(null)} />}
        </>
    );
}
