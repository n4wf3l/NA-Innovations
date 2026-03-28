import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import PdfPreviewCard from '@/Components/ui/PdfPreviewCard';

interface Props { invoice: any; }

export default function ClientInvoiceShow({ invoice }: Props) {
    const { t } = useTranslation();
    const items = invoice.items || [];
    const payments = invoice.payments || [];

    return (
        <ClientLayout title={invoice.invoice_number}>
            <Head title={invoice.invoice_number} />

            <Link href="/client/invoices" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 inline-block">&larr; {t('Back to')} {t('Invoices')}</Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{invoice.invoice_number}</h2>
                                    <p className="text-white/80 text-sm mt-1">{invoice.title}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge status={invoice.type || 'standard'} />
                                    <Badge status={invoice.status} />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Issue Date')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Due Date')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.due_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Amount Paid')}</span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(invoice.amount_paid)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Amount Due')}</span>
                                <span className={`font-bold ${invoice.amount_due > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{formatCurrency(invoice.amount_due)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t('Line Items')}</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Description')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Qty')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Unit Price')}</th>
                                    <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any) => (
                                    <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700">
                                        <td className="px-6 py-3 text-gray-900 dark:text-white">{item.description}</td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('Subtotal')}</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('Tax')} ({invoice.tax_rate}%)</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.tax_amount)}</span></div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2"><span className="text-gray-900 dark:text-white">{t('Total')}</span><span className="text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</span></div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {payments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t('Payment History')}</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Date')}</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Method')}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p: any) => (
                                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-700">
                                            <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatDate(p.payment_date)}</td>
                                            <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatStatus(p.method)}</td>
                                            <td className="px-6 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(p.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Payment instructions */}
                    {invoice.payment_instructions && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('Payment Instructions')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoice.payment_instructions}</p>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <PdfPreviewCard
                        previewUrl={`/client/invoices/${invoice.id}/pdf/preview`}
                        downloadUrl={`/client/invoices/${invoice.id}/pdf`}
                        filename={`${invoice.invoice_number}.pdf`}
                        accentColor="blue"
                    />
                </div>
            </div>
        </ClientLayout>
    );
}
