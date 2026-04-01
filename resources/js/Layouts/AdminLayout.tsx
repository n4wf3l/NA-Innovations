import { useState, useEffect, PropsWithChildren, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar, { NavItem } from '@/Components/layout/Sidebar';
import TopBar from '@/Components/layout/TopBar';
import TopBarActions from '@/Components/layout/TopBarActions';
import FlashMessages from '@/Components/layout/FlashMessages';
import LoginSplash from '@/Components/ui/LoginSplash';
import LogoutButton from '@/Components/layout/LogoutButton';
import MobileMenu from '@/Components/layout/MobileMenu';
import { setCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useSidebarConfig } from '@/hooks/useSidebarConfig';
import SidebarCustomizer from '@/Components/layout/SidebarCustomizer';

interface AdminLayoutProps {
    title?: string;
    header?: string;
}

// LEFT sidebar: Business + Finance + People + System
const leftNavItems: NavItem[] = [
    { type: 'section', label: 'Business' },
    { type: 'link', label: 'Dashboard', href: '/admin/dashboard', match: '/admin/dashboard', icon: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
    { type: 'link', label: 'Calendar', href: '/admin/calendar', match: '/admin/calendar', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
    { type: 'link', label: 'Leads', href: '/admin/leads', match: '/admin/leads', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'link', label: 'Clients', href: '/admin/clients', match: '/admin/clients', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
    { type: 'link', label: 'Projects', href: '/admin/projects', match: '/admin/projects', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' },
    { type: 'link', label: 'Timesheets', href: '/admin/timesheets', match: '/admin/timesheets', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'section', label: 'Finance' },
    { type: 'link', label: 'Quotes', href: '/admin/quotes', match: '/admin/quotes', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { type: 'link', label: 'Invoices', href: '/admin/invoices', match: '/admin/invoices', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
    { type: 'link', label: 'Revenue', href: '/admin/revenue', match: '/admin/revenue', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
    { type: 'link', label: 'Commissions', href: '/admin/commissions', match: '/admin/commissions', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { type: 'section', label: 'People' },
    { type: 'link', label: 'Partners', href: '/admin/partners', match: '/admin/partners', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { type: 'link', label: 'Team', href: '/admin/team', match: '/admin/team', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { type: 'section', label: 'Administration' },
    { type: 'link', label: 'Services', href: '/admin/services', match: '/admin/services', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
    { type: 'link', label: 'Taux de commission', href: '/admin/settings/commission-rates', match: '/admin/settings/commission-rates', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
    { type: 'link', label: 'Audit Log', href: '/admin/audit-log', match: '/admin/audit-log', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
    { type: 'link', label: 'Modèles documents', href: '/admin/settings/document-templates', match: '/admin/settings/document-templates', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { type: 'link', label: 'Emails', href: '/admin/settings/email-templates', match: '/admin/settings/email', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
];

// RIGHT sidebar: Landing Page & Content
const rightNavItems: NavItem[] = [
    // Content
    { type: 'section', label: 'Contenu' },
    { type: 'link', label: 'Sections', href: '/admin/settings/landing-sections', match: '/admin/settings/landing-sections', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { type: 'link', label: 'Portfolio', href: '/admin/portfolio', match: '/admin/portfolio', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25m0 0V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v9.75' },
    { type: 'link', label: 'Articles', href: '/admin/posts', match: '/admin/posts', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z' },
    { type: 'link', label: 'Pages', href: '/admin/pages', match: '/admin/pages', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },

    // Catalog
    { type: 'section', label: 'Catalogue' },
    { type: 'link', label: 'Services', href: '/admin/settings/public-services', match: '/admin/settings/public-services', icon: 'M11.42 15.17l-5.58 3.18c-.46.26-1.01-.15-.88-.66l1.06-6.17L.95 6.62c-.38-.37-.19-1.01.32-1.08l6.19-.9L10.23.37c.23-.47.95-.47 1.18 0l2.77 5.27 6.19.9c.51.07.7.71.32 1.08l-4.07 3.9 1.06 6.17c.13.51-.42.92-.88.66l-5.58-3.18z' },
    { type: 'link', label: 'Products', href: '/admin/products', match: '/admin/products', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
    { type: 'link', label: 'FAQ', href: '/admin/settings/faqs', match: '/admin/settings/faqs', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
    { type: 'link', label: 'Ticker', href: '/admin/messages', match: '/admin/messages', icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },

    // Appearance
    { type: 'section', label: 'Apparence' },
    { type: 'link', label: 'Branding', href: '/admin/settings/branding', match: '/admin/settings/branding', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { type: 'link', label: 'SEO', href: '/admin/settings/seo', match: '/admin/settings/seo', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
    { type: 'link', label: 'Chatbot IA', href: '/admin/settings/chatbot', match: '/admin/settings/chatbot', icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' },
    { type: 'link', label: 'NDA Partenaires', href: '/admin/settings/nda', match: '/admin/settings/nda', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
];

// Combine for mobile
const allNavItems: NavItem[] = [...leftNavItems, ...rightNavItems];

export default function AdminLayout({ children, title, header }: PropsWithChildren<AdminLayoutProps>) {
    const pageProps = usePage<PageProps>().props;
    const { auth, locale, notifications } = pageProps;
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [customizerOpen, setCustomizerOpen] = useState(false);
    const [customizerSide, setCustomizerSide] = useState<'left' | 'right'>('left');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const leftConfig = useSidebarConfig(leftNavItems);
    const rightConfig = useSidebarConfig(rightNavItems);

    // Lock body scroll for dashboard layout
    useEffect(() => {
        document.documentElement.classList.add('dashboard-layout');
        return () => { document.documentElement.classList.remove('dashboard-layout'); };
    }, []);

    // Sidebar modes: 'open' (always expanded), 'collapsed' (hover to expand), 'closed' (tooltips only)
    type SidebarMode = 'open' | 'collapsed' | 'closed';

    const [leftMode, setLeftMode] = useState<SidebarMode>(() => {
        if (typeof window === 'undefined') return 'open';
        return (localStorage.getItem('admin_left_mode') as SidebarMode) || 'open';
    });
    const [rightMode, setRightMode] = useState<SidebarMode>(() => {
        if (typeof window === 'undefined') return 'collapsed';
        return (localStorage.getItem('admin_right_mode') as SidebarMode) || 'collapsed';
    });

    const [leftHovered, setLeftHovered] = useState(false);
    const [rightHovered, setRightHovered] = useState(false);

    useEffect(() => {
        setCurrency(auth.user?.preferences?.currency || 'EUR');
    }, [auth.user?.preferences?.currency]);

    // Cycle: open → collapsed → closed → open
    const cycleLeftMode = () => {
        const next: SidebarMode = leftMode === 'open' ? 'collapsed' : leftMode === 'collapsed' ? 'closed' : 'open';
        setLeftMode(next);
        setLeftHovered(false);
        localStorage.setItem('admin_left_mode', next);
    };
    const cycleRightMode = () => {
        const next: SidebarMode = rightMode === 'open' ? 'collapsed' : rightMode === 'collapsed' ? 'closed' : 'open';
        setRightMode(next);
        setRightHovered(false);
        localStorage.setItem('admin_right_mode', next);
    };

    const leftCollapsed = leftMode !== 'open';
    const rightCollapsed = rightMode !== 'open';
    const leftExpanded = leftMode === 'open' || (leftMode === 'collapsed' && leftHovered);
    const rightExpanded = rightMode === 'open' || (rightMode === 'collapsed' && rightHovered);

    const leftW = leftExpanded ? 'w-72' : 'w-16';
    const rightW = rightExpanded ? 'w-72' : 'w-16';
    const mlClass = leftExpanded ? 'lg:ml-72' : 'lg:ml-16';
    const mrClass = rightExpanded ? 'lg:mr-72' : 'lg:mr-16';

    const modeTooltip = (mode: SidebarMode) =>
        mode === 'open' ? t('Réduire (hover pour ouvrir)') :
        mode === 'collapsed' ? t('Fermer (tooltips seulement)') :
        t('Ouvrir');

    const modeIcon = (mode: SidebarMode) =>
        mode === 'open' ? 'M15.75 19.5L8.25 12l7.5-7.5' :       // chevron → will collapse
        mode === 'collapsed' ? 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' : // bars → will close
        'M8.25 4.5l7.5 7.5-7.5 7.5';                              // chevron right → will open

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
            <LogoutButton />
        </div>
    );

    const rightSidebarFooter = (
        <div className="border-t border-white/5 px-3 py-3">
            <a href="/" target="_blank" className="flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-amber-300 hover:bg-white/5 transition-colors" title={t('Voir le site')}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                <span className="ml-2">{t('Voir le site')}</span>
            </a>
        </div>
    );

    const rightSidebarFooterCollapsed = (
        <div className="border-t border-white/5 px-2 py-3 flex justify-center">
            <a href="/" target="_blank" className="p-2 rounded-lg text-gray-500 hover:text-amber-300 hover:bg-white/5 transition-colors" title={t('Voir le site')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
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
                className={`hidden lg:block fixed inset-y-0 left-0 z-50 bg-[#0b0f19] transition-all duration-200 sidebar-animate ${leftW}`}
                onMouseEnter={() => leftMode === 'collapsed' && setLeftHovered(true)}
                onMouseLeave={() => setLeftHovered(false)}
            >
                <Sidebar
                    items={leftConfig.visibleItems}
                    logo={sidebarLogo}
                    collapsedLogo={collapsedLogo}
                    footer={sidebarFooter}
                    accentColor={leftConfig.accentColor || 'teal'}
                    currentPath={currentPath}
                    collapsed={leftCollapsed}
                    hovered={leftMode === 'collapsed' && leftHovered}
                    onOpenCustomizer={() => { setCustomizerSide('left'); setCustomizerOpen(true); }}
                    sidebarStyle={leftConfig.sidebarStyle}
                />
                <button
                    onClick={cycleLeftMode}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[#0b0f19] border-2 border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-teal-400 transition-all z-50 shadow-lg"
                    title={modeTooltip(leftMode)}
                >
                    <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={modeIcon(leftMode)} />
                    </svg>
                </button>
            </aside>

            {/* ── RIGHT SIDEBAR (Vitrine) ── */}
            <aside
                className={`hidden lg:block fixed inset-y-0 right-0 z-50 bg-[#0b0f19] transition-all duration-200 sidebar-animate-right ${rightW}`}
                onMouseEnter={() => rightMode === 'collapsed' && setRightHovered(true)}
                onMouseLeave={() => setRightHovered(false)}
            >
                <Sidebar
                    items={rightConfig.visibleItems}
                    logo={rightLogo}
                    collapsedLogo={collapsedRightLogo}
                    footer={rightSidebarFooter}
                    collapsedFooter={rightSidebarFooterCollapsed}
                    accentColor={rightConfig.accentColor || 'amber'}
                    currentPath={currentPath}
                    collapsed={rightCollapsed}
                    hovered={rightMode === 'collapsed' && rightHovered}
                    tooltipSide="left"
                    onOpenCustomizer={() => { setCustomizerSide('right'); setCustomizerOpen(true); }}
                    sidebarStyle={rightConfig.sidebarStyle}
                />
                <button
                    onClick={cycleRightMode}
                    className="absolute -left-3 top-20 w-6 h-6 bg-[#0b0f19] border-2 border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-amber-400 transition-all z-50 shadow-lg"
                    title={modeTooltip(rightMode)}
                >
                    <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={modeIcon(rightMode)} />
                    </svg>
                </button>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className={`${mlClass} ${mrClass} h-screen flex flex-col transition-all duration-200 overflow-hidden`}>
                <TopBar
                    title={header}
                    onMenuClick={() => setMobileOpen(true)}
                    right={<TopBarActions notifications={notifications} />}
                />

                <FlashMessages />
                <LoginSplash />

                <main className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6">
                    <div className="animate-page-in">
                        {children}
                    </div>
                </main>
            </div>

            {/* Sidebar Customizer Modal */}
            <SidebarCustomizer
                open={customizerOpen}
                onClose={() => setCustomizerOpen(false)}
                items={customizerSide === 'left' ? leftConfig.items : rightConfig.items}
                hiddenItems={customizerSide === 'left' ? leftConfig.hiddenItems : rightConfig.hiddenItems}
                accentColor={customizerSide === 'left' ? leftConfig.accentColor : rightConfig.accentColor}
                sidebarStyle={customizerSide === 'left' ? leftConfig.sidebarStyle : rightConfig.sidebarStyle}
                onReorder={customizerSide === 'left' ? leftConfig.reorderItems : rightConfig.reorderItems}
                onToggleHide={customizerSide === 'left' ? leftConfig.toggleHideItem : rightConfig.toggleHideItem}
                onAccentChange={customizerSide === 'left' ? leftConfig.updateAccentColor : rightConfig.updateAccentColor}
                onStyleChange={customizerSide === 'left' ? leftConfig.updateStyle : rightConfig.updateStyle}
                onReset={customizerSide === 'left' ? leftConfig.resetToDefault : rightConfig.resetToDefault}
                saving={customizerSide === 'left' ? leftConfig.saving : rightConfig.saving}
            />
        </div>
    );
}
