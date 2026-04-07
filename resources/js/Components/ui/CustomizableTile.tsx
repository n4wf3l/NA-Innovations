/**
 * Reusable customizable tile wrapper.
 *
 * Wraps any content with an always-visible (but discreet) control bar that
 * lets the user drag-reorder, collapse and hide the tile. No "edit mode"
 * needed — controls are inline and accessible at all times.
 *
 * Usage:
 *   <DndContext ...>
 *     <SortableContext items={order} strategy={verticalListSortingStrategy}>
 *       {order.map(id => (
 *         <CustomizableTile key={id} id={id} title={...} collapsed={...} hidden={...}
 *                           onToggleCollapse={...} onToggleHide={...}>
 *           {content}
 *         </CustomizableTile>
 *       ))}
 *     </SortableContext>
 *   </DndContext>
 */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    id: string;
    title: string;
    collapsed: boolean;
    hidden: boolean;
    onToggleCollapse: () => void;
    onToggleHide: () => void;
    children: React.ReactNode;
}

export default function CustomizableTile({ id, title, collapsed, hidden, onToggleCollapse, onToggleHide, children }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto', opacity: isDragging ? 0.85 : 1 };

    if (hidden) return null;

    return (
        <div ref={setNodeRef} style={style} className={`group/tile transition-shadow duration-200 ${isDragging ? 'shadow-2xl ring-2 ring-rose-500/30 rounded-2xl' : ''}`}>
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
            <div className={`relative transition-all duration-300 overflow-hidden ${collapsed ? 'max-h-0 opacity-0' : 'max-h-[3000px] opacity-100'}`}>
                {children}
            </div>
        </div>
    );
}
