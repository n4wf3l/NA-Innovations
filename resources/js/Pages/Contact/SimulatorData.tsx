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
    description?: string;
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
    { id: 'responsive', name: 'Responsive design (mobile/tablet/desktop)', price: 0, included: true, description: 'Your site will look perfect on phones, tablets, and computers.' },
    { id: 'seo', name: 'SEO optimization', price: 300, description: 'Helps your site appear higher on Google when people search for your services.' },
    { id: 'contact_form', name: 'Contact form', price: 0, included: true, description: 'A form where visitors can send you a message directly from your website.' },
    { id: 'analytics', name: 'Analytics integration (Google Analytics, etc.)', price: 150, description: 'See how many people visit your site, where they come from, and what they click.' },
    { id: 'gdpr', name: 'Cookie consent / GDPR compliance', price: 200, description: 'The cookie banner required by European law to protect visitor privacy.' },
    { id: 'multilingual', name: 'Multilingual support', price: 150, suffix: 'per additional language', description: 'Your site available in multiple languages (e.g. French, Dutch, English).' },
    { id: 'domain_ssl', name: 'Custom domain & SSL', price: 100, suffix: '/year', description: 'Your own web address (e.g. yourcompany.be) with a secure padlock icon.' },
    { id: 'hosting', name: 'Hosting setup', price: 200, description: 'We set up and configure the server where your website lives on the internet.' },
    { id: 'migration', name: 'Content migration from existing site', price: 400, description: 'We transfer your text, images, and data from your old website to the new one.' },
    { id: 'pixel_tracking', name: 'Marketing pixels (Facebook Ads, Google Ads)', price: 200, description: 'Track conversions and retarget visitors on Facebook, Instagram or Google Ads.' },
];

export const ecommerceFeatures: FeatureOption[] = [
    { id: 'payment', name: 'Payment integration (Stripe/Mollie)', price: 500, description: 'Accept credit cards and online payments securely on your store.' },
    { id: 'local_payment', name: 'Local payment methods (Bancontact, iDeal)', price: 200, description: 'Accept Belgian, Dutch and other local payment methods popular in the Benelux.' },
    { id: 'catalog_50', name: 'Product catalog (up to 50 products)', price: 0, included: true, description: 'Display and manage up to 50 products with photos and descriptions.' },
    { id: 'catalog_500', name: 'Product catalog (50-500 products)', price: 400, description: 'Extended catalog for larger inventories with search and filters.' },
    { id: 'catalog_plus', name: 'Product catalog (500+ products)', price: 800, description: 'Bulk import, advanced search, and performance optimization for large stores.' },
    { id: 'product_variants', name: 'Product variants (sizes, colors, models)', price: 400, description: 'Offer multiple variants per product - e.g. T-shirt sizes S/M/L with different colors.' },
    { id: 'inventory', name: 'Inventory management', price: 600, description: 'Track stock levels in real-time and get alerts when products run low.' },
    { id: 'discounts', name: 'Discount codes / promotions', price: 300, description: 'Create promo codes, flash sales, and automatic discounts for your customers.' },
    { id: 'gift_cards', name: 'Gift cards', price: 400, description: 'Sell and redeem digital gift cards with custom amounts.' },
    { id: 'shipping', name: 'Shipping calculator', price: 400, description: 'Automatically calculate shipping costs based on weight, size, or destination.' },
    { id: 'multi_currency', name: 'Multi-currency support', price: 300, description: 'Let customers pay in their own currency (EUR, USD, GBP, etc.).' },
    { id: 'vat_mgmt', name: 'Multi-country VAT management', price: 400, description: 'Automatic VAT calculation per country and customer type (B2B/B2C, EU/non-EU).' },
    { id: 'customer_accounts', name: 'Customer accounts / order tracking', price: 500, description: 'Customers can create an account, view past orders, and track deliveries.' },
    { id: 'product_reviews', name: 'Product reviews and ratings', price: 400, description: 'Let customers leave reviews and ratings on your products to build trust.' },
    { id: 'wishlist', name: 'Wishlist / save for later', price: 300, description: 'Customers can save favorite products to come back to later.' },
    { id: 'abandoned_cart', name: 'Abandoned cart recovery', price: 500, description: 'Automatic email reminders sent to customers who left items in their cart.' },
    { id: 'automated_emails_shop', name: 'Automated order emails', price: 300, description: 'Confirmation, shipping notification, and delivery follow-up emails sent automatically.' },
];

