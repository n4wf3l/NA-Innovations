import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from '@/Components/landing/WhatsAppButton';
import ChatWidget from '@/Components/landing/ChatWidget';
import { useTheme } from '@/lib/useTheme';

interface PublicLayoutProps {
    title?: string;
    description?: string;
    ogImage?: string;
    jsonLd?: Record<string, any>;
}

const socialIcons: Record<string, JSX.Element> = {
    instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    ),
    twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
    linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ),
    github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ),
    facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    ),
    tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
    ),
};

export default function PublicLayout({ children, title, description, ogImage, jsonLd }: PropsWithChildren<PublicLayoutProps>) {
    const { auth, locale, appUrl, branding } = usePage<{ auth: { user: { id: number } | null }; locale: string; appUrl: string; branding: { company_name: string; logo_path: string; tagline: string } }>().props;
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
    const pageUrl = typeof window !== 'undefined' ? window.location.href : appUrl;
    const siteName = branding?.company_name || 'NA Innovations';
    const metaDesc = description || branding?.tagline || 'Web Development, Mobile & Software — NA Innovations';
    const metaImage = ogImage || (branding?.logo_path ? `${appUrl}/storage/${branding.logo_path}` : `${appUrl}/NAlogo2.png`);

    const orgJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NA Innovations BV',
        url: appUrl,
        logo: `${appUrl}/NAlogo2.png`,
        contactPoint: { '@type': 'ContactPoint', telephone: '+32490221912', contactType: 'customer service', availableLanguage: ['French', 'English', 'Dutch'] },
        address: { '@type': 'PostalAddress', streetAddress: '170 Nijverheidskaai', addressLocality: 'Anderlecht', postalCode: '1070', addressCountry: 'BE' },
        sameAs: [],
    };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const socialLinks: Record<string, string> = (usePage().props.socialLinks as Record<string, string>) || {};

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const navLinks = [
        { href: '/', label: t('Home') },
        { href: '/services', label: t('Services') },
        { href: '/products', label: t('Products') },
        { href: '/pricing', label: t('Pricing') },
        { href: '/projects', label: t('Projects') },
        { href: '/about', label: t('About') },
        { href: '/posts', label: t('News') },
        { href: '/contact', label: t('Free Quote') },
    ];

    const isActive = (href: string) => {
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    return (
        <>
            <Head title={title || siteName}>
                {/* SEO */}
                <meta name="description" content={metaDesc} />
                <link rel="canonical" href={pageUrl} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:title" content={`${title || siteName} — ${siteName}`} />
                <meta property="og:description" content={metaDesc} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:locale" content={locale === 'fr' ? 'fr_BE' : locale === 'nl' ? 'nl_BE' : 'en_US'} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${title || siteName} — ${siteName}`} />
                <meta name="twitter:description" content={metaDesc} />
                <meta name="twitter:image" content={metaImage} />

                {/* Hreflang */}
                <link rel="alternate" hrefLang="fr" href={`${appUrl}/locale/fr`} />
                <link rel="alternate" hrefLang="en" href={`${appUrl}/locale/en`} />
                <link rel="alternate" hrefLang="nl" href={`${appUrl}/locale/nl`} />
                <link rel="alternate" hrefLang="x-default" href={appUrl} />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />

                {/* Organization JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>

                {/* Page-specific JSON-LD */}
                {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
            </Head>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }

                @keyframes floatWord1 { 0%, 100% { transform: translate(0, 0) rotate(-5deg); } 50% { transform: translate(30px, -20px) rotate(2deg); } }
                @keyframes floatWord2 { 0%, 100% { transform: translate(0, 0) rotate(3deg); } 50% { transform: translate(-20px, 30px) rotate(-3deg); } }
                @keyframes floatWord3 { 0%, 100% { transform: translate(0, 0) rotate(-2deg); } 50% { transform: translate(25px, 15px) rotate(4deg); } }
                @keyframes floatWord4 { 0%, 100% { transform: translate(0, 0) rotate(4deg); } 50% { transform: translate(-15px, -25px) rotate(-2deg); } }
                @keyframes floatWord5 { 0%, 100% { transform: translate(0, 0) rotate(-3deg); } 50% { transform: translate(20px, 20px) rotate(3deg); } }
                @keyframes floatWord6 { 0%, 100% { transform: translate(0, 0) rotate(2deg); } 50% { transform: translate(-25px, -15px) rotate(-4deg); } }
                @keyframes floatWord7 { 0%, 100% { transform: translate(0, 0) rotate(-4deg); } 50% { transform: translate(15px, 25px) rotate(2deg); } }
                @keyframes floatWord8 { 0%, 100% { transform: translate(0, 0) rotate(3deg); } 50% { transform: translate(-30px, 10px) rotate(-3deg); } }

                .hero-word {
                    position: absolute;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(4rem, 15vw, 14rem);
                    color: white;
                    opacity: 0.03;
                    white-space: nowrap;
                    user-select: none;
                    pointer-events: none;
                }
                .hero-word-1 { top: 5%; left: 10%; animation: floatWord1 12s ease-in-out infinite; }
                .hero-word-2 { top: 15%; right: 5%; animation: floatWord2 10s ease-in-out infinite; }
                .hero-word-3 { top: 35%; left: -5%; animation: floatWord3 14s ease-in-out infinite; }
                .hero-word-4 { top: 50%; right: 10%; animation: floatWord4 11s ease-in-out infinite; }
                .hero-word-5 { top: 65%; left: 15%; animation: floatWord5 13s ease-in-out infinite; }
                .hero-word-6 { top: 75%; right: -5%; animation: floatWord6 9s ease-in-out infinite; }
                .hero-word-7 { top: 85%; left: 5%; animation: floatWord7 15s ease-in-out infinite; }
                .hero-word-8 { bottom: 5%; right: 15%; animation: floatWord8 10s ease-in-out infinite; }

                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .scroll-banner {
                    display: flex;
                    animation: scrollLeft 20s linear infinite;
                    width: max-content;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>

            {/* Navbar */}
            <nav className="bg-gray-900 sticky top-0 z-50">
                <div className="flex justify-between items-center max-w-[1298px] mx-auto px-4 py-5">
                    <Link href="/" className="flex items-center gap-3">
                        {branding.logo_path ? (
                            <img src={`/storage/${branding.logo_path}`} alt={branding.company_name} className="h-10 w-auto" />
                        ) : null}
                        <span className="text-3xl font-bold text-white">{branding.company_name.split(' ').map(w => w[0]).join('')}</span>
                    </Link>

                    {/* Hamburger */}
                    <button
                        className="md:hidden block text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop nav */}
                    <div className="hidden md:flex gap-6 items-center pr-5 text-lg font-medium text-white whitespace-nowrap bebas" style={{ letterSpacing: '2px' }}>
                        {navLinks.filter(l => l.href !== '/contact').map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:text-teal-300 transition duration-300 ${isActive(link.href) ? 'text-teal-300' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {navLinks.find(l => l.href === '/contact') && (
                            <a href="/contact#tabs" className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${isActive('/contact') ? 'bg-teal-300 text-gray-900' : 'bg-teal-400 text-gray-900 hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(94,234,212,0.3)]'}`} style={{ letterSpacing: '1px' }}>
                                {navLinks.find(l => l.href === '/contact')!.label}
                            </a>
                        )}
                        <span className="w-px h-6 bg-white/20" />
                        {/* Theme + Language group */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
                            {/* Theme toggle */}
                            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-teal-300 hover:bg-white/10 transition-all" title={isDark ? t('Light mode') : t('Dark mode')}>
                                {isDark ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                )}
                            </button>
                            {/* Language */}
                            <button onClick={() => setShowLangModal(true)} className="h-8 flex items-center gap-1 rounded-full text-gray-400 hover:text-teal-300 hover:bg-white/10 transition-all px-2.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                                <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '1px' }}>{locale}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu — Fullscreen overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-[9998]">
                        <div className="absolute inset-0 bg-gray-950" onClick={() => setMobileMenuOpen(false)} />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
                            {/* Close button */}
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-7 right-7 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Nav links */}
                            <nav className="flex flex-col items-center gap-8 mb-14">
                                {navLinks.filter(l => l.href !== '/contact').map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-2xl font-bold tracking-widest transition-all duration-300 bebas ${
                                            isActive(link.href) ? 'text-teal-300' : 'text-white/25 hover:text-white'
                                        }`}
                                        style={{ letterSpacing: '6px' }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* CTA */}
                            <a
                                href="/contact#tabs"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-12 py-4 bg-teal-400 text-gray-900 text-base font-bold rounded-full hover:bg-teal-300 transition-all duration-300 bebas"
                                style={{ letterSpacing: '4px' }}
                            >
                                {navLinks.find(l => l.href === '/contact')?.label || t('Free Quote')}
                            </a>

                            {/* Theme + Language */}
                            <div className="mt-14 flex items-center gap-6">
                                <button onClick={() => { toggleTheme(); }} className="flex items-center gap-2 text-white/20 hover:text-teal-300 transition-colors">
                                    {isDark ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                    )}
                                    <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{isDark ? t('Light') : t('Dark')}</span>
                                </button>
                                <span className="w-px h-4 bg-white/10" />
                                <button
                                    onClick={() => { setMobileMenuOpen(false); setShowLangModal(true); }}
                                    className="flex items-center gap-2 text-white/20 hover:text-teal-300 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                                    <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{locale}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Language Modal — Fullscreen */}
            {showLangModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-[langFadeIn_0.4s_ease-out]" onClick={() => setShowLangModal(false)}>
                    <style>{`
                        @keyframes langFadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes langSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                    <div className="absolute inset-0 bg-gray-950" />
                    <div className="relative z-10 text-center animate-[langSlideUp_0.5s_ease-out_0.1s_both]" onClick={e => e.stopPropagation()}>
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-12 bebas">{t('Select your language')}</p>
                        <div className="flex flex-col gap-4">
                            {[
                                { code: 'en', label: 'English' },
                                { code: 'fr', label: 'Français' },
                                { code: 'nl', label: 'Nederlands' },
                            ].map((lang, i) => (
                                <a
                                    key={lang.code}
                                    href={`/locale/${lang.code}`}
                                    className={`group relative px-16 py-5 text-4xl md:text-5xl font-bold tracking-wide transition-all duration-300 bebas ${
                                        locale === lang.code
                                            ? 'text-teal-300'
                                            : 'text-white/30 hover:text-white'
                                    }`}
                                    style={{ letterSpacing: '3px', animation: `langSlideUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
                                >
                                    {lang.label}
                                    {locale === lang.code && (
                                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-400 rounded-full" />
                                    )}
                                    <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-px bg-teal-400 transition-all duration-300 ${
                                        locale === lang.code ? 'w-16' : 'w-0 group-hover:w-16'
                                    }`} />
                                </a>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowLangModal(false)}
                            className="mt-16 text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] bebas"
                            style={{ letterSpacing: '2px', animation: 'langSlideUp 0.5s ease-out 0.5s both' }}
                        >
                            {t('Close')}
                        </button>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900 py-12">
                <div className="container mx-auto flex flex-col items-center px-4">
                    {/* Logo + social row */}
                    <div className="w-full flex flex-col items-center mb-10">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            {branding.logo_path ? (
                                <img src={`/storage/${branding.logo_path}`} alt={branding.company_name} className="h-8 w-auto" />
                            ) : null}
                            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{branding.company_name}</span>
                        </Link>
                        {Object.keys(socialLinks).length > 0 && (
                            <div className="flex items-center gap-3">
                                {Object.entries(socialLinks).map(([platform, url]) => (
                                    socialIcons[platform] ? (
                                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300">
                                            {socialIcons[platform]}
                                        </a>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {/* Quick Links */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Quick Links')}</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                                <Link href="/" className="hover:text-teal-500 hover:underline transition">{t('Home')}</Link>
                                <Link href="/services" className="hover:text-teal-500 hover:underline transition">{t('Services')}</Link>
                                <Link href="/products" className="hover:text-teal-500 hover:underline transition">{t('Products')}</Link>
                                <Link href="/projects" className="hover:text-teal-500 hover:underline transition">{t('Projects')}</Link>
                                <Link href="/posts" className="hover:text-teal-500 hover:underline transition">{t('News')}</Link>
                                <Link href="/contact" className="hover:text-teal-500 hover:underline transition">{t('Free Quote')}</Link>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Contact')}</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="mb-2">{t('Email')}: <a href="mailto:info@nainnovations.be" className="hover:underline">info@nainnovations.be</a></p>
                                <p className="mb-2">{t('Phone')}: <a href="tel:+32490221912" className="hover:underline">+32 490 22 19 12</a></p>
                                <p className="mb-2 mt-4 font-bold">NA Innovations BV</p>
                                <p className="mb-2">{t('Company Registration Number')}: 1025.939.504</p>
                                <p className="mb-2">{t('VAT Number')}: BE1025939504</p>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Legal')}</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                                <Link href="/terms" className="hover:text-teal-500 hover:underline transition">{t('Terms & Conditions')}</Link>
                                <Link href="/privacy" className="hover:text-teal-500 hover:underline transition">{t('Privacy Policy')}</Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 mt-12 w-full pt-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} {branding.company_name}. {t('All rights reserved')}.</p>
                    </div>
                </div>
            </footer>

            {/* Fixed portal access — bottom left, icon only */}
            <a
                href={auth?.user ? '/dashboard' : '/login'}
                className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-teal-300 hover:border-teal-300/30 hover:bg-gray-900 transition-all duration-300 group"
                title={auth?.user ? t('Dashboard') : t('Portal')}
            >
                {auth?.user ? (
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                ) : (
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                )}
            </a>

            {/* Theme toggle — always visible, top right */}
            <div className="fixed right-5 top-5 z-50 hidden lg:block">
                <button
                    onClick={toggleTheme}
                    className="group w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-300 hover:border-amber-400 dark:hover:border-amber-400/40 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300 hover:scale-110"
                    title={isDark ? t('Light mode') : t('Dark mode')}
                >
                    {isDark ? (
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                    ) : (
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                    )}
                </button>
            </div>

            {/* Scroll to top — bottom right, above WhatsApp */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-[136px] right-6 z-50 w-11 h-11 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-teal-300 hover:border-teal-300/30 hover:bg-gray-900 transition-all duration-500 group ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                title={t('Back to top')}
            >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
            </button>

            {/* WhatsApp floating button — above chatbot */}
            <WhatsAppButton phoneNumber={socialLinks.whatsapp || ''} />

            {/* AI Chatbot widget — bottom right */}
            <ChatWidget />
        </>
    );
}
