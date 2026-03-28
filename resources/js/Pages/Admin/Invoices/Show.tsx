import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Invoice, Payment, Quote, User, TimelineEvent } from '@/types';
import { formatDate, formatStatus, formatCurrency } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import LocalePicker from '@/Components/ui/LocalePicker';
import PdfPreviewCard from '@/Components/ui/PdfPreviewCard';

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
    emailTemplates: Record<string, { subject: string; body: string }>;
}

export default function InvoiceShow({ invoice, emailTemplates }: Props) {
    const { t } = useTranslation();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sending, setSending] = useState(false);
    const [emailLocale, setEmailLocale] = useState(invoice.locale || 'fr');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    const paymentForm = useForm({
        amount: '',
        method: 'bank_transfer',
        reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const initEmail = (locale?: string) => {
        const loc = locale || emailLocale;
        const tpl = emailTemplates[loc] || emailTemplates['fr'];
        const vars: Record<string, string> = {
            client_name: invoice.client_name,
            invoice_number: invoice.invoice_number,
            total: formatCurrency(invoice.total),
            due_date: invoice.due_date ? formatDate(invoice.due_date) : '--',
            client_email: invoice.client_email,
        };
        let subject = tpl.subject;
        let body = tpl.body;
        for (const [key, val] of Object.entries(vars)) {
            const re = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            subject = subject.replace(re, val);
            body = body.replace(re, val);
        }
        setEmailSubject(subject);
        setEmailBody(body);
    };

    const handleEmailLocaleChange = (loc: string) => {
        setEmailLocale(loc);
        initEmail(loc);
    };

    const openSendModal = () => { initEmail(); setShowSendModal(true); };

    useEffect(() => {
        if (showSendModal) { document.body.style.overflow = 'hidden'; modalRef.current?.scrollTo(0, 0); }
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [showSendModal]);

    const confirmSend = () => {
        setSending(true);
        router.post(`/admin/invoices/${invoice.id}/send`, {
            email_subject: emailSubject,
            email_body: emailBody,
        }, { onFinish: () => { setSending(false); setShowSendModal(false); } });
    };

    const handleDelete = () => {
        if (confirm(t('Are you sure you want to delete this invoice?'))) {
            router.delete(`/admin/invoices/${invoice.id}`);
        }
    };

    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/admin/invoices/${invoice.id}/record-payment`, {
            onSuccess: () => { setShowPaymentForm(false); paymentForm.reset(); },
        });
    };

    const items = invoice.items || [];
    const payments = invoice.payments || [];
    const timelineEvents = invoice.timeline_events || [];

    const paymentMethods = [
        { value: 'bank_transfer', label: t('Bank Transfer') },
        { value: 'cash', label: t('Cash') },
        { value: 'card', label: t('card') },
        { value: 'paypal', label: 'PayPal' },
        { value: 'other', label: t('Other') },
    ];

    return (
        <AdminLayout title={invoice.invoice_number} header={t('Invoice Details')}>
            <Head title={invoice.invoice_number} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/invoices" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Invoices")}</Link>
                <div className="flex flex-wrap items-center gap-2">
                    {invoice.status === 'draft' && (
                        <button onClick={openSendModal} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            {t('Send')}
                        </button>
                    )}
                    <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">{t('Record Payment')}</button>
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
                    {invoice.status === 'draft' && (
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">{t('Delete')}</button>
                    )}
                </div>
            </div>

            {/* Payment Form */}
            {showPaymentForm && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-500/30 p-6 shadow-sm animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Record Payment")}</h3>
                    <form onSubmit={handleRecordPayment} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Amount")} *</label>
                            <input type="number" value={paymentForm.data.amount} onChange={e => paymentForm.setData('amount', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400" step="0.01" min="0.01" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Method")}</label>
                            <select value={paymentForm.data.method} onChange={e => paymentForm.setData('method', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400">
                                {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Reference")}</label>
                            <input type="text" value={paymentForm.data.reference} onChange={e => paymentForm.setData('reference', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Date")}</label>
                            <input type="date" value={paymentForm.data.payment_date} onChange={e => paymentForm.setData('payment_date', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div className="flex items-end gap-2">
                            <button type="submit" disabled={paymentForm.processing} className="px-4 py-3 text-sm font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50">{t('Save')}</button>
                            <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">{t('Cancel')}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{invoice.invoice_number}</h2>
                                    <p className="text-white/80 text-sm mt-1">{invoice.title}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(invoice as any).is_external && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                            {t('External document')}
                                        </span>
                                    )}
                                    <Badge status={invoice.type || 'standard'} />
                                    <Badge status={invoice.status} />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b border-gray-50 dark:border-gray-700">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Issue Date")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Due Date")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.due_date)}</span>
                            </div>
                            {invoice.sent_at && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Sent At")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.sent_at)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Type")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatStatus(invoice.type || 'standard')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t("Line Items")}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">#</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Description")}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Qty")}</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Unit")}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Unit Price")}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Total")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => (
                                        <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700">
                                            <td className="px-6 py-3 text-gray-400 dark:text-gray-500">{i + 1}</td>
                                            <td className="px-6 py-3 text-gray-900 dark:text-white">{item.description}</td>
                                            <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                            <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{formatStatus(item.unit)}</td>
                                            <td className="px-6 py-3 text-right"><ProtectedAmount amount={item.unit_price} /></td>
                                            <td className="px-6 py-3 text-right font-medium"><ProtectedAmount amount={item.total} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Subtotal")}</span>
                                <span className="font-medium"><ProtectedAmount amount={invoice.subtotal} /></span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Tax")} ({invoice.tax_rate ?? 21}%)</span>
                                <span className="font-medium"><ProtectedAmount amount={invoice.tax_amount} /></span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                                <span className="text-gray-900 dark:text-white">{t("Total")}</span>
                                <ProtectedAmount amount={invoice.total} />
                            </div>
                            <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 pt-1">
                                <span>{t("Amount Paid")}</span>
                                <ProtectedAmount amount={invoice.amount_paid} />
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                                <span>{t("Amount Due")}</span>
                                <ProtectedAmount amount={invoice.amount_due} />
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {payments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Payment History")}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                            <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Date")}</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Method")}</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Reference")}</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Status")}</th>
                                            <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t("Amount")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="border-b border-gray-50 dark:border-gray-700">
                                                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatDate(payment.payment_date)}</td>
                                                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatStatus(payment.method)}</td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{payment.reference || '--'}</td>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Related Quote")}</h3>
                            <Link href={`/admin/quotes/${invoice.quote.id}`} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors -mx-3">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{invoice.quote.quote_number}</span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{invoice.quote.title}</span>
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
                    {/* PDF Preview */}
                    <PdfPreviewCard
                        previewUrl={`/admin/invoices/${invoice.id}/pdf/preview`}
                        downloadUrl={`/admin/invoices/${invoice.id}/pdf`}
                        filename={`${invoice.invoice_number}.pdf`}
                        accentColor="blue"
                    />

                    {/* Client Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Client")}</h3>
                        </div>
                        <div className="p-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("Name")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{invoice.client_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("Email")}</span>
                                <a href={`mailto:${invoice.client_email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700">{invoice.client_email}</a>
                            </div>
                            {invoice.client_company && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Company")}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{invoice.client_company}</span>
                                </div>
                            )}
                            {invoice.client_address && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Address")}</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-right max-w-[60%]">{invoice.client_address}</span>
                                </div>
                            )}
                            {invoice.client_vat && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("VAT")}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{invoice.client_vat}</span>
                                </div>
                            )}
                            {invoice.client && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <Link href={`/admin/clients/${invoice.client.id}/edit`} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">{t("View Client Profile")}</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    {invoice.payment_instructions && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Payment Instructions")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoice.payment_instructions}</p>
                        </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Internal Notes")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t("Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timelineEvents.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                    <div className="space-y-5">
                                        {timelineEvents.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.created_at)}</span>
                                                    </div>
                                                    {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{event.description}</p>}
                                                    {event.old_value && event.new_value && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge status={event.old_value} />
                                                            <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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

            {/* Send Email Modal */}
            {showSendModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center">
                    <div className="hidden sm:block absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !sending && setShowSendModal(false)} />

                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[85vh] sm:rounded-2xl sm:shadow-2xl flex flex-col animate-modal">
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sm:rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                    {t('Send Invoice')}
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">{t('To')}: {invoice.client_name} &lt;{invoice.client_email}&gt;</p>
                            </div>
                            <button onClick={() => !sending && setShowSendModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div ref={modalRef} className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-6 space-y-5">
                                {/* Language picker */}
                                <LocalePicker value={emailLocale} onChange={handleEmailLocaleChange} label={t("Document & Email Language")} />

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t("Subject")}</label>
                                    <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        {t("Message")} <span className="font-normal normal-case text-gray-400 dark:text-gray-500 ml-1">({t('editable')})</span>
                                    </label>
                                    <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={10}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700 font-mono leading-relaxed" />
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8l-6-6H7zm7 7V3.5L18.5 8H14z"/></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{invoice.invoice_number}.pdf</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">{t("PDF attached automatically")}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded-full uppercase">{t("Attachment")}</span>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('Email sending is pending')}</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5">{t('The invoice will be marked as sent. Email delivery will be activated soon.')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center space-x-3 sm:rounded-b-2xl">
                            <button type="button" onClick={() => setShowSendModal(false)} disabled={sending}
                                className="flex-1 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                {t('Cancel')}
                            </button>
                            <button type="button" onClick={confirmSend} disabled={sending}
                                className="flex-[2] py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2">
                                {sending ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Sending...')}</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>{t('Send Invoice')}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
