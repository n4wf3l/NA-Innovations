import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { protectedValue } from '@/Components/ui/ProtectedAmount';
import { User, PaginatedData, PageProps } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
    clients: PaginatedData<User>;
    totalClients: number;
    activeClients: number;
    totalRevenue: number;
}

export default function ClientsIndex({ clients, totalClients, activeClients, totalRevenue }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;

    const columns = [
        {
            header: t('Name'),
            accessor: (client: User) => (
                <Link href={`/admin/clients/${client.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600">{client.name}</Link>
            ),
        },
        { header: t('Email'), accessor: (client: User) => <span className="text-gray-500">{client.email}</span> },
        { header: t('Company'), accessor: (client: User) => <span className="text-gray-500">{client.company_name || '--'}</span> },
        { header: t('Phone'), accessor: (client: User) => <span className="text-gray-500">{client.phone || '--'}</span> },
        { header: t('City'), accessor: (client: User) => <span className="text-gray-500">{client.city || '--'}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (client: User) => (
                <span>
                    <Link href={`/admin/clients/${client.id}`} className="text-gray-400 hover:text-blue-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/clients/${client.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Clients")} header={t("Clients")}>
            <Head title={t("Clients")} />

            <ModuleBanner
                breadcrumb={`${t("Business")} / ${t("Clients")}`}
                title={t("Client Management")}
                description={t("Manage your client portfolio. View contact details, projects, and billing history.")}
                gradient="from-blue-600 to-sky-600"
                icon="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                actionHref="/admin/clients/create"
                actionLabel={t("New Client")}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard label={t("Total Clients")} value={totalClients} borderColor="border-l-blue-500" />
                <StatCard label={t("Active Clients")} value={activeClients} borderColor="border-l-emerald-500" />
                <StatCard label={t("Total Revenue")} value={protectedValue(totalRevenue, financialUnlocked)} borderColor="border-l-teal-500" />
            </div>

            {/* Table */}
            {clients.data.length === 0 ? (
                <EmptyState title={t("No clients yet")} description={t("Add your first client to get started.")} actionHref="/admin/clients/create" actionLabel={t("New Client")} borderColor="border-t-blue-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={clients.data}
                        keyExtractor={client => client.id}
                    />
                    <div className="mt-2">
                        <Pagination links={clients.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
