import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/useTheme';

interface NavLink {
    href: string;
    label: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    navLinks: NavLink[];
    branding: { company_name: string };
    locale: string;
    onLangClick: () => void;
}

export default function PublicMobileDrawer({ isOpen, onClose, navLinks, locale, onLangClick }: Props) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const toggleTheme = (e: React.MouseEvent) => setTheme(isDark ? 'light' : 'dark', e.nativeEvent);

    const [render, setRender] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setClosing(false);
            setRender(true);
        } else if (render) {
            setClosing(true);
            const to = setTimeout(() => { setRender(false); setClosing(false); }, 400);
            return () => clearTimeout(to);
        }
    }, [isOpen]);

    if (!render) return null;

    const isActive = (href: string) => {
        if (typeof window === 'undefined') return false;
        return href === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(href);
    };

    const filteredLinks = navLinks.filter(l => l.href !== '/contact');
    const contactLink = navLinks.find(l => l.href === '/contact');

    return (
        <div className="md:hidden fixed inset-0 z-[9998]">
            <style>{`
                @keyframes pmd-bg-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pmd-bg-out { from { opacity: 1; } to { opacity: 0; } }
                @keyframes pmd-item-in { 0% { opacity: 0; transform: translateY(24px); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
                @keyframes pmd-item-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-12px); } }
                @keyframes pmd-cta-in { 0% { opacity: 0; transform: translateY(20px) scale(0.9); } 60% { transform: translateY(-3px) scale(1.04); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes pmd-close-in { from { opacity: 0; transform: rotate(-90deg) scale(0.6); } to { opacity: 1; transform: rotate(0) scale(1); } }
                @keyframes pmd-bottom-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pmd-glow { 0%, 100% { transform: translate(0,0) scale(1); opacity: 0.25; } 50% { transform: translate(40px, -30px) scale(1.15); opacity: 0.35; } }
                @keyframes pmd-glow2 { 0%, 100% { transform: translate(0,0) scale(1); opacity: 0.2; } 50% { transform: translate(-30px, 40px) scale(1.2); opacity: 0.3; } }
            `}</style>

            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgb(3, 7, 18)',
                    animation: closing ? 'pmd-bg-out 350ms ease-in forwards' : 'pmd-bg-in 350ms ease-out forwards',
                }}
            />

            {/* Subtle ambient glows */}
            <div style={{ position: 'absolute', top: '15%', left: '-15%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, #14b8a6, transparent 70%)', filter: 'blur(70px)', opacity: 0.25, animation: 'pmd-glow 10s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-15%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, #0d9488, transparent 70%)', filter: 'blur(90px)', opacity: 0.2, animation: 'pmd-glow2 12s ease-in-out infinite', pointerEvents: 'none' }} />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
                {/* Close */}
                <button
                    onClick={onClose}
                    aria-label={t('Close')}
                    className="absolute top-7 right-7 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                    style={{ animation: closing ? 'none' : 'pmd-close-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards', opacity: closing ? 0 : 1 }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Nav */}
                <nav className="flex flex-col items-center gap-8 mb-14">
                    {filteredLinks.map((link, idx) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={`text-2xl font-bold tracking-widest transition-colors duration-300 bebas relative ${
                                isActive(link.href) ? 'text-teal-300' : 'text-white/30 hover:text-white'
                            }`}
                            style={{
                                letterSpacing: '6px',
                                animation: closing
                                    ? `pmd-item-out 250ms ease-in ${idx * 30}ms forwards`
                                    : `pmd-item-in 600ms cubic-bezier(0.16, 1, 0.3, 1) ${100 + idx * 70}ms both`,
                                textShadow: isActive(link.href) ? '0 0 25px rgba(45, 212, 191, 0.5)' : 'none',
                            }}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '20px',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent, #2dd4bf, transparent)',
                                    borderRadius: '2px',
                                }} />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                {contactLink && (
                    <a
                        href="/contact#quote"
                        onClick={onClose}
                        className="px-12 py-4 bg-teal-400 text-gray-900 text-base font-bold rounded-full hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] transition-all duration-300 bebas"
                        style={{
                            letterSpacing: '4px',
                            animation: closing
                                ? 'pmd-item-out 250ms ease-in forwards'
                                : `pmd-cta-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1) ${100 + filteredLinks.length * 70 + 80}ms both`,
                        }}
                    >
                        {contactLink.label || t('Free Quote')}
                    </a>
                )}

                {/* Theme + Lang */}
                <div
                    className="mt-14 flex items-center gap-5"
                    style={{
                        animation: closing
                            ? 'pmd-item-out 250ms ease-in forwards'
                            : `pmd-bottom-in 500ms ease-out ${100 + filteredLinks.length * 70 + 250}ms both`,
                    }}
                >
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 text-white/30 hover:text-teal-300 transition-colors"
                        aria-label={isDark ? t('Light mode') : t('Dark mode')}
                    >
                        {isDark ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                        )}
                        <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{isDark ? t('Light') : t('Dark')}</span>
                    </button>

                    <span className="w-px h-4 bg-white/10" />

                    <button
                        onClick={() => { onClose(); onLangClick(); }}
                        className="flex items-center gap-2 text-white/30 hover:text-teal-300 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                        </svg>
                        <span className="text-xs font-bold uppercase bebas" style={{ letterSpacing: '3px' }}>{locale}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
