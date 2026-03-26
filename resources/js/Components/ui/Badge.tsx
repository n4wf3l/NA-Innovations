import { STATUS_COLORS, formatStatus } from '@/lib/utils';

interface BadgeProps {
    status: string;
    className?: string;
}

export default function Badge({ status, className = '' }: BadgeProps) {
    const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors} ${className}`}>
            {formatStatus(status)}
        </span>
    );
}
