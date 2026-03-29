import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn('animate-pulse rounded-md bg-gray-100 dark:bg-gray-700', className)} />
    );
}

export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5', className)}>
            <Skeleton className="w-10 h-10 rounded-xl mb-3" />
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-28" />
        </div>
    );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className={`h-3 ${i === 0 ? 'w-28' : 'w-20'}`} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex gap-4 px-4 py-3.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    {Array.from({ length: cols }).map((_, c) => (
                        <Skeleton key={c} className={`h-4 ${c === 0 ? 'w-36' : c === cols - 1 ? 'w-16' : 'w-24'}`} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonPage() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Banner */}
            <Skeleton className="h-32 rounded-2xl" />
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
            {/* Table */}
            <SkeletonTable />
        </div>
    );
}
