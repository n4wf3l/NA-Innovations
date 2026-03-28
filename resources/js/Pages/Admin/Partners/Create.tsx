import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-pink-300 focus:ring-pink-300';

export default function PartnerCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        default_commission_rate: '10',
        payment_method: 'bank_transfer',
        bank_iban: '',
        paypal_email: '',
        notes: '',
        financial_pin: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/partners');
    };

    return (
        <AdminLayout title={t("New Partner")} header={t("New Partner")}>
            <Head title={t("New Partner")} />

            <div className="mb-6">
                <Link href="/admin/partners" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Partners")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Partner Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Name")} *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Email")} *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} required />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Commission Rate (%)")}</label>
                            <input type="number" value={data.default_commission_rate} onChange={e => setData('default_commission_rate', e.target.value)} className={inputClass} min="0" max="100" step="0.01" />
                            {errors.default_commission_rate && <p className="mt-1 text-sm text-red-600">{errors.default_commission_rate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Payment Method")}</label>
                            <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className={inputClass}>
                                <option value="bank_transfer">{t("Bank Transfer")}</option>
                                <option value="paypal">{t("PayPal")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Bank IBAN")}</label>
                            <input type="text" value={data.bank_iban} onChange={e => setData('bank_iban', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("PayPal Email")}</label>
                            <input type="email" value={data.paypal_email} onChange={e => setData('paypal_email', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Notes")}</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className={inputClass} />
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Security")}</h3>
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Financial PIN")}</label>
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
                    <Link href="/admin/partners" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Create Partner')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
