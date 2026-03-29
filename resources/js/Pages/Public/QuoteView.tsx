import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    quote: any;
}

export default function QuoteView({ quote }: Props) {
    const { t } = useTranslation();
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [reason, setReason] = useState('');
    const items = quote.items || [];
    const canRespond = ['sent', 'viewed'].includes(quote.status);
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const token = typeof window !== 'undefined'
        ? window.location.pathname.split('/').pop() || ''
        : '';

    const handleAccept = () => {
        if (confirm(t('Are you sure you want to accept this quote?'))) {
            setAccepting(true);
            router.post(`/quotes/${quote.id}/accept/${token}`, {}, {
                onFinish: () => setAccepting(false),
            });
        }
    };

    const handleReject = () => {
        setRejecting(true);
        router.post(`/quotes/${quote.id}/reject/${token}`, { reason }, {
            onFinish: () => setRejecting(false),
        });
    };

    return (
        <>
            <Head title={`${t('Quote')} ${quote.quote_number}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gray-900 py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{t('Quote')}</p>
                                <h1 className="text-white text-xl font-bold mt-0.5">{quote.quote_number}</h1>
                            </div>
                            <StatusBadge status={quote.status} />
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{flash.success}</p>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                                <p className="text-sm font-semibold text-red-800 dark:text-red-300">{flash.error}</p>
                            </div>
                        </div>
                    )}

                    {/* Status messages for finalized quotes */}
                    {quote.status === 'accepted' && !flash?.success && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 text-center">
                            <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{t('Quote Accepted')}</h3>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{t('This quote has been accepted. Your project has been initiated.')}</p>
                        </div>
                    )}

                    {quote.status === 'rejected' && !flash?.success && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 text-center">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-300">{t('Quote Rejected')}</h3>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{t('This quote has been declined.')}</p>
                        </div>
                    )}

                    {quote.status === 'expired' && (
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">{t('Quote Expired')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{t('This quote has expired and can no longer be accepted.')}</p>
                        </div>
                    )}

                    {/* Action bar for responding */}
                    {canRespond && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('This quote requires your response')}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Review the details below and accept or reject')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setShowRejectForm(!showRejectForm)}
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

                            {/* Rejection reason form */}
                            {showRejectForm && (
                                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-500/30 space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('Reason for rejection')} <span className="text-gray-400">({t('optional')})</span></label>
                                    <textarea
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        rows={3}
                                        maxLength={1000}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                                        placeholder={t('Tell us why you are declining this quote...')}
                                    />
                                    <div className="flex justify-end">
                                        <button onClick={handleReject} disabled={rejecting}
                                            className="px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors">
                                            {rejecting ? t('Sending...') : t('Confirm Rejection')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quote details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                            <h2 className="text-white text-xl font-bold">{quote.title}</h2>
                            <p className="text-white/80 text-sm mt-1">{quote.quote_number}</p>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Issue Date')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(quote.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Valid Until')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{quote.valid_until ? formatDate(quote.valid_until) : '--'}</span>
                            </div>
                            {quote.deposit_percentage > 0 && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t('Deposit')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{quote.deposit_percentage}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Introduction */}
                    {quote.introduction && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.introduction}</p>
                        </div>
                    )}

                    {/* Items table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
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
                                        <td className="px-6 py-3 text-gray-900 dark:text-white">
                                            {item.description}
                                            {item.is_optional && <span className="text-xs text-amber-500 ml-1">({t('Optional').toLowerCase()})</span>}
                                        </td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Subtotal')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Tax')} ({quote.tax_rate}%)</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                                <span className="text-gray-900 dark:text-white">{t('Total')}</span>
                                <span className="text-gray-900 dark:text-white">{formatCurrency(quote.total)}</span>
                            </div>
                            {quote.deposit_amount > 0 && (
                                <div className="flex justify-between text-sm text-teal-600 dark:text-teal-400 pt-1">
                                    <span>{t('Deposit')} ({quote.deposit_percentage}%)</span>
                                    <span>{formatCurrency(quote.deposit_amount)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scope of Work */}
                    {quote.scope_of_work && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('Scope of Work')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.scope_of_work}</p>
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    {quote.terms_and_conditions && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('Terms & Conditions')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.terms_and_conditions}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center py-6">
                        <p className="text-xs text-gray-400 dark:text-gray-500">NA Innovations BV &middot; BE1025939504</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        sent: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
        viewed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
        accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
        expired: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    };
    return (
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || colors.draft}`}>
            {status}
        </span>
    );
}
