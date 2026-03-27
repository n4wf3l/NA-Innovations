import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Invoice, Payment, Quote, User, TimelineEvent } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    invoice: Invoice & {
        client_company?: string;
        client_address?: string;
        client_vat?: string;
        tax_rate?: number;
        payment_instructions?: string;
        notes?: string;
        sent_at?: string;
        pdf_path?: string;
        view_token?: string;
        items?: { id: number; description: string; quantity: number; unit: string; unit_price: number; total: number; sort_order: number }[];
        payments?: Payment[];
        quote?: Quote;
        client?: User;
        timeline_events?: TimelineEvent[];
    };
}

export default function InvoiceShow({ invoice }: Props) {
    const { t } = useTranslation();
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const paymentForm = useForm({
        amount: '',
        method: 'bank_transfer',
        reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(`/admin/invoices/${invoice.id}`);
        }
    };

    const handleSend = () => {
        if (confirm('Mark this invoice as sent?')) {
            router.post(`/admin/invoices/${invoice.id}/send`);
        }
    };

    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/admin/invoices/${invoice.id}/record-payment`, {
            onSuccess: () => {
                setShowPaymentForm(false);
                paymentForm.reset();
            },
        });
    };

    const items = invoice.items || [];
    const payments = invoice.payments || [];
    const timelineEvents = invoice.timeline_events || [];

    const paymentMethods = [
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' },
        { value: 'card', label: 'Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <AdminLayout title={invoice.invoice_number} header={t('Invoice Details')}>
            <Head title={invoice.invoice_number} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/invoices" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Invoices")}</Link>
                <div className="flex flex-wrap items-center gap-2">
                    {invoice.status === 'draft' && (
                        <button onClick={handleSend} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">{t('Send')}</button>
                    )}
                    <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">Record Payment</button>
                    <a href={`/admin/invoices/${invoice.id}/pdf`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Download PDF</a>
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Edit')}</Link>
                    {invoice.status === 'draft' && (
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">{t('Delete')}</button>
                    )}
                </div>
            </div>

            {/* Payment Form */}
            {showPaymentForm && (
                <div className="mb-6 bg-white rounded-xl border border-emerald-200 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Record Payment")}</h3>
                    <form onSubmit={handleRecordPayment} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Amount")} *</label>
                            <input type="number" value={paymentForm.data.amount} onChange={e => paymentForm.setData('amount', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400" step="0.01" min="0.01" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Method")}</label>
                            <select value={paymentForm.data.method} onChange={e => paymentForm.setData('method', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400">
                                {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Reference")}</label>
                            <input type="text" value={paymentForm.data.reference} onChange={e => paymentForm.setData('reference', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Date")}</label>
                            <input type="date" value={paymentForm.data.payment_date} onChange={e => paymentForm.setData('payment_date', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400" />
                        </div>
                        <div className="flex items-end gap-2">
                            <button type="submit" disabled={paymentForm.processing} className="px-4 py-3 text-sm font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50">{t('Save')}</button>
                            <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">{t('Cancel')}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Header */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
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
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b border-gray-50">
                            <div>
                                <span className="text-gray-500 block">{t("Issue Date")}</span>
                                <span className="font-medium text-gray-900">{formatDate(invoice.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">{t("Due Date")}</span>
                                <span className="font-medium text-gray-900">{formatDate(invoice.due_date)}</span>
                            </div>
                            {invoice.sent_at && (
                                <div>
                                    <span className="text-gray-500 block">{t("Sent At")}</span>
                                    <span className="font-medium text-gray-900">{formatDate(invoice.sent_at)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 block">{t("Type")}</span>
                                <span className="font-medium text-gray-900">{formatStatus(invoice.type || 'standard')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="font-semibold text-gray-900">{t("Line Items")}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-3 font-medium text-gray-500">#</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500">Qty</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500">Unit</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500">Unit Price</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => (
                                        <tr key={item.id} className="border-b border-gray-50">
                                            <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                                            <td className="px-6 py-3 text-gray-900">{item.description}</td>
                                            <td className="px-6 py-3 text-right text-gray-700">{item.quantity}</td>
                                            <td className="px-6 py-3 text-gray-500">{formatStatus(item.unit)}</td>
                                            <td className="px-6 py-3 text-right"><ProtectedAmount amount={item.unit_price} /></td>
                                            <td className="px-6 py-3 text-right font-medium"><ProtectedAmount amount={item.total} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="px-6 py-4 bg-gray-50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t("Subtotal")}</span>
                                <span className="font-medium"><ProtectedAmount amount={invoice.subtotal} /></span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax ({invoice.tax_rate ?? 21}%)</span>
                                <span className="font-medium"><ProtectedAmount amount={invoice.tax_amount} /></span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                                <span>{t("Total")}</span>
                                <ProtectedAmount amount={invoice.total} />
                            </div>
                            <div className="flex justify-between text-sm text-emerald-600 pt-1">
                                <span>{t("Amount Paid")}</span>
                                <ProtectedAmount amount={invoice.amount_paid} />
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-red-600 border-t border-gray-200 pt-2">
                                <span>{t("Amount Due")}</span>
                                <ProtectedAmount amount={invoice.amount_due} />
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {payments.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Payment History")}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">Method</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">Reference</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                            <th className="text-right px-6 py-3 font-medium text-gray-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="border-b border-gray-50">
                                                <td className="px-6 py-3 text-gray-700">{formatDate(payment.payment_date)}</td>
                                                <td className="px-6 py-3 text-gray-700">{formatStatus(payment.method)}</td>
                                                <td className="px-6 py-3 text-gray-500">{payment.reference || '--'}</td>
                                                <td className="px-6 py-3"><Badge status={payment.status} /></td>
                                                <td className="px-6 py-3 text-right font-medium"><ProtectedAmount amount={payment.amount} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Related Quote */}
                    {invoice.quote && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Related Quote")}</h3>
                            <Link href={`/admin/quotes/${invoice.quote.id}`} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors -mx-3">
                                <div>
                                    <span className="font-medium text-gray-900">{invoice.quote.quote_number}</span>
                                    <span className="ml-2 text-sm text-gray-500">{invoice.quote.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge status={invoice.quote.status} />
                                    <ProtectedAmount amount={invoice.quote.total} className="font-medium text-sm" />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Client")}</h3>
                        </div>
                        <div className="p-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">{t("Name")}</span>
                                <span className="font-medium text-gray-900">{invoice.client_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">{t("Email")}</span>
                                <a href={`mailto:${invoice.client_email}`} className="text-teal-600 hover:text-teal-700">{invoice.client_email}</a>
                            </div>
                            {invoice.client_company && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Company")}</span>
                                    <span className="text-gray-700">{invoice.client_company}</span>
                                </div>
                            )}
                            {invoice.client_address && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Address")}</span>
                                    <span className="text-gray-700 text-right max-w-[60%]">{invoice.client_address}</span>
                                </div>
                            )}
                            {invoice.client_vat && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("VAT")}</span>
                                    <span className="text-gray-700">{invoice.client_vat}</span>
                                </div>
                            )}
                            {invoice.client && (
                                <div className="pt-2 border-t border-gray-100">
                                    <Link href={`/admin/clients/${invoice.client.id}/edit`} className="text-sm text-teal-600 hover:text-teal-700">{t("View Client Profile")}</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    {invoice.payment_instructions && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Payment Instructions")}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.payment_instructions}</p>
                        </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Internal Notes")}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h3 className="font-semibold text-gray-900">{t("Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timelineEvents.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-4">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                                    <div className="space-y-5">
                                        {timelineEvents.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                        <span className="text-xs text-gray-400">{formatDate(event.created_at)}</span>
                                                    </div>
                                                    {event.description && <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>}
                                                    {event.old_value && event.new_value && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge status={event.old_value} />
                                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                            <Badge status={event.new_value} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
