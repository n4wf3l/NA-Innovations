/**
 * App logo that switches between dark and white variants based on context.
 * - dark-logo-small.png → for light/white backgrounds
 * - white-logo-small.png → for dark backgrounds
 *
 * Props:
 * - variant: 'dark' (white logo for dark bg) | 'light' (dark logo for light bg) | 'auto' (follows theme)
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - className: additional classes
 */

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

export default function AppLogo({ variant = 'auto', size = 'md', className = '' }: Props) {
    const sizeClass = sizeMap[size];

    if (variant === 'dark') {
        // White logo for dark backgrounds
        return <img src="/white-logo-small.png" alt="NA Innovations" className={`${sizeClass} w-auto object-contain ${className}`} />;
    }

    if (variant === 'light') {
        // Dark logo for light backgrounds
        return <img src="/dark-logo-small.png" alt="NA Innovations" className={`${sizeClass} w-auto object-contain ${className}`} />;
    }

    // Auto: show both, CSS handles visibility
    return (
        <span className={`inline-block ${className}`}>
            <img src="/white-logo-small.png" alt="NA Innovations" className={`${sizeClass} w-auto object-contain hidden dark:block`} />
            <img src="/dark-logo-small.png" alt="NA Innovations" className={`${sizeClass} w-auto object-contain block dark:hidden`} />
        </span>
    );
}
