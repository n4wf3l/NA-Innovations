import { useState, useEffect, PropsWithChildren, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar, { NavItem } from '@/Components/layout/Sidebar';
import TopBar from '@/Components/layout/TopBar';
import TopBarActions from '@/Components/layout/TopBarActions';
import FlashMessages from '@/Components/layout/FlashMessages';
import MobileMenu from '@/Components/layout/MobileMenu';
import { setCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface AdminLayoutProps {
    title?: string;
    header?: string;
}

// LEFT sidebar: Business + Finance + People + System
const leftNavItems: NavItem[] = [
    { type: 'section', label: 'Business' },
    { type: 'link', label: 'Dashboard', href: '/admin/dashboard', match: '/admin/dashboard', icon: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
    { type: 'link', label: 'Leads', href: '/admin/leads', match: '/admin/leads', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'link', label: 'Clients', href: '/admin/clients', match: '/admin/clients', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
    { type: 'link', label: 'Projects', href: '/admin/projects', match: '/admin/projects', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' },
    { type: 'section', label: 'Finance' },
    { type: 'link', label: 'Quotes', href: '/admin/quotes', match: '/admin/quotes', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { type: 'link', label: 'Invoices', href: '/admin/invoices', match: '/admin/invoices', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
    { type: 'link', label: 'Commissions', href: '/admin/commissions', match: '/admin/commissions', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { type: 'section', label: 'People' },
    { type: 'link', label: 'Partners', href: '/admin/partners', match: '/admin/partners', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { type: 'link', label: 'Team', href: '/admin/team', match: '/admin/team', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'section', label: 'System' },
    { type: 'link', label: 'Services', href: '/admin/services', match: '/admin/services', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
    { type: 'link', label: 'Settings', href: '#', match: '/admin/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
];

// RIGHT sidebar: Content (Vitrine)
const rightNavItems: NavItem[] = [
    { type: 'section', label: 'Showcase' },
    { type: 'link', label: 'Portfolio', href: '#', match: '/admin/portfolio', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25m0 0V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v9.75' },
    { type: 'link', label: 'News / Blog', href: '/admin/posts', match: '/admin/posts', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z' },
    { type: 'link', label: 'Pages', href: '/admin/pages', match: '/admin/pages', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { type: 'link', label: 'Messages', href: '/admin/messages', match: '/admin/messages', icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },
];

// Combine for mobile
const allNavItems: NavItem[] = [...leftNavItems, ...rightNavItems];

type SidebarSide = 'left' | 'right' | null;

export default function AdminLayout({ children, title, header }: PropsWithChildren<AdminLayoutProps>) {
    const { auth, locale, notifications } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Which sidebar is open on desktop (null = both closed, 'left' or 'right')
    const [activeSide, setActiveSide] = useState<SidebarSide>(() => {
        if (typeof window === 'undefined') return 'left';
        return (localStorage.getItem('admin_active_sidebar') as SidebarSide) || 'left';
    });

    // Is the active sidebar pinned open?
    const [pinned, setPinned] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('admin_sidebar_pinned') !== 'false';
    });

    const [hoverSide, setHoverSide] = useState<SidebarSide>(null);

    useEffect(() => {
        setCurrency(auth.user?.preferences?.currency || 'EUR');
    }, [auth.user?.preferences?.currency]);

    // Persist
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('admin_active_sidebar', activeSide || '');
        localStorage.setItem('admin_sidebar_pinned', String(pinned));
    }, [activeSide, pinned]);

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const openSide = useCallback((side: SidebarSide) => {
        if (side === activeSide) return;
        if (pinned && activeSide) {
            setToast(`Unpin the ${activeSide} sidebar first (click the pin icon)`);
            return;
        }
        setActiveSide(side);
    }, [pinned, activeSide]);

    const togglePin = useCallback(() => {
        setPinned(p => !p);
    }, []);

    // Is left/right visible?
    const leftVisible = activeSide === 'left' || hoverSide === 'left';
    const rightVisible = activeSide === 'right' || hoverSide === 'right';
    const leftExpanded = leftVisible && (pinned || hoverSide === 'left');
    const rightExpanded = rightVisible && (pinned || hoverSide === 'right');

    // Widths
    const leftW = leftExpanded ? 'w-64' : 'w-14';
    const rightW = rightExpanded ? 'w-64' : 'w-14';

    // Main margins
    let mlClass = 'lg:ml-14';
    let mrClass = 'lg:mr-14';
    if (leftExpanded) mlClass = 'lg:ml-64';
    if (rightExpanded) mrClass = 'lg:mr-64';

    const sidebarLogo = (
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-900 text-lg font-bold leading-none" style={{ fontFamily: "'Bebas Neue', cursive" }}>NA</span>
            </div>
            <span className="text-white text-xl tracking-wide whitespace-nowrap" style={{ fontFamily: "'Bebas Neue', cursive" }}>{t('Admin')}</span>
        </Link>
    );

    const collapsedLogo = (
        <Link href="/admin/dashboard" className="flex items-center justify-center">
            <div className="w-8 h-8 bg-teal-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>NA</span>
            </div>
        </Link>
    );

    const rightLogo = (
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
            <span className="text-white text-xl tracking-wide whitespace-nowrap" style={{ fontFamily: "'Bebas Neue', cursive" }}>{t('Vitrine')}</span>
        </div>
    );

    const collapsedRightLogo = (
        <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
        </div>
    );

    const sidebarFooter = (
        <div className="border-t border-white/5 px-3 py-3">
            <a href="/" target="_blank" className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-teal-300 hover:bg-white/5 transition-colors">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                {t('View Site')}
            </a>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-500 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-scale-in flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    <span>{toast}</span>
                </div>
            )}

            {/* Mobile fullscreen menu (shows ALL items) */}
            <MobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                items={allNavItems}
                accentColor="teal"
                currentPath={currentPath}
                userName={auth.user?.name}
                userInitial={auth.user?.initial}
            />

            {/* ── LEFT SIDEBAR (Business) ── */}
            <aside
                className={`hidden lg:flex fixed inset-y-0 left-0 z-50 bg-[#0b0f19] flex-col transition-all duration-200 ${leftW}`}
                onMouseEnter={() => { if (activeSide !== 'left') setHoverSide('left'); }}
                onMouseLeave={() => setHoverSide(null)}
                onClick={() => openSide('left')}
            >
                <Sidebar
                    items={leftNavItems}
                    logo={sidebarLogo}
                    collapsedLogo={collapsedLogo}
                    footer={sidebarFooter}
                    accentColor="teal"
                    currentPath={currentPath}
                    collapsed={!leftExpanded}
                    hovered={false}
                />
                {/* Pin indicator */}
                {activeSide === 'left' && (
                    <button onClick={(e) => { e.stopPropagation(); togglePin(); }}
                        className={`absolute -right-3 top-16 w-6 h-6 bg-[#0b0f19] border-2 rounded-full flex items-center justify-center transition-all z-50 shadow-lg ${pinned ? 'border-teal-400 text-teal-400' : 'border-gray-600 text-gray-500 hover:border-teal-400 hover:text-teal-400'}`}
                        title={pinned ? t('Unpin (allow switching)') : t('Pin open')}>
                        <svg className={`w-3 h-3 ${pinned ? '' : 'rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            {pinned
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75" />
                            }
                        </svg>
                    </button>
                )}
            </aside>

            {/* ── RIGHT SIDEBAR (Vitrine) ── */}
            <aside
                className={`hidden lg:flex fixed inset-y-0 right-0 z-50 bg-[#0b0f19] flex-col transition-all duration-200 ${rightW}`}
                onMouseEnter={() => { if (activeSide !== 'right') setHoverSide('right'); }}
                onMouseLeave={() => setHoverSide(null)}
                onClick={() => openSide('right')}
            >
                <Sidebar
                    items={rightNavItems}
                    logo={rightLogo}
                    collapsedLogo={collapsedRightLogo}
                    footer={null}
                    accentColor="teal"
                    currentPath={currentPath}
                    collapsed={!rightExpanded}
                    hovered={false}
                />
                {activeSide === 'right' && (
                    <button onClick={(e) => { e.stopPropagation(); togglePin(); }}
                        className={`absolute -left-3 top-16 w-6 h-6 bg-[#0b0f19] border-2 rounded-full flex items-center justify-center transition-all z-50 shadow-lg ${pinned ? 'border-amber-400 text-amber-400' : 'border-gray-600 text-gray-500 hover:border-amber-400 hover:text-amber-400'}`}
                        title={pinned ? t('Unpin (allow switching)') : t('Pin open')}>
                        <svg className={`w-3 h-3 ${pinned ? '' : 'rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            {pinned
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75" />
                            }
                        </svg>
                    </button>
                )}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className={`${mlClass} ${mrClass} h-screen flex flex-col transition-all duration-200 overflow-hidden`}>
                <TopBar
                    title={header}
                    onMenuClick={() => setMobileOpen(true)}
                    right={<TopBarActions notifications={notifications} />}
                />

                <FlashMessages />

                <main className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6">
                    <div className="animate-page-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
