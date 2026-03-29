import { useEffect } from 'react';

/**
 * Observes all elements with reveal classes (.reveal, .reveal-left, .reveal-right,
 * .reveal-scale, .reveal-stagger) and adds .visible when they enter the viewport.
 *
 * Call once in a page component — it handles all elements on the page.
 */
export function useScrollReveal() {
    useEffect(() => {
        const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';
        const elements = document.querySelectorAll(selectors);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
