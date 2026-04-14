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
    match?: string | string[];
    tourId?: string;
    badge?: number;
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
    tooltipSide?: 'right' | 'left';
    onOpenCustomizer?: () => void;
    sidebarStyle?: string;
}

function Tooltip({ text, anchor, side = 'right' }: { text: string; anchor: DOMRect | null; side?: 'right' | 'left' }) {
    if (!anchor) return null;
    const isLeft = side === 'left';
    return createPortal(
        <div
            className="fixed z-[99999] pointer-events-none"
            style={{
                top: anchor.top + anchor.height / 2,
                ...(isLeft
                    ? { right: window.innerWidth - anchor.left + 12, transform: 'translateY(-50%)' }
                    : { left: anchor.right + 12, transform: 'translateY(-50%)' }
                ),
            }}
        >
            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl whitespace-nowrap animate-fade-in flex items-center relative">
                {isLeft ? (
                    <svg className="w-2 h-2 text-slate-800 absolute -right-[5px] top-1/2 -translate-y-1/2" viewBox="0 0 6 10" fill="currentColor">
                        <path d="M0 0l6 5-6 5z" />
                    </svg>
                ) : (
                    <svg className="w-2 h-2 text-slate-800 absolute -left-[5px] top-1/2 -translate-y-1/2" viewBox="0 0 6 10" fill="currentColor">
                        <path d="M6 0L0 5l6 5z" />
                    </svg>
                )}
                {text}
            </div>
        </div>,
        document.body
    );
}

