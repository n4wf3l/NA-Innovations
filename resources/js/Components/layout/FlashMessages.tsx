import { usePage } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';

export default function FlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    if (!visible || typeof document === 'undefined') return null;

    const isError = !!flash?.error;
    const message = flash?.success || flash?.error;

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm animate-slide-up">
            <div className={`rounded-2xl shadow-2xl p-4 flex items-start space-x-3 ${
                isError
                    ? 'bg-red-600 text-white'
                    : 'bg-emerald-600 text-white'
            }`}>
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isError ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                    {isError ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{message}</p>
                </div>

                {/* Close */}
                <button onClick={() => setVisible(false)} className="flex-shrink-0 text-white/60 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="mt-1 h-0.5 rounded-full overflow-hidden mx-4">
                <div className={`h-full rounded-full ${isError ? 'bg-red-300' : 'bg-emerald-300'}`} style={{ animation: 'shrinkBar 5s linear forwards' }} />
            </div>
        </div>,
        document.body
    );
}
