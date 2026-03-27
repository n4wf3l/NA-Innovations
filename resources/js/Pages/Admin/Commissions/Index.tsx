import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { Commission, PaginatedData, PageProps } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    commissions: PaginatedData<Commission>;
    totalCommissions: number;
    totalPending: number;
    totalPaid: number;
    totalAmount: number;
}

export default function CommissionsIndex({ commissions, totalCommissions, totalPending, totalPaid, totalAmount }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;

    const columns = [
        { header: t('Partner'), accessor: (c: Commission) => <span className="font-medium text-gray-900 dark:text-white">{c.referral_partner?.user?.name || '--'}</span> },
        {
            header: t('Lead'),
            accessor: (c: Commission) => c.lead ? (
                <Link href={`/admin/leads/${c.lead.id}`} className="text-gray-500 hover:text-orange-600">
                    {c.lead.first_name} {c.lead.last_name}
                </Link>
            ) : <span className="text-gray-500">--</span>,
        },
        {
            header: t('Invoice'),
            accessor: (c: Commission) => c.invoice ? (
                <Link href={`/admin/invoices/${c.invoice.id}`} className="text-gray-500 hover:text-orange-600">
                    {c.invoice.invoice_number}
                </Link>
            ) : <span className="text-gray-500">--</span>,
        },
        { header: t('Base Amount'), className: 'text-right', accessor: (c: Commission) => <span className="text-gray-700 dark:text-gray-200"><ProtectedAmount amount={c.base_amount} /></span> },
        { header: t('Rate'), className: 'text-right', accessor: (c: Commission) => <span className="text-gray-700 dark:text-gray-200">{c.commission_rate}%</span> },
        { header: t('Commission'), className: 'text-right', accessor: (c: Commission) => <span className="font-medium text-gray-900 dark:text-white"><ProtectedAmount amount={c.commission_amount} /></span> },
        { header: t('Status'), accessor: (c: Commission) => <Badge status={c.status} /> },
        {
            header: t('Payment Date'),
            accessor: (c: Commission) => (
                <span className="text-gray-500">
                    {c.paid_date ? formatDate(c.paid_date) : c.scheduled_payment_date ? formatDate(c.scheduled_payment_date) : '--'}
                </span>
            ),
        },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (c: Commission) => (
                <Link href={`/admin/commissions/${c.id}`} className="text-gray-400 hover:text-orange-600">{t('View')}</Link>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Commissions")} header={t("Commissions")}>
            <Head title={t("Commissions")} />

            <ModuleBanner
                breadcrumb={`${t("Finance")} / ${t("Commissions")}`}
                title={t("Commission Tracking")}
                description={t("Track partner commissions from referrals. Manage payments and commission schedules.")}
                gradient="from-orange-500 to-amber-500"
                icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Total Commissions")} value={totalCommissions} borderColor="border-l-orange-500" />
                <StatCard label={t("Pending")} value={protectedValue(totalPending, financialUnlocked)} borderColor="border-l-amber-500" />
                <StatCard label={t("Paid Out")} value={protectedValue(totalPaid, financialUnlocked)} borderColor="border-l-emerald-500" />
                <StatCard label={t("Total Amount")} value={protectedValue(totalAmount, financialUnlocked)} borderColor="border-l-blue-500" />
            </div>

            {/* Table */}
            {commissions.data.length === 0 ? (
                <EmptyState title={t("No commissions yet")} description={t("Commissions will appear here when referral partners generate sales.")} borderColor="border-t-orange-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={commissions.data}
                        keyExtractor={c => c.id}
                    />
                    <div className="mt-2">
                        <Pagination links={commissions.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
