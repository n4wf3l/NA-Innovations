import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    DragOverlay,
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
    onMove: (itemId: string | number, fromColumn: string, toColumn: string) => void;
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

function DraggableCard({ id, children, onDragStateChange }: {
    id: string | number; children: React.ReactNode; onDragStateChange: (dragging: boolean) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(id) });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : 'auto' as any,
    };

    // Block all clicks inside the card during and right after drag
    const wasDragging = useRef(false);

    if (isDragging && !wasDragging.current) {
        wasDragging.current = true;
        onDragStateChange(true);
    }

    const handleClickCapture = (e: React.MouseEvent) => {
        // If we just finished dragging, block this click
        if (wasDragging.current) {
            e.preventDefault();
            e.stopPropagation();
            // Reset after a tick
            setTimeout(() => { wasDragging.current = false; }, 0);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClickCapture={handleClickCapture}
            className={`cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'ring-2 ring-blue-300 rounded-xl' : ''}`}
        >
            {children}
        </div>
    );
}

// Toast component
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
    const [activeItem, setActiveItem] = useState<T | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const isDraggingGlobal = useRef(false);
    const { t } = useTranslation();

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

    const handleDragStart = (event: DragStartEvent) => {
        isDraggingGlobal.current = true;
        for (const colItems of Object.values(items)) {
            const found = colItems.find(item => String(keyExtractor(item)) === String(event.active.id));
            if (found) { setActiveItem(found); break; }
        }
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        // Keep blocking clicks briefly after drag ends
        setTimeout(() => { isDraggingGlobal.current = false; }, 200);

        if (!over) return;

        const fromColumn = findColumn(active.id);
        let toColumn = String(over.id);

        if (!columns.find(c => c.key === toColumn)) {
            toColumn = findColumn(over.id) || toColumn;
        }

        if (fromColumn && toColumn && fromColumn !== toColumn) {
            onMove(active.id, fromColumn, toColumn);
            setToast(t('Moved to {{column}}', { column: getColumnLabel(toColumn) }));
            setTimeout(() => setToast(null), 3000);
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
                <div className="flex overflow-x-auto space-x-4 pb-4">
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
                                    onDragStateChange={() => {}}
                                >
                                    {renderCard(item, false)}
                                </DraggableCard>
                            ))}
                        </DroppableColumn>
                    ))}
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeItem && (
                        <div className="rotate-2 scale-105 shadow-2xl rounded-xl">
                            {renderCard(activeItem, true)}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {toast && <SuccessToast message={toast} onDone={() => setToast(null)} />}
        </>
    );
}
