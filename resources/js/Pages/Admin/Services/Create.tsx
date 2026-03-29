import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Project } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    clients: User[];
    projects: Project[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';

const serviceTypes = ['domain', 'hosting', 'ssl', 'email', 'saas', 'maintenance', 'support', 'other'];
const frequencies = ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'];
const paymentModes = ['manual', 'automatic', 'client_direct'];
const serviceStatuses = ['active', 'expiring_soon', 'expired', 'cancelled', 'suspended'];

export default function ServiceCreate({ clients, projects }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'hosting',
        provider: '',
        provider_account: '',
        provider_reference: '',
        client_id: '',
        projet_id: '',
        purchase_date: '',
        expiry_date: '',
        frequency: 'annual',
        real_cost: '',
        billed_price: '',
        currency: 'EUR',
        status: 'active',
        payment_mode: 'manual',
        auto_renew: true,
        alert_days_before: '30',
        login_url: '',
        credentials_note: '',
        description: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/services');
    };

    const margin = (parseFloat(data.billed_price as string) || 0) - (parseFloat(data.real_cost as string) || 0);

    return (
        <AdminLayout title={t("New Recurring Service")} header={t("New Recurring Service")}>
            <Head title={t("New Recurring Service")} />

            <div className="mb-6">
                <Link href="/admin/services" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Services")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Service Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Service Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Service Name")} *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required placeholder="e.g. Domain example.com" />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Type")} *</label>
                            <SearchableSelect
                                value={data.type}
                                onChange={(val) => setData('type', val)}
                                options={serviceTypes.map(st => ({ value: st, label: formatStatus(st) }))}
                            />
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Provider")}</label>
                            <input type="text" value={data.provider} onChange={e => setData('provider', e.target.value)} className={inputClass} placeholder="e.g. OVH, Cloudflare" />
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
                            <SearchableSelect
                                value={data.status}
                                onChange={(val) => setData('status', val)}
                                options={serviceStatuses.map(s => ({ value: s, label: formatStatus(s) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Login URL")}</label>
                            <input type="url" value={data.login_url} onChange={e => setData('login_url', e.target.value)} className={inputClass} placeholder="https://..." />
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
                            <SearchableSelect
                                value={data.client_id}
                                onChange={(val) => setData('client_id', val)}
                                placeholder={t("None")}
                                options={clients.map(c => ({ value: String(c.id), label: `${c.name}${c.company_name ? ` (${c.company_name})` : ''}` }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Project")}</label>
                            <SearchableSelect
                                value={data.projet_id}
                                onChange={(val) => setData('projet_id', val)}
                                placeholder={t("None")}
                                options={projects.map(p => ({ value: String(p.id), label: p.nom_societe }))}
                            />
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
                            <SearchableSelect
                                value={data.frequency}
                                onChange={(val) => setData('frequency', val)}
                                options={frequencies.map(f => ({ value: f, label: formatStatus(f) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Real Cost")} *</label>
                            <input type="number" value={data.real_cost} onChange={e => setData('real_cost', e.target.value)} className={inputClass} step="0.01" min="0" required placeholder="0.00" />
                            {errors.real_cost && <p className="mt-1 text-sm text-red-600">{errors.real_cost}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Billed Price")} *</label>
                            <input type="number" value={data.billed_price} onChange={e => setData('billed_price', e.target.value)} className={inputClass} step="0.01" min="0" required placeholder="0.00" />
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
                            <SearchableSelect
                                value={data.payment_mode}
                                onChange={(val) => setData('payment_mode', val)}
                                options={paymentModes.map(m => ({ value: m, label: formatStatus(m) }))}
                            />
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
                            <textarea value={data.credentials_note} onChange={e => setData('credentials_note', e.target.value)} rows={2} className={inputClass} placeholder="Login info, API keys (will be encrypted)..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Notes")}</label>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/services" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Create Service')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
