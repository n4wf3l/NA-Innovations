import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function SessionExpired() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`419 - ${t('Session Expired')}`}>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin419 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .fade-up-d1 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .fade-up-d2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-transparent" />
                {['SESSION', 'EXPIRED', '419'].map((w, i) => (
                    <span key={w} className="absolute text-white/[0.02] font-black select-none pointer-events-none bebas" style={{ fontSize: `clamp(5rem, ${14 + i * 4}vw, 20rem)`, top: `${10 + i * 30}%`, left: `${-5 + i * 25}%`, transform: `rotate(${-8 + i * 6}deg)` }}>{w}</span>
                ))}
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 fade-up">
                        <svg className="w-10 h-10 text-amber-400" style={{ animation: 'spin419 8s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-[6rem] font-black text-white/5 leading-none bebas fade-up">419</h1>
                    <h2 className="text-3xl font-bold text-white bebas tracking-wider -mt-6 fade-up-d1">{t('SESSION EXPIRED').toUpperCase()}</h2>
                    <p className="text-gray-400 mt-4 max-w-md mx-auto fade-up-d1">{t('Your session has expired. This usually happens when you stay on a page for too long. Please refresh to continue.')}</p>
                    <div className="mt-10 flex items-center justify-center gap-4 fade-up-d2">
                        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-amber-500 text-gray-900 text-lg font-bold rounded-full hover:bg-amber-400 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] bebas" style={{ letterSpacing: '2px' }}>
                            {t('REFRESH PAGE')}
                        </button>
                        <a href="/" className="px-8 py-4 border-2 border-white/20 text-white text-lg font-bold rounded-full hover:border-amber-400/50 hover:text-amber-300 transition-all bebas" style={{ letterSpacing: '2px' }}>
                            {t('GO HOME')}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
