import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface SectionItem {
    id: string;
    label: string;
    icon?: string;
    onClick?: () => void;
    highlight?: boolean;
}

interface Props {
    sections: SectionItem[];
}

export default function SectionNav({ sections }: Props) {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState('');
    const [showDots, setShowDots] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowDots(window.scrollY > 400);

            let current = '';
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 250 && rect.bottom > 250) {
                        current = section.id;
                    }
                }
            }
            setActiveId(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (sections.length === 0) return null;

    return (
        <div
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-2 transition-all duration-500 ${
                showDots ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
        >
            {sections.map((section) => {
                const isActive = activeId === section.id;
                const isHighlight = section.highlight;
                return (
                    <button
                        key={section.id}
                        onClick={() => section.onClick ? section.onClick() : scrollTo(section.id)}
                        className="group flex items-center gap-3 py-1 transition-all duration-300"
                    >
                        <span
                            className={`text-sm font-bold uppercase whitespace-nowrap transition-all duration-300 ${
                                isHighlight
                                    ? 'opacity-100 translate-x-0 text-violet-400'
                                    : isActive
                                    ? 'opacity-100 translate-x-0 text-teal-500 dark:text-teal-400'
                                    : 'opacity-40 group-hover:opacity-100 text-gray-400 dark:text-gray-500'
                            }`}
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}
                        >
                            {t(section.label)}
                        </span>

                        <div className="relative flex items-center justify-center">
                            {isActive && !isHighlight && (
                                <div className="absolute w-8 h-8 rounded-full bg-teal-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                            )}
                            {isHighlight && (
                                <div className="absolute w-8 h-8 rounded-full bg-violet-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                            )}
                            <div
                                className={`rounded-full transition-all duration-500 ${
                                    isHighlight
                                        ? 'w-4 h-4 bg-violet-500 shadow-lg shadow-violet-500/50'
                                        : isActive
                                        ? 'w-4 h-4 bg-teal-500 dark:bg-teal-400 shadow-lg shadow-teal-500/50 dark:shadow-teal-400/50'
                                        : 'w-3 h-3 bg-gray-400/40 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-400 group-hover:scale-110'
                                }`}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
