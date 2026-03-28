// ─── Types ───────────────────────────────────────────────────────

export interface ProjectTypeOption {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    icon: JSX.Element;
}

export interface FeatureOption {
    id: string;
    name: string;
    price: number;
    suffix?: string;
    included?: boolean;
}

export interface DesignOption {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface MaintenanceOption {
    id: string;
    name: string;
    price: number;
    suffix?: string;
}

export interface TimelineOption {
    id: string;
    name: string;
    multiplier: number;
    description: string;
}

// ─── Data ────────────────────────────────────────────────────────

export const projectTypeOptions: ProjectTypeOption[] = [
    {
        id: 'static_site',
        name: 'Static Site / Landing Page',
        basePrice: 500,
        description: 'Single-page site or simple landing page to present your offer.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    },
    {
        id: 'showcase_site',
        name: 'Showcase Website',
        basePrice: 1200,
        description: 'Multi-page professional site to present your business and services.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    },
    {
        id: 'blog_portfolio',
        name: 'Blog / Portfolio',
        basePrice: 800,
        description: 'Content-driven site for articles, case studies, or creative work.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>,
    },
    {
        id: 'ecommerce',
        name: 'E-commerce',
        basePrice: 3500,
        description: 'Full online store with product management, cart, and checkout.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>,
    },
    {
        id: 'custom_cms',
        name: 'Custom CMS Website',
        basePrice: 4000,
        description: 'Tailor-made content management system built for your specific needs.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
        id: 'platform_saas',
        name: 'Web Platform / SaaS',
        basePrice: 8000,
        description: 'Complex web application with user accounts, dashboards, and business logic.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>,
    },
    {
        id: 'mobile_app',
        name: 'Mobile Application',
        basePrice: 6000,
        description: 'Native or cross-platform mobile app for iOS and/or Android.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>,
    },
    {
        id: 'desktop_app',
        name: 'Desktop Application',
        basePrice: 7000,
        description: 'Windows, macOS, or cross-platform desktop software.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
    },
    {
        id: 'api_backend',
        name: 'API / Backend',
        basePrice: 3000,
        description: 'RESTful API, backend infrastructure, or microservices architecture.',
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
    },
    {
        id: 'no_idea',
        name: "I don't know yet",
        basePrice: 0,
        description: "No worries! Describe your idea and we'll guide you to the best solution.",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>,
    },
];

export const commonFeatures: FeatureOption[] = [
    { id: 'responsive', name: 'Responsive design (mobile/tablet/desktop)', price: 0, included: true },
    { id: 'seo', name: 'SEO optimization', price: 300 },
    { id: 'contact_form', name: 'Contact form', price: 0, included: true },
    { id: 'analytics', name: 'Analytics integration (Google Analytics, etc.)', price: 150 },
    { id: 'gdpr', name: 'Cookie consent / GDPR compliance', price: 200 },
    { id: 'multilingual', name: 'Multilingual support', price: 500, suffix: 'per additional language' },
    { id: 'domain_ssl', name: 'Custom domain & SSL', price: 100, suffix: '/year' },
    { id: 'hosting', name: 'Hosting setup', price: 200 },
    { id: 'migration', name: 'Content migration from existing site', price: 400 },
];

export const ecommerceFeatures: FeatureOption[] = [
    { id: 'payment', name: 'Payment integration (Stripe/Mollie)', price: 500 },
    { id: 'catalog_50', name: 'Product catalog (up to 50 products)', price: 0, included: true },
    { id: 'catalog_500', name: 'Product catalog (50-500 products)', price: 400 },
    { id: 'catalog_plus', name: 'Product catalog (500+ products)', price: 800 },
    { id: 'inventory', name: 'Inventory management', price: 600 },
    { id: 'discounts', name: 'Discount codes / promotions', price: 300 },
    { id: 'shipping', name: 'Shipping calculator', price: 400 },
    { id: 'multi_currency', name: 'Multi-currency support', price: 300 },
    { id: 'customer_accounts', name: 'Customer accounts / order tracking', price: 500 },
];

export const mobileFeatures: FeatureOption[] = [
    { id: 'ios_only', name: 'iOS only', price: 0 },
    { id: 'android_only', name: 'Android only', price: 0 },
    { id: 'cross_platform', name: 'iOS + Android (cross-platform)', price: 2000 },
    { id: 'push_notif', name: 'Push notifications', price: 500 },
    { id: 'in_app_pay', name: 'In-app payments', price: 800 },
    { id: 'offline', name: 'Offline mode', price: 600 },
    { id: 'camera_gps', name: 'Camera / GPS integration', price: 400 },
    { id: 'social_login', name: 'Social login (Google, Apple, Facebook)', price: 300 },
    { id: 'store_submit', name: 'App Store submission', price: 200 },
];

export const saasFeatures: FeatureOption[] = [
    { id: 'auth_roles', name: 'User authentication & roles', price: 0, included: true },
    { id: 'admin_panel', name: 'Dashboard / admin panel', price: 0, included: true },
    { id: 'api_integration', name: 'API integration', price: 800 },
    { id: 'realtime_notif', name: 'Real-time notifications', price: 500 },
    { id: 'file_upload', name: 'File upload / storage', price: 400 },
    { id: 'subscription_billing', name: 'Payment / subscription billing', price: 1200 },
    { id: 'multi_tenancy', name: 'Multi-tenancy', price: 2000 },
    { id: 'automated_emails', name: 'Automated emails', price: 400 },
    { id: 'data_export', name: 'Data export (CSV/PDF)', price: 300 },
];

export const webFeatures: FeatureOption[] = [
    { id: 'blog_section', name: 'Blog / news section', price: 400 },
    { id: 'gallery', name: 'Image gallery / portfolio', price: 300 },
    { id: 'booking', name: 'Booking / appointment system', price: 800 },
    { id: 'live_chat', name: 'Live chat integration', price: 200 },
    { id: 'newsletter', name: 'Newsletter integration', price: 200 },
    { id: 'social_media', name: 'Social media integration', price: 150 },
    { id: 'video_bg', name: 'Video backgrounds / media', price: 200 },
    { id: 'animations', name: 'Custom animations', price: 500 },
];

export const designOptions: DesignOption[] = [
    { id: 'standard', name: 'Use our design (standard)', price: 0, description: 'Clean, professional layout designed by our team.' },
    { id: 'from_mockups', name: 'Custom design from your mockups', price: 500, description: 'We implement your existing design files.' },
    { id: 'branding', name: 'Full branding package (logo + colors + typography)', price: 1500, description: 'Complete visual identity from scratch.' },
    { id: 'premium_ux', name: 'Premium UX/UI design', price: 2000, description: 'Top-tier user experience with research and testing.' },
];

export const maintenanceOptions: MaintenanceOption[] = [
    { id: 'none', name: 'No maintenance', price: 0 },
    { id: 'basic_3m', name: 'Basic maintenance (3 months)', price: 300 },
    { id: 'standard_6m', name: 'Standard maintenance (6 months)', price: 500 },
    { id: 'premium_12m', name: 'Premium maintenance (12 months)', price: 900 },
    { id: 'priority_support', name: 'Priority support (24h response)', price: 200, suffix: '/month' },
];

export const timelineOptions: TimelineOption[] = [
    { id: 'standard', name: 'Standard (flexible timeline)', multiplier: 0, description: 'We work on a comfortable schedule.' },
    { id: 'priority', name: 'Priority (2x faster)', multiplier: 0.3, description: '+30% of total price.' },
    { id: 'urgent', name: 'Urgent (ASAP, within 2 weeks)', multiplier: 0.5, description: '+50% of total price.' },
];

// ─── Helpers ─────────────────────────────────────────────────────

export function formatEUR(amount: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function getFeaturesForType(typeId: string): { common: FeatureOption[]; specific: FeatureOption[]; specificLabel: string } {
    let specific: FeatureOption[] = [];
    let specificLabel = '';

    if (typeId === 'ecommerce') {
        specific = ecommerceFeatures;
        specificLabel = 'E-commerce Features';
    } else if (typeId === 'mobile_app') {
        specific = mobileFeatures;
        specificLabel = 'Mobile App Features';
    } else if (typeId === 'platform_saas') {
        specific = saasFeatures;
        specificLabel = 'SaaS / Platform Features';
    } else if (['showcase_site', 'blog_portfolio', 'custom_cms'].includes(typeId)) {
        specific = webFeatures;
        specificLabel = 'Web Features';
    }

    return { common: commonFeatures, specific, specificLabel };
}
