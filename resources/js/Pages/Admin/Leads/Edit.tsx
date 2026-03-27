import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lead, ReferralPartner } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    lead: Lead;
    partners: ReferralPartner[];
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300';

export default function LeadEdit({ lead, partners }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone || '',
        company_name: lead.company_name || '',
        status: lead.status,
        source: lead.source,
        referral_partner_id: lead.referral_partner_id ? String(lead.referral_partner_id) : '',
        service_interest: lead.service_interest || '',
        estimated_budget: lead.estimated_budget ? String(lead.estimated_budget) : '',
        notes: lead.notes || '',
        lost_reason: lead.lost_reason || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/leads/${lead.id}`);
    };

    const statuses = ['new', 'contacted', 'brief_pending', 'brief_completed', 'call_scheduled', 'qualified', 'not_qualified', 'quote_draft', 'quote_sent', 'won', 'lost'];
    const sources = ['referral', 'organic', 'website_contact', 'social_media', 'word_of_mouth', 'advertising', 'other'];

    return (
        <AdminLayout title={t("Edit Lead")} header={t("Edit Lead")}>
            <Head title={t("Edit Lead")} />

            <div className="mb-6">
                <Link href={`/admin/leads/${lead.id}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Lead")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Contact Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("First Name")} *</label>
                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} required />
                            {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Last Name")} *</label>
                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} required />
                            {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Email")} *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} required />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Phone")}</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Company")}</label>
                            <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Lead Details */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Lead Details")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Status")}</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                {statuses.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Source")}</label>
                            <select value={data.source} onChange={e => setData('source', e.target.value)} className={inputClass}>
                                {sources.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Referral Partner")}</label>
                            <select value={data.referral_partner_id} onChange={e => setData('referral_partner_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {partners.map(p => <option key={p.id} value={p.id}>{p.user?.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Service Interest")}</label>
                            <input type="text" value={data.service_interest} onChange={e => setData('service_interest', e.target.value)} className={inputClass} placeholder="e.g. E-commerce website" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Estimated Budget")}</label>
                            <input type="number" value={data.estimated_budget} onChange={e => setData('estimated_budget', e.target.value)} className={inputClass} step="0.01" min="0" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("Notes")}</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className={inputClass} />
                    </div>
                    {data.status === 'lost' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Lost Reason")}</label>
                            <textarea value={data.lost_reason} onChange={e => setData('lost_reason', e.target.value)} rows={2} className={inputClass} placeholder="Why was this lead lost?" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/leads/${lead.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        Update Lead
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
