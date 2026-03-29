import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { Quote, PaginatedData, PageProps } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
    quotes: PaginatedData<Quote>;
    totalQuotes: number;
    acceptedQuotes: number;
    pendingValue: number;
    conversionRate: number;
}

export default function QuotesIndex({ quotes, totalQuotes, acceptedQuotes, pendingValue, conversionRate }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();

    return (
        <AdminLayout title={t("Quotes")} header={t("Quotes")}>
            <Head title={t("Quotes")} />

            <ModuleBanner
                breadcrumb="Finance / Quotes"
                title={t('Quotation Management')}
                description={t('Create and manage client quotations. Track acceptance rates and pending proposals.')}
                gradient="from-amber-500 to-orange-500"
                icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                actionHref="/admin/quotes/create"
                actionLabel={t('New Quote')}
            />

            {/* Export buttons */}
            <div className="flex items-center gap-2 mb-4">
                <a href="/admin/exports/quotes/csv" className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    CSV
                </a>
            </div>

            {/* KPIs */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t('Total Quotes')} value={totalQuotes} borderColor="border-l-amber-500" />
                <StatCard label={t('Accepted')} value={acceptedQuotes} borderColor="border-l-emerald-500" />
                <StatCard label={t('Pending Value')} value={protectedValue(pendingValue, financialUnlocked)} borderColor="border-l-blue-500" />
                <StatCard label={t('Conversion')} value={`${conversionRate}%`} borderColor="border-l-violet-500" />
            </div>

            {/* Quotes list */}
            {quotes.data.length === 0 ? (
                <EmptyState title={t('No quotes yet.')} description={t('Create your first quotation to get started.')} actionHref="/admin/quotes/create" actionLabel={t('New Quote')} borderColor="border-t-amber-500" />
            ) : (
                <div className="space-y-3">
                    {quotes.data.map((quote) => (
                        <div key={quote.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                {/* Left: status bar */}
                                <div className={`sm:w-1.5 w-full h-1.5 sm:h-auto flex-shrink-0 ${
                                    quote.status === 'accepted' ? 'bg-emerald-500' :
                                    quote.status === 'sent' || quote.status === 'viewed' ? 'bg-blue-500' :
                                    quote.status === 'rejected' ? 'bg-red-500' :
                                    quote.status === 'expired' ? 'bg-amber-500' :
                                    'bg-gray-300'
                                }`} />

                                {/* Content */}
                                <div className="flex-1 p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        {/* Left info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{quote.quote_number}</span>
                                                <Badge status={quote.status} />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{quote.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{quote.client_name} {quote.client_company ? `· ${quote.client_company}` : ''}</p>
                                        </div>

                                        {/* Right: amount + dates */}
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-lg font-black text-gray-900 dark:text-white">
                                                    <ProtectedAmount amount={quote.total} />
                                                </p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                                    {formatDate(quote.issue_date)} → {quote.valid_until ? formatDate(quote.valid_until) : '—'}
                                                </p>
                                            </div>

                                            {/* Actions - visible buttons */}
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/admin/quotes/${quote.id}`}
                                                    className="px-3 py-2 text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                                                >
                                                    {t('View')}
                                                </Link>
                                                <Link
                                                    href={`/admin/quotes/${quote.id}/edit`}
                                                    className="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    {t('Edit')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Pagination links={quotes.links} />
                </div>
            )}
        </AdminLayout>
    );
}
