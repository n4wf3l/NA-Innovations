import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import { useTheme } from '@/lib/useTheme';
import SpinnerLink from '@/Components/landing/SpinnerLink';

interface NavLink {
    href: string;
    label: string;
}

interface Props {
    heroSection?: { title: string | null; subtitle: string | null; description: string | null } | null;
    branding: { logo_path: string; company_name: string; tagline: string };
    socialLinks: Record<string, string>;
    socialIcons: Record<string, JSX.Element>;
    navLinks: NavLink[];
    locale: string;
    auth: { user: { id: number } | null };
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (v: boolean) => void;
}

export default function HeroSection({ heroSection, branding, socialLinks, socialIcons, navLinks, locale, auth, mobileMenuOpen, setMobileMenuOpen }: Props) {
    const { t } = useTranslation();
    const [showLangModal, setShowLangModal] = useState(false);
    const [langModalClosing, setLangModalClosing] = useState(false);

    const closeLangModal = () => {
        if (langModalClosing) return;
        setLangModalClosing(true);
        setTimeout(() => {
            setShowLangModal(false);
            setLangModalClosing(false);
        }, 500);
    };
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const toggleTheme = (e: React.MouseEvent) => setTheme(isDark ? 'light' : 'dark', e.nativeEvent);

    const [scrolled, setScrolled] = useState(false);
    const [navOnLight, setNavOnLight] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = document.querySelectorAll('[data-section-theme]');
            const navBottom = 80;
            let onLight = false;
            sections.forEach(section => {
                const rect = (section as HTMLElement).getBoundingClientRect();
                if (rect.top < navBottom && rect.bottom > 0) {
                    onLight = (section as HTMLElement).dataset.sectionTheme === 'light';
                }
            });
            // In dark mode, all sections are dark regardless of data-section-theme
            const darkActive = document.documentElement.classList.contains('dark');
            setNavOnLight(onLight && !darkActive);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navTextColor = navOnLight && !isDark ? 'text-gray-900' : 'text-white';
    const navHoverColor = navOnLight && !isDark ? 'hover:text-teal-600' : 'hover:text-teal-300';
    const navActiveColor = navOnLight && !isDark ? 'text-teal-600' : 'text-teal-300';

    return (
        <div id="hero-section" className="flex flex-col bg-gray-900 relative overflow-hidden" style={{ minHeight: '100vh' }}>
            {/* Animated background words */}
            <div aria-hidden="true">
                <span className="hero-word hero-word-1">DEVELOPMENT</span>
                <span className="hero-word hero-word-2">WEB</span>
                <span className="hero-word hero-word-3">MOBILE</span>
                <span className="hero-word hero-word-4">SOFTWARE</span>
                <span className="hero-word hero-word-5">SAAS</span>
                <span className="hero-word hero-word-6">INNOVATION</span>
                <span className="hero-word hero-word-7">DIGITAL</span>
                <span className="hero-word hero-word-8">CODE</span>
            </div>

            {/* Navbar — Top (static in hero) */}
            <div className={`flex justify-between items-center self-center w-full max-w-[1298px] px-4 py-5 relative z-20 transition-opacity duration-500 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Link href="/" className="flex items-center gap-3">
                    <img src="/white-logo-small.png" alt={branding.company_name} className="h-10 w-auto" />
                </Link>

                <button className="md:hidden block text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                <div className="hidden md:flex gap-6 items-center pr-5 text-lg font-medium text-white whitespace-nowrap bebas" style={{ letterSpacing: '2px' }}>
                    {navLinks.filter(l => l.href !== '/contact').map((link) => (
                        <Link key={link.href} href={link.href} className={`hover:text-teal-300 transition duration-300 ${link.href === '/' ? 'text-teal-300' : ''}`}>
                            {link.label}
                        </Link>
                    ))}
                    {navLinks.find(l => l.href === '/contact') && (
                        <a href="/contact#quote" className="px-5 py-2 bg-teal-400 text-gray-900 text-sm font-bold rounded-full hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(94,234,212,0.3)] transition-all duration-300" style={{ letterSpacing: '1px' }}>
                            {navLinks.find(l => l.href === '/contact')!.label}
                        </a>
                    )}
                    <span className={`w-px h-6 ${navOnLight && !isDark ? 'bg-gray-300' : 'bg-white/20'} transition-colors duration-500`} />
                    {/* Theme toggle */}
                    <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-gray-300 hover:text-teal-300 hover:border-teal-300/40 transition-all duration-300" title={isDark ? t('Light mode') : t('Dark mode')}>
                        {isDark ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                        )}
                    </button>
                    {/* Language */}
                    <button onClick={() => setShowLangModal(true)} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors px-2 py-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                        <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '1px' }}>{locale}</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu — Fullscreen overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[9998]">
                    <div className="absolute inset-0 bg-gray-950" onClick={() => setMobileMenuOpen(false)} />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
                        <button onClick={() => setMobileMenuOpen(false)} className="absolute top-7 right-7 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <nav className="flex flex-col items-center gap-8 mb-14">
                            {navLinks.filter(l => l.href !== '/contact').map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`text-2xl font-bold tracking-widest transition-all duration-300 bebas ${link.href === '/' ? 'text-teal-300' : 'text-white/25 hover:text-white'}`}
                                    style={{ letterSpacing: '6px' }}
                                    onClick={() => setMobileMenuOpen(false)}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <a href="/contact#quote" onClick={() => setMobileMenuOpen(false)}
                            className="px-12 py-4 bg-teal-400 text-gray-900 text-base font-bold rounded-full hover:bg-teal-300 transition-all duration-300 bebas"
                            style={{ letterSpacing: '4px' }}>
                            {navLinks.find(l => l.href === '/contact')?.label || t('Free Quote')}
                        </a>

                        {/* Theme toggle mobile */}
                        <button onClick={toggleTheme} className="mt-10 flex items-center gap-2 text-white/20 hover:text-teal-300 transition-colors">
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                            )}
                            <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{isDark ? t('Light') : t('Dark')}</span>
                        </button>

                        <button onClick={() => { setMobileMenuOpen(false); setShowLangModal(true); }}
                            className="mt-4 flex items-center gap-2.5 text-white/20 hover:text-teal-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                            <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{locale}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mini Sidebar — slides in from left on scroll */}
            <div className={`hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-[998] flex-col items-center gap-1.5 py-5 px-2 bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-xl rounded-r-2xl border border-l-0 border-white/10 shadow-2xl transition-all duration-700 ${
                scrolled ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}>
                {/* Logo */}
                <Link href="/" className="w-9 h-9 flex items-center justify-center mb-2 group" title={branding.company_name}>
                    <img src="/white-logo-small.png" alt="" className="w-7 h-7 object-contain" />
                </Link>

                <div className="w-6 h-px bg-white/10 mb-1" />

                {/* Nav links as icons */}
                {(() => {
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
                    const iconMap: Record<string, string> = {
                        '/': 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
                        '/services': 'M11.42 15.17l-5.12-5.12a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l2.93 2.93 5.59-5.59a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-7.59 7.59a1.5 1.5 0 01-2.12 0z',
                        '/products': 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
                        '/projects': 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
                        '/about': 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
                        '/posts': 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.875c0-.621.504-1.125 1.125-1.125h3.375',
                    };
                    return navLinks.filter(l => l.href !== '/contact').map((link) => {
                        const icon = iconMap[link.href] || iconMap['/'];
                        const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
                        return (
                            <Link key={link.href} href={link.href}
                                className={`group relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'text-teal-300 bg-teal-400/10'
                                        : 'text-gray-500 hover:text-teal-300 hover:bg-white/10'
                                }`}
                                title={link.label}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                </svg>
                                {/* Active indicator */}
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-teal-400 rounded-r-full" />}
                                {/* Tooltip */}
                                <span className="absolute left-full ml-3 px-4 py-2 bg-gray-900 text-white text-base font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl bebas" style={{ letterSpacing: '2px' }}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    });
                })()}

                <div className="w-6 h-px bg-white/10 my-1" />

                {/* Free Quote CTA */}
                <a href="/contact#quote" className="w-11 h-11 flex items-center justify-center rounded-xl border border-teal-400/50 text-teal-400 hover:bg-teal-400 hover:text-gray-900 hover:scale-110 transition-all duration-200 group relative" title={t('Free Quote')}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="absolute left-full ml-3 px-4 py-2 bg-teal-400 text-gray-900 text-base font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl bebas" style={{ letterSpacing: '2px' }}>
                        {t('Free Quote')}
                    </span>
                </a>

                <div className="w-6 h-px bg-white/10 my-1" />

                {/* Theme toggle */}
                <button onClick={toggleTheme} className="group relative w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:text-teal-300 hover:bg-white/10 transition-all duration-200">
                    {isDark ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                    )}
                    <span className="absolute left-full ml-3 px-4 py-2 bg-gray-900 text-white text-base font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl bebas" style={{ letterSpacing: '2px' }}>
                        {isDark ? t('Light mode') : t('Dark mode')}
                    </span>
                </button>

                {/* Language */}
                <button onClick={() => setShowLangModal(true)} className="group relative w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:text-teal-300 hover:bg-white/10 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                    <span className="absolute left-full ml-3 px-4 py-2 bg-gray-900 text-white text-base font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl bebas" style={{ letterSpacing: '2px' }}>
                        {locale.toUpperCase()} — {t('Language')}
                    </span>
                </button>
            </div>

            <style>{`
                @keyframes heroSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes heroBorderDraw { from { opacity: 0; clip-path: inset(0 100% 100% 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
                @keyframes heroButtonPop { from { opacity: 0; transform: scale(0.8) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .hero-anim { opacity: 0; animation: heroSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .hero-anim-d1 { animation-delay: 0.1s; }
                .hero-anim-d2 { animation-delay: 0.25s; }
                .hero-anim-d3 { animation-delay: 0.4s; }
                .hero-anim-d4 { animation-delay: 0.55s; }
                .hero-anim-d5 { animation-delay: 0.7s; }
                .hero-border-anim { animation: heroBorderDraw 1s ease-out 0.05s forwards; opacity: 0; }
                .hero-btn-anim { opacity: 0; animation: heroButtonPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .hero-btn-d1 { animation-delay: 0.6s; }
                .hero-btn-d2 { animation-delay: 0.75s; }
            `}</style>

            {/* Hero content */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-12">
                <div className="w-full max-w-[1100px] border border-white/20 p-8 md:p-14 relative z-10 hero-border-anim">
                    {/* No language badge here — hero text is translated via t() */}
                    <div className="text-sm md:text-base lg:text-xl font-medium text-neutral-400 bebas hover:text-teal-300 transition-colors duration-700 hero-anim hero-anim-d1" style={{ letterSpacing: '2px' }}>
                        {heroSection?.subtitle || t('Web Development, Mobile & Software Solutions')}
                    </div>
                    <div className="mt-8 text-6xl sm:text-7xl lg:text-8xl font-bold text-white hover:text-teal-300 transition-colors duration-700 hero-anim hero-anim-d2">
                        {heroSection?.title || t('Innovative solutions designed for you.')}
                    </div>
                    <p className="mt-8 text-sm lg:text-base bebas text-white/60 hover:text-teal-300 transition-colors duration-700 hero-anim hero-anim-d3" style={{ letterSpacing: '1px' }}>
                        {heroSection?.description || t('From idea to application')}
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 hero-anim hero-anim-d4">
                        <SpinnerLink href="/contact#quote"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-teal-400 text-gray-900 text-xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] bebas hero-btn-anim hero-btn-d1"
                            style={{ letterSpacing: '3px' }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            {t('Request a Quote').toUpperCase()}
                        </SpinnerLink>

                        {Object.keys(socialLinks).length > 0 && (
                            <div className="flex gap-4 items-center hero-anim hero-anim-d5">
                                <span className="hidden sm:block w-px h-8 bg-white/20" />
                                {Object.entries(socialLinks).map(([platform, url]) => (
                                    socialIcons[platform] ? (
                                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/20 text-white hover:bg-teal-400 hover:border-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-110">
                                            {socialIcons[platform]}
                                        </a>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll arrow handled by fixed global ScrollNextButton */}
            </div>
            {/* Language Modal — Fullscreen */}
            {showLangModal && (
                <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ease-out ${langModalClosing ? 'opacity-0' : 'animate-[langFadeIn_0.4s_ease-out]'}`} onClick={() => closeLangModal()}>
                    <style>{`
                        @keyframes langFadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes langSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                    <div className={`absolute inset-0 bg-gray-950 transition-opacity duration-500 ease-out ${langModalClosing ? 'opacity-0' : ''}`} />
                    <div className={`relative z-10 text-center transition-all duration-500 ease-out ${langModalClosing ? 'opacity-0 translate-y-8 scale-95' : 'animate-[langSlideUp_0.5s_ease-out_0.1s_both]'}`} onClick={e => e.stopPropagation()}>
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-12 bebas">{t('Select your language')}</p>
                        <div className="flex flex-col gap-4">
                            {[
                                { code: 'en', label: 'English' },
                                { code: 'fr', label: 'Français' },
                                { code: 'nl', label: 'Nederlands' },
                            ].map((lang, i) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setShowLangModal(false); window.location.href = `/locale/${lang.code}`; }}
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
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => closeLangModal()}
                            className="mt-16 text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] bebas"
                            style={{ letterSpacing: '2px', animation: 'langSlideUp 0.5s ease-out 0.5s both' }}
                        >
                            {t('Close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
