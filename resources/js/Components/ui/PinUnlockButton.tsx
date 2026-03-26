import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function PinUnlockButton() {
    const { financialUnlocked, auth } = usePage<PageProps>().props;
    const [showModal, setShowModal] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showModal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showModal]);

    // Auto-lock timer
    useEffect(() => {
        if (!financialUnlocked) return;
        const timer = setTimeout(() => {
            // Check status and reload
            fetch('/financial-pin/status')
                .then(r => r.json())
                .then(data => {
                    if (!data.unlocked) router.reload();
                });
        }, 60000); // Check every minute
        return () => clearTimeout(timer);
    }, [financialUnlocked]);

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
                router.reload(); // Reload to get updated financialUnlocked
            } else {
                setError(data.error || 'Incorrect PIN');
                setPin('');
            }
        } catch {
            setError('Connection error');
        }
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

    // Don't show if user has no PIN set
    if (!auth.user) return null;

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => financialUnlocked ? handleLock() : setShowModal(true)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    financialUnlocked
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title={financialUnlocked ? 'Lock amounts' : 'Unlock amounts'}
            >
                {financialUnlocked ? (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <span>Lock</span>
                    </>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <span>Show $</span>
                    </>
                )}
            </button>

            {/* PIN Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 animate-modal text-center">
                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">Enter PIN</h3>
                        <p className="text-xs text-gray-400 mb-5">Enter your financial PIN to view amounts</p>

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
                            ) : 'Unlock'}
                        </button>

                        <button onClick={() => setShowModal(false)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">
                            Cancel
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
