import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Quote, QuoteItem, Invoice, Lead, User, TimelineEvent } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    quote: Quote & {
        client_address?: string;
        client_vat?: string;
        introduction?: string;
        scope_of_work?: string;
        exclusions?: string;
        tax_rate?: number;
        deposit_percentage?: number;
        deposit_amount?: number;
        terms_and_conditions?: string;
        notes?: string;
        sent_at?: string;
        pdf_path?: string;
        view_token?: string;
        items?: QuoteItem[];
        invoices?: Invoice[];
        lead?: Lead;
        client?: User;
        timeline_events?: TimelineEvent[];
    };
}

export default function QuoteShow({ quote }: Props) {
    const { t } = useTranslation();
    const [invoiceTypeOpen, setInvoiceTypeOpen] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this quote?')) {
            router.delete(`/admin/quotes/${quote.id}`);
        }
    };

    const handleSend = () => {
        if (confirm('Mark this quote as sent?')) {
            router.post(`/admin/quotes/${quote.id}/send`);
        }
    };

    const handleDuplicate = () => {
        router.post(`/admin/quotes/${quote.id}/duplicate`);
    };

    const handleCreateInvoice = (type: string) => {
        router.post(`/admin/quotes/${quote.id}/create-invoice`, { type });
        setInvoiceTypeOpen(false);
    };

    const items = quote.items || [];
    const invoices = quote.invoices || [];
    const timelineEvents = quote.timeline_events || [];

    return (
        <AdminLayout title={quote.quote_number} header={t('Quote Details')}>
            <Head title={quote.quote_number} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/quotes" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Quotes")}</Link>
                <div className="flex flex-wrap items-center gap-2">
                    {quote.status === 'draft' && (
                        <button onClick={handleSend} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">{t('Send')}</button>
                    )}
                    <button onClick={handleDuplicate} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Duplicate')}</button>
                    <div className="relative">
                        <button onClick={() => setInvoiceTypeOpen(!invoiceTypeOpen)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">Create Invoice</button>
                        {invoiceTypeOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                                <button onClick={() => handleCreateInvoice('deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t("Deposit Invoice")}</button>
                                <button onClick={() => handleCreateInvoice('final')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t("Final Invoice")}</button>
                            </div>
                        )}
                    </div>
                    <a href={`/admin/quotes/${quote.id}/pdf`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Download PDF</a>
                    <Link href={`/admin/quotes/${quote.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quote Header */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{quote.quote_number}</h2>
                                    <p className="text-white/80 text-sm mt-1">{quote.title}</p>
                                </div>
                                <Badge status={quote.status} className="text-sm" />
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b border-gray-50">
                            <div>
                                <span className="text-gray-500 block">{t("Issue Date")}</span>
                                <span className="font-medium text-gray-900">{formatDate(quote.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Valid Until</span>
                                <span className="font-medium text-gray-900">{quote.valid_until ? formatDate(quote.valid_until) : '--'}</span>
                            </div>
                            {quote.sent_at && (
                                <div>
                                    <span className="text-gray-500 block">{t("Sent At")}</span>
                                    <span className="font-medium text-gray-900">{formatDate(quote.sent_at)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 block">{t("Deposit")}</span>
                                <span className="font-medium text-gray-900">{quote.deposit_percentage ?? 30}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    {quote.introduction && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Introduction")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.introduction}</p>
                        </div>
                    )}

                    {/* Scope of Work */}
                    {quote.scope_of_work && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Scope of Work")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.scope_of_work}</p>
                        </div>
                    )}

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
                                        <tr key={item.id} className={`border-b border-gray-50 ${item.is_optional ? 'opacity-60' : ''}`}>
                                            <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                                            <td className="px-6 py-3 text-gray-900">
                                                {item.description}
                                                {item.is_optional && <span className="ml-2 text-xs text-amber-600 font-medium">(optional)</span>}
                                            </td>
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
                                <span className="font-medium"><ProtectedAmount amount={quote.subtotal} /></span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax ({quote.tax_rate ?? 21}%)</span>
                                <span className="font-medium"><ProtectedAmount amount={quote.tax_amount} /></span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                                <span>{t("Total")}</span>
                                <ProtectedAmount amount={quote.total} />
                            </div>
                            {quote.deposit_amount != null && quote.deposit_amount > 0 && (
                                <div className="flex justify-between text-sm text-teal-600 pt-1">
                                    <span>Deposit ({quote.deposit_percentage ?? 30}%)</span>
                                    <ProtectedAmount amount={quote.deposit_amount} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exclusions */}
                    {quote.exclusions && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Exclusions")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.exclusions}</p>
                        </div>
                    )}

                    {/* Terms */}
                    {quote.terms_and_conditions && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Terms & Conditions")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.terms_and_conditions}</p>
                        </div>
                    )}

                    {/* Related Invoices */}
                    {invoices.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Related Invoices")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {invoices.map(inv => (
                                    <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900">{inv.invoice_number}</span>
                                            <span className="ml-2 text-sm text-gray-500">{inv.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge status={inv.status} />
                                            <ProtectedAmount amount={inv.total} className="font-medium text-sm" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Client")}</h3>
                        </div>
                        <div className="p-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">{t("Name")}</span>
                                <span className="font-medium text-gray-900">{quote.client_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">{t("Email")}</span>
                                <a href={`mailto:${quote.client_email}`} className="text-teal-600 hover:text-teal-700">{quote.client_email}</a>
                            </div>
                            {quote.client_company && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Company")}</span>
                                    <span className="text-gray-700">{quote.client_company}</span>
                                </div>
                            )}
                            {quote.client_address && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Address")}</span>
                                    <span className="text-gray-700 text-right max-w-[60%]">{quote.client_address}</span>
                                </div>
                            )}
                            {quote.client_vat && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("VAT")}</span>
                                    <span className="text-gray-700">{quote.client_vat}</span>
                                </div>
                            )}
                            {quote.client && (
                                <div className="pt-2 border-t border-gray-100">
                                    <Link href={`/admin/clients/${quote.client.id}/edit`} className="text-sm text-teal-600 hover:text-teal-700">{t("View Client Profile")}</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead Info */}
                    {quote.lead && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Linked Lead")}</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Name")}</span>
                                    <Link href={`/admin/leads/${quote.lead.id}`} className="text-teal-600 hover:text-teal-700">{quote.lead.first_name} {quote.lead.last_name}</Link>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Status")}</span>
                                    <Badge status={quote.lead.status} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {quote.notes && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Internal Notes")}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
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
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-amber-400" />
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