export const mobileFeatures: FeatureOption[] = [
    { id: 'ios_only', name: 'iOS only', price: 0, description: 'Your app available on iPhone and iPad only.' },
    { id: 'android_only', name: 'Android only', price: 0, description: 'Your app available on Android phones and tablets only.' },
    { id: 'cross_platform', name: 'iOS + Android (cross-platform)', price: 2000, description: 'One app that works on both iPhone and Android - reach all your users.' },
    { id: 'push_notif', name: 'Push notifications', price: 500, description: 'Send alerts and messages directly to your users\' phones.' },
    { id: 'in_app_pay', name: 'In-app payments', price: 800, description: 'Let users pay for products or subscriptions directly inside the app.' },
    { id: 'offline', name: 'Offline mode', price: 600, description: 'The app works even without internet - data syncs when connection returns.' },
    { id: 'camera_gps', name: 'Camera / GPS integration', price: 400, description: 'Use the phone\'s camera for photos/scanning or GPS for location features.' },
    { id: 'biometric', name: 'Biometric login (Face ID / fingerprint)', price: 400, description: 'Secure login using face recognition or fingerprint.' },
    { id: 'social_login', name: 'Social login (Google, Apple, Facebook)', price: 300, description: 'Users can sign in with their existing Google, Apple, or Facebook account.' },
    { id: 'qr_scanner', name: 'QR code / barcode scanner', price: 250, description: 'Built-in scanner for QR codes, barcodes, tickets, coupons.' },
    { id: 'deep_linking', name: 'Deep linking', price: 300, description: 'Links in emails or SMS that open the app directly on the right page.' },
    { id: 'in_app_chat', name: 'In-app chat / messaging', price: 700, description: 'Real-time chat between users inside the app.' },
    { id: 'crash_reporting', name: 'Crash reporting & monitoring', price: 250, description: 'Automatic tracking of crashes so we can fix bugs before users complain.' },
    { id: 'store_submit', name: 'App Store submission', price: 200, description: 'We handle publishing your app on the App Store and/or Google Play.' },
];

export const saasFeatures: FeatureOption[] = [
    { id: 'auth_roles', name: 'User authentication & roles', price: 0, included: true, description: 'Login system with different access levels (admin, user, etc.).' },
    { id: 'admin_panel', name: 'Dashboard / admin panel', price: 0, included: true, description: 'A control panel to manage your data, users, and settings.' },
    { id: 'permissions_matrix', name: 'Advanced permissions matrix', price: 800, description: 'Fine-grained permissions - who can see/do what, per role, per module.' },
    { id: 'onboarding', name: 'Step-by-step user onboarding', price: 500, description: 'Guided tour for new users to learn the platform quickly.' },
    { id: 'team_mgmt', name: 'Team / organization management', price: 700, description: 'Users can invite teammates, assign roles, manage their organization.' },
    { id: 'api_integration', name: 'Third-party integrations', price: 800, description: 'Connect your platform with external services (payment, maps, email, etc.).' },
    { id: 'realtime_notif', name: 'Real-time notifications', price: 500, description: 'Instant alerts when something happens - no need to refresh the page.' },
    { id: 'file_upload', name: 'File upload / storage', price: 400, description: 'Let users upload documents, images, or files to the platform.' },
    { id: 'subscription_billing', name: 'Payment / subscription billing', price: 1200, description: 'Monthly or yearly billing with automatic payments and invoices.' },
    { id: 'multi_tenancy', name: 'Multi-tenancy', price: 2000, description: 'Each customer gets their own isolated space on the same platform.' },
    { id: 'white_label', name: 'White-label / branded per client', price: 2000, description: 'Each client sees their own logo and colors on their space.' },
    { id: 'automated_emails', name: 'Automated emails', price: 400, description: 'The system sends emails automatically (welcome, reminders, alerts, etc.).' },
    { id: 'webhooks', name: 'Outgoing webhooks (Zapier, Make)', price: 500, description: 'Notify external services in real-time when something happens on your platform.' },
    { id: 'public_api', name: 'Public API for clients', price: 800, description: 'Expose a secure API so your clients can integrate with their own tools.' },
    { id: 'custom_reports', name: 'Custom reports & dashboards', price: 900, description: 'Build visual reports with charts, KPIs, filters - exportable and shareable.' },
    { id: 'audit_logs', name: 'Audit logs (who did what)', price: 500, description: 'Complete traceability of all actions for compliance and security.' },
    { id: '2fa', name: 'Two-factor authentication', price: 300, description: 'Extra login security via authenticator app or SMS code.' },
    { id: 'social_login_saas', name: 'Social login (Google, Microsoft, Apple)', price: 300, description: 'Users sign in with their existing Google, Microsoft or Apple account.' },
    { id: 'data_import', name: 'Data import from existing tools', price: 400, description: 'Import customers, products or other data from Excel, CSV, or other platforms.' },
    { id: 'data_export', name: 'Data export (CSV/PDF/Excel)', price: 300, description: 'Users can export their data anytime in multiple formats.' },
];

