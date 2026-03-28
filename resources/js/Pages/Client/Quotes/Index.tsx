import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props { quotes: any[]; }

export default function ClientQuotesIndex({ quotes }: Props) {
    const { t } = useTranslation();

    return (
        <ClientLayout title={t("Quotes")}>
            <Head title={t("Quotes")} />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Quotes')}</h1>
                    <p className="text-amber-100 text-sm">{t('View your quotes and proposals')}</p>
                </div>
            </div>

            {quotes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No quotes yet.')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Number')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Title')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">{t('Valid Until')}</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                <th className="text-center px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Status')}</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((q: any) => (
                                <tr key={q.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{q.quote_number}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{q.title}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{q.valid_until ? formatDate(q.valid_until) : '--'}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(q.total)}</td>
                                    <td className="px-6 py-4 text-center"><Badge status={q.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/client/quotes/${q.id}`} className="text-xs text-teal-500 hover:text-teal-600 font-semibold">{t('View')} &rarr;</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ClientLayout>
    );
}
