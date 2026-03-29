import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
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

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        localStorage.setItem('na_theme', t);
        applyTheme(t);
        // Notify other useTheme instances
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }, []);

    return { theme, setTheme };
}