export const webFeatures: FeatureOption[] = [
    { id: 'blog_section', name: 'Blog / news section', price: 400, description: 'A section to publish articles, news or case studies.' },
    { id: 'gallery', name: 'Image gallery / portfolio', price: 300, description: 'Showcase images with categories and lightbox preview.' },
    { id: 'booking', name: 'Booking / appointment system', price: 800, description: 'Online calendar with availability, booking and automatic confirmation.' },
    { id: 'live_chat', name: 'Live chat integration', price: 200, description: 'Chat directly with visitors from your site (Crisp, Tawk.to or similar).' },
    { id: 'newsletter', name: 'Newsletter integration', price: 200, description: 'Email capture form connected to Mailchimp, Brevo or similar.' },
    { id: 'social_media', name: 'Social media integration', price: 150, description: 'Social icons, share buttons, Instagram feed or Facebook plugin.' },
    { id: 'video_bg', name: 'Video backgrounds / media', price: 200, description: 'Video hero, background videos or embedded YouTube/Vimeo players.' },
    { id: 'animations', name: 'Custom animations', price: 500, description: 'Scroll animations, page transitions, micro-interactions.' },
    { id: 'team_page', name: 'Team page (members with photos & bios)', price: 300, description: 'Dedicated page presenting your team with photos and biographies.' },
    { id: 'services_page', name: 'Services page (detailed offerings)', price: 200, description: 'A page detailing each of your services with icons and descriptions.' },
    { id: 'pricing_page', name: 'Pricing page / rate table', price: 200, description: 'Public pricing page with comparison tables or packages.' },
    { id: 'testimonials_block', name: 'Customer testimonials (carousel)', price: 200, description: 'Social proof with client quotes, photos and ratings.' },
    { id: 'partners_logos', name: 'Partners / clients logos grid', price: 150, description: 'Showcase logos of partners or prestigious clients.' },
    { id: 'google_maps', name: 'Google Maps with your location', price: 150, description: 'Interactive map showing your business location.' },
    { id: 'opening_hours', name: 'Opening hours / schedule display', price: 100, description: 'Display your business hours, automatically highlighting open/closed status.' },
    { id: 'certifications', name: 'Certifications & credentials', price: 150, description: 'Display your diplomas, accreditations and professional certifications.' },
    { id: 'countdown_timer', name: 'Countdown timer (promo, launch)', price: 200, description: 'Urgency timer counting down to an event, launch or end of promo.' },
    { id: 'video_hero', name: 'Video hero (autoplay background)', price: 400, description: 'Full-width video background at the top of your home page.' },
    { id: 'faq_section', name: 'FAQ section (expandable questions)', price: 200, description: 'Expandable Q&A to answer your most common customer questions.' },
    { id: 'whatsapp_cta', name: 'WhatsApp / click-to-call button', price: 80, description: 'One-tap button to start a WhatsApp chat or call you directly from mobile.' },
    { id: 'comments', name: 'Comments system on articles', price: 400, description: 'Let readers comment on blog articles with moderation.' },
    { id: 'search', name: 'Site-wide search engine', price: 300, description: 'Search bar to quickly find articles, products or pages.' },
    { id: 'author_profiles', name: 'Author profile pages', price: 250, description: 'Dedicated page per author with bio and list of their articles.' },
    { id: 'related_posts', name: 'Related articles suggestions', price: 200, description: 'Show similar articles at the end of each post to keep readers engaged.' },
    { id: 'rss_feed', name: 'RSS feed', price: 100, description: 'RSS feed so readers can follow your blog from their favorite reader.' },
    { id: 'reading_time', name: 'Reading time estimate', price: 50, description: 'Shows how long each article takes to read (e.g. "5 min read").' },
    { id: 'tags_categories', name: 'Tags and categories', price: 150, description: 'Organize your articles by theme, categories and tags.' },
    { id: 'scheduled_pub', name: 'Scheduled publishing', price: 250, description: 'Write articles in advance and let them publish automatically at a chosen date.' },
];

