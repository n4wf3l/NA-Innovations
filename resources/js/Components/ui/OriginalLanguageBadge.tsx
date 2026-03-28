import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

/**
 * Petit badge discret indiquant que le contenu est dans la langue originale de l'admin.
 * S'affiche uniquement quand la langue active est différente de la langue du contenu.
 *
 * @param contentLang — langue du contenu (default: 'fr' car l'admin écrit en français)
 * @param light — version claire pour les fonds sombres
 */
export default function OriginalLanguageBadge({ className = '', contentLang = 'fr', light = false }: { className?: string; contentLang?: string; light?: boolean }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || (usePage<{ locale: string }>().props.locale);

    // Don't show if already in the content language
    if (currentLang === contentLang) return null;

    const messages: Record<string, string> = {
        en: 'Content displayed in original language (FR)',
        nl: 'Inhoud weergegeven in de originele taal (FR)',
        fr: 'Contenu affiché dans la langue originale',
    };

    const message = messages[currentLang] || messages.en;
    const colorClass = light
        ? 'text-white/40'
        : 'text-gray-400 dark:text-gray-500';

    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${colorClass} ${className}`} title={message}>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
            </svg>
            {message}
        </span>
    );
}
