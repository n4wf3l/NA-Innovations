import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    searchable?: boolean;
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select...', required, className = '', searchable = false }: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(o => o.value === value);

    const filtered = searchable && search
        ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && searchable && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open, searchable]);

    const handleSelect = (val: string) => {
        onChange(val);
        setOpen(false);
        setSearch('');
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Hidden input for form validation */}
            {required && <input type="text" value={value} required tabIndex={-1} className="sr-only" onChange={() => {}} />}

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-sm transition-all duration-200 ${
                    open
                        ? 'border-teal-400 ring-2 ring-teal-400/20 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400'
                } ${value ? 'text-gray-900' : 'text-gray-400'}`}
            >
                <span className="truncate">{selectedOption?.label || placeholder}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in" style={{ animation: 'fadeSlideDown 0.2s ease-out' }}>
                    {/* Search input */}
                    {searchable && (
                        <div className="p-2 border-b border-gray-100">
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-400/30 focus:outline-none placeholder-gray-400"
                            />
                        </div>
                    )}

                    {/* Options list */}
                    <div className="max-h-60 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>
                        ) : (
                            filtered.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-100 flex items-center justify-between ${
                                        option.value === value
                                            ? 'bg-teal-50 text-teal-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && (
                                        <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
