import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    user: {
        name: string;
        email: string;
        phone: string | null;
        preferences: {
            email_notifications: boolean;
            name_display: 'full' | 'abbreviated';
            currency: string;
            privacy_full_name: boolean;
        };
    };
    partner: {
        referral_code: string;
        referral_link: string | null;
        default_commission_rate: number;
        payment_method: string;
        bank_iban: string | null;
        paypal_email: string | null;
    };
}

const currencies = [
    { code: 'EUR', label: 'Euro (EUR)', symbol: '\u20AC', flag: '\uD83C\uDDEA\uD83C\uDDFA' },
    { code: 'USD', label: 'US Dollar (USD)', symbol: '$', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
    { code: 'GBP', label: 'British Pound (GBP)', symbol: '\u00A3', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
    { code: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: 'Rs', flag: '\uD83C\uDDF5\uD83C\uDDF0' },
    { code: 'BDT', label: 'Bangladeshi Taka (BDT)', symbol: '\u09F3', flag: '\uD83C\uDDE7\uD83C\uDDE9' },
    { code: 'INR', label: 'Indian Rupee (INR)', symbol: '\u20B9', flag: '\uD83C\uDDEE\uD83C\uDDF3' },
    { code: 'MAD', label: 'Moroccan Dirham (MAD)', symbol: 'DH', flag: '\uD83C\uDDF2\uD83C\uDDE6' },
];

const inputClass = 'w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent';
const toggleClass = (active: boolean) =>
    `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${active ? 'bg-rose-500' : 'bg-gray-200 dark:bg-gray-600'}`;
const toggleDot = (active: boolean) =>
    `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`;

export default function PartnerProfile({ user, partner }: Props) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        payment_method: partner.payment_method,
        bank_iban: partner.bank_iban || '',
        paypal_email: partner.paypal_email || '',
        preferences: {
            email_notifications: user.preferences?.email_notifications ?? true,
            name_display: user.preferences?.name_display ?? 'full',
            currency: user.preferences?.currency ?? 'EUR',
            privacy_full_name: user.preferences?.privacy_full_name ?? true,
        },
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/partner/profile');
    }

    function copyCode() {
        navigator.clipboard.writeText(partner.referral_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    // Preview name display
    const nameParts = data.name.split(' ');
    const abbreviatedName = nameParts.length > 1
        ? `${nameParts[0]} ${nameParts.slice(1).map(n => n[0] + '.').join(' ')}`
        : data.name;

    return (
        <PartnerLayout title={t("Profile & Settings")}>
            <Head title={t("Profile & Settings")} />

            <div className="max-w-2xl mx-auto space-y-6">

                {/* Referral Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t("Referral Information")}</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-400 dark:text-gray-500 mb-1">{t("Referral Code")}</label>
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-mono text-sm font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                                    {partner.referral_code}
                                </div>
                                <button type="button" onClick={copyCode} className="px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 dark:text-gray-500 mb-1">{t("Commission Rate")}</label>
                            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white">
                                {partner.default_commission_rate}%
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Personal Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t("Personal Information")}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("Full Name")}</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("Email")}</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("Phone")}</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t("Payment Details")}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("Payment Method")}</label>
                                <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className={inputClass + ' bg-white dark:bg-gray-700'}>
                                    <option value="bank_transfer">{t("Bank Transfer")}</option>
                                    <option value="paypal">{t("PayPal")}</option>
                                    <option value="cash">{t("Cash")}</option>
                                    <option value="other">{t("Other")}</option>
                                </select>
                            </div>
                            {data.payment_method === 'bank_transfer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("Bank IBAN")}</label>
                                    <input type="text" value={data.bank_iban} onChange={e => setData('bank_iban', e.target.value)} className={inputClass + ' font-mono'} placeholder="BE00 0000 0000 0000" />
                                </div>
                            )}
                            {data.payment_method === 'paypal' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("PayPal Email")}</label>
                                    <input type="email" value={data.paypal_email} onChange={e => setData('paypal_email', e.target.value)} className={inputClass} placeholder="your@paypal.com" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">{t("Settings & Preferences")}</h3>

                        <div className="space-y-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t("Email Notifications")}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Receive email alerts when your leads progress or commissions are updated</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('preferences', { ...data.preferences, email_notifications: !data.preferences.email_notifications })}
                                    className={toggleClass(data.preferences.email_notifications)}
                                >
                                    <span className={toggleDot(data.preferences.email_notifications)} />
                                </button>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            {/* Privacy - Full Name */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t("Show Full Name")}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Allow developers and admin to see your full name. If off, they see: <span className="font-mono font-bold text-gray-600">{abbreviatedName}</span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('preferences', { ...data.preferences, privacy_full_name: !data.preferences.privacy_full_name })}
                                    className={toggleClass(data.preferences.privacy_full_name)}
                                >
                                    <span className={toggleDot(data.preferences.privacy_full_name)} />
                                </button>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            {/* Name Display */}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{t("Name Display Format")}</p>
                                <p className="text-xs text-gray-400 mb-3">How your name appears in your own dashboard</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('preferences', { ...data.preferences, name_display: 'full' })}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${data.preferences.name_display === 'full' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        <span className="block font-bold">{data.name}</span>
                                        <span className="text-xs opacity-60">{t("Full name")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('preferences', { ...data.preferences, name_display: 'abbreviated' })}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${data.preferences.name_display === 'abbreviated' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        <span className="block font-bold">{abbreviatedName}</span>
                                        <span className="text-xs opacity-60">{t("Abbreviated")}</span>
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            {/* Currency */}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{t("Display Currency")}</p>
                                <p className="text-xs text-gray-400 mb-3">All amounts on your dashboard will be displayed in this currency</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {currencies.map(c => (
                                        <button
                                            key={c.code}
                                            type="button"
                                            onClick={() => setData('preferences', { ...data.preferences, currency: c.code })}
                                            className={`flex items-center space-x-2 p-3 rounded-xl border-2 text-sm transition-all ${data.preferences.currency === c.code ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <span className="text-lg">{c.flag}</span>
                                            <div className="text-left">
                                                <span className={`block text-xs font-bold ${data.preferences.currency === c.code ? 'text-rose-700' : 'text-gray-700'}`}>{c.code}</span>
                                                <span className="block text-[10px] text-gray-400">{c.symbol}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-50 flex items-center"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    Saving...
                                </>
                            ) : t('Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </PartnerLayout>
    );
}
