import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ServerError() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`500 - ${t('Server Error')}`}>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes glitch500 { 0%, 100% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -1px); } 60% { transform: translate(-1px, -2px); } 80% { transform: translate(1px, 1px); } }
                .fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .fade-up-d1 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .fade-up-d2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent" />
                {['ERROR', 'CRASH', '500'].map((w, i) => (
                    <span key={w} className="absolute text-white/[0.02] font-black select-none pointer-events-none bebas" style={{ fontSize: `clamp(5rem, ${14 + i * 4}vw, 20rem)`, top: `${10 + i * 30}%`, left: `${-5 + i * 25}%`, transform: `rotate(${-8 + i * 6}deg)` }}>{w}</span>
                ))}
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 fade-up">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h1 className="text-[6rem] font-black text-white/5 leading-none bebas fade-up" style={{ animation: 'glitch500 0.3s ease-in-out infinite' }}>500</h1>
                    <h2 className="text-3xl font-bold text-white bebas tracking-wider -mt-6 fade-up-d1">{t('SERVER ERROR').toUpperCase()}</h2>
                    <p className="text-gray-400 mt-4 max-w-md mx-auto fade-up-d1">{t('Something went wrong on our end. Our team has been notified. Please try again in a moment.')}</p>
                    <div className="mt-10 flex items-center justify-center gap-4 fade-up-d2">
                        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all bebas" style={{ letterSpacing: '2px' }}>
                            {t('TRY AGAIN')}
                        </button>
                        <a href="/" className="px-8 py-4 border-2 border-white/20 text-white text-lg font-bold rounded-full hover:border-red-400/50 hover:text-red-300 transition-all bebas" style={{ letterSpacing: '2px' }}>
                            {t('GO HOME')}
                        </a>
                    </div>
                    <p className="text-xs text-gray-600 mt-8">{t('If the problem persists, contact')} <a href="mailto:info@nainnovations.be" className="text-red-400 hover:underline">info@nainnovations.be</a></p>
                </div>
            </div>
        </>
    );
}
