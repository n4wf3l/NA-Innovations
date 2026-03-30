import { useState, useEffect, useCallback } from 'react';

const SECTION_IDS = [
    'hero-section',
    'estimate-banner',
    'section-services',
    'section-portfolio',
    'section-news',
    'section-testimonials',
    'section-cta',
];

export default function ScrollNextButton() {
    const [visible, setVisible] = useState(true);
    const [atBottom, setAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollBottom = window.scrollY + window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            setAtBottom(scrollBottom >= docHeight - 100);
            setVisible(scrollBottom < docHeight - 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToNext = useCallback(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        for (const id of SECTION_IDS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const top = el.getBoundingClientRect().top + scrollY;
            // Find the first section whose top is significantly below current scroll
            if (top > scrollY + 80) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        // If no next section, scroll down one viewport
        window.scrollBy({ top: vh, behavior: 'smooth' });
    }, []);

    if (!visible || atBottom) return null;

    return (
        <button
            onClick={scrollToNext}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 group cursor-pointer"
            aria-label="Scroll to next section"
        >
            <div className="absolute inset-0 w-12 h-12 rounded-full border border-teal-400/30" style={{ animation: 'scrollRing 2s ease-out infinite' }} />
            <div className="w-12 h-12 rounded-full border border-white/20 dark:border-white/20 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-md group-hover:border-teal-400/60 group-hover:bg-teal-400/10 flex items-center justify-center transition-all duration-500 shadow-lg shadow-black/20">
                <svg
                    className="w-5 h-5 text-white/70 group-hover:text-teal-300 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                    style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
            </div>
        </button>
    );
}
