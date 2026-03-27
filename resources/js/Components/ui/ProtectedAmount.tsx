import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface ProtectedAmountProps {
    amount: number;
    className?: string;
}

/** Locked placeholder with lock icon */
export function LockedPlaceholder({ className = '' }: { className?: string }) {
    return (
        <span className={`inline-flex items-center space-x-1.5 select-none ${className}`}>
            <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-gray-300 dark:text-gray-600 tracking-widest font-medium">••••</span>
        </span>
    );
}

/** Use in StatCard value prop: returns formatted string or locked JSX */
export function protectedValue(amount: number, unlocked: boolean): React.ReactNode {
    if (!unlocked) return <LockedPlaceholder />;
    return <AnimatedAmount amount={amount} />;
}

/** Animated number that counts up from 0 */
function AnimatedAmount({ amount }: { amount: number }) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef<number>();

    useEffect(() => {
        const duration = 800; // ms
        const start = performance.now();
        const from = 0;

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(from + (amount - from) * eased);
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [amount]);

    return <span>{formatCurrency(display)}</span>;
}

export default function ProtectedAmount({ amount, className = '' }: ProtectedAmountProps) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const prevUnlocked = useRef(financialUnlocked);
    const [animState, setAnimState] = useState<'idle' | 'reveal' | 'hide'>('idle');

    useEffect(() => {
        if (financialUnlocked && !prevUnlocked.current) {
            // Just unlocked — animate reveal
            setAnimState('reveal');
            const t = setTimeout(() => setAnimState('idle'), 600);
            prevUnlocked.current = true;
            return () => clearTimeout(t);
        }
        if (!financialUnlocked && prevUnlocked.current) {
            // Just locked — animate hide
            setAnimState('hide');
            const t = setTimeout(() => { setAnimState('idle'); prevUnlocked.current = false; }, 400);
            return () => clearTimeout(t);
        }
        prevUnlocked.current = financialUnlocked;
    }, [financialUnlocked]);

    if (!financialUnlocked && animState !== 'hide') {
        return <LockedPlaceholder className={className} />;
    }

    if (animState === 'hide') {
        return (
            <span className={`inline-block ${className}`} style={{
                animation: 'amountHide 0.4s ease-in forwards',
            }}>
                {formatCurrency(amount)}
            </span>
        );
    }

    return (
        <span className={`inline-block ${className}`} style={
            animState === 'reveal' ? { animation: 'amountReveal 0.6s ease-out forwards' } : undefined
        }>
            <AnimatedAmount amount={amount} />
        </span>
    );
}
