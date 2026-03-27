import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center space-x-1 mt-6">
            {links.map((link, i) => (
                <span key={i}>
                    {link.url ? (
                        <Link
                            href={link.url}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                link.active
                                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span className="px-3 py-1.5 text-sm text-gray-300 dark:text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                </span>
            ))}
        </nav>
    );
}
