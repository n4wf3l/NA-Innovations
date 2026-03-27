import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-300 focus:ring-blue-300';

export default function ClientCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        vat_number: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
        financial_pin: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/clients');
    };

    return (
        <AdminLayout title={t("New Client")} header={t("New Client")}>
            <Head title={t("New Client")} />

            <div className="mb-6">
                <Link href="/admin/clients" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Clients")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Contact Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Name")} *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Company")}</label>
                            <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("VAT Number")}</label>
                            <input type="text" value={data.vat_number} onChange={e => setData('vat_number', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Address")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Street Address")}</label>
                            <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("City")}</label>
                            <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Postal Code")}</label>
                            <input type="text" value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Country")}</label>
                            <input type="text" value={data.country} onChange={e => setData('country', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Security")}</h3>
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("Financial PIN")}</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={data.financial_pin}
                            onChange={e => setData('financial_pin', e.target.value.replace(/\D/g, ''))}
                            className={inputClass}
                            placeholder={t("4-6 digit PIN")}
                        />
                        <p className="mt-1 text-xs text-gray-400">{t("Optional. Used to protect financial data visibility.")}</p>
                        {errors.financial_pin && <p className="mt-1 text-sm text-red-600">{errors.financial_pin}</p>}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/clients" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        Create Client
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
