import { cn } from '@/lib/utils';

interface Column<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    onRowClick?: (row: T) => void;
    hoverColor?: string;
    loading?: boolean;
    skeletonRows?: number;
}

function SkeletonRow({ cols }: { cols: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className={`h-4 rounded-md bg-gray-100 dark:bg-gray-700 animate-pulse ${i === 0 ? 'w-40' : i === cols - 1 ? 'w-16' : 'w-24'}`} />
                </td>
            ))}
        </tr>
    );
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, hoverColor = 'hover:bg-gray-50 dark:hover:bg-gray-700', loading = false, skeletonRows = 8 }: DataTableProps<T>) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                            {columns.map((col, i) => (
                                <th key={i} className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider', col.className)}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <SkeletonRow key={i} cols={columns.length} />
                            ))
                        ) : (
                            data.map(row => (
                                <tr
                                    key={keyExtractor(row)}
                                    className={cn('transition-colors', hoverColor, onRowClick && 'cursor-pointer')}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col, i) => (
                                        <td key={i} className={cn('px-4 py-3', col.className)}>
                                            {col.accessor(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
