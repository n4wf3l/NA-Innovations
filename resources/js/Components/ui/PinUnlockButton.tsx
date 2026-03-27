import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';

export default function PinUnlockButton() {
    const { financialUnlocked, auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [remaining, setRemaining] = useState(900);
    const [securityToast, setSecurityToast] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showModal && inputRef.current) inputRef.current.focus();
    }, [showModal]);

    // Show toast when unlocked, auto-dismiss after 8 seconds
    useEffect(() => {
        if (financialUnlocked) setSecurityToast(true);
        else setSecurityToast(false);
    }, [financialUnlocked]);

    useEffect(() => {
        if (!securityToast) return;
        const t = setTimeout(() => setSecurityToast(false), 8000);
        return () => clearTimeout(t);
    }, [securityToast]);

    // Countdown timer when unlocked
    useEffect(() => {
        if (!financialUnlocked) { setRemaining(900); return; }

        // Fetch actual remaining time from server
        fetch('/financial-pin/status')
            .then(r => r.json())
            .then(data => { if (data.remaining) setRemaining(data.remaining); })
            .catch(() => {});

        const interval = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    router.reload();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [financialUnlocked]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const progressPct = (remaining / 900) * 100;

    const handleUnlock = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/financial-pin/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({ pin }),
            });
            const data = await res.json();
            if (res.ok) {
                setShowModal(false);
                setPin('');
                setRemaining(data.expires_in || 900);
                setSecurityToast(true);
                router.reload();
            } else {
                setError(data.error || 'Incorrect PIN');
                setPin('');
            }
        } catch { setError('Connection error'); }
        setLoading(false);
    };

    const handleLock = async () => {
        await fetch('/financial-pin/lock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            },
        });
        router.reload();
    };

    if (!auth.user) return null;

    return (
        <>
            {financialUnlocked ? (
                /* Unlocked state with countdown */
                <div className="flex items-center space-x-2">
                    {/* Timer badge */}
                    <div className="relative flex items-center bg-emerald-50 rounded-lg overflow-hidden" title={`Auto-lock in ${formatTime(remaining)}`}>
                        {/* Progress bar background */}
                        <div
                            className="absolute inset-0 bg-emerald-100 transition-all duration-1000 ease-linear"
                            style={{ width: `${progressPct}%` }}
                        />
                        <div className="relative flex items-center space-x-1.5 px-3 py-1.5">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className={`text-xs font-bold tabular-nums ${remaining < 120 ? 'text-red-600' : 'text-emerald-700'}`}>
                                {formatTime(remaining)}
                            </span>
                        </div>
                    </div>

                    {/* Lock button */}
                    <button
                        onClick={handleLock}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title={t('Lock now')}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </button>
                </div>
            ) : (
                /* Locked state */
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                    title={t('Unlock financial data')}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span>{t('Show $')}</span>
                </button>
            )}

            {/* PIN Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 animate-modal text-center">
                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">{t('Enter PIN')}</h3>
                        <p className="text-xs text-gray-400 mb-5">{t('Visible for 15 minutes after unlock')}</p>

                        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-4">{error}</p>}

                        <input
                            ref={inputRef}
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={e => e.key === 'Enter' && pin.length >= 4 && handleUnlock()}
                            placeholder="••••••"
                            className="w-full text-center text-2xl font-mono tracking-[0.5em] border-2 border-gray-200 rounded-xl py-4 focus:border-gray-900 focus:ring-gray-900 placeholder-gray-200"
                        />

                        <button
                            onClick={handleUnlock}
                            disabled={pin.length < 4 || loading}
                            className="w-full mt-4 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-xl disabled:opacity-30 active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            ) : t('Unlock')}
                        </button>

                        <button onClick={() => setShowModal(false)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">{t('Cancel')}</button>
                    </div>
                </div>,
                document.body
            )}

            {/* Security toast - bottom right */}
            {securityToast && financialUnlocked && createPortal(
                <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up max-w-sm">
                    <div className="bg-gray-900 text-white rounded-2xl shadow-2xl shadow-black/20 p-4 flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{t('Financial data visible')}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{t('For security, amounts will be automatically hidden after 15 minutes.')}</p>
                        </div>
                        <button onClick={() => setSecurityToast(false)} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    {/* Auto-dismiss progress bar */}
                    <div className="mt-1 h-0.5 bg-gray-800 rounded-full overflow-hidden mx-4">
                        <div className="h-full bg-amber-500 rounded-full" style={{ animation: 'shrinkBar 8s linear forwards' }} />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
