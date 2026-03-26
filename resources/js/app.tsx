import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import InstallPrompt from './Components/layout/InstallPrompt';

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
