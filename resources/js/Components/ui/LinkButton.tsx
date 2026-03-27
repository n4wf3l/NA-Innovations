import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

/**
 * A Link that shows a spinner while navigating.
 * Replaces <Link> for action buttons (New Quote, Add Lead, etc.)
 */
export default function LinkButton({ href, children, className = '', method = 'get' }: LinkButtonProps) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const onStart = () => {}; // handled by click
        const onFinish = () => setLoading(false);

        router.on('finish', onFinish);
        return () => {
            // cleanup not needed for router events but good practice
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (loading) {
            e.preventDefault();
            return;
        }
        setLoading(true);
    };

    return (
        <Link
            href={href}
            method={method}
            onClick={handleClick}
            className={`${className} ${loading ? 'pointer-events-none opacity-80' : ''}`}
        >
            {loading ? (
                <span className="inline-flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('Loading...')}
                </span>
            ) : children}
        </Link>
    );
}
