import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lead, ReferralPartner } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    lead: Lead;
    partners: ReferralPartner[];
    projectTypes: { value: string; label: string; commission_rate: number }[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-300 focus:ring-teal-300';

export default function LeadEdit({ lead, partners, projectTypes }: Props) {
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
                <Link href={`/admin/leads/${lead.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Lead")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Contact Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("First Name")} *</label>
                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} required />
                            {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Last Name")} *</label>
                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} required />
                            {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Email")} *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} required />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Phone")}</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Company")}</label>
                            <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Lead Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Lead Details")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Status")}</label>
                            <SearchableSelect
                                value={data.status}
                                onChange={(val) => setData('status', val)}
                                options={statuses.map(s => ({ value: s, label: formatStatus(s) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Source")}</label>
                            <SearchableSelect
                                value={data.source}
                                onChange={(val) => setData('source', val)}
                                options={sources.map(s => ({ value: s, label: formatStatus(s) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Referral Partner")}</label>
                            <SearchableSelect
                                value={data.referral_partner_id}
                                onChange={(val) => setData('referral_partner_id', val)}
                                placeholder={t("None")}
                                options={partners.map(p => ({ value: String(p.id), label: p.user?.name || '' }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Service Interest")}</label>
                            <SearchableSelect
                                value={data.service_interest}
                                onChange={(val) => setData('service_interest', val)}
                                placeholder={t('Sélectionner le type')}
                                options={projectTypes.map((pt: any) => ({ value: pt.value, label: pt.label }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Estimated Budget")}</label>
                            <input type="number" value={data.estimated_budget} onChange={e => setData('estimated_budget', e.target.value)} className={inputClass} step="0.01" min="0" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Notes")}</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className={inputClass} />
                    </div>
                    {data.status === 'lost' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Lost Reason")}</label>
                            <textarea value={data.lost_reason} onChange={e => setData('lost_reason', e.target.value)} rows={2} className={inputClass} placeholder="Why was this lead lost?" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/leads/${lead.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Update Lead')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
