import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Forbidden() {
    const { auth } = usePage<{ auth: { user: { id: number; role?: string } | null } }>().props;
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

    const dashboardUrl = auth?.user?.role === 'admin' ? '/admin/dashboard'
        : auth?.user?.role === 'referral_partner' ? '/partner/dashboard'
        : auth?.user?.role === 'developer' ? '/dev/dashboard'
        : auth?.user?.role === 'client' ? '/client/dashboard'
        : '/';

    return (
        <>
            <Head title={`403 - ${t('Access Denied')}`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes float403 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(-1deg); }
                    75% { transform: translateY(8px) rotate(1deg); }
                }
                @keyframes lockPulse {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse403 {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.06; }
                }
                .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .animate-fade-up-d1 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-fade-up-d2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>

            <div className="min-h-screen bg-gray-900 relative overflow-hidden flex flex-col">
                {/* Interactive gradient */}
                <div
                    className="absolute inset-0 transition-all duration-1000 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)`,
                    }}
                />

                {/* Background words */}
                {['DENIED', 'LOCKED', '403', 'FORBIDDEN', 'RESTRICTED'].map((word, i) => (
                    <span
                        key={word}
                        className="absolute text-white select-none pointer-events-none bebas"
                        style={{
                            fontSize: `clamp(4rem, ${12 + i * 3}vw, 18rem)`,
                            top: `${5 + i * 20}%`,
                            left: `${-5 + i * 20}%`,
                            opacity: 0.02,
                            transform: `rotate(${-10 + i * 5}deg)`,
                            animation: 'pulse403 4s ease-in-out infinite',
                            animationDelay: `${i * 0.5}s`,
                        }}
                    >
                        {word}
                    </span>
                ))}

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
                    {/* Lock icon */}
                    <div className="relative mb-8 animate-fade-up">
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-500/10" style={{ animation: 'lockPulse 3s ease-in-out infinite' }} />
                        <div className="relative w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    </div>

                    {/* 403 */}
                    <h1
                        className="text-[8rem] sm:text-[12rem] font-black text-white/5 leading-none bebas animate-fade-up select-none"
                        style={{ animation: 'float403 6s ease-in-out infinite' }}
                    >
                        403
                    </h1>

                    {/* Message */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white bebas tracking-wider -mt-8 animate-fade-up-d1">
                        {t('Access Denied').toUpperCase()}
                    </h2>
                    <p className="text-gray-400 text-center max-w-md mt-4 animate-fade-up-d1">
                        {t('You don\'t have permission to access this page. This area is restricted to authorized users.')}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-up-d2">
                        <a
                            href={dashboardUrl}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] bebas"
                            style={{ letterSpacing: '2px' }}
                        >
                            {auth?.user ? t('GO TO DASHBOARD') : t('GO HOME')}
                        </a>
                        <a
                            href={auth?.user ? '/logout' : '/login'}
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white text-lg font-bold rounded-full transition-all duration-300 hover:border-red-400/50 hover:text-red-300 bebas"
                            style={{ letterSpacing: '2px' }}
                        >
                            {auth?.user ? t('SIGN OUT') : t('SIGN IN')}
                        </a>
                    </div>

                    {/* Help text */}
                    <p className="text-xs text-gray-600 mt-8 text-center max-w-sm">
                        {t('If you think this is an error, please contact the administrator.')}
                    </p>
                </div>
            </div>
        </>
    );
}
