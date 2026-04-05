import { usePage } from '@inertiajs/react';

interface Props {
    href: string;
    className?: string;
}

export default function AdminEditButton({ href, className = '' }: Props) {
    const { auth } = usePage<{ auth: { user: { role?: string } | null } }>().props;

    if (!auth?.user || auth.user.role !== 'admin') return null;

    return (
        <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = href; }}
            className={`absolute top-3 right-3 z-20 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-teal-300 hover:bg-teal-500/20 hover:border-teal-400/40 transition-all duration-200 opacity-0 group-hover:opacity-100 ${className}`}
            title="Modifier"
        >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </button>
    );
}
