import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

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

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handlePassword(e: FormEvent) {
        e.preventDefault();
        passwordForm.put('/partner/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
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
                                <SearchableSelect
                                    value={data.payment_method}
                                    onChange={(val) => setData('payment_method', val)}
                                    options={[
                                        { value: 'bank_transfer', label: t("Bank Transfer") },
                                        { value: 'paypal', label: t("PayPal") },
                                        { value: 'cash', label: t("Cash") },
                                        { value: 'other', label: t("Other") },
                                    ]}
                                />
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

                {/* Change Password */}
                <form onSubmit={handlePassword} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Change Password')}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('Current Password')}</label>
                            <input type="password" value={passwordForm.data.current_password} onChange={e => passwordForm.setData('current_password', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-400" />
                            {passwordForm.errors.current_password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('New Password')}</label>
                            <input type="password" value={passwordForm.data.password} onChange={e => passwordForm.setData('password', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-400" />
                            {passwordForm.errors.password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('Confirm Password')}</label>
                            <input type="password" value={passwordForm.data.password_confirmation} onChange={e => passwordForm.setData('password_confirmation', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-400" />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={passwordForm.processing} className="px-6 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors">
                                {passwordForm.processing ? t('Saving...') : t('Update Password')}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Guided Tour Reset */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Visite guidée')}</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('Relancez la présentation interactive de votre tableau de bord pour redécouvrir toutes les fonctionnalités.')}</p>
                        <button
                            type="button"
                            onClick={async () => {
                                await fetch('/api/tour-completed', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
                                    body: JSON.stringify({ tour_key: 'partner_dashboard', reset: true }),
                                });
                                window.location.href = '/partner/dashboard';
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                            {t('Relancer la visite guidée')}
                        </button>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
}
