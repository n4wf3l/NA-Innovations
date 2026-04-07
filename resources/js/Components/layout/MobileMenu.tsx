import { Link } from '@inertiajs/react';
import { NavItem } from './Sidebar';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
    const [render, setRender] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (open) {
            setClosing(false);
            setRender(true);
        } else if (render) {
            setClosing(true);
            const to = setTimeout(() => { setRender(false); setClosing(false); }, 450);
            return () => clearTimeout(to);
        }
    }, [open]);

    useEffect(() => {
        if (render) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [render]);

    if (!render || typeof document === 'undefined') return null;

    const accentGradient =
        accentColor === 'rose' ? 'linear-gradient(135deg, #f43f5e, #db2777)' :
        accentColor === 'indigo' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' :
        'linear-gradient(135deg, #14b8a6, #0d9488)';

    const accentGlow =
        accentColor === 'rose' ? 'rgba(244, 63, 94, 0.45)' :
        accentColor === 'indigo' ? 'rgba(99, 102, 241, 0.45)' :
        'rgba(20, 184, 166, 0.45)';

    const navLinks = items.filter(i => i.type === 'link');

    // Each item gets a staggered slide-in (or fast slide-out on close)
    const itemStyle = (delay: number): React.CSSProperties => ({
        animation: closing
            ? `mm-out 280ms cubic-bezier(0.4, 0, 1, 1) forwards`
            : `mm-in 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms forwards`,
        opacity: 0,
        willChange: 'transform, opacity',
    });

    return createPortal((
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
            }}
            className="lg:hidden"
        >
            <style>{`
                @keyframes mm-backdrop-in {
                    from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
                }
                @keyframes mm-backdrop-out {
                    from { opacity: 1; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
                    to { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
                }
                @keyframes mm-in {
                    0% { opacity: 0; transform: translateY(28px) scale(0.96); filter: blur(8px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes mm-out {
                    0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                    100% { opacity: 0; transform: translateY(20px) scale(0.97); filter: blur(6px); }
                }
                @keyframes mm-glow-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.08); }
                }
                @keyframes mm-orb-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(40px, -30px) scale(1.15); }
                }
                @keyframes mm-orb-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-50px, 40px) scale(1.2); }
                }
            `}</style>

            {/* Backdrop sombre flouté */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 8, 16, 0.85)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    animation: closing
                        ? 'mm-backdrop-out 350ms ease-out forwards'
                        : 'mm-backdrop-in 400ms ease-out forwards',
                }}
            />

            {/* Orbes lumineuses en arrière-plan (pour l'ambiance) */}
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: accentGradient,
                    filter: 'blur(80px)',
                    opacity: 0.25,
                    animation: 'mm-orb-1 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: accentGradient,
                    filter: 'blur(100px)',
                    opacity: 0.2,
                    animation: 'mm-orb-2 10s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* Contenu */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4rem 2rem 3rem',
                    color: '#ffffff',
                }}
            >
                {/* Bouton fermer */}
                <button
                    onClick={onClose}
                    aria-label={t('Fermer')}
                    style={{
                        ...itemStyle(0),
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 200ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'rotate(0)'; }}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Avatar utilisateur avec halo animé */}
                <div style={{ ...itemStyle(60), marginBottom: '2.5rem', textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 1rem' }}>
                        {/* Halo */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: '-10px',
                                borderRadius: '50%',
                                background: accentGradient,
                                filter: 'blur(20px)',
                                opacity: 0.6,
                                animation: 'mm-glow-pulse 3s ease-in-out infinite',
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                width: '88px',
                                height: '88px',
                                borderRadius: '24px',
                                background: accentGradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontSize: '2rem',
                                fontWeight: 900,
                                boxShadow: `0 20px 60px ${accentGlow}`,
                            }}
                        >
                            {userInitial || 'U'}
                        </div>
                    </div>
                    <p style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: 700, margin: 0, letterSpacing: '0.01em' }}>{userName}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('Connecté')}</p>
                </div>

                {/* CTA */}
                {cta && (
                    <Link
                        href={cta.href}
                        onClick={onClose}
                        style={{
                            ...itemStyle(140),
                            display: 'block',
                            width: '100%',
                            maxWidth: '20rem',
                            padding: '1rem 1.5rem',
                            borderRadius: '1rem',
                            background: accentGradient,
                            color: '#ffffff',
                            fontSize: '1rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            boxShadow: `0 12px 40px ${accentGlow}`,
                            marginBottom: '2rem',
                            textDecoration: 'none',
                            letterSpacing: '0.01em',
                        }}
                    >
                        + {t(cta.label)}
                    </Link>
                )}

                {/* Liens nav */}
                <nav style={{ width: '100%', maxWidth: '20rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navLinks.map((item, idx) => {
                        const isActive = item.match ? currentPath.startsWith(item.match) : currentPath === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                onClick={onClose}
                                style={{
                                    ...itemStyle(220 + idx * 60),
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.875rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '1rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    textDecoration: 'none',
                                    transition: 'background 200ms, border-color 200ms, transform 200ms',
                                }}
                            >
                                {item.icon && (
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: isActive ? accentGradient : 'rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} style={{ color: '#ffffff' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                )}
                                <span style={{ flex: 1, color: '#ffffff' }}>{t(item.label)}</span>
                                {isActive && (
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: `0 0 12px #ffffff` }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bas - liens secondaires */}
                <div style={{ ...itemStyle(220 + navLinks.length * 60 + 80), marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <a href="/" target="_blank" onClick={onClose} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>
                        {t('Voir le site')}
                    </a>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <form method="POST" action="/logout" style={{ display: 'inline' }}>
                        <input type="hidden" name="_token" value={typeof document !== 'undefined' ? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' : ''} />
                        <button type="submit" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            {t('Déconnexion')}
                        </button>
                    </form>
                </div>

                {/* Sélecteur langue */}
                <div style={{
                    ...itemStyle(220 + navLinks.length * 60 + 140),
                    marginTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.875rem',
                    padding: '0.25rem',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}>
                    {['en', 'fr', 'nl'].map(code => (
                        <a
                            key={code}
                            href={`/locale/${code}`}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                borderRadius: '0.625rem',
                                color: '#ffffff',
                                textDecoration: 'none',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {code.toUpperCase()}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    ), document.body);
}
