import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export interface NavItem {
    type: 'link' | 'section';
    label: string;
    href?: string;
    icon?: string;
    match?: string;
}

interface SidebarProps {
    items: NavItem[];
    logo: React.ReactNode;
    footer?: React.ReactNode;
    cta?: { label: string; href: string };
    accentColor: string;
    currentPath: string;
}

export default function Sidebar({ items, logo, footer, cta, accentColor, currentPath }: SidebarProps) {
    const activeClasses = accentColor === 'rose'
        ? 'bg-white/10 text-white'
        : accentColor === 'indigo'
        ? 'bg-indigo-500/10 text-indigo-400'
        : 'bg-teal-500/10 text-teal-400';
    const inactiveClasses = 'text-gray-400 hover:bg-white/5 hover:text-gray-200';

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex-shrink-0 p-5 pb-3">{logo}</div>

            {/* CTA */}
            {cta && (
                <div className="px-4 pb-4">
                    <Link
                        href={cta.href}
                        className={cn(
                            'flex items-center justify-center w-full py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5',
                            accentColor === 'rose'
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-600/30 hover:shadow-rose-600/50'
                                : accentColor === 'indigo'
                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-600/30 hover:shadow-indigo-600/50'
                                : 'bg-gradient-to-r from-teal-400 to-teal-500 shadow-teal-500/30 hover:shadow-teal-500/50'
                        )}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {cta.label}
                    </Link>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin">
                {items.map((item, i) => {
                    if (item.type === 'section') {
                        return (
                            <div key={`s-${i}`} className="pt-4 pb-1 px-3">
                                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">{item.label}</p>
                            </div>
                        );
                    }
                    const isActive = item.match ? currentPath.startsWith(item.match) : currentPath === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href || '#'}
                            className={cn(
                                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                isActive ? activeClasses : inactiveClasses
                            )}
                        >
                            {item.icon && (
                                <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            )}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {footer && <div className="flex-shrink-0">{footer}</div>}
        </div>
    );
}
