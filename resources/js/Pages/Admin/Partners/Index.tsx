import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { ReferralPartner, PaginatedData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';

interface PartnerWithStats extends ReferralPartner {
    leads_count?: number;
    total_commission?: number;
}

interface Props {
    partners: PaginatedData<PartnerWithStats>;
    totalPartners: number;
    activePartners: number;
    totalCommissionsPaid: number;
    totalLeadsReferred: number;
}

export default function PartnersIndex({ partners, totalPartners, activePartners, totalCommissionsPaid, totalLeadsReferred }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;
    const columns = [
        {
            header: t('Name'),
            accessor: (partner: PartnerWithStats) => (
                <Link href={`/admin/partners/${partner.id}`} className="font-medium text-gray-900 dark:text-white hover:text-pink-600">{partner.user?.name || '--'}</Link>
            ),
        },
        { header: t('Email'), accessor: (partner: PartnerWithStats) => <span className="text-gray-500">{partner.user?.email || '--'}</span> },
        {
            header: t('Referral Code'),
            accessor: (partner: PartnerWithStats) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono text-gray-600 dark:text-gray-300">{partner.referral_code}</span>
            ),
        },
        { header: t('Commission Rate'), className: 'text-right', accessor: (partner: PartnerWithStats) => <span className="text-gray-700 dark:text-gray-200">{partner.default_commission_rate}%</span> },
        { header: t('Leads'), className: 'text-right', accessor: (partner: PartnerWithStats) => <span className="text-gray-700 dark:text-gray-200">{partner.leads_count ?? 0}</span> },
        { header: t('Total Commission'), className: 'text-right', accessor: (partner: PartnerWithStats) => <ProtectedAmount amount={partner.total_commission ?? 0} className="font-medium" /> },
        { header: t('Status'), accessor: (partner: PartnerWithStats) => <Badge status={partner.is_active ? 'active' : 'suspended'} /> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (partner: PartnerWithStats) => (
                <span>
                    <Link href={`/admin/partners/${partner.id}`} className="text-gray-400 hover:text-pink-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/partners/${partner.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Partners")} header={t("Partners")}>
            <Head title={t("Partners")} />

            <ModuleBanner
                breadcrumb={`${t("People")} / ${t("Partners")}`}
                title={t("Referral Partners")}
                description={t("Manage your referral partner network. Track referrals, commissions, and performance.")}
                gradient="from-pink-500 to-rose-500"
                icon="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                actionHref="/admin/partners/create"
                actionLabel={t("New Partner")}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Total Partners")} value={totalPartners} borderColor="border-l-pink-500" />
                <StatCard label={t("Active")} value={activePartners} borderColor="border-l-emerald-500" />
                <StatCard label={t("Commissions Paid")} value={protectedValue(totalCommissionsPaid, financialUnlocked)} borderColor="border-l-orange-500" />
                <StatCard label={t("Leads Referred")} value={totalLeadsReferred} borderColor="border-l-violet-500" />
            </div>

            {/* Table */}
            {partners.data.length === 0 ? (
                <EmptyState title={t("No partners yet")} description={t("Add your first referral partner to grow your network.")} actionHref="/admin/partners/create" actionLabel={t("New Partner")} borderColor="border-t-pink-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={partners.data}
                        keyExtractor={partner => partner.id}
                    />
                    <div className="mt-2">
                        <Pagination links={partners.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
