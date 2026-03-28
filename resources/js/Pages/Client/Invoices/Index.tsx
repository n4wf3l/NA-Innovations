import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props { invoices: any[]; }

export default function ClientInvoicesIndex({ invoices }: Props) {
    const { t } = useTranslation();

    return (
        <ClientLayout title={t("Invoices")}>
            <Head title={t("Invoices")} />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Invoices')}</h1>
                    <p className="text-blue-200 text-sm">{t('View and download your invoices')}</p>
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No invoices yet.')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Number')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Title')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">{t('Due Date')}</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden sm:table-cell">{t('Amount Due')}</th>
                                <th className="text-center px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Status')}</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv: any) => (
                                <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inv.invoice_number}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{inv.title}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(inv.due_date)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.total)}</td>
                                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                                        <span className={inv.amount_due > 0 ? 'text-red-500 font-semibold' : 'text-emerald-500 font-semibold'}>{formatCurrency(inv.amount_due)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center"><Badge status={inv.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/client/invoices/${inv.id}`} className="text-xs text-teal-500 hover:text-teal-600 font-semibold">{t('View')} &rarr;</Link>
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
