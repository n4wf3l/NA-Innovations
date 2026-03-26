import { Link } from '@inertiajs/react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionHref?: string;
    actionLabel?: string;
    borderColor?: string;
}

export default function EmptyState({ title, description, actionHref, actionLabel, borderColor = 'border-t-teal-500' }: EmptyStateProps) {
    return (
        <div className={`bg-white rounded-xl border border-gray-100 border-t-4 ${borderColor} p-12 text-center shadow-sm`}>
            <svg className="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 mb-6">{description}</p>
            {actionHref && actionLabel && (
                <Link href={actionHref} className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
