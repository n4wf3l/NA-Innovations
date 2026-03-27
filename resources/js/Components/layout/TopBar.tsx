interface TopBarProps {
    title?: string;
    onMenuClick: () => void;
    right?: React.ReactNode;
}

export default function TopBar({ title, onMenuClick, right }: TopBarProps) {
    return (
        <header className="sticky top-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4 -ml-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                {title && <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h1>}
            </div>
            {right && <div>{right}</div>}
        </header>
    );
}