export const cmsFeatures: FeatureOption[] = [
    { id: 'content_types', name: 'Multiple content types', price: 500, description: 'Articles, events, products, projects - each with custom fields and templates.' },
    { id: 'media_library', name: 'Centralized media library', price: 400, description: 'Organize all images, videos and documents in one searchable library.' },
    { id: 'scheduled_pub_cms', name: 'Scheduled content publishing', price: 300, description: 'Write ahead and publish automatically at a chosen date and time.' },
    { id: 'versioning', name: 'Version history / rollback', price: 500, description: 'Keep a complete history of changes and roll back to previous versions.' },
    { id: 'workflow', name: 'Editorial workflow (draft → approval → publish)', price: 700, description: 'Editors draft, reviewers approve, admins publish - full editorial workflow.' },
    { id: 'custom_fields', name: 'Custom fields per content type', price: 400, description: 'Add custom fields specific to your business (price, date, location, etc.).' },
    { id: 'preview_mode', name: 'Preview before publishing', price: 200, description: 'Preview exactly how your content will look before publishing it live.' },
    { id: 'bulk_editing', name: 'Bulk editing & actions', price: 300, description: 'Edit, move or delete multiple items at once.' },
];

export const desktopFeatures: FeatureOption[] = [
    { id: 'windows_only', name: 'Windows only', price: 0, description: 'App available for Windows only.' },
    { id: 'mac_only', name: 'macOS only', price: 0, description: 'App available for macOS only.' },
    { id: 'desktop_cross', name: 'Windows + macOS (cross-platform)', price: 1500, description: 'One codebase, two platforms - Windows and macOS.' },
    { id: 'local_db', name: 'Local database (offline-first)', price: 500, description: 'All data stored locally, works without internet - syncs when online.' },
    { id: 'auto_update', name: 'Automatic updates', price: 400, description: 'App updates itself silently in the background.' },
    { id: 'system_tray', name: 'System tray icon', price: 200, description: 'Stays in the system tray / menu bar even when window is closed.' },
    { id: 'offline_desktop', name: 'Full offline mode', price: 400, description: 'Complete functionality without any internet connection.' },
    { id: 'printer', name: 'Printer / PDF export support', price: 300, description: 'Print documents or export to PDF directly from the app.' },
    { id: 'file_sync', name: 'Cloud sync (multi-device)', price: 700, description: 'Sync user data across multiple computers via cloud.' },
    { id: 'shortcuts', name: 'Custom keyboard shortcuts', price: 200, description: 'Power-user keyboard shortcuts, customizable per user.' },
    { id: 'notifications_desktop', name: 'Desktop notifications', price: 200, description: 'Native desktop notifications integrated with the OS.' },
    { id: 'license_system', name: 'License / activation system', price: 500, description: 'Paid license keys or activation codes to control who uses the app.' },
];

