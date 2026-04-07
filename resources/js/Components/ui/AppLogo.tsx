/**
 * App logo that switches between dark and white variants based on context.
 *
 * Reads the admin-uploaded logo and company name from Inertia shared props
 * (`branding.logo_path`, `branding.company_name`). If the admin has uploaded
 * a custom logo, it is used everywhere — otherwise we fall back to the
 * built-in dark/white logo files.
 *
 * Props:
 * - variant: 'dark' (white logo for dark bg) | 'light' (dark logo for light bg) | 'auto' (follows theme)
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - className: additional classes
 */
import { usePage } from '@inertiajs/react';

interface Props {
    variant?: 'dark' | 'light' | 'auto';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14',
};

interface BrandingProps {
    branding?: { logo_path?: string; company_name?: string };
}

export default function AppLogo({ variant = 'auto', size = 'md', className = '' }: Props) {
    const sizeClass = sizeMap[size];
    const page = usePage<BrandingProps>();
    const branding = page.props.branding;
    const customLogo = branding?.logo_path ? `/storage/${branding.logo_path}` : null;
    const altText = branding?.company_name || 'NA Innovations';

    if (customLogo) {
        // Custom uploaded logo — single file used regardless of background
        return <img src={customLogo} alt={altText} className={`${sizeClass} w-auto object-contain ${className}`} />;
    }

    if (variant === 'dark') {
        return <img src="/white-logo-small.png" alt={altText} className={`${sizeClass} w-auto object-contain ${className}`} />;
    }

    if (variant === 'light') {
        return <img src="/dark-logo-small.png" alt={altText} className={`${sizeClass} w-auto object-contain ${className}`} />;
    }

    return (
        <span className={`inline-block ${className}`}>
            <img src="/white-logo-small.png" alt={altText} className={`${sizeClass} w-auto object-contain hidden dark:block`} />
            <img src="/dark-logo-small.png" alt={altText} className={`${sizeClass} w-auto object-contain block dark:hidden`} />
        </span>
    );
}
