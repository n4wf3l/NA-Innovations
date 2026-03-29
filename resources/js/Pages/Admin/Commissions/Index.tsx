import { useState, useRef, useEffect } from 'react';
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
    const [exportOpen, setExportOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
                setExportOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const buildExportUrl = (format: 'pdf' | 'csv') => {
        const params = new URLSearchParams(window.location.search);
        const exportParams = new URLSearchParams();
        if (params.get('status')) exportParams.set('status', params.get('status')!);
        if (params.get('partner_id')) exportParams.set('partner_id', params.get('partner_id')!);
        if (params.get('from')) exportParams.set('from', params.get('from')!);
        if (params.get('to')) exportParams.set('to', params.get('to')!);
        const qs = exportParams.toString();
        return `/admin/exports/commissions/${format}${qs ? '?' + qs : ''}`;
    };

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

            {/* Export dropdown */}
            <div className="flex justify-end mb-4">
                <div className="relative" ref={exportRef}>
                    <button
                        onClick={() => setExportOpen(!exportOpen)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        {t('Export')}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {exportOpen && (
                        <div className="absolute right-0 z-20 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <a
                                href={buildExportUrl('pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                {t('Export PDF')}
                            </a>
                            <a
                                href={buildExportUrl('csv')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" /></svg>
                                {t('Export CSV')}
                            </a>
                        </div>
                    )}
                </div>
            </div>

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
