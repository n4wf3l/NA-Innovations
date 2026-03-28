import { useState, useEffect, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar, { NavItem } from '@/Components/layout/Sidebar';
import TopBar from '@/Components/layout/TopBar';
import TopBarActions from '@/Components/layout/TopBarActions';
import FlashMessages from '@/Components/layout/FlashMessages';
import { setCurrency } from '@/lib/utils';
import MobileMenu from '@/Components/layout/MobileMenu';
import { useTranslation } from 'react-i18next';

interface DevLayoutProps {
    title?: string;
}

const devNavItems: NavItem[] = [
    { type: 'link', label: 'Dashboard', href: '/dev/dashboard', match: '/dev/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { type: 'link', label: 'Projects', href: '/dev/projects', match: '/dev/projects', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' },
];

export default function DevLayout({ children, title }: PropsWithChildren<DevLayoutProps>) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && localStorage.getItem('dev_sidebar_collapsed') === 'true');
    const [hovered, setHovered] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useEffect(() => {
        document.documentElement.classList.add('dashboard-layout');
        return () => { document.documentElement.classList.remove('dashboard-layout'); };
    }, []);

    const toggleCollapse = () => { const n = !collapsed; setCollapsed(n); localStorage.setItem('dev_sidebar_collapsed', String(n)); };
    const isExpanded = !collapsed || hovered;
    const sw = isExpanded ? 'w-72' : 'w-16';
    const mm = isExpanded ? 'lg:ml-72' : 'lg:ml-16';

    useEffect(() => {
        setCurrency(auth.user?.preferences?.currency || 'EUR');
    }, [auth.user?.preferences?.currency]);

    const sidebarLogo = (
        <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white text-lg font-black">NA</span>
            </div>
            <div>
                <p className="text-white text-sm font-bold tracking-wide">{t('Developer Portal')}</p>
                <p className="text-gray-500 text-xs">{auth.user?.name}</p>
            </div>
        </div>
    );

    const sidebarFooter = (
        <div className="p-4 space-y-1 border-t border-white/5">
            <a href="/" target="_blank" className="flex items-center px-4 py-2 text-xs text-gray-600 hover:text-gray-300 rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                {t('View Website')}
            </a>
            <Link href="/logout" method="post" as="button" className="flex items-center w-full px-4 py-2 text-xs text-gray-600 hover:text-red-400 rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                {t('Sign Out')}
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            {/* Mobile fullscreen menu */}
            <MobileMenu
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                items={devNavItems}
                accentColor="indigo"
                currentPath={currentPath}
                userName={auth.user?.name}
                userInitial={auth.user?.initial}
            />

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-50 bg-[#0b0f19] transition-all duration-200 ${sw}`}
                onMouseEnter={() => collapsed && setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Sidebar
                    items={devNavItems}
                    logo={sidebarLogo}
                    footer={sidebarFooter}
                    accentColor="indigo"
                    currentPath={currentPath}
                    collapsed={collapsed}
                    hovered={hovered}
                />
                <button onClick={toggleCollapse} className="absolute -right-3 top-20 w-6 h-6 bg-[#0b0f19] border-2 border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-indigo-400 transition-all z-50 shadow-lg" title={collapsed ? 'Pin open' : 'Collapse'}>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
            </aside>

            {/* Main */}
            <div className={`${mm} h-screen flex flex-col transition-all duration-200 overflow-hidden`}>
                <TopBar
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                    right={<TopBarActions notifications={usePage<PageProps>().props.notifications} />}
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
