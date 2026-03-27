import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { NavItem } from './Sidebar';
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    items: NavItem[];
    cta?: { label: string; href: string };
    accentColor: string;
    currentPath: string;
    userName?: string;
    userInitial?: string;
}

export default function MobileMenu({ open, onClose, items, cta, accentColor, currentPath, userName, userInitial }: MobileMenuProps) {
    const { t } = useTranslation();
    if (!open) return null;

    const accentText = accentColor === 'rose' ? 'text-rose-400' : accentColor === 'indigo' ? 'text-indigo-400' : 'text-teal-400';
    const accentBg = accentColor === 'rose'
        ? 'from-rose-500 to-pink-600'
        : accentColor === 'indigo'
        ? 'from-indigo-500 to-indigo-600'
        : 'from-teal-400 to-teal-500';

    return (
        <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-12 animate-scale-in">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* User avatar */}
                <div className="mb-8 text-center">
                    <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br', accentBg)}>
                        <span className="text-white text-2xl font-black">{userInitial || 'U'}</span>
                    </div>
                    <p className="text-white text-lg font-semibold">{userName}</p>
                </div>

                {/* CTA */}
                {cta && (
                    <Link
                        href={cta.href}
                        onClick={onClose}
                        className={cn(
                            'w-full max-w-xs py-4 rounded-2xl text-white text-base font-bold text-center shadow-xl mb-8 transition-transform hover:scale-105 bg-gradient-to-r',
                            accentBg
                        )}
                    >
                        + {cta.label}
                    </Link>
                )}

                {/* Nav items */}
                <nav className="w-full max-w-xs space-y-2">
                    {items.filter(i => i.type === 'link').map(item => {
                        const isActive = item.match ? currentPath.startsWith(item.match) : currentPath === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center justify-center py-4 rounded-2xl text-lg font-semibold transition-all duration-200',
                                    isActive
                                        ? `bg-white/15 text-white`
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {item.icon && (
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                )}
                                {t(item.label)}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="mt-10 flex items-center space-x-6">
                    <a href="/" target="_blank" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        {t('View Site')}
                    </a>
                    <span className="text-gray-700">|</span>
                    <form method="POST" action="/logout" className="inline">
                        <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' : ''} />
                        <button type="submit" className="text-sm text-gray-500 hover:text-red-400 transition-colors">{t('Sign Out')}</button>
                    </form>
                </div>

                {/* Language */}
                <div className="mt-6 flex items-center space-x-1 bg-white/10 rounded-xl p-1">
                    {['en', 'fr', 'nl'].map(code => (
                        <a
                            key={code}
                            href={`/locale/${code}`}
                            className="px-4 py-2 text-sm font-bold rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            {code.toUpperCase()}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
