import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { Invoice, PaginatedData } from '@/types';
import { formatCurrency, formatDate, formatStatus } from '@/lib/utils';

interface Props {
    invoices: PaginatedData<Invoice>;
    totalInvoices: number;
    totalBilled: number;
    totalPaid: number;
    totalOverdue: number;
}

export default function InvoicesIndex({ invoices, totalInvoices, totalBilled, totalPaid, totalOverdue }: Props) {
    const columns = [
        {
            header: 'Number',
            accessor: (invoice: Invoice) => (
                <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-gray-900 hover:text-emerald-600">{invoice.invoice_number}</Link>
            ),
        },
        { header: 'Title', accessor: (invoice: Invoice) => <span className="text-gray-700">{invoice.title}</span> },
        { header: 'Client', accessor: (invoice: Invoice) => <span className="text-gray-500">{invoice.client_name}</span> },
        { header: 'Type', accessor: (invoice: Invoice) => <span className="text-gray-500">{formatStatus(invoice.type)}</span> },
        { header: 'Status', accessor: (invoice: Invoice) => <Badge status={invoice.status} /> },
        { header: 'Total', className: 'text-right', accessor: (invoice: Invoice) => <span className="font-medium text-gray-900">{formatCurrency(invoice.total)}</span> },
        { header: 'Due', className: 'text-right', accessor: (invoice: Invoice) => <span className="text-gray-700">{formatCurrency(invoice.amount_due)}</span> },
        { header: 'Due Date', accessor: (invoice: Invoice) => <span className="text-gray-500">{formatDate(invoice.due_date)}</span> },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (invoice: Invoice) => (
                <span>
                    <Link href={`/admin/invoices/${invoice.id}`} className="text-gray-400 hover:text-emerald-600 mr-2">View</Link>
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="text-gray-400 hover:text-gray-600">Edit</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Invoices" header="Invoices">
            <Head title="Invoices" />

            <ModuleBanner
                breadcrumb="Finance / Invoices"
                title="Invoice Management"
                description="Create and track invoices. Monitor payments, overdue amounts, and cash flow."
                gradient="from-emerald-600 to-teal-600"
                icon="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                actionHref="/admin/invoices/create"
                actionLabel="New Invoice"
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Invoices" value={totalInvoices} borderColor="border-l-emerald-500" />
                <StatCard label="Total Billed" value={formatCurrency(totalBilled)} borderColor="border-l-blue-500" />
                <StatCard label="Total Paid" value={formatCurrency(totalPaid)} borderColor="border-l-teal-500" />
                <StatCard label="Overdue" value={formatCurrency(totalOverdue)} borderColor="border-l-red-500" />
            </div>

            {/* Table */}
            {invoices.data.length === 0 ? (
                <EmptyState title="No invoices yet" description="Create your first invoice to get started." actionHref="/admin/invoices/create" actionLabel="New Invoice" borderColor="border-t-emerald-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={invoices.data}
                        keyExtractor={invoice => invoice.id}
                    />
                    <div className="mt-2">
                        <Pagination links={invoices.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
