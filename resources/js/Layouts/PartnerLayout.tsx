import { useState, PropsWithChildren, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar, { NavItem } from '@/Components/layout/Sidebar';
import TopBar from '@/Components/layout/TopBar';
import TopBarActions from '@/Components/layout/TopBarActions';
import FlashMessages from '@/Components/layout/FlashMessages';
import { setCurrency } from '@/lib/utils';
import MobileMenu from '@/Components/layout/MobileMenu';

interface PartnerLayoutProps {
    title?: string;
}

const partnerNavItems: NavItem[] = [
    { type: 'link', label: 'Dashboard', href: '/partner/dashboard', match: '/partner/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { type: 'link', label: 'My Leads', href: '/partner/leads', match: '/partner/leads', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'link', label: 'Commissions', href: '/partner/commissions', match: '/partner/commissions', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'link', label: 'Resources', href: '/partner/resources', match: '/partner/resources', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
    { type: 'link', label: 'Profile', href: '/partner/profile', match: '/partner/profile', icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function PartnerLayout({ children, title }: PropsWithChildren<PartnerLayoutProps>) {
    const { auth } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Set currency from user preferences
    useEffect(() => {
        const currency = auth.user?.preferences?.currency || 'EUR';
        setCurrency(currency);
    }, [auth.user?.preferences?.currency]);

    const sidebarLogo = (
        <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <span className="text-white text-lg font-black">NA</span>
            </div>
            <div>
                <p className="text-white text-sm font-bold tracking-wide">Partner Portal</p>
                <p className="text-gray-500 text-xs">{auth.user?.name}</p>
            </div>
        </div>
    );

    const sidebarFooter = (
        <div className="p-4 space-y-1 border-t border-white/5">
            <a href="/" target="_blank" className="flex items-center px-4 py-2 text-xs text-gray-600 hover:text-gray-300 rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                View Website
            </a>
            <Link href="/logout" method="post" as="button" className="flex items-center w-full px-4 py-2 text-xs text-gray-600 hover:text-red-400 rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                Sign Out
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile fullscreen menu */}
            <MobileMenu
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                items={partnerNavItems}
                cta={{ label: 'Submit a Client', href: '/partner/leads/submit' }}
                accentColor="rose"
                currentPath={currentPath}
                userName={auth.user?.name}
                userInitial={auth.user?.initial}
            />

            {/* Desktop sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 z-50 w-72 bg-[#0b0f19]">
                <Sidebar
                    items={partnerNavItems}
                    logo={sidebarLogo}
                    footer={sidebarFooter}
                    cta={{ label: 'Submit a Client', href: '/partner/leads/submit' }}
                    accentColor="rose"
                    currentPath={currentPath}
                />
            </aside>

            {/* Main */}
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <TopBar
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                    right={<TopBarActions notifications={usePage<PageProps>().props.notifications} />}
                />

                <FlashMessages />

                <main className="flex-1 p-4 sm:p-6">
                    <div className="animate-page-in">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
}
