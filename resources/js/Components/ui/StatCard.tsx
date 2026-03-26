interface StatCardProps {
    label: string;
    value: React.ReactNode;
    borderColor?: string;
    icon?: React.ReactNode;
}

export default function StatCard({ label, value, borderColor = 'border-l-teal-500', icon }: StatCardProps) {
    return (
        <div className={`bg-white rounded-xl p-4 border border-gray-100 border-l-4 ${borderColor} shadow-sm`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                {icon && <div className="text-gray-300">{icon}</div>}
            </div>
        </div>
    );
}
