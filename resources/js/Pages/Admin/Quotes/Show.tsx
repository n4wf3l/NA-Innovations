import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Quote, QuoteItem, Invoice, Lead, User, TimelineEvent } from '@/types';
import { formatDate, formatStatus, formatCurrency } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    emailTemplate: { subject: string; body: string };
}

export default function QuoteShow({ quote, emailTemplate }: Props) {
    const { t } = useTranslation();
    const [invoiceTypeOpen, setInvoiceTypeOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sending, setSending] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    // Initialize email fields from template with variable replacement
    const initEmail = () => {
        const vars: Record<string, string> = {
            client_name: quote.client_name,
            quote_number: quote.quote_number,
            total: formatCurrency(quote.total),
            valid_until: quote.valid_until ? formatDate(quote.valid_until) : '--',
            client_email: quote.client_email,
            company_name: quote.client_company || '',
        };
        let subject = emailTemplate.subject;
        let body = emailTemplate.body;
        for (const [key, val] of Object.entries(vars)) {
            const re = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            subject = subject.replace(re, val);
            body = body.replace(re, val);
        }
        setEmailSubject(subject);
        setEmailBody(body);
    };

    const openSendModal = () => {
        initEmail();
        setShowSendModal(true);
    };

    useEffect(() => {
        if (showSendModal) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showSendModal]);

    const confirmSend = () => {
        setSending(true);
        router.post(`/admin/quotes/${quote.id}/send`, {
            email_subject: emailSubject,
            email_body: emailBody,
        }, { onFinish: () => { setSending(false); setShowSendModal(false); } });
    };

    const handleDownloadPdf = async () => {
        setDownloading(true);
        try {
            const response = await fetch(`/admin/quotes/${quote.id}/pdf`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${quote.quote_number}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (e) {
            // fallback
            window.location.href = `/admin/quotes/${quote.id}/pdf`;
        }
        setTimeout(() => setDownloading(false), 800);
    };

    const handleDelete = () => {
        if (confirm(t('Are you sure you want to delete this quote?'))) {
            router.delete(`/admin/quotes/${quote.id}`);
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
                <Link href="/admin/quotes" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Quotes")}</Link>
                <div className="flex flex-wrap items-center gap-2">
                    {quote.status === 'draft' && (
                        <button onClick={openSendModal} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            {t('Send')}
                        </button>
                    )}
                    <button onClick={handleDuplicate} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Duplicate')}</button>
                    <div className="relative">
                        <button onClick={() => setInvoiceTypeOpen(!invoiceTypeOpen)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">{t('Create Invoice')}</button>
                        {invoiceTypeOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 py-1">
                                <button onClick={() => handleCreateInvoice('deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("Deposit Invoice")}</button>
                                <button onClick={() => handleCreateInvoice('final')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("Final Invoice")}</button>
                            </div>
                        )}
                    </div>
                    <Link href={`/admin/quotes/${quote.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quote Header */}
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
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b border-gray-50 dark:border-gray-700">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Issue Date")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(quote.issue_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Valid Until")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{quote.valid_until ? formatDate(quote.valid_until) : '--'}</span>
                            </div>
                            {quote.sent_at && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Sent At")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(quote.sent_at)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Deposit")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{quote.deposit_percentage ?? 30}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    {quote.introduction && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Introduction")}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.introduction}</p>
                        </div>
                    )}

                    {/* Scope of Work */}
                    {quote.scope_of_work && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Scope of Work")}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.scope_of_work}</p>
                        </div>
                    )}

                    {/* Line Items Table */}
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
                                        <tr key={item.id} className={`border-b border-gray-50 dark:border-gray-700 ${item.is_optional ? 'opacity-60' : ''}`}>
                                            <td className="px-6 py-3 text-gray-400 dark:text-gray-500">{i + 1}</td>
                                            <td className="px-6 py-3 text-gray-900 dark:text-white">
                                                {item.description}
                                                {item.is_optional && <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-medium">({t("Optional").toLowerCase()})</span>}
                                            </td>
                                            <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                                            <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{formatStatus(item.unit)}</td>
                                            <td className="px-6 py-3 text-right"><ProtectedAmount amount={item.unit_price} /></td>
                                            <td className="px-6 py-3 text-right font-medium"><ProtectedAmount amount={item.total} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Subtotal")}</span>
                                <span className="font-medium"><ProtectedAmount amount={quote.subtotal} /></span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Tax")} ({quote.tax_rate ?? 21}%)</span>
                                <span className="font-medium"><ProtectedAmount amount={quote.tax_amount} /></span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                                <span className="text-gray-900 dark:text-white">{t("Total")}</span>
                                <ProtectedAmount amount={quote.total} />
                            </div>
                            {quote.deposit_amount != null && quote.deposit_amount > 0 && (
                                <div className="flex justify-between text-sm text-teal-600 dark:text-teal-400 pt-1">
                                    <span>{t("Deposit")} ({quote.deposit_percentage ?? 30}%)</span>
                                    <ProtectedAmount amount={quote.deposit_amount} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exclusions */}
                    {quote.exclusions && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Exclusions")}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.exclusions}</p>
                        </div>
                    )}

                    {/* Terms */}
                    {quote.terms_and_conditions && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Terms & Conditions")}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.terms_and_conditions}</p>
                        </div>
                    )}

                    {/* Related Invoices */}
                    {invoices.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Related Invoices")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {invoices.map(inv => (
                                    <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">{inv.invoice_number}</span>
                                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{inv.title}</span>
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
                    {/* PDF Document Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        {/* Real PDF preview */}
                        <div className="relative bg-gray-100 dark:bg-gray-900/80" style={{ height: 280 }}>
                            <iframe
                                src={`/admin/quotes/${quote.id}/pdf/preview#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                className="w-full h-full border-0 pointer-events-none"
                                title={`${quote.quote_number}.pdf`}
                            />
                            {/* Clickable overlay */}
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={downloading}
                                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 dark:hover:bg-white/5 transition-colors group cursor-pointer w-full"
                            >
                                <div className={`transition-all duration-200 transform ${downloading ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90'}`}>
                                    <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-xl shadow-amber-500/30 flex items-center space-x-2">
                                        {downloading ? (
                                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        )}
                                        <span className="text-sm font-bold">{downloading ? t("Loading...") : t("Download PDF")}</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                        {/* Filename bar */}
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="group flex items-center space-x-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full text-left"
                        >
                            <svg className="w-8 h-8 text-red-500 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                                <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M20 2v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <rect x="7" y="18" width="18" height="8" rx="1.5" fill="currentColor"/>
                                <text x="16" y="24.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="system-ui">PDF</text>
                            </svg>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{quote.quote_number}.pdf</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{downloading ? t("Loading...") : t("Download PDF")}</p>
                            </div>
                            {downloading ? (
                                <svg className="animate-spin w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-amber-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Client Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Client")}</h3>
                        </div>
                        <div className="p-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("Name")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{quote.client_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("Email")}</span>
                                <a href={`mailto:${quote.client_email}`} className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">{quote.client_email}</a>
                            </div>
                            {quote.client_company && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Company")}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{quote.client_company}</span>
                                </div>
                            )}
                            {quote.client_address && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Address")}</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-right max-w-[60%]">{quote.client_address}</span>
                                </div>
                            )}
                            {quote.client_vat && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("VAT")}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{quote.client_vat}</span>
                                </div>
                            )}
                            {quote.client && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <Link href={`/admin/clients/${quote.client.id}/edit`} className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">{t("View Client Profile")}</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead Info */}
                    {quote.lead && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Linked Lead")}</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Name")}</span>
                                    <Link href={`/admin/leads/${quote.lead.id}`} className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">{quote.lead.first_name} {quote.lead.last_name}</Link>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">{t("Status")}</span>
                                    <Badge status={quote.lead.status} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {quote.notes && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Internal Notes")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{quote.notes}</p>
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
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-amber-400" />
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
                        {/* Header */}
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sm:rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                    {t('Send Quote')}
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">{t('To')}: {quote.client_name} &lt;{quote.client_email}&gt;</p>
                            </div>
                            <button onClick={() => !sending && setShowSendModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div ref={modalRef} className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-6 space-y-5">
                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t("Subject")}</label>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={e => setEmailSubject(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700"
                                    />
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        {t("Message")} <span className="font-normal normal-case text-gray-400 dark:text-gray-500 ml-1">({t('editable')})</span>
                                    </label>
                                    <textarea
                                        value={emailBody}
                                        onChange={e => setEmailBody(e.target.value)}
                                        rows={10}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700 font-mono leading-relaxed"
                                    />
                                </div>

                                {/* PDF attachment indicator */}
                                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 2C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8l-6-6H7zm7 7V3.5L18.5 8H14z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{quote.quote_number}.pdf</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">{t("PDF attached automatically")}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded-full uppercase">{t("Attachment")}</span>
                                </div>

                                {/* Email pending notice */}
                                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('Email sending is pending')}</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5">{t('The quote will be marked as sent. Email delivery will be activated soon.')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center space-x-3 sm:rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setShowSendModal(false)}
                                disabled={sending}
                                className="flex-1 py-3.5 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmSend}
                                disabled={sending}
                                className="flex-[2] py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        {t('Sending...')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                        {t('Send Quote')}
                                    </>
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
