import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface SectionItem {
    id: string;
    label: string;
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
            className={`fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-1 transition-all duration-500 ${
                showDots ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
        >
            {sections.map((section) => {
                const isActive = activeId === section.id;
                return (
                    <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className="group flex items-center gap-3 py-1.5 transition-all duration-300"
                    >
                        <span
                            className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                                isActive
                                    ? 'opacity-100 translate-x-0 text-teal-500 dark:text-teal-400'
                                    : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-gray-500 dark:text-gray-400'
                            }`}
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}
                        >
                            {t(section.label)}
                        </span>

                        <div className="relative flex items-center justify-center">
                            {isActive && (
                                <div className="absolute w-6 h-6 rounded-full bg-teal-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                            )}
                            <div
                                className={`rounded-full transition-all duration-500 ${
                                    isActive
                                        ? 'w-3 h-3 bg-teal-500 dark:bg-teal-400 shadow-lg shadow-teal-500/50 dark:shadow-teal-400/50'
                                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 group-hover:scale-125'
                                }`}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