export default function Sidebar({ items, logo, collapsedLogo, footer, collapsedFooter, cta, accentColor, currentPath, collapsed, hovered, tooltipSide = 'right', onOpenCustomizer, sidebarStyle = 'default' }: SidebarProps) {
    const { t } = useTranslation();
    const isSmall = collapsed && !hovered;
    const [tooltip, setTooltip] = useState<{ text: string; rect: DOMRect } | null>(null);

    const showTooltip = useCallback((text: string, el: HTMLElement) => {
        if (!isSmall) return;
        setTooltip({ text, rect: el.getBoundingClientRect() });
    }, [isSmall]);

    const hideTooltip = useCallback(() => setTooltip(null), []);

    const accentMap: Record<string, string> = {
        teal: 'bg-teal-500/10 text-teal-400',
        blue: 'bg-blue-500/10 text-blue-400',
        purple: 'bg-purple-500/10 text-purple-400',
        rose: 'bg-rose-500/10 text-rose-400',
        amber: 'bg-amber-500/10 text-amber-400',
        emerald: 'bg-emerald-500/10 text-emerald-400',
        indigo: 'bg-indigo-500/10 text-indigo-400',
        cyan: 'bg-cyan-500/10 text-cyan-400',
        orange: 'bg-orange-500/10 text-orange-400',
    };
    const activeClasses = accentMap[accentColor] || 'bg-teal-500/10 text-teal-400';
    const inactiveClasses = 'text-gray-400 hover:bg-white/5 hover:text-gray-200';

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn('flex-shrink-0 p-4 pb-2', isSmall && 'flex justify-center p-3')}>
                {isSmall ? (collapsedLogo || logo) : logo}
            </div>

            {/* CTA */}
            {cta && (
                <div className={cn('px-3 pb-3', isSmall && 'px-2')} data-tour="sidebar-cta">
                    <Link
                        href={cta.href}
                        className={cn(
                            'flex items-center justify-center py-2.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200',
                            isSmall ? 'px-0 w-10 h-10 mx-auto' : 'w-full px-4',
                            {
                                teal: 'bg-gradient-to-r from-teal-400 to-teal-500 shadow-teal-500/30',
                                blue: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-600/30',
                                purple: 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-600/30',
                                rose: 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-600/30',
                                amber: 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-600/30',
                                emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-600/30',
                                indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-600/30',
                                cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-cyan-600/30',
                                orange: 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-600/30',
                            }[accentColor] || 'bg-gradient-to-r from-teal-400 to-teal-500 shadow-teal-500/30'
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
            <nav className={cn(
                'flex-1 overflow-y-auto scrollbar-thin',
                isSmall ? 'px-2 space-y-0.5' : sidebarStyle === 'compact' ? 'px-2 space-y-px' : sidebarStyle === 'minimal' ? 'px-2 space-y-0' : 'px-3 space-y-0.5'
            )}>
                {items.map((item, i) => {
                    if (item.type === 'section') {
                        if (isSmall) return <div key={`s-${i}`} className="pt-3 pb-1"><div className="border-t border-white/5" /></div>;
                        if (sidebarStyle === 'minimal') return <div key={`s-${i}`} className="pt-3 pb-0.5"><div className="border-t border-white/5" /></div>;
                        return (
                            <div key={`s-${i}`} className={sidebarStyle === 'compact' ? 'pt-3 pb-0.5 px-3' : 'pt-4 pb-1 px-3'}>
                                <p className={cn('font-semibold text-gray-600 uppercase tracking-wider', sidebarStyle === 'compact' ? 'text-[10px]' : 'text-[11px]')}>{t(item.label)}</p>
                            </div>
                        );
                    }
                    const isActive = item.match
                        ? (Array.isArray(item.match)
                            ? item.match.some(m => currentPath.startsWith(m))
                            : currentPath.startsWith(item.match))
                        : currentPath === item.href;
                    const linkPadding = isSmall ? 'justify-center w-10 h-10 mx-auto p-0'
                        : sidebarStyle === 'compact' ? 'px-2.5 py-1.5'
                        : sidebarStyle === 'minimal' ? 'px-2.5 py-1'
                        : 'px-3 py-2.5';
                    const textSize = sidebarStyle === 'compact' ? 'text-xs' : sidebarStyle === 'minimal' ? 'text-xs' : 'text-sm';
                    const iconSize = sidebarStyle === 'compact' ? 'w-4 h-4' : sidebarStyle === 'minimal' ? 'w-3.5 h-3.5' : 'w-[18px] h-[18px]';
                    const iconGap = sidebarStyle === 'minimal' ? 'mr-2' : 'mr-3';

                    return (
                        <Link
                            key={item.label}
                            href={item.href || '#'}
                            {...(item.tourId ? { 'data-tour': item.tourId } : {})}
                            className={cn(
                                'relative flex items-center rounded-lg font-medium transition-all duration-150',
                                textSize,
                                linkPadding,
                                isActive ? activeClasses : inactiveClasses
                            )}
                            onMouseEnter={e => showTooltip(t(item.label), e.currentTarget)}
                            onMouseLeave={hideTooltip}
                        >
                            {item.icon && (
                                <svg className={cn(iconSize, 'flex-shrink-0', !isSmall && iconGap)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            )}
                            {!isSmall && <span className="flex-1">{t(item.label)}</span>}
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className={cn(
                                    'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold',
                                    isSmall && 'absolute top-1 right-1 min-w-[14px] h-[14px] text-[9px]'
                                )}>
                                    {item.badge > 99 ? '99+' : item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Customize button */}
            {onOpenCustomizer && (
                <div className={cn('flex-shrink-0 px-3 py-2', isSmall && 'px-2')}>
                    <button
                        onClick={onOpenCustomizer}
                        className={cn(
                            'flex items-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-150 w-full',
                            isSmall ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                        )}
                        onMouseEnter={e => showTooltip(t('Personnaliser'), e.currentTarget)}
                        onMouseLeave={hideTooltip}
                    >
                        <svg className={cn('w-[18px] h-[18px] flex-shrink-0', !isSmall && 'mr-3')} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {!isSmall && <span className="text-sm">{t('Personnaliser')}</span>}
                    </button>
                </div>
            )}

            {/* Footer */}
            {isSmall ? (collapsedFooter || null) : (footer && <div className="flex-shrink-0">{footer}</div>)}

            {/* Tooltip portal */}
            {isSmall && tooltip && <Tooltip text={tooltip.text} anchor={tooltip.rect} side={tooltipSide} />}
        </div>
    );
}
