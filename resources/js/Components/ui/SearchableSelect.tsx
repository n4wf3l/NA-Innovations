import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
    value: string;
    label: string;
    sublabel?: string;
    icon?: React.ReactNode;
}

interface Props {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyLabel?: string;
    className?: string;
    disabled?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder, searchPlaceholder, emptyLabel, className = '', disabled }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

    const selected = options.find(o => o.value === value);

    const filtered = useMemo(() => {
        if (!search) return options;
        const q = search.toLowerCase();
        return options.filter(o =>
            o.label.toLowerCase().includes(q) ||
            (o.sublabel && o.sublabel.toLowerCase().includes(q))
        );
    }, [options, search]);

    // Position dropdown
    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = Math.min(filtered.length * 44 + 56, 320);
            const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

            setPos({
                top: showAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });

            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open, filtered.length]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Close on escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setOpen(false); setSearch(''); }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    const handleSelect = (val: string) => {
        onChange(val);
        setOpen(false);
        setSearch('');
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                disabled={disabled}
                className={`w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-left transition-all ${
                    open
                        ? 'ring-2 ring-teal-400 bg-white dark:bg-gray-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            >
                <span className={selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                    {selected ? (
                        <span className="flex items-center gap-2">
                            {selected.icon}
                            <span>{selected.label}</span>
                            {selected.sublabel && <span className="text-gray-400 dark:text-gray-500 text-xs">— {selected.sublabel}</span>}
                        </span>
                    ) : (
                        placeholder || t('Select...')
                    )}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && pos && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed z-[99999] animate-fade-in"
                    style={{ top: pos.top, left: pos.left, width: pos.width }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl">
                        {/* Search */}
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder || t('Search...')}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:bg-white dark:focus:bg-gray-700"
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="max-h-60 overflow-y-auto overscroll-contain py-1 scrollbar-thin">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                                    {emptyLabel || t('No results found')}
                                </div>
                            ) : (
                                filtered.map(option => {
                                    const isSelected = option.value === value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                                                isSelected
                                                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-teal-700 dark:text-teal-300' : ''}`}>{option.label}</p>
                                                    {option.sublabel && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{option.sublabel}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
