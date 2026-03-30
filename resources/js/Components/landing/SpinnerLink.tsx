import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    href: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    external?: boolean;
}

export default function SpinnerLink({ href, className = '', style, children, external }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (external || href.startsWith('http')) return; // let browser handle external links
        e.preventDefault();
        setLoading(true);
        router.visit(href, {
            onFinish: () => setLoading(false),
        });
    }, [href, external]);

    return (
        <a href={href} onClick={handleClick} className={`${className} relative`} style={style}>
            <span className={`inline-flex items-center gap-inherit transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
                style={{ gap: 'inherit' }}
            >
                {children}
            </span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </span>
            )}
        </a>
    );
}
