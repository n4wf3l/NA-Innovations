import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props {
    emailTemplate: { subject: string; body: string };
    partnerName: string;
}

export default function PartnerLeadSubmit({ emailTemplate, partnerName }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        service_interest: '',
        estimated_budget: '',
        notes: '',
        email_subject: emailTemplate.subject,
        email_body: emailTemplate.body,
    });

    const getPreviewBody = () => {
        return data.email_body
            .replace(/\{\{\s*client_name\s*\}\}/g, `${data.first_name} ${data.last_name}`.trim() || '[Client Name]')
            .replace(/\{\{\s*client_email\s*\}\}/g, data.email || '[Client Email]')
            .replace(/\{\{\s*partner_name\s*\}\}/g, partnerName)
            .replace(/\{\{\s*company_name\s*\}\}/g, data.company_name || '[Company]')
            .replace(/\{\{\s*service_interest\s*\}\}/g, data.service_interest || '[Service]')
            .replace(/\{\{\s*estimated_budget\s*\}\}/g, data.estimated_budget || '[Budget]');
    };

    const openModal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.first_name || !data.last_name || !data.email) return;
        setShowModal(true);
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    const confirmSend = () => {
        post('/partner/leads/submit');
    };

    // Large input classes for mobile-app feel
    const input = 'w-full border border-gray-200 rounded-2xl px-5 py-4 text-base focus:border-rose-400 focus:ring-rose-400 placeholder-gray-300 transition-colors';
    const label = 'block text-sm font-semibold text-gray-700 mb-2';

    return (
        <PartnerLayout title={t("Submit a Client")}>
            <Head title={t("Submit a Client")} />

            <div className="max-w-lg mx-auto pb-8">
                {/* Back */}
                <Link href="/partner/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {t('Back')}
                </Link>

                {/* Header - big and centered */}
                <div className="text-center mb-10">
                    <div className="animate-scale-in w-20 h-20 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-rose-500/25">
                        <svg className="w-10 h-10 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl sm:text-2xl font-black text-gray-900">{t('New Client')}</h2>
                    <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">{t("Fill in the details. We'll prepare a professional email with a PDF summary.")}</p>
                </div>

                {/* Form */}
                <form onSubmit={openModal} className="space-y-5">

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={label}>{t('First Name')} <span className="text-rose-400">*</span></label>
                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={input} placeholder="John" required />
                            {errors.first_name && <p className="mt-1.5 text-xs text-red-500">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('Last Name')} <span className="text-rose-400">*</span></label>
                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={input} placeholder="Doe" required />
                            {errors.last_name && <p className="mt-1.5 text-xs text-red-500">{errors.last_name}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={label}>{t('Email')} <span className="text-rose-400">*</span></label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={input} placeholder="john@company.com" required />
                        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={label}>{t("Phone")}</label>
                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={input} placeholder="+32 470 123 456" />
                    </div>

                    {/* Company */}
                    <div>
                        <label className={label}>{t("Company")}</label>
                        <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className={input} placeholder="Acme Inc." />
                    </div>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                        <div className="relative flex justify-center"><span className="bg-gray-50 px-4 text-xs font-bold text-gray-300 uppercase tracking-wider">{t('Project')}</span></div>
                    </div>

                    {/* Service */}
                    <div>
                        <label className={label}>{t('What do they need?')}</label>
                        <input type="text" value={data.service_interest} onChange={e => setData('service_interest', e.target.value)} className={input} placeholder="E-commerce, mobile app, website..." />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className={label}>{t("Estimated Budget")}</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-semibold">&euro;</span>
                            <input type="number" value={data.estimated_budget} onChange={e => setData('estimated_budget', e.target.value)} className={input + ' pl-10'} placeholder="5,000" min="0" step="100" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={label}>{t('Notes')} <span className="text-gray-300 font-normal">({t('Optional').toLowerCase()})</span></label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className={input} placeholder="How do you know them, any context..." />
                    </div>

                    {/* Submit - BIG app-like button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-500/30 transition-all duration-200 hover:shadow-rose-500/50 active:scale-[0.98] flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            {t('Review & Send')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Email Modal - true fullscreen sheet on mobile, card on desktop */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center">
                    {/* Backdrop - only visible on desktop behind the card */}
                    <div className="hidden sm:block absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !processing && setShowModal(false)} />

                    {/*
                        Mobile: full screen, 3-part layout (fixed header, scrollable body, fixed footer)
                        Desktop: centered card with max-height
                    */}
                    <div className="relative z-10 bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[85vh] sm:rounded-2xl sm:shadow-2xl flex flex-col animate-modal">

                        {/* Fixed header */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between safe-top">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">{t("Review Email")}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">To: {data.first_name} {data.last_name}</p>
                            </div>
                            <button onClick={() => !processing && setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 active:bg-gray-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable body - this is the ONLY scrollable area */}
                        <div ref={modalRef} className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
                            <div className="p-5 space-y-5">
                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Subject")}</label>
                                    <input
                                        type="text"
                                        value={data.email_subject}
                                        onChange={e => setData('email_subject', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-rose-400 focus:ring-rose-400"
                                    />
                                </div>

                                {/* Email body */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        {t('Message')} <span className="font-normal normal-case text-gray-300 ml-1">({t('editable')})</span>
                                    </label>
                                    <textarea
                                        value={data.email_body}
                                        onChange={e => setData('email_body', e.target.value)}
                                        rows={10}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-rose-400 focus:ring-rose-400 font-mono leading-relaxed"
                                    />
                                </div>

                                {/* Preview */}
                                <details className="group">
                                    <summary className="cursor-pointer flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5 active:bg-gray-100 transition-colors">
                                        <span className="text-sm font-semibold text-gray-700">{t('Preview with variables replaced')}</span>
                                        <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </summary>
                                    <div className="mt-2 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 whitespace-pre-wrap border border-gray-100 max-h-60 overflow-y-auto">
                                        {getPreviewBody()}
                                    </div>
                                </details>

                                {/* PDF info */}
                                <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                    </svg>
                                    <p className="text-sm text-blue-600">{t("PDF attached automatically")}</p>
                                </div>

                                {/* Extra padding at bottom so content doesn't hide behind footer */}
                                <div className="h-4" />
                            </div>
                        </div>

                        {/* Fixed footer */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center space-x-3 safe-bottom">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={processing}
                                className="flex-1 py-4 text-base font-semibold text-gray-500 bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmSend}
                                disabled={processing}
                                className="flex-[2] py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-base font-black rounded-xl shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        {t('Sending...')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                        {t('Send Email')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </PartnerLayout>
    );
}
