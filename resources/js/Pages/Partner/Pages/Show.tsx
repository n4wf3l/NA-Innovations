import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';

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
    return (
        <PartnerLayout title={page.title}>
            <Head title={page.title} />

            {/* Back link */}
            <Link href="/partner/resources" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Resources
            </Link>

            {/* Page header */}
            <div className="mb-8 flex items-center space-x-4">
                {page.icon && (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={page.icon} />
                        </svg>
                    </div>
                )}
                <h1 className="text-2xl font-black text-gray-900">{page.title}</h1>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div
                    className="page-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>

            <style>{`
                .page-content h2 { font-size: 1.25rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 1rem; }
                .page-content h2:first-child { margin-top: 0; }
                .page-content h3 { font-size: 1.125rem; font-weight: 700; color: #111827; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                .page-content p { color: #4b5563; line-height: 1.75; margin-bottom: 0.75rem; }
                .page-content ul, .page-content ol { color: #4b5563; padding-left: 1.5rem; margin-bottom: 1rem; }
                .page-content ul { list-style-type: disc; }
                .page-content ol { list-style-type: decimal; }
                .page-content li { margin-bottom: 0.25rem; line-height: 1.75; }
                .page-content strong { color: #111827; font-weight: 600; }
                .page-content a { color: #f43f5e; text-decoration: none; }
                .page-content a:hover { text-decoration: underline; }
            `}</style>
        </PartnerLayout>
    );
}
