import ClientLayout from '@/Layouts/ClientLayout';
import { Head } from '@inertiajs/react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface PurchaseOrder {
    id: number;
    po_number: string;
    client_name: string;
    total: number;
    status: string;
    issue_date: string;
    quote?: { quote_number: string; title: string } | null;
}

interface Props {
    purchaseOrders: { data: PurchaseOrder[] };
}

export default function ClientPurchaseOrdersIndex({ purchaseOrders }: Props) {
    const { t } = useTranslation();
    const orders = purchaseOrders?.data ?? purchaseOrders ?? [];

    return (
        <ClientLayout title={t("Purchase Orders")}>
            <Head title={t("Purchase Orders")} />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Purchase Orders')}</h1>
                    <p className="text-teal-200 text-sm">{t('View and download your purchase orders')}</p>
                </div>
            </div>

            {(Array.isArray(orders) ? orders : []).length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No purchase orders yet.')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('PO Number')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">{t('Quote')}</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">{t('Date')}</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                <th className="text-center px-6 py-3 font-semibold text-gray-500 dark:text-gray-400">{t('Status')}</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(orders) ? orders : []).map((po: PurchaseOrder) => (
                                <tr key={po.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.po_number}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">{po.quote?.quote_number ?? '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(po.issue_date)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(po.total)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            po.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                            po.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                        }`}>
                                            {t(po.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={`/client/purchase-orders/${po.id}/pdf`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-900/20 rounded-lg transition-colors"
                                        >
                                            {t('Download PDF')}
                                        </a>
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
