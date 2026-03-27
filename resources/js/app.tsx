import '../css/app.css';
import './lib/i18n'; // Initialize i18n before anything else
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import InstallPrompt from './Components/layout/InstallPrompt';

// Global: detect clicked link/button and add loading state
let lastClickedEl: HTMLElement | null = null;

document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a, button') as HTMLElement | null;
    if (target) lastClickedEl = target;
});

router.on('start', () => {
    if (lastClickedEl) {
        lastClickedEl.setAttribute('data-loading', 'true');
    }
});

router.on('finish', () => {
    if (lastClickedEl) {
        lastClickedEl.removeAttribute('data-loading');
        lastClickedEl = null;
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - NA Innovations` : 'NA Innovations',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <InstallPrompt />
            </>
        );
    },
    progress: {
        color: '#5eead4',
        showSpinner: false,
    },
});
