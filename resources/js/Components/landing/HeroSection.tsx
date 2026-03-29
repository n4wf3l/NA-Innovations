import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';

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

    return (
        <div className="flex flex-col bg-gray-900 relative overflow-hidden" style={{ minHeight: '100vh' }}>
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

            {/* Navbar */}
            <div className="flex justify-between items-center self-center w-full max-w-[1298px] px-4 py-5 relative z-20">
                <Link href="/" className="flex items-center gap-3">
                    {branding.logo_path ? (
                        <img src={`/storage/${branding.logo_path}`} alt={branding.company_name} className="h-10 w-auto" />
                    ) : null}
                    <span className="text-3xl font-bold text-white">{branding.company_name.split(' ').map(w => w[0]).join('')}</span>
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
                        <a href="/contact#tabs" className="px-5 py-2 bg-teal-400 text-gray-900 text-sm font-bold rounded-full hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(94,234,212,0.3)] transition-all duration-300" style={{ letterSpacing: '1px' }}>
                            {navLinks.find(l => l.href === '/contact')!.label}
                        </a>
                    )}
                    <span className="w-px h-6 bg-white/20" />
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

                        <a href="/contact#tabs" onClick={() => setMobileMenuOpen(false)}
                            className="px-12 py-4 bg-teal-400 text-gray-900 text-base font-bold rounded-full hover:bg-teal-300 transition-all duration-300 bebas"
                            style={{ letterSpacing: '4px' }}>
                            {navLinks.find(l => l.href === '/contact')?.label || t('Free Quote')}
                        </a>

                        <button onClick={() => { setMobileMenuOpen(false); setShowLangModal(true); }}
                            className="mt-14 flex items-center gap-2.5 text-white/20 hover:text-teal-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                            <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{locale}</span>
                        </button>
                    </div>
                </div>
            )}

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
                    <OriginalLanguageBadge light className="mb-4" />
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
                        <Link href="/contact"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-teal-400 text-gray-900 text-xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] bebas hero-btn-anim hero-btn-d1"
                            style={{ letterSpacing: '3px' }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            {t('Request a Quote').toUpperCase()}
                        </Link>

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
            </div>
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
        </div>
    );
}
