import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppLogo from '@/Components/ui/AppLogo';
import { useBranding } from '@/hooks/useBranding';

export default function NotFound() {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const { companyName } = useBranding();
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <>
            <Head title={`404 - ${t('Page Not Found')}`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes float404 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-20px) rotate(-2deg); }
                    75% { transform: translateY(10px) rotate(1deg); }
                }
                @keyframes glitch {
                    0%, 100% { clip-path: inset(0 0 0 0); }
                    10% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 2px); }
                    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
                    30% { clip-path: inset(0 0 0 0); transform: translate(0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse404 {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.06; }
                }
                .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .animate-fade-up-delay { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-fade-up-delay2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>

            <div className="min-h-screen bg-gray-900 relative overflow-hidden flex flex-col">
                {/* Interactive gradient background */}
                <div
                    className="absolute inset-0 transition-all duration-1000 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(94, 234, 212, 0.08) 0%, transparent 50%)`,
                    }}
                />

                {/* Animated background words */}
                <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
                    <span className="absolute bebas text-white" style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', top: '10%', left: '5%', opacity: 0.03, animation: 'pulse404 4s ease-in-out infinite' }}>{t('ERROR')}</span>
                    <span className="absolute bebas text-white" style={{ fontSize: 'clamp(6rem, 18vw, 14rem)', top: '40%', right: '5%', opacity: 0.03, animation: 'pulse404 4s ease-in-out infinite 1s' }}>{t('LOST')}</span>
                    <span className="absolute bebas text-white" style={{ fontSize: 'clamp(5rem, 15vw, 12rem)', bottom: '15%', left: '15%', opacity: 0.03, animation: 'pulse404 4s ease-in-out infinite 2s' }}>404</span>
                </div>

                {/* Navbar */}
                <div className="relative z-10 flex justify-between items-center w-full max-w-[1298px] mx-auto px-6 py-6">
                    <a href="/"><AppLogo variant="dark" size="lg" /></a>
                    <a
                        href="/"
                        className="text-sm text-white/50 hover:text-teal-300 transition-colors flex items-center gap-2 bebas"
                        style={{ letterSpacing: '2px' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        {t('Back to home').toUpperCase()}
                    </a>
                </div>

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center relative z-10 px-6">
                    <div className="text-center max-w-2xl">
                        {/* Big 404 */}
                        <div className="relative mb-8 animate-fade-up">
                            <h1
                                className="bebas text-[12rem] sm:text-[16rem] md:text-[20rem] leading-none font-bold text-transparent select-none"
                                style={{
                                    WebkitTextStroke: '2px rgba(94, 234, 212, 0.3)',
                                    animation: 'float404 6s ease-in-out infinite',
                                }}
                            >
                                404
                            </h1>
                            {/* Glitch overlay */}
                            <h1
                                className="absolute inset-0 bebas text-[12rem] sm:text-[16rem] md:text-[20rem] leading-none font-bold text-teal-400/10 select-none"
                                style={{ animation: 'glitch 3s ease-in-out infinite' }}
                                aria-hidden="true"
                            >
                                404
                            </h1>
                        </div>

                        {/* Text */}
                        <h2 className="bebas text-4xl sm:text-5xl md:text-6xl text-white mb-4 animate-fade-up-delay" style={{ letterSpacing: '3px' }}>
                            {t('Page Not Found')}
                        </h2>
                        <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto animate-fade-up-delay2">
                            {t("The page you're looking for doesn't exist or has been moved.")}
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay2">
                            <a
                                href="/"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-teal-400 text-gray-900 text-lg font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] bebas"
                                style={{ letterSpacing: '3px' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                                {t('Go home').toUpperCase()}
                            </a>
                            <a
                                href="/contact#quote"
                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white text-lg font-bold rounded-full transition-all duration-300 hover:border-teal-400/50 hover:text-teal-300 bebas"
                                style={{ letterSpacing: '2px' }}
                            >
                                {t('Free Quote').toUpperCase()}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </a>
                        </div>

                        {/* Quick links */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm">
                            {[
                                { href: '/services', label: t('Services') },
                                { href: '/projects', label: t('Projects') },
                                { href: '/about', label: t('About') },
                                { href: '/posts', label: t('News') },
                            ].map(link => (
                                <a key={link.href} href={link.href} className="text-gray-500 hover:text-teal-300 transition-colors bebas" style={{ letterSpacing: '2px' }}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer line */}
                <div className="relative z-10 text-center py-6">
                    <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} {companyName}</p>
                </div>

                {/* Fixed portal icon */}
                <a
                    href={auth?.user ? '/dashboard' : '/login'}
                    className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-teal-300 hover:border-teal-300/30 hover:bg-gray-900 transition-all duration-300 group"
                >
                    {auth?.user ? (
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                    )}
                </a>
            </div>
        </>
    );
}
