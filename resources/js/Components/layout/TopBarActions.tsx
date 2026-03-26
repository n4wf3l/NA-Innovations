import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import PinUnlockButton from '@/Components/ui/PinUnlockButton';

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
    const { auth, locale } = usePage<PageProps>().props;
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const unread = notifications.filter(n => !n.is_read);

    return (
        <div className="flex items-center space-x-2">
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
                                <p className="text-sm font-bold text-gray-900">Notifications</p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                        <p className="text-xs text-gray-400">No notifications</p>
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-medium text-gray-900">{auth.user?.name}</p>
                                <p className="text-xs text-gray-400">{auth.user?.email}</p>
                            </div>
                            <div className="py-1">
                                <Link href="/partner/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                                <form method="POST" action="/logout">
                                    <input type="hidden" name="_token" value={document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''} />
                                    <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign Out</button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
