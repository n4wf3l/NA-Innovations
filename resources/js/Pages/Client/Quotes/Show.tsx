import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PdfPreviewCard from '@/Components/ui/PdfPreviewCard';
import { useConfirm } from '@/hooks/useConfirm';

interface Props { quote: any; }

export default function ClientQuoteShow({ quote }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [accepting, setAccepting] = useState(false);
    const items = quote.items || [];
    const canRespond = ['sent', 'viewed'].includes(quote.status);

    const handleAccept = async () => {
        const ok = await confirm({
            title: t('Accept Quote'),
            message: t('Are you sure you want to accept this quote? A deposit invoice will be generated.'),
            confirmText: t('Accept'),
            variant: 'info',
        });
        if (!ok) return;
        setAccepting(true);
        router.post(`/client/quotes/${quote.id}/accept`, {}, { onFinish: () => setAccepting(false) });
    };

    const handleReject = () => {
        const reason = prompt(t('Rejection reason (optional):'));
        if (reason !== null) {
            router.post(`/client/quotes/${quote.id}/reject`, { reason });
        }
    };

    return (
        <ClientLayout title={quote.quote_number}>
            <Head title={quote.quote_number} />

            <Link href="/client/quotes" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 inline-block">&larr; {t('Back to')} {t('Documents')}</Link>

            {/* Accept/Reject action bar */}
            {canRespond && (
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('This quote requires your response')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Review the details below and accept or reject')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleReject}
                                className="px-5 py-3 text-sm font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                {t('Reject')}
                            </button>
                            <button onClick={handleAccept} disabled={accepting}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2">
                                {accepting ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Accepting...')}</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>{t('Accept Quote')}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{quote.quote_number}</h2>
                                    <p className="text-white/80 text-sm mt-1">{quote.title}</p>
                                </div>
                                <Badge status={quote.status} className="text-sm" />
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div><span className="text-gray-500 dark:text-gray-400 block">{t('Issue Date')}</span><span className="font-medium text-gray-900 dark:text-white">{formatDate(quote.issue_date)}</span></div>
                            <div><span className="text-gray-500 dark:text-gray-400 block">{t('Valid Until')}</span><span className="font-medium text-gray-900 dark:text-white">{quote.valid_until ? formatDate(quote.valid_until) : '--'}</span></div>
                            <div><span className="text-gray-500 dark:text-gray-400 block">{t('Deposit')}</span><span className="font-medium text-gray-900 dark:text-white">{quote.deposit_percentage ?? 30}%</span></div>
                        </div>
                    </div>

                    {/* Introduction */}
                    {quote.introduction && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.introduction}</p>
                        </div>
                    )}

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
                                    <tr key={item.id} className={`border-b border-gray-50 dark:border-gray-700 ${item.is_optional ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-3 text-gray-900 dark:text-white">{item.description} {item.is_optional && <span className="text-xs text-amber-500">({t('Optional').toLowerCase()})</span>}</td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('Subtotal')}</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.subtotal)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('Tax')} ({quote.tax_rate}%)</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.tax_amount)}</span></div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2"><span className="text-gray-900 dark:text-white">{t('Total')}</span><span className="text-gray-900 dark:text-white">{formatCurrency(quote.total)}</span></div>
                            {quote.deposit_amount > 0 && (
                                <div className="flex justify-between text-sm text-teal-600 dark:text-teal-400 pt-1"><span>{t('Deposit')} ({quote.deposit_percentage}%)</span><span>{formatCurrency(quote.deposit_amount)}</span></div>
                            )}
                        </div>
                    </div>

                    {/* Scope */}
                    {quote.scope_of_work && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('Scope of Work')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.scope_of_work}</p>
                        </div>
                    )}

                    {/* Terms */}
                    {quote.terms_and_conditions && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('Terms & Conditions')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.terms_and_conditions}</p>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <PdfPreviewCard
                        previewUrl={`/client/quotes/${quote.id}/pdf/preview`}
                        downloadUrl={`/client/quotes/${quote.id}/pdf`}
                        filename={`${quote.quote_number}.pdf`}
                    />

                    {/* Accept button repeated for convenience */}
                    {canRespond && (
                        <button onClick={handleAccept} disabled={accepting}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2">
                            {accepting ? (
                                <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Accepting...')}</>
                            ) : (
                                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>{t('Accept Quote')}</>
                            )}
                        </button>
                    )}
                </div>
            </div>
            <ConfirmDialog />
        </ClientLayout>
    );
}
