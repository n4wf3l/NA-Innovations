import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function TooManyRequests() {
    const { t } = useTranslation();
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (countdown <= 0) { window.location.reload(); return; }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <>
            <Head title={`429 - ${t('Too Many Requests')}`}>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.8s ease-out forwards; }
                .fade-up-d1 { animation: fadeUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .fade-up-d2 { animation: fadeUp 0.8s ease-out 0.4s forwards; opacity: 0; }
            `}</style>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-transparent to-transparent" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6 fade-up">
                        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <h1 className="text-[6rem] font-black text-white/5 leading-none bebas fade-up">429</h1>
                    <h2 className="text-3xl font-bold text-white bebas tracking-wider -mt-6 fade-up-d1">{t('TOO MANY REQUESTS')}</h2>
                    <p className="text-gray-400 mt-4 max-w-md mx-auto fade-up-d1">{t('You\'ve sent too many requests. Please wait a moment before trying again.')}</p>
                    <div className="mt-8 fade-up-d2">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                            <span className="text-orange-400 text-sm">{t('Auto-refresh in')}</span>
                            <span className="text-2xl font-black text-orange-300 font-mono w-8 text-center">{countdown}</span>
                            <span className="text-orange-400 text-sm">s</span>
                        </div>
                    </div>
                    <div className="mt-6 fade-up-d2">
                        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">{t('Go back home')}</a>
                    </div>
                </div>
            </div>
        </>
    );
}
