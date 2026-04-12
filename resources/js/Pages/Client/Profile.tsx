import ClientLayout from '@/Layouts/ClientLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import TwoFactorSetup from '@/Components/ui/TwoFactorSetup';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        company_name: string | null;
        address: string | null;
        city: string | null;
        postal_code: string | null;
        country: string | null;
        avatar: string | null;
        preferences: { notifications?: Record<string, boolean> } | null;
    };
    completion: number;
    lastLogin: string | null;
    memberSince: string | null;
}

const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 focus:bg-white dark:focus:bg-gray-700 transition-all';
const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';
const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';

export default function ClientProfile({ user, completion, lastLogin, memberSince }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const avatarInput = useRef<HTMLInputElement>(null);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showDanger, setShowDanger] = useState(false);

    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company_name: user.company_name || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const notifPrefs = user.preferences?.notifications ?? {};
    const notifForm = useForm({
        notify_project_updates: notifPrefs.notify_project_updates !== false,
        notify_service_expiry: notifPrefs.notify_service_expiry !== false,
    });

    const handleProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/client/profile', { preserveScroll: true });
    };

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const formData = new FormData();
        formData.append('avatar', e.target.files[0]);
        router.post('/client/profile/avatar', formData as any, { preserveScroll: true });
    };

    const handlePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/client/profile/password', { preserveScroll: true, onSuccess: () => passwordForm.reset() });
    };

    const handleNotifications = (e: React.FormEvent) => {
        e.preventDefault();
        notifForm.put('/client/profile/notifications', { preserveScroll: true });
    };

    const handleDelete = () => {
        if (deleteConfirm !== 'DELETE') return;
        router.delete('/client/profile', { data: { confirmation: 'DELETE' } });
    };

    const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (
        <ClientLayout title={t("Profile")}>
            <Head title={t("Profile")} />

            {/* Header with avatar */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-5">
                    {/* Avatar */}
                    <button type="button" onClick={() => avatarInput.current?.click()} className="relative group flex-shrink-0">
                        {user.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt="" className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20" />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/10">
                                <span className="text-2xl font-black text-white">{initials}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                        </div>
                        <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} className="hidden" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{user.name}</h1>
                        <p className="text-teal-200 text-sm">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-teal-300">
                            {lastLogin && <span>{t('Last login')}: {lastLogin}</span>}
                            {memberSince && <span>{t('Member since')}: {memberSince}</span>}
                        </div>
                    </div>
                    {/* Completion indicator */}
                    <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                        <div className="relative w-14 h-14">
                            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                                <circle cx="28" cy="28" r="24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"
                                    strokeDasharray={`${(completion / 100) * 150.8} 150.8`} />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{completion}%</span>
                        </div>
                        <span className="text-[10px] text-teal-200 mt-1">{t('Profile')}</span>
                    </div>
                </div>
            </div>

            {/* Completion bar (mobile) */}
            {completion < 100 && (
                <div className="sm:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6 flex items-center gap-3">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('Profile completion')}</span>
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{completion}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <form onSubmit={handleProfile} className={card}>
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Personal Information')}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>{t('Name')}</label>
                                <input type="text" value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} className={input} required />
                                {profileForm.errors.name && <p className="mt-1 text-xs text-red-500">{profileForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className={label}>{t('Email')}</label>
                                <input type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} className={input} required />
                                {profileForm.errors.email && <p className="mt-1 text-xs text-red-500">{profileForm.errors.email}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>{t('Phone')}</label>
                                <input type="tel" value={profileForm.data.phone} onChange={e => profileForm.setData('phone', e.target.value)} className={input} placeholder="+32 470 123 456" />
                            </div>
                            <div>
                                <label className={label}>{t('Company')}</label>
                                <input type="text" value={profileForm.data.company_name} onChange={e => profileForm.setData('company_name', e.target.value)} className={input} />
                            </div>
                        </div>
                        <div>
                            <label className={label}>{t('Address')}</label>
                            <input type="text" value={profileForm.data.address} onChange={e => profileForm.setData('address', e.target.value)} className={input} placeholder="170 Rue Example" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={label}>{t('City')}</label>
                                <input type="text" value={profileForm.data.city} onChange={e => profileForm.setData('city', e.target.value)} className={input} placeholder="Brussels" />
                            </div>
                            <div>
                                <label className={label}>{t('Postal Code')}</label>
                                <input type="text" value={profileForm.data.postal_code} onChange={e => profileForm.setData('postal_code', e.target.value)} className={input} placeholder="1000" />
                            </div>
                            <div>
                                <label className={label}>{t('Country')}</label>
                                <input type="text" value={profileForm.data.country} onChange={e => profileForm.setData('country', e.target.value)} className={input} placeholder="Belgium" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={profileForm.processing} className="px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors">
                                {profileForm.processing ? t('Saving...') : t('Save Changes')}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="space-y-6">
                    {/* Password */}
                    <form onSubmit={handlePassword} className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Password')}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={label}>{t('Current Password')}</label>
                                <input type="password" value={passwordForm.data.current_password} onChange={e => passwordForm.setData('current_password', e.target.value)} className={input} required />
                                {passwordForm.errors.current_password && <p className="mt-1 text-xs text-red-500">{passwordForm.errors.current_password}</p>}
                            </div>
                            <div>
                                <label className={label}>{t('New Password')}</label>
                                <input type="password" value={passwordForm.data.password} onChange={e => passwordForm.setData('password', e.target.value)} className={input} required minLength={8} />
                                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">{t('Min 8 characters, 1 uppercase, 1 number')}</p>
                                {passwordForm.errors.password && <p className="mt-1 text-xs text-red-500">{passwordForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className={label}>{t('Confirm Password')}</label>
                                <input type="password" value={passwordForm.data.password_confirmation} onChange={e => passwordForm.setData('password_confirmation', e.target.value)} className={input} required minLength={8} />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={passwordForm.processing} className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                    {passwordForm.processing ? t('Saving...') : t('Update Password')}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Notification Preferences */}
                    <form onSubmit={handleNotifications} className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Email Notifications')}</h3>
                        </div>
                        <div className="p-6 space-y-1">
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-4 py-3 mb-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <svg className="w-3.5 h-3.5 inline mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                    {t('Transactional emails (invoices, quotes, payment confirmations) are always sent.')}
                                </p>
                            </div>

                            <label className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4.5 h-4.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Project updates')}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Status changes, developer assigned')}</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={notifForm.data.notify_project_updates} onChange={e => notifForm.setData('notify_project_updates', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                                </div>
                            </label>

                            <label className="flex items-center justify-between py-4 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4.5 h-4.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Service expiry reminders')}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Hosting, domain, SSL expiration alerts')}</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={notifForm.data.notify_service_expiry} onChange={e => notifForm.setData('notify_service_expiry', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                                </div>
                            </label>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={notifForm.processing} className="px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors">
                                    {notifForm.processing ? t('Saving...') : t('Save Changes')}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* 2FA */}
                    <TwoFactorSetup enabled={auth.user?.two_factor_enabled || false} />

                    {/* Guided Tour Reset */}
                    <div className={card}>
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
                                        body: JSON.stringify({ tour_key: 'client_dashboard', reset: true }),
                                    });
                                    window.location.href = '/client/dashboard';
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                                {t('Relancer la visite guidée')}
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone (GDPR) */}
                    <div className={`${card} border-red-200 dark:border-red-500/30`}>
                        <button type="button" onClick={() => setShowDanger(!showDanger)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                <h3 className="font-bold text-red-600 dark:text-red-400 text-sm">{t('Danger Zone')}</h3>
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDanger ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showDanger && (
                            <div className="px-6 pb-6 space-y-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Deleting your account will permanently remove all your data. This action cannot be undone.')}</p>
                                <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">{t('Type DELETE to confirm')}</label>
                                    <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="w-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 placeholder-red-300 dark:placeholder-red-500/50 focus:ring-2 focus:ring-red-400" placeholder="DELETE" />
                                </div>
                                <button type="button" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE'}
                                    className="px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-30 transition-colors">
                                    {t('Delete my account')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
