import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Project, RecurringService } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    service: RecurringService & {
        provider_account?: string;
        provider_reference?: string;
        client_id?: number;
        projet_id?: number;
        purchase_date?: string;
        currency?: string;
        payment_mode?: string;
        auto_renew?: boolean;
        alert_days_before?: number;
        login_url?: string;
        credentials_note?: string;
        description?: string;
        notes?: string;
    };
    clients: User[];
    projects: Project[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';

function toDateInput(val: string | null | undefined): string {
    if (!val) return '';
    return val.substring(0, 10);
}

const serviceTypes = ['domain', 'hosting', 'ssl', 'email', 'saas', 'maintenance', 'support', 'other'];
const frequencies = ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'];
const paymentModes = ['manual', 'automatic', 'client_direct'];
const serviceStatuses = ['active', 'expiring_soon', 'expired', 'cancelled', 'suspended'];

export default function ServiceEdit({ service, clients, projects }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        type: service.type || 'hosting',
        provider: service.provider || '',
        provider_account: service.provider_account || '',
        provider_reference: service.provider_reference || '',
        client_id: service.client_id ? String(service.client_id) : '',
        projet_id: service.projet_id ? String(service.projet_id) : '',
        purchase_date: toDateInput(service.purchase_date),
        expiry_date: toDateInput(service.expiry_date),
        frequency: service.frequency || 'annual',
        real_cost: service.real_cost ? String(service.real_cost) : '',
        billed_price: service.billed_price ? String(service.billed_price) : '',
        currency: service.currency || 'EUR',
        status: service.status || 'active',
        payment_mode: service.payment_mode || 'manual',
        auto_renew: service.auto_renew ?? true,
        alert_days_before: service.alert_days_before != null ? String(service.alert_days_before) : '30',
        login_url: service.login_url || '',
        credentials_note: service.credentials_note || '',
        description: service.description || '',
        notes: service.notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    };

    const margin = (parseFloat(data.billed_price) || 0) - (parseFloat(data.real_cost) || 0);

    return (
        <AdminLayout title={t("Edit Service")} header={t("Edit Recurring Service")}>
            <Head title={t("Edit Service")} />

            <div className="mb-6">
                <Link href={`/admin/services/${service.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Service")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Service Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Service Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Service Name")} *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Type")} *</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className={inputClass}>
                                {serviceTypes.map(t => <option key={t} value={t}>{formatStatus(t)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Provider")}</label>
                            <input type="text" value={data.provider} onChange={e => setData('provider', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Provider Account")}</label>
                            <input type="text" value={data.provider_account} onChange={e => setData('provider_account', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Provider Reference")}</label>
                            <input type="text" value={data.provider_reference} onChange={e => setData('provider_reference', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Status")}</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                {serviceStatuses.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Login URL")}</label>
                            <input type="url" value={data.login_url} onChange={e => setData('login_url', e.target.value)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Description")}</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Assignment */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Assignment")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Client")}</label>
                            <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Project")}</label>
                            <select value={data.projet_id} onChange={e => setData('projet_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.nom_societe}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Schedule & Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Schedule & Pricing")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Purchase Date")}</label>
                            <input type="date" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Expiry Date")} *</label>
                            <input type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} className={inputClass} required />
                            {errors.expiry_date && <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Frequency")} *</label>
                            <select value={data.frequency} onChange={e => setData('frequency', e.target.value)} className={inputClass}>
                                {frequencies.map(f => <option key={f} value={f}>{formatStatus(f)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Real Cost")} *</label>
                            <input type="number" value={data.real_cost} onChange={e => setData('real_cost', e.target.value)} className={inputClass} step="0.01" min="0" required />
                            {errors.real_cost && <p className="mt-1 text-sm text-red-600">{errors.real_cost}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Billed Price")} *</label>
                            <input type="number" value={data.billed_price} onChange={e => setData('billed_price', e.target.value)} className={inputClass} step="0.01" min="0" required />
                            {errors.billed_price && <p className="mt-1 text-sm text-red-600">{errors.billed_price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Margin")}</label>
                            <div className={`${inputClass} bg-gray-50 dark:bg-gray-700 ${margin >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                                {margin.toFixed(2)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Payment Mode")}</label>
                            <select value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)} className={inputClass}>
                                {paymentModes.map(m => <option key={m} value={m}>{formatStatus(m)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Alert Days Before")}</label>
                            <input type="number" value={data.alert_days_before} onChange={e => setData('alert_days_before', e.target.value)} className={inputClass} min="0" />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                                <input type="checkbox" checked={data.auto_renew} onChange={e => setData('auto_renew', e.target.checked)} className="rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                                {t('Auto Renew')}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Credentials & Notes */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Credentials & Notes")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Credentials Note")}</label>
                            <textarea value={data.credentials_note} onChange={e => setData('credentials_note', e.target.value)} rows={2} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Notes")}</label>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/services/${service.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Update Service')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
