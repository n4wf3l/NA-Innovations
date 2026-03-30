import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface NavItem {
    type: 'link' | 'section';
    label: string;
    href?: string;
    icon?: string;
    match?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    items: NavItem[];
    hiddenItems: string[];
    accentColor: string;
    sidebarStyle: string;
    onReorder: (items: NavItem[]) => void;
    onToggleHide: (label: string) => void;
    onAccentChange: (color: string) => void;
    onStyleChange: (style: string) => void;
    onReset: () => void;
    saving: boolean;
    roleAccent?: string;
}

const ACCENT_COLORS = [
    { value: '', label: 'Par defaut', color: '' },
    { value: 'teal', label: 'Teal', color: '#14b8a6' },
    { value: 'blue', label: 'Bleu', color: '#3b82f6' },
    { value: 'purple', label: 'Violet', color: '#8b5cf6' },
    { value: 'rose', label: 'Rose', color: '#f43f5e' },
    { value: 'amber', label: 'Ambre', color: '#f59e0b' },
    { value: 'emerald', label: 'Emeraude', color: '#10b981' },
    { value: 'indigo', label: 'Indigo', color: '#6366f1' },
    { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
    { value: 'orange', label: 'Orange', color: '#f97316' },
];

function SortableItem({ item, isHidden, onToggleHide }: { item: NavItem; isHidden: boolean; onToggleHide: (label: string) => void }) {
    const { t } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.label });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : isHidden ? 0.4 : 1,
    };

    if (item.type === 'section') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="flex items-center justify-between py-2 px-3 mt-2 first:mt-0"
            >
                <div className="flex items-center gap-2">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t(item.label)}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-200 ${
                isDragging ? 'bg-teal-500/20 ring-2 ring-teal-500/40 shadow-lg scale-[1.02]' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isHidden ? 'line-through' : ''}`}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                    </svg>
                </div>
                {item.icon && (
                    <svg className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                )}
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{t(item.label)}</span>
            </div>
            <button
                onClick={() => onToggleHide(item.label)}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isHidden
                        ? 'text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={isHidden ? t('Afficher') : t('Masquer')}
            >
                {isHidden ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default function SidebarCustomizer({ open, onClose, items, hiddenItems, accentColor, sidebarStyle, onReorder, onToggleHide, onAccentChange, onStyleChange, onReset, saving }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'order' | 'appearance'>('order');
    const [showToast, setShowToast] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(i => i.label === active.id);
        const newIndex = items.findIndex(i => i.label === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }, [items, onReorder]);

    const handleAccentChange = (color: string) => {
        onAccentChange(color);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleStyleChange = (style: string) => {
        onStyleChange(style);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out]">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">{t('Personnaliser le menu')}</h2>
                            <p className="text-sm text-gray-400 mt-0.5">{t('Organisez et stylisez votre navigation')}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-gray-800/50 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('order')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'order' ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t('Ordre du menu')}
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'appearance' ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t('Apparence')}
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
                    {activeTab === 'order' ? (
                        <div className="space-y-1.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                                </svg>
                                {t('Glissez pour réorganiser, cliquez sur l\'oeil pour masquer')}
                            </p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={items.map(i => i.label)} strategy={verticalListSortingStrategy}>
                                    {items.map(item => (
                                        <SortableItem
                                            key={item.label}
                                            item={item}
                                            isHidden={hiddenItems.includes(item.label)}
                                            onToggleHide={(label) => {
                                                onToggleHide(label);
                                                setShowToast(true);
                                                setTimeout(() => setShowToast(false), 2000);
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Accent Color */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('Couleur d\'accent')}</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ACCENT_COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => handleAccentChange(c.value)}
                                            className={`relative group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all duration-200 ${
                                                accentColor === c.value
                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 scale-105'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-105'
                                            }`}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full shadow-inner ring-1 ring-black/5"
                                                style={{ background: c.color || 'linear-gradient(135deg, #14b8a6, #3b82f6, #8b5cf6)' }}
                                            />
                                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{c.label}</span>
                                            {accentColor === c.value && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Live Preview */}
                                <div className="mt-4 bg-[#0b0f19] rounded-xl p-3 space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">{t('Apercu')}</p>
                                    {['Tableau de bord', 'Projets', 'Factures'].map((label, i) => {
                                        const isActive = i === 1;
                                        const colorMap: Record<string, string> = {
                                            teal: 'bg-teal-500/10 text-teal-400',
                                            blue: 'bg-blue-500/10 text-blue-400',
                                            purple: 'bg-purple-500/10 text-purple-400',
                                            rose: 'bg-rose-500/10 text-rose-400',
                                            amber: 'bg-amber-500/10 text-amber-400',
                                            emerald: 'bg-emerald-500/10 text-emerald-400',
                                            indigo: 'bg-indigo-500/10 text-indigo-400',
                                            cyan: 'bg-cyan-500/10 text-cyan-400',
                                            orange: 'bg-orange-500/10 text-orange-400',
                                        };
                                        return (
                                            <div
                                                key={label}
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                                                    isActive
                                                        ? (colorMap[accentColor] || 'bg-teal-500/10 text-teal-400') + ' font-medium'
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded ${isActive ? 'opacity-100' : 'opacity-30'}`} style={{ background: isActive ? (ACCENT_COLORS.find(c => c.value === accentColor)?.color || '#14b8a6') : '#6b7280' }} />
                                                {label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sidebar Style */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('Style du menu')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 'default', label: 'Standard', desc: 'Icones + texte' },
                                        { value: 'compact', label: 'Compact', desc: 'Plus resserré' },
                                        { value: 'minimal', label: 'Minimal', desc: 'Très épuré' },
                                    ].map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => handleStyleChange(s.value)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                                sidebarStyle === s.value
                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{s.label}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                        {t('Réinitialiser')}
                    </button>
                    <button onClick={onClose} className="px-5 py-2 bg-teal-500 text-white text-sm font-medium rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                        {t('Terminé')}
                    </button>
                </div>

                {/* Toast */}
                {showToast && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-xl animate-[fadeSlideUp_0.3s_ease-out] flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {t('Enregistré')}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
