import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { Quote, PaginatedData } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    quotes: PaginatedData<Quote>;
    totalQuotes: number;
    acceptedQuotes: number;
    pendingValue: number;
    conversionRate: number;
}

export default function QuotesIndex({ quotes, totalQuotes, acceptedQuotes, pendingValue, conversionRate }: Props) {
    const columns = [
        {
            header: 'Number',
            accessor: (quote: Quote) => (
                <Link href={`/admin/quotes/${quote.id}`} className="font-medium text-gray-900 hover:text-amber-600">{quote.quote_number}</Link>
            ),
        },
        { header: 'Title', accessor: (quote: Quote) => <span className="text-gray-700">{quote.title}</span> },
        { header: 'Client', accessor: (quote: Quote) => <span className="text-gray-500">{quote.client_name}</span> },
        { header: 'Status', accessor: (quote: Quote) => <Badge status={quote.status} /> },
        { header: 'Total', className: 'text-right', accessor: (quote: Quote) => <span className="font-medium text-gray-900">{formatCurrency(quote.total)}</span> },
        { header: 'Issued', accessor: (quote: Quote) => <span className="text-gray-500">{formatDate(quote.issue_date)}</span> },
        { header: 'Valid Until', accessor: (quote: Quote) => <span className="text-gray-500">{quote.valid_until ? formatDate(quote.valid_until) : '--'}</span> },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (quote: Quote) => (
                <span>
                    <Link href={`/admin/quotes/${quote.id}`} className="text-gray-400 hover:text-amber-600 mr-2">View</Link>
                    <Link href={`/admin/quotes/${quote.id}/edit`} className="text-gray-400 hover:text-gray-600">Edit</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Quotes" header="Quotes">
            <Head title="Quotes" />

            <ModuleBanner
                breadcrumb="Finance / Quotes"
                title="Quotation Management"
                description="Create and manage client quotations. Track acceptance rates and pending proposals."
                gradient="from-amber-500 to-orange-500"
                icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                actionHref="/admin/quotes/create"
                actionLabel="New Quote"
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Quotes" value={totalQuotes} borderColor="border-l-amber-500" />
                <StatCard label="Accepted" value={acceptedQuotes} borderColor="border-l-emerald-500" />
                <StatCard label="Pending Value" value={formatCurrency(pendingValue)} borderColor="border-l-blue-500" />
                <StatCard label="Conversion" value={`${conversionRate}%`} borderColor="border-l-violet-500" />
            </div>

            {/* Table */}
            {quotes.data.length === 0 ? (
                <EmptyState title="No quotes yet" description="Create your first quotation to get started." actionHref="/admin/quotes/create" actionLabel="New Quote" borderColor="border-t-amber-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={quotes.data}
                        keyExtractor={quote => quote.id}
                    />
                    <div className="mt-2">
                        <Pagination links={quotes.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
