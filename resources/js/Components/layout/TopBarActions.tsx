import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import PinUnlockButton from '@/Components/ui/PinUnlockButton';
import { useTheme } from '@/lib/useTheme';
import { useTranslation } from 'react-i18next';

interface Notification {
    id: number;
    title: string;
    message: string;
    action_url?: string;
    created_at: string;
    is_read: boolean;
}

interface TopBarActionsProps {
    notifications?: Notification[];
}

export default function TopBarActions({ notifications = [] }: TopBarActionsProps) {
    const { auth, locale, teamCounts } = usePage<PageProps>().props;
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { t } = useTranslation();

    const unread = notifications.filter(n => !n.is_read);
    const isAdmin = auth.user?.role === 'admin';
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center space-x-2">
            {/* Team counts - admin only */}
            {isAdmin && teamCounts && (
                <div className="hidden sm:flex items-center space-x-1 mr-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold" title="Partners">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        {teamCounts.partners}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold" title="Developers">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                        {teamCounts.developers}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-600 text-[10px] font-bold" title="Admins">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        {teamCounts.admins}
                    </span>
                </div>
            )}

            {/* Financial PIN Unlock */}
            <PinUnlockButton />

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                {['en', 'fr', 'nl'].map(code => (
                    <a
                        key={code}
                        href={`/locale/${code}`}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                            locale === code
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {code.toUpperCase()}
                    </a>
                ))}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
                <button
                    onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                    className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {unread.length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unread.length}
                        </span>
                    )}
                </button>

                {showNotifs && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-bold text-gray-900">{t('Notifications')}</p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                        <p className="text-xs text-gray-400">{t('No notifications')}</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 5).map(n => (
                                        <a
                                            key={n.id}
                                            href={n.action_url || '#'}
                                            className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-rose-50/30' : ''}`}
                                        >
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-gray-300 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
                <button
                    onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                >
                    {auth.user?.initial || 'U'}
                </button>

                {showProfile && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{auth.user?.name}</p>
                                <p className="text-xs text-gray-400">{auth.user?.email}</p>
                            </div>

                            {/* Theme switcher */}
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Theme')}</p>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                            theme === 'light' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                        {t('Light')}
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                            theme === 'dark' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                        {t('Dark')}
                                    </button>
                                    <button
                                        onClick={() => setTheme('system')}
                                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                            theme === 'system' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                                        {t('Auto')}
                                    </button>
                                </div>
                            </div>

                            <div className="py-1">
                                <Link href="/partner/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('Profile')}</Link>
                                <form method="POST" action="/logout">
                                    <input type="hidden" name="_token" value={document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''} />
                                    <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('Sign Out')}</button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
