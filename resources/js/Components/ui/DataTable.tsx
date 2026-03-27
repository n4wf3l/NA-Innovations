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
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, hoverColor = 'hover:bg-gray-50 dark:hover:bg-gray-700' }: DataTableProps<T>) {
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
                        {data.map(row => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
