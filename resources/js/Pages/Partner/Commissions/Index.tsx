import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, usePage } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import StatCard from '@/Components/ui/StatCard';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
    commissions: any;
    totalEarned: number;
    totalPaid: number;
    totalEstimated: number;
    totalConfirmed: number;
    totalScheduled: number;
    upcomingPayouts: any[];
}

export default function PartnerCommissionsIndex({
    commissions,
    totalEarned,
    totalPaid,
    totalEstimated,
    totalConfirmed,
    totalScheduled,
    upcomingPayouts,
}: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;

    const columns = [
        {
            header: t('Lead'),
            accessor: (c: any) => (
                <span className="text-gray-900">
                    {c.lead ? `${c.lead.first_name} ${c.lead.last_name}` : '--'}
                </span>
            ),
        },
        {
            header: t('Base'),
            className: 'text-right',
            accessor: (c: any) => (
                <span className="text-gray-500"><ProtectedAmount amount={c.base_amount} /></span>
            ),
        },
        {
            header: t('Rate'),
            className: 'text-center',
            accessor: (c: any) => (
                <span className="text-gray-500">{c.commission_rate}%</span>
            ),
        },
        {
            header: t('Commission'),
            className: 'text-right',
            accessor: (c: any) => (
                <span className="font-medium text-gray-900">
                    <ProtectedAmount amount={c.commission_amount} />
                </span>
            ),
        },
        {
            header: t('Status'),
            accessor: (c: any) => <Badge status={c.status} />,
        },
        {
            header: t('Scheduled Date'),
            accessor: (c: any) => (
                <span className="text-gray-500 text-xs">
                    {c.scheduled_payment_date ? formatDate(c.scheduled_payment_date) : '--'}
                </span>
            ),
        },
        {
            header: t('Paid Date'),
            accessor: (c: any) => (
                <span className="text-gray-500 text-xs">
                    {c.paid_date ? formatDate(c.paid_date) : '--'}
                </span>
            ),
        },
        {
            header: t('Reference'),
            accessor: (c: any) => (
                <span className="text-gray-500 text-xs font-mono">
                    {c.payment_reference || '--'}
                </span>
            ),
        },
    ];

    return (
        <PartnerLayout title={t("Commissions")}>
            <Head title={t("Commissions")} />

            {/* Total Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Estimated")} value={protectedValue(totalEstimated, financialUnlocked)} borderColor="border-l-gray-400" />
                <StatCard label={t("Confirmed")} value={protectedValue(totalConfirmed, financialUnlocked)} borderColor="border-l-blue-500" />
                <StatCard label={t("Scheduled")} value={protectedValue(totalScheduled, financialUnlocked)} borderColor="border-l-amber-500" />
                <StatCard label={t("Paid")} value={protectedValue(totalPaid, financialUnlocked)} borderColor="border-l-emerald-500" />
            </div>

            {/* Upcoming Payouts */}
            {upcomingPayouts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-amber-900">{t("Upcoming Payouts")}</h3>
                    </div>
                    <div className="space-y-2">
                        {upcomingPayouts.map((payout: any) => (
                            <div key={payout.id} className="flex items-center justify-between bg-white/60 rounded-lg px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        <ProtectedAmount amount={payout.commission_amount} />
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {payout.lead ? `${payout.lead.first_name} ${payout.lead.last_name}` : 'Commission'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-amber-700">
                                        {formatDate(payout.scheduled_payment_date)}
                                    </p>
                                    <Badge status="scheduled" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary Row + Export */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Earned (all statuses)</span>
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900 dark:text-white"><ProtectedAmount amount={totalEarned} /></span>
                        <a
                            href="/partner/commissions/export"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {t('Export CSV')}
                        </a>
                        <a
                            href="/partner/commissions/export-pdf"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-200 dark:hover:bg-teal-800/40 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            {t('Export PDF')}
                        </a>
                    </div>
                </div>
            </div>

            {commissions.data.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center shadow-sm">
                    <p className="text-gray-400 dark:text-gray-500">{t("No commissions yet.")}</p>
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={commissions.data}
                        keyExtractor={(c: any) => c.id}
                    />
                    <div className="mt-2">
                        <Pagination links={commissions.links} />
                    </div>
                </>
            )}
        </PartnerLayout>
    );
}
