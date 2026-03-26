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

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, hoverColor = 'hover:bg-gray-50' }: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map((col, i) => (
                                <th key={i} className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider', col.className)}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
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
