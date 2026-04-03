import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function Maintenance() {
    const { t } = useTranslation();
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title={t('Maintenance')}>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes gearSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .fade-up-d1 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .fade-up-d2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-transparent to-transparent" />
                {['MAINTENANCE', 'UPGRADE', 'SOON'].map((w, i) => (
                    <span key={w} className="absolute text-white/[0.02] font-black select-none pointer-events-none bebas" style={{ fontSize: `clamp(5rem, ${14 + i * 4}vw, 20rem)`, top: `${10 + i * 30}%`, left: `${-5 + i * 25}%`, transform: `rotate(${-8 + i * 6}deg)` }}>{w}</span>
                ))}
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6 fade-up">
                        <svg className="w-10 h-10 text-teal-400" style={{ animation: 'gearSpin 4s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-white bebas tracking-wider fade-up-d1">{t('MAINTENANCE IN PROGRESS').toUpperCase()}</h2>
                    <p className="text-gray-400 mt-4 max-w-md mx-auto fade-up-d1">
                        {t('We\'re improving the platform. We\'ll be back shortly.')}<span className="text-teal-400 font-mono">{dots}</span>
                    </p>
                    <div className="mt-10 fade-up-d2">
                        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-teal-500 text-gray-900 text-lg font-bold rounded-full hover:bg-teal-400 transition-all hover:shadow-[0_0_30px_rgba(94,234,212,0.3)] bebas" style={{ letterSpacing: '2px' }}>
                            {t('CHECK AGAIN')}
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-600 fade-up-d2">
                        <a href="mailto:info@nainnovations.be" className="hover:text-teal-400 transition-colors">info@nainnovations.be</a>
                        <span>·</span>
                        <a href="tel:+32490221912" className="hover:text-teal-400 transition-colors">+32 490 22 19 12</a>
                    </div>
                </div>
            </div>
        </>
    );
}
