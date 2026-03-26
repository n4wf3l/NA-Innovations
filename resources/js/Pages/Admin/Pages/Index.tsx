import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import DataTable from '@/Components/ui/DataTable';
import EmptyState from '@/Components/ui/EmptyState';

interface Page {
    id: number;
    title: string;
    slug: string;
    audience: string;
    is_published: boolean;
    sort_order: number;
    icon?: string;
}

interface Props {
    pages: Page[];
}

const audienceColors: Record<string, string> = {
    partner: 'bg-rose-100 text-rose-700',
    developer: 'bg-blue-100 text-blue-700',
    public: 'bg-gray-100 text-gray-700',
};

export default function PagesIndex({ pages }: Props) {
    function deletePage(page: Page) {
        if (confirm(`Delete "${page.title}"? This cannot be undone.`)) {
            router.delete(`/admin/pages/${page.id}`);
        }
    }

    function togglePublished(page: Page) {
        router.put(`/admin/pages/${page.id}`, {
            ...page,
            is_published: !page.is_published,
        }, { preserveScroll: true });
    }

    const columns = [
        {
            header: 'Title',
            accessor: (page: Page) => (
                <div>
                    <span className="font-medium text-gray-900">{page.title}</span>
                    <p className="text-xs text-gray-400 mt-0.5">/{page.slug}</p>
                </div>
            ),
        },
        {
            header: 'Audience',
            accessor: (page: Page) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${audienceColors[page.audience] || 'bg-gray-100 text-gray-700'}`}>
                    {page.audience}
                </span>
            ),
        },
        {
            header: 'Published',
            accessor: (page: Page) => (
                <button
                    onClick={(e) => { e.stopPropagation(); togglePublished(page); }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${page.is_published ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${page.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            ),
        },
        {
            header: 'Order',
            accessor: (page: Page) => <span className="text-gray-500">{page.sort_order}</span>,
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (page: Page) => (
                <span className="flex items-center justify-end space-x-2">
                    <Link href={`/admin/pages/${page.id}/edit`} className="text-gray-400 hover:text-gray-600 text-sm">Edit</Link>
                    <button onClick={() => deletePage(page)} className="text-gray-400 hover:text-red-500 text-sm">Delete</button>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Dynamic Pages" header="Dynamic Pages">
            <Head title="Dynamic Pages" />

            <ModuleBanner
                breadcrumb="Content / Pages"
                title="Dynamic Pages"
                description="Create and manage content pages for partners, developers, and the public."
                gradient="from-slate-600 to-gray-700"
                icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                actionHref="/admin/pages/create"
                actionLabel="New Page"
            />

            {pages.length === 0 ? (
                <EmptyState
                    title="No pages yet"
                    description="Create your first content page for partners or developers."
                    actionHref="/admin/pages/create"
                    actionLabel="New Page"
                    borderColor="border-t-slate-500"
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={pages}
                    keyExtractor={page => page.id}
                />
            )}
        </AdminLayout>
    );
}
