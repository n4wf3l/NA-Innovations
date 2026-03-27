import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
    collapsedLogo?: React.ReactNode;
    footer?: React.ReactNode;
    collapsedFooter?: React.ReactNode;
    cta?: { label: string; href: string };
    accentColor: string;
    currentPath: string;
    collapsed: boolean;
    hovered: boolean;
}

function Tooltip({ text, anchor }: { text: string; anchor: DOMRect | null }) {
    if (!anchor) return null;
    return createPortal(
        <div
            className="fixed z-[99999] pointer-events-none"
            style={{
                top: anchor.top + anchor.height / 2,
                left: anchor.right + 12,
                transform: 'translateY(-50%)',
            }}
        >
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl whitespace-nowrap animate-fade-in flex items-center">
                <svg className="w-2 h-2 text-slate-800 absolute -left-[5px] top-1/2 -translate-y-1/2" viewBox="0 0 6 10" fill="currentColor">
                    <path d="M6 0L0 5l6 5z" />
                </svg>
                {text}
            </div>
        </div>,
        document.body
    );
}

export default function Sidebar({ items, logo, collapsedLogo, footer, collapsedFooter, cta, accentColor, currentPath, collapsed, hovered }: SidebarProps) {
    const { t } = useTranslation();
    const isSmall = collapsed && !hovered;
    const [tooltip, setTooltip] = useState<{ text: string; rect: DOMRect } | null>(null);

    const showTooltip = useCallback((text: string, el: HTMLElement) => {
        if (!isSmall) return;
        setTooltip({ text, rect: el.getBoundingClientRect() });
    }, [isSmall]);

    const hideTooltip = useCallback(() => setTooltip(null), []);

    const activeClasses = accentColor === 'rose'
        ? 'bg-white/10 text-white'
        : accentColor === 'indigo'
        ? 'bg-indigo-500/10 text-indigo-400'
        : 'bg-teal-500/10 text-teal-400';
    const inactiveClasses = 'text-gray-400 hover:bg-white/5 hover:text-gray-200';

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn('flex-shrink-0 p-4 pb-2', isSmall && 'flex justify-center p-3')}>
                {isSmall ? (collapsedLogo || logo) : logo}
            </div>

            {/* CTA */}
            {cta && (
                <div className={cn('px-3 pb-3', isSmall && 'px-2')}>
                    <Link
                        href={cta.href}
                        className={cn(
                            'flex items-center justify-center py-2.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200',
                            isSmall ? 'px-0 w-10 h-10 mx-auto' : 'w-full px-4',
                            accentColor === 'rose' ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-600/30' :
                            accentColor === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-600/30' :
                            'bg-gradient-to-r from-teal-400 to-teal-500 shadow-teal-500/30'
                        )}
                        onMouseEnter={e => showTooltip(t(cta.label), e.currentTarget)}
                        onMouseLeave={hideTooltip}
                    >
                        <svg className={cn('w-5 h-5 flex-shrink-0', !isSmall && 'mr-2')} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {!isSmall && t(cta.label)}
                    </Link>
                </div>
            )}

            {/* Nav */}
            <nav className={cn('flex-1 overflow-y-auto space-y-0.5 scrollbar-thin', isSmall ? 'px-2' : 'px-3')}>
                {items.map((item, i) => {
                    if (item.type === 'section') {
                        if (isSmall) return <div key={`s-${i}`} className="pt-3 pb-1"><div className="border-t border-white/5" /></div>;
                        return (
                            <div key={`s-${i}`} className="pt-4 pb-1 px-3">
                                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">{t(item.label)}</p>
                            </div>
                        );
                    }
                    const isActive = item.match ? currentPath.startsWith(item.match) : currentPath === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href || '#'}
                            className={cn(
                                'flex items-center rounded-lg text-sm font-medium transition-all duration-150',
                                isSmall ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2.5',
                                isActive ? activeClasses : inactiveClasses
                            )}
                            onMouseEnter={e => showTooltip(t(item.label), e.currentTarget)}
                            onMouseLeave={hideTooltip}
                        >
                            {item.icon && (
                                <svg className={cn('w-[18px] h-[18px] flex-shrink-0', !isSmall && 'mr-3')} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            )}
                            {!isSmall && t(item.label)}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {isSmall ? (collapsedFooter || null) : (footer && <div className="flex-shrink-0">{footer}</div>)}

            {/* Tooltip portal */}
            {isSmall && tooltip && <Tooltip text={tooltip.text} anchor={tooltip.rect} />}
        </div>
    );
}
