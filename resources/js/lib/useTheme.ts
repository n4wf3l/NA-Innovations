import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
    return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme) {
    const resolved = resolveTheme(theme);
    if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function animateThemeTransition(theme: Theme, event?: MouseEvent | null) {
    const resolved = resolveTheme(theme);
    const isDark = resolved === 'dark';

    // If View Transitions API is supported (Chrome 111+)
    if (document.startViewTransition) {
        // Get the click origin for the circular reveal
        const x = event?.clientX ?? window.innerWidth / 2;
        const y = event?.clientY ?? 0;
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            applyTheme(theme);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${maxRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    } else {
        // Fallback: smooth opacity transition
        document.documentElement.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        applyTheme(theme);
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 400);
    }
}

// Custom event to sync multiple useTheme instances
const THEME_CHANGE_EVENT = 'na-theme-change';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'light';
        return (localStorage.getItem('na_theme') as Theme) || 'light';
    });

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Listen for system theme changes when in 'system' mode
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme('system');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    // Sync with other useTheme instances
    useEffect(() => {
        const handler = () => {
            const stored = localStorage.getItem('na_theme') as Theme;
            if (stored && stored !== theme) {
                setThemeState(stored);
            }
        };
        window.addEventListener(THEME_CHANGE_EVENT, handler);
        return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
    }, [theme]);

    const setTheme = useCallback((t: Theme, event?: MouseEvent | React.MouseEvent | null) => {
        setThemeState(t);
        localStorage.setItem('na_theme', t);
        animateThemeTransition(t, event as MouseEvent | null);
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }, []);

    return { theme, setTheme };
}
