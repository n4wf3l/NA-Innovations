import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
    icon?: string;
}

interface Props {
    page: Page;
}

export default function ResourceShow({ page }: Props) {
    const { t } = useTranslation();
    return (
        <PartnerLayout title={page.title}>
            <Head title={page.title} />

            {/* Back link */}
            <Link href="/partner/resources" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-6 inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t('Back to Resources')}
            </Link>

            {/* Page header */}
            <div className="mb-8 flex items-center space-x-4">
                {page.icon && (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/10 dark:to-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={page.icon} />
                        </svg>
                    </div>
                )}
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{page.title}</h1>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
                <div
                    className="page-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>

            <style>{`
                .page-content h2 { font-size: 1.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
                .page-content h2:first-child { margin-top: 0; }
                .page-content h3 { font-size: 1.125rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                .page-content p { line-height: 1.75; margin-bottom: 0.75rem; }
                .page-content ul, .page-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                .page-content ul { list-style-type: disc; }
                .page-content ol { list-style-type: decimal; }
                .page-content li { margin-bottom: 0.25rem; line-height: 1.75; }
                .page-content a { color: #f43f5e; text-decoration: none; }
                .page-content a:hover { text-decoration: underline; }

                .page-content h2, .page-content h3, .page-content strong { color: #111827; }
                .page-content p, .page-content li, .page-content ul, .page-content ol { color: #4b5563; }

                .dark .page-content h2, .dark .page-content h3, .dark .page-content strong { color: #f3f4f6; }
                .dark .page-content p, .dark .page-content li, .dark .page-content ul, .dark .page-content ol { color: #9ca3af; }
            `}</style>
        </PartnerLayout>
    );
}
