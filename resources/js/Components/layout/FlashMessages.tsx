import { usePage } from '@inertiajs/react';
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

    if (!visible) return null;

    return (
        <div className="px-4 sm:px-6 mt-4 space-y-2">
            {flash?.success && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 flex items-center justify-between animate-fade-in">
                    <span>{flash.success}</span>
                    <button onClick={() => setVisible(false)} className="text-emerald-400 hover:text-emerald-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
            {flash?.error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center justify-between animate-fade-in">
                    <span>{flash.error}</span>
                    <button onClick={() => setVisible(false)} className="text-red-400 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
}