export const apiFeatures: FeatureOption[] = [
    { id: 'rest_api', name: 'RESTful API', price: 0, included: true, description: 'Standard REST API with JSON responses.' },
    { id: 'graphql', name: 'GraphQL API', price: 1000, description: 'Modern query language letting clients request exactly the data they need.' },
    { id: 'websockets', name: 'Real-time WebSockets', price: 800, description: 'Persistent connection for real-time data (chat, live updates, dashboards).' },
    { id: 'webhooks_api', name: 'Outgoing webhooks', price: 400, description: 'Notify external systems in real-time when events happen.' },
    { id: 'oauth', name: 'OAuth 2.0 authentication', price: 500, description: 'Let third-party apps securely connect to your API.' },
    { id: 'jwt_auth', name: 'JWT authentication', price: 300, description: 'Stateless token-based authentication for your clients.' },
    { id: 'rate_limiting', name: 'Rate limiting & throttling', price: 300, description: 'Prevent abuse by limiting the number of requests per client.' },
    { id: 'api_docs', name: 'Interactive API documentation (Swagger)', price: 400, description: 'Beautiful, interactive docs that let developers try endpoints live.' },
    { id: 'caching', name: 'Caching layer (Redis)', price: 500, description: 'Dramatically speed up responses with smart caching.' },
    { id: 'queue_system', name: 'Queue / background jobs', price: 600, description: 'Process heavy tasks in the background without blocking requests.' },
    { id: 'cron_jobs', name: 'Scheduled tasks (cron)', price: 300, description: 'Tasks that run automatically at defined times (cleanup, reports, emails).' },
    { id: 'monitoring', name: 'Monitoring & alerting', price: 400, description: 'Health checks, uptime monitoring and alerts when something goes wrong.' },
    { id: 'api_versioning', name: 'API versioning (v1, v2)', price: 400, description: 'Multiple API versions side by side so old clients keep working.' },
    { id: 'audit_logs_api', name: 'Request audit logs', price: 400, description: 'Log every API call for compliance, debugging or billing.' },
    { id: 'file_upload_api', name: 'File upload endpoints', price: 400, description: 'Upload and serve files (images, documents) through the API.' },
    { id: 'encryption', name: 'Sensitive data encryption', price: 500, description: 'Encrypt sensitive fields at rest (passwords, tokens, personal data).' },
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
    let common: FeatureOption[] = commonFeatures;

    if (typeId === 'mobile_app') {
        common = commonFeatures.filter(f => ['analytics', 'gdpr', 'multilingual'].includes(f.id));
        specific = mobileFeatures;
        specificLabel = 'Mobile App Features';
    } else if (typeId === 'desktop_app') {
        common = commonFeatures.filter(f => ['analytics', 'multilingual', 'gdpr'].includes(f.id));
        specific = desktopFeatures;
        specificLabel = 'Desktop App Features';
    } else if (typeId === 'api_backend') {
        common = commonFeatures.filter(f => ['hosting', 'domain_ssl', 'migration'].includes(f.id));
        specific = apiFeatures;
        specificLabel = 'API / Backend Features';
    } else if (typeId === 'ecommerce') {
        specific = ecommerceFeatures;
        specificLabel = 'E-commerce Features';
    } else if (typeId === 'platform_saas') {
        specific = saasFeatures;
        specificLabel = 'SaaS / Platform Features';
    } else if (typeId === 'custom_cms') {
        specific = [...webFeatures, ...cmsFeatures];
        specificLabel = 'CMS Features';
    } else if (['showcase_site', 'blog_portfolio', 'static_site'].includes(typeId)) {
        specific = webFeatures;
        specificLabel = 'Web Features';
    }

    return { common, specific, specificLabel };
}
