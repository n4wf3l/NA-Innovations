import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';

interface Page {
    id: number;
    title: string;
    slug: string;
    icon?: string;
}

interface Props {
    pages: Page[];
}

export default function ResourcesIndex({ pages }: Props) {
    return (
        <PartnerLayout title="Resources">
            <Head title="Resources & Documentation" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900">Resources & Documentation</h1>
                <p className="text-gray-400 text-sm mt-1">Guides, FAQs, and everything you need to know about the partner program.</p>
            </div>

            {/* Grid of page cards */}
            {pages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-400">No resources available yet.</p>
                    <p className="text-xs text-gray-300 mt-1">Check back later for guides and documentation.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/partner/resources/${page.slug}`}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-rose-100 transition-all duration-200"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center mb-4 group-hover:from-rose-100 group-hover:to-pink-100 transition-colors">
                                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={page.icon || 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'} />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{page.title}</h3>
                            <div className="mt-3 flex items-center text-sm text-rose-500 font-semibold group-hover:text-rose-600">
                                Read
                                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PartnerLayout>
    );
}
