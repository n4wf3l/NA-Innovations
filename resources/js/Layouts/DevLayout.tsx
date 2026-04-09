import { useState, useEffect, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar, { NavItem } from '@/Components/layout/Sidebar';
import TopBar from '@/Components/layout/TopBar';
import TopBarActions from '@/Components/layout/TopBarActions';
import FlashMessages from '@/Components/layout/FlashMessages';
import LoginSplash from '@/Components/ui/LoginSplash';
import AppLogo from '@/Components/ui/AppLogo';
import LogoutButton from '@/Components/layout/LogoutButton';
import { setCurrency } from '@/lib/utils';
import MobileMenu from '@/Components/layout/MobileMenu';
import { useTranslation } from 'react-i18next';
import { useSidebarConfig } from '@/hooks/useSidebarConfig';
import SidebarCustomizer from '@/Components/layout/SidebarCustomizer';

interface DevLayoutProps {
    title?: string;
}

const devNavItems: NavItem[] = [
    { type: 'link', label: 'Dashboard', href: '/dev/dashboard', match: '/dev/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { type: 'link', label: 'Projects', href: '/dev/projects', match: '/dev/projects', tourId: 'nav-projects', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' },
    { type: 'link', label: 'Earnings', href: '/dev/earnings', match: '/dev/earnings', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { type: 'link', label: 'Team', href: '/dev/team', match: '/dev/team', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'link', label: 'Profile', href: '/dev/profile', match: '/dev/profile', tourId: 'nav-profile', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
];

export default function DevLayout({ children, title }: PropsWithChildren<DevLayoutProps>) {
    const { auth } = usePage<PageProps>().props;
    const devSettings = usePage<PageProps>().props.devSettings as any;
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [customizerOpen, setCustomizerOpen] = useState(false);
    const filteredDevNav = devNavItems.filter(item => {
        if (!devSettings) return true;
        if (item.label === 'Earnings' && devSettings.show_earnings === false) return false;
        if (item.label === 'Team' && devSettings.show_team_contacts === false) return false;
        return true;
    });
    const sidebarConfig = useSidebarConfig(filteredDevNav);
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
            <AppLogo variant="dark" size="md" className="flex-shrink-0" />
            <div>
                <p className="text-white text-sm font-bold tracking-wide">{t('Developer Portal')}</p>
                <p className="text-gray-500 text-xs">{auth.user?.name}</p>
            </div>
        </div>
    );

    const collapsedLogo = (
        <div className="flex items-center justify-center mb-1">
            <img src="/white-logo-small.png" alt="NA" className="h-7 w-auto object-contain" />
        </div>
    );

    const sidebarFooter = (
        <div className="p-4 space-y-1 border-t border-white/5">
            <a href="/" target="_blank" className="flex items-center px-4 py-2 text-xs text-gray-600 hover:text-gray-300 rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                {t('View Website')}
            </a>
            <LogoutButton />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            {/* Mobile fullscreen menu */}
            <MobileMenu
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                items={filteredDevNav}
                accentColor="indigo"
                currentPath={currentPath}
                userName={auth.user?.name}
                userInitial={auth.user?.initial}
            />

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-50 bg-[#0b0f19] transition-all duration-200 sidebar-animate ${sw}`}
                onMouseEnter={() => collapsed && setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Sidebar
                    items={sidebarConfig.visibleItems}
                    logo={sidebarLogo}
                    collapsedLogo={collapsedLogo}
                    footer={sidebarFooter}
                    accentColor={sidebarConfig.accentColor || 'indigo'}
                    currentPath={currentPath}
                    collapsed={collapsed}
                    hovered={hovered}
                    onOpenCustomizer={() => setCustomizerOpen(true)}
                    sidebarStyle={sidebarConfig.sidebarStyle}
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
                <LoginSplash />

                <main className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6">
                    <div className="animate-page-in">
                        {children}
                    </div>
                </main>
            </div>

            <SidebarCustomizer
                open={customizerOpen}
                onClose={() => setCustomizerOpen(false)}
                items={sidebarConfig.items}
                hiddenItems={sidebarConfig.hiddenItems}
                accentColor={sidebarConfig.accentColor}
                sidebarStyle={sidebarConfig.sidebarStyle}
                onReorder={sidebarConfig.reorderItems}
                onToggleHide={sidebarConfig.toggleHideItem}
                onAccentChange={sidebarConfig.updateAccentColor}
                onStyleChange={sidebarConfig.updateStyle}
                onReset={sidebarConfig.resetToDefault}
                saving={sidebarConfig.saving}
            />
        </div>
    );
}
