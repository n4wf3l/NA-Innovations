import '../css/app.css';
import './lib/i18n'; // Initialize i18n before anything else
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import InstallPrompt from './Components/layout/InstallPrompt';
import { installCustomValidation } from './lib/customValidation';

// Replace ugly native browser validation bubbles with our own styled popover
installCustomValidation();

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

// Read company name from initial Inertia page props (set by HandleInertiaRequests)
const initialDataEl = document.getElementById('app');
let initialBrandName = 'NA Innovations';
try {
    const pageData = initialDataEl?.getAttribute('data-page');
    if (pageData) {
        const parsed = JSON.parse(pageData);
        initialBrandName = parsed?.props?.branding?.company_name || 'NA Innovations';
    }
} catch { /* keep default */ }

createInertiaApp({
    title: (title) => title ? `${title} - ${initialBrandName}` : initialBrandName,
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
        // Reveal body after React mounts
        requestAnimationFrame(() => document.body.classList.add('ready'));
    },
    progress: {
        color: '#5eead4',
        showSpinner: false,
    },
});
