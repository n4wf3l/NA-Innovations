import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
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

export default function TopBarActions({ notifications: initialNotifications = [] }: TopBarActionsProps) {
    const { auth, locale, teamCounts } = usePage<PageProps>().props;
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showQuickCreate, setShowQuickCreate] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    // Live notification polling
    const [liveNotifications, setLiveNotifications] = useState<Notification[]>(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialNotifications.filter(n => !n.is_read).length);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        setLiveNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter(n => !n.is_read).length);
    }, [initialNotifications]);

    useEffect(() => {
        const poll = () => {
            fetch('/api/notifications/poll', { credentials: 'same-origin' })
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (!data) return;
                    const oldCount = unreadCount;
                    setLiveNotifications(data.notifications);
                    setUnreadCount(data.count);
                    // Pulse animation if new notifs arrived
                    if (data.count > oldCount) {
                        setPulse(true);
                        setTimeout(() => setPulse(false), 2000);
                    }
                })
                .catch(() => {});
        };

        const interval = setInterval(poll, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [unreadCount]);

    const markAsRead = (id: number) => {
        fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' } })
            .then(() => {
                setLiveNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            });
    };

    const markAllRead = () => {
        fetch('/api/notifications/read-all', { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' } })
            .then(() => {
                setLiveNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            });
    };

    const notifications = liveNotifications;
    const unread = notifications.filter(n => !n.is_read);
    const isAdmin = auth.user?.role === 'admin';
    const { theme, setTheme } = useTheme();

    // Close all dropdowns
    const closeAll = () => { setShowNotifs(false); setShowProfile(false); setShowSearch(false); setShowQuickCreate(false); };

    // Keyboard shortcut: Ctrl+K or Cmd+K to open search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
                setTimeout(() => searchRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') closeAll();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Search debounce
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) { setSearchResults([]); return; }
        setSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.results || []);
                }
            } catch { /* silently fail */ }
            setSearching(false);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const handleSearchSelect = (result: any) => {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        router.visit(result.url);
    };

    const typeIcons: Record<string, string> = {
        client: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
        project: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
        partner: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
        developer: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
        lead: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zm-13.5 0a2.625 2.625 0 11-4.5 0 2.625 2.625 0 014.5 0z',
    };

    const typeColors: Record<string, string> = {
        client: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        project: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
        partner: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
        developer: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        lead: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };

    const profileHref = auth.user?.role === 'admin' ? '/profile' :
        auth.user?.role === 'referral_partner' ? '/partner/profile' :
        auth.user?.role === 'client' ? '/client/profile' :
        '/profile';

    return (
        <div className="flex items-center space-x-2">
            {/* Team counts - admin only */}
            {isAdmin && teamCounts && (
                <div className="hidden sm:flex items-center space-x-1 mr-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold" title="Partners">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={typeIcons.partner} /></svg>
                        {teamCounts.partners}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold" title="Developers">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={typeIcons.developer} /></svg>
                        {teamCounts.developers}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold" title="Admins">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        {teamCounts.admins}
                    </span>
                </div>
            )}

            {/* Financial PIN Unlock */}
            <div data-tour="pin-unlock">
                <PinUnlockButton />
            </div>

            {/* Quick Create Button */}
            {isAdmin && (
                <div className="relative">
                    <button
                        onClick={() => { setShowQuickCreate(!showQuickCreate); setShowNotifs(false); setShowProfile(false); setShowSearch(false); }}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors"
                        title={t('Créer')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>

                    {showQuickCreate && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowQuickCreate(false)} />
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-scale-in overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-700">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Création rapide')}</p>
                                </div>
                                <div className="py-1">
                                    {[
                                        { label: t('Nouveau prospect'), href: '/admin/leads/create', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zm-13.5 0a2.625 2.625 0 11-4.5 0 2.625 2.625 0 014.5 0z', color: 'text-violet-500' },
                                        { label: t('Nouveau client'), href: '/admin/clients/create', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21', color: 'text-emerald-500' },
                                        { label: t('Nouveau devis'), href: '/admin/quotes/create', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: 'text-amber-500' },
                                        { label: t('Nouvelle facture'), href: '/admin/invoices/create', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', color: 'text-blue-500' },
                                        { label: t('Nouveau projet'), href: '/admin/projects/create', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0', color: 'text-indigo-500' },
                                    ].map(item => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setShowQuickCreate(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <svg className={`w-4 h-4 ${item.color} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Search Button */}
            {isAdmin && (
                <button
                    onClick={() => { closeAll(); setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 100); }}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={`${t('Rechercher')} (Ctrl+K)`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            )}

            {/* Support Tickets (admin only) */}
            {isAdmin && (
                <Link
                    href="/admin/support"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Support
                </Link>
            )}

            {/* Notifications Bell */}
            <div className="relative" data-tour="notifications-bell">
                <button
                    onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); setShowSearch(false); }}
                    className={`relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pulse ? 'animate-bounce' : ''}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${pulse ? 'ring-2 ring-rose-300 dark:ring-rose-700' : ''}`}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {showNotifs && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{t('Notifications')}</p>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[10px] font-medium text-teal-500 hover:text-teal-600 transition-colors">
                                        {t('Mark all read')}
                                    </button>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <svg className="w-8 h-8 text-gray-200 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('No notifications')}</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 10).map(n => (
                                        <a key={n.id} href={n.action_url || '#'} onClick={() => !n.is_read && markAsRead(n.id)}
                                            className={`block px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!n.is_read ? 'bg-teal-50/50 dark:bg-teal-500/5' : ''}`}>
                                            <div className="flex items-start gap-2.5">
                                                {/* Unread dot */}
                                                <div className="mt-1.5 flex-shrink-0">
                                                    {!n.is_read ? (
                                                        <span className="block w-2 h-2 rounded-full bg-teal-500" />
                                                    ) : (
                                                        <span className="block w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium line-clamp-1 ${!n.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{n.title}</p>
                                                    <p className={`text-xs mt-0.5 line-clamp-2 ${!n.is_read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>{n.message}</p>
                                                    <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Profile Avatar */}
            <div className="relative" data-tour="profile-menu">
                <button
                    onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); setShowSearch(false); }}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    {auth.user?.initial || 'U'}
                </button>

                {showProfile && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{auth.user?.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{auth.user?.email}</p>
                            </div>

                            {/* Theme switcher */}
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Theme')}</p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={(e) => setTheme('light', e.nativeEvent)}
                                            className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            title={t('Light')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                        </button>
                                        <button onClick={(e) => setTheme('dark', e.nativeEvent)}
                                            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            title={t('Dark')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                        </button>
                                        <button onClick={(e) => setTheme('system', e.nativeEvent)}
                                            className={`p-2 rounded-lg transition-all ${theme === 'system' ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-500 dark:text-teal-400' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            title={t('Auto')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Language')}</p>
                                    <div className="flex items-center gap-1">
                                        {['en', 'fr', 'nl'].map(code => (
                                            <a key={code} href={`/locale/${code}`}
                                                className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                                                    locale === code
                                                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                                        : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}>
                                                {code.toUpperCase()}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                <Link href={profileHref} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('Profile')}</Link>
                                <form method="POST" action="/logout">
                                    <input type="hidden" name="_token" value={document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''} />
                                    <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t('Sign Out')}</button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Search Modal (Ctrl+K) */}
            {showSearch && (
                <>
                    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
                    <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[10000] w-full max-w-lg animate-scale-in">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder={t('Rechercher un client, projet, partenaire...')}
                                    className="w-full px-3 py-4 bg-transparent border-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none"
                                    autoComplete="off"
                                />
                                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto">
                                {searching && (
                                    <div className="px-4 py-6 text-center">
                                        <svg className="animate-spin h-5 w-5 mx-auto text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    </div>
                                )}

                                {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucun résultat pour')} "{searchQuery}"</p>
                                    </div>
                                )}

                                {!searching && searchResults.length > 0 && (
                                    <div className="py-2">
                                        {searchResults.map((result: any, i: number) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => handleSearchSelect(result)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[result.type] || 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[result.type] || typeIcons.client} />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.name}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{result.subtitle}</p>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase text-gray-300 dark:text-gray-600 flex-shrink-0">{result.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!searching && searchQuery.length < 2 && (
                                    <div className="px-4 py-6 text-center">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Tapez au moins 2 caractères pour rechercher')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
