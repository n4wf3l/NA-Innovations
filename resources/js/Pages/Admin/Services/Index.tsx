import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { RecurringService, PaginatedData, PageProps } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    services: PaginatedData<RecurringService>;
    totalServices: number;
    activeServices: number;
    monthlyRevenue: number;
    totalMargin: number;
}

export default function ServicesIndex({ services, totalServices, activeServices, monthlyRevenue, totalMargin }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;

    const columns = [
        {
            header: t('Name'),
            accessor: (svc: RecurringService) => (
                <Link href={`/admin/services/${svc.id}`} className="font-medium text-gray-900 dark:text-white hover:text-cyan-600">{svc.name}</Link>
            ),
        },
        { header: t('Type'), accessor: (svc: RecurringService) => <span className="text-gray-500">{formatStatus(svc.type)}</span> },
        { header: t('Client'), accessor: (svc: RecurringService) => <span className="text-gray-500">{svc.client?.name || '--'}</span> },
        { header: t('Provider'), accessor: (svc: RecurringService) => <span className="text-gray-500">{svc.provider || '--'}</span> },
        { header: t('Status'), accessor: (svc: RecurringService) => <Badge status={svc.status} /> },
        { header: t('Frequency'), accessor: (svc: RecurringService) => <span className="text-gray-500 capitalize">{svc.frequency}</span> },
        { header: t('Cost'), className: 'text-right', accessor: (svc: RecurringService) => <span className="text-gray-700 dark:text-gray-200"><ProtectedAmount amount={svc.real_cost} /></span> },
        { header: t('Billed'), className: 'text-right', accessor: (svc: RecurringService) => <span className="text-gray-700 dark:text-gray-200"><ProtectedAmount amount={svc.billed_price} /></span> },
        { header: t('Margin'), className: 'text-right', accessor: (svc: RecurringService) => <span className="font-medium text-emerald-600"><ProtectedAmount amount={svc.margin} /></span> },
        { header: t('Expiry'), accessor: (svc: RecurringService) => <span className="text-gray-500">{formatDate(svc.expiry_date)}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (svc: RecurringService) => (
                <span>
                    <Link href={`/admin/services/${svc.id}`} className="text-gray-400 hover:text-cyan-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/services/${svc.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Recurring Services")} header={t("Recurring Services")}>
            <Head title={t("Recurring Services")} />

            <ModuleBanner
                breadcrumb={`${t("System")} / ${t("Recurring Services")}`}
                title={t("Service Management")}
                description={t("Track recurring services like hosting, domains, and maintenance. Monitor costs and margins.")}
                gradient="from-cyan-600 to-teal-600"
                icon="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                actionHref="/admin/services/create"
                actionLabel={t("New Service")}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Total Services")} value={totalServices} borderColor="border-l-cyan-500" />
                <StatCard label={t("Active")} value={activeServices} borderColor="border-l-emerald-500" />
                <StatCard label={t("Monthly Revenue")} value={protectedValue(monthlyRevenue, financialUnlocked)} borderColor="border-l-teal-500" />
                <StatCard label={t("Total Margin")} value={protectedValue(totalMargin, financialUnlocked)} borderColor="border-l-blue-500" />
            </div>

            {/* Table */}
            {services.data.length === 0 ? (
                <EmptyState title={t("No services yet")} description={t("Add your first recurring service to track costs and margins.")} actionHref="/admin/services/create" actionLabel={t("New Service")} borderColor="border-t-cyan-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={services.data}
                        keyExtractor={svc => svc.id}
                    />
                    <div className="mt-2">
                        <Pagination links={services.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
