import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { Invoice, PaginatedData, PageProps } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    invoices: PaginatedData<Invoice>;
    totalInvoices: number;
    totalBilled: number;
    totalPaid: number;
    totalOverdue: number;
}

export default function InvoicesIndex({ invoices, totalInvoices, totalBilled, totalPaid, totalOverdue }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;

    const columns = [
        {
            header: t('Number'),
            accessor: (invoice: Invoice) => (
                <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-gray-900 dark:text-white hover:text-emerald-600">{invoice.invoice_number}</Link>
            ),
        },
        { header: t('Title'), accessor: (invoice: Invoice) => <span className="text-gray-700 dark:text-gray-200">{invoice.title}</span> },
        { header: t('Client'), accessor: (invoice: Invoice) => <span className="text-gray-500">{invoice.client_name}</span> },
        { header: t('Type'), accessor: (invoice: Invoice) => <span className="text-gray-500">{formatStatus(invoice.type)}</span> },
        { header: t('Status'), accessor: (invoice: Invoice) => <Badge status={invoice.status} /> },
        { header: t('Total'), className: 'text-right', accessor: (invoice: Invoice) => <span className="font-medium text-gray-900 dark:text-white"><ProtectedAmount amount={invoice.total} /></span> },
        { header: t('Due'), className: 'text-right', accessor: (invoice: Invoice) => <span className="text-gray-700 dark:text-gray-200"><ProtectedAmount amount={invoice.amount_due} /></span> },
        { header: t('Due Date'), accessor: (invoice: Invoice) => <span className="text-gray-500">{formatDate(invoice.due_date)}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (invoice: Invoice) => (
                <span>
                    <Link href={`/admin/invoices/${invoice.id}`} className="text-gray-400 hover:text-emerald-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Invoices")} header={t("Invoices")}>
            <Head title={t("Invoices")} />

            <ModuleBanner
                breadcrumb={`${t("Finance")} / ${t("Invoices")}`}
                title={t("Invoice Management")}
                description={t("Create and track invoices. Monitor payments, overdue amounts, and cash flow.")}
                gradient="from-emerald-600 to-teal-600"
                icon="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                actionHref="/admin/invoices/create"
                actionLabel={t("New Invoice")}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Total Invoices")} value={totalInvoices} borderColor="border-l-emerald-500" />
                <StatCard label={t("Total Billed")} value={protectedValue(totalBilled, financialUnlocked)} borderColor="border-l-blue-500" />
                <StatCard label={t("Total Paid")} value={protectedValue(totalPaid, financialUnlocked)} borderColor="border-l-teal-500" />
                <StatCard label={t("Overdue")} value={protectedValue(totalOverdue, financialUnlocked)} borderColor="border-l-red-500" />
            </div>

            {/* Table */}
            {invoices.data.length === 0 ? (
                <EmptyState title={t("No invoices yet")} description={t("Create your first invoice to get started.")} actionHref="/admin/invoices/create" actionLabel={t("New Invoice")} borderColor="border-t-emerald-500" />
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
