import DevLayout from '@/Layouts/DevLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import TwoFactorSetup from '@/Components/ui/TwoFactorSetup';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        github_username: string | null;
        bio?: string | null;
        skills?: string[] | null;
        specialties?: string[] | null;
        hourly_rate?: number | string | null;
    };
    devSettings?: { showHourlyRate: boolean };
}

const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-700 transition-all';
const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';
const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';

export default function DevProfile({ user, devSettings }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;

    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills : [],
        specialties: Array.isArray(user.specialties) ? user.specialties : [],
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/dev/profile', { preserveScroll: true });
    };

    const handlePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/dev/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <DevLayout title={t('Profile')}>
            <Head title={t('Profile')} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Personal Information */}
                <div className={card}>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Personal Information')}</h3>
                    </div>
                    <form onSubmit={handleProfile} className="p-6 space-y-4">
                        <div>
                            <label className={label}>{t('Name')}</label>
                            <input
                                type="text"
                                className={input}
                                value={profileForm.data.name}
                                onChange={e => profileForm.setData('name', e.target.value)}
                            />
                            {profileForm.errors.name && <p className="text-xs text-red-500 mt-1">{profileForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('Email')}</label>
                            <input
                                type="email"
                                className={input}
                                value={profileForm.data.email}
                                onChange={e => profileForm.setData('email', e.target.value)}
                            />
                            {profileForm.errors.email && <p className="text-xs text-red-500 mt-1">{profileForm.errors.email}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('Phone')}</label>
                            <input
                                type="text"
                                className={input}
                                value={profileForm.data.phone}
                                onChange={e => profileForm.setData('phone', e.target.value)}
                                placeholder={t('Phone number')}
                            />
                            {profileForm.errors.phone && <p className="text-xs text-red-500 mt-1">{profileForm.errors.phone}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('Bio')}</label>
                            <textarea
                                rows={3}
                                className={input}
                                value={profileForm.data.bio}
                                onChange={e => profileForm.setData('bio', e.target.value)}
                                placeholder={t('Présentez-vous en quelques mots')}
                            />
                        </div>
                        <div>
                            <label className={label}>{t('Compétences')} ({t('séparées par des virgules')})</label>
                            <input
                                type="text"
                                className={input}
                                value={profileForm.data.skills.join(', ')}
                                onChange={e => profileForm.setData('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                placeholder="Laravel, React, TypeScript"
                            />
                        </div>
                        <div>
                            <label className={label}>{t('Spécialités')} ({t('séparées par des virgules')})</label>
                            <input
                                type="text"
                                className={input}
                                value={profileForm.data.specialties.join(', ')}
                                onChange={e => profileForm.setData('specialties', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                placeholder="SaaS, Dashboards"
                            />
                        </div>
                        {devSettings?.showHourlyRate && user.hourly_rate != null && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                <span className="text-xs text-indigo-700 dark:text-indigo-300">{t('Tarif horaire défini par l\'admin')} :</span>
                                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{user.hourly_rate} €/h</span>
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                            >
                                {profileForm.processing ? t('Saving...') : t('Save')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className={card}>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Change Password')}</h3>
                    </div>
                    <form onSubmit={handlePassword} className="p-6 space-y-4">
                        <div>
                            <label className={label}>{t('Current Password')}</label>
                            <input
                                type="password"
                                className={input}
                                value={passwordForm.data.current_password}
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                            />
                            {passwordForm.errors.current_password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('New Password')}</label>
                            <input
                                type="password"
                                className={input}
                                value={passwordForm.data.password}
                                onChange={e => passwordForm.setData('password', e.target.value)}
                            />
                            {passwordForm.errors.password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className={label}>{t('Confirm Password')}</label>
                            <input
                                type="password"
                                className={input}
                                value={passwordForm.data.password_confirmation}
                                onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                            >
                                {passwordForm.processing ? t('Saving...') : t('Update Password')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* GitHub Connection */}
                <div className={card}>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('GitHub Connection')}</h3>
                    </div>
                    <div className="p-6">
                        {user.github_username ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Connected as')} @{user.github_username}</p>
                                        <p className="text-xs text-gray-400">{t('Your GitHub account is linked')}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/auth/github/disconnect"
                                    method="post"
                                    as="button"
                                    className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    {t('Disconnect')}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('Connect your GitHub account to link repositories to projects.')}</p>
                                </div>
                                <a
                                    href="/auth/github/redirect"
                                    className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-700 text-white text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                    <span>{t('Connect GitHub')}</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                {/* 2FA */}
                <TwoFactorSetup enabled={auth.user?.two_factor_enabled || false} />

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
                                    body: JSON.stringify({ tour_key: 'dev_dashboard', reset: true }),
                                });
                                window.location.href = '/dev/dashboard';
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                            {t('Relancer la visite guidée')}
                        </button>
                    </div>
                </div>
            </div>
        </DevLayout>
    );
}
