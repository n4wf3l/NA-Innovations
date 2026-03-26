import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProtectedAmountProps {
    amount: number;
    className?: string;
}

export default function ProtectedAmount({ amount, className = '' }: ProtectedAmountProps) {
    const { financialUnlocked } = usePage<PageProps>().props;

    if (!financialUnlocked) {
        return <span className={`text-gray-300 select-none ${className}`}>••••••</span>;
    }

    return <span className={className}>{formatCurrency(amount)}</span>;
}
