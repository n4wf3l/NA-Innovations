import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const themes: Record<string, { bg1: string; bg2: string; accent: string; words: string[] }> = {
    admin: {
        bg1: '#0d9488', bg2: '#06b6d4', accent: '#5eead4',
        words: ['DASHBOARD', 'ADMIN', 'MANAGE', 'BUILD'],
    },
    client: {
        bg1: '#0d9488', bg2: '#10b981', accent: '#6ee7b7',
        words: ['PROJECTS', 'PORTAL', 'TRACK', 'CLIENT'],
    },
    referral_partner: {
        bg1: '#e11d48', bg2: '#f43f5e', accent: '#fda4af',
        words: ['PARTNER', 'EARN', 'REFER', 'GROW'],
    },
    developer: {
        bg1: '#4f46e5', bg2: '#7c3aed', accent: '#a5b4fc',
        words: ['CODE', 'BUILD', 'SHIP', 'DEV'],
    },
};

export default function LoginSplash() {
    const { auth, flash } = usePage<PageProps>().props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const isLogin = !!(flash?.success?.includes('Bienvenue'));
    const role = auth.user?.role || 'client';
    const theme = themes[role] || themes.client;
    const name = (auth.user?.name || '').split(' ')[0];

    // Synchronous init - must show BEFORE first paint
    const shouldShow = isLogin && (typeof window === 'undefined' || !sessionStorage.getItem('login_splash_active'));

    const [show, setShow] = useState(shouldShow);
    const [phase, setPhase] = useState(shouldShow ? 1 : 0);

    // Freeze dashboard animations while splash is active
    useEffect(() => {
        if (!shouldShow) return;
        document.body.classList.add('splash-active');
        document.body.classList.remove('splash-done');
        sessionStorage.setItem('login_splash_active', '1');

        const t1 = setTimeout(() => setPhase(2), 400);
        const t2 = setTimeout(() => setPhase(3), 2000);
        const t3 = setTimeout(() => {
            setShow(false);
            document.body.classList.remove('splash-active');
            document.body.classList.add('splash-done');
            sessionStorage.removeItem('login_splash_active');
            // Clean up splash-done after animations complete
            setTimeout(() => document.body.classList.remove('splash-done'), 1500);
        }, 2600);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    // Particle canvas
    useEffect(() => {
        if (!show || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                r: Math.random() * 2 + 0.5,
                a: Math.random() * 0.5 + 0.1,
            });
        }

        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                ctx.fill();
            });
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, [show]);

    if (!show) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-500 ease-out ${phase === 3 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            style={{ background: `linear-gradient(135deg, #0b0f19 0%, #111827 50%, #0b0f19 100%)` }}
        >
            <style>{`
                @keyframes sReveal {
                    0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(20px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes sLine {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
                @keyframes sLabel {
                    0% { opacity: 0; letter-spacing: 12px; }
                    100% { opacity: 1; letter-spacing: 6px; }
                }
                @keyframes sDot {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes sOrbit {
                    from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
                }
            `}</style>

            {/* Particle canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 45%, ${theme.bg1}25 0%, transparent 55%)`,
            }} />

            {/* Background words */}
            {theme.words.map((word, i) => (
                <span key={i} className="absolute text-white/[0.015] font-black select-none pointer-events-none"
                    style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: `clamp(4rem, ${10 + i * 4}vw, 16rem)`,
                        top: `${10 + i * 22}%`, left: `${5 + i * 18}%`,
                        transform: `rotate(${-8 + i * 4}deg)`,
                    }}
                >{word}</span>
            ))}

            {/* Center */}
            <div className="relative text-center z-10">
                {/* Orbiting dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ animation: phase >= 1 ? 'sOrbit 4s linear infinite' : 'none' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 12px ${theme.accent}` }} />
                </div>

                {/* Pulsing ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border pointer-events-none"
                    style={{ borderColor: `${theme.accent}30`, animation: 'sDot 2.5s ease-out infinite' }} />

                {/* Name */}
                <h1 className="text-6xl sm:text-8xl font-black text-white mb-1"
                    style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: '4px',
                        animation: phase >= 2 ? 'sReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                        opacity: phase >= 2 ? undefined : 0,
                    }}
                >{name}</h1>

                {/* Accent line */}
                <div className="flex justify-center mb-5">
                    <div className="h-[2px] w-24 rounded-full origin-center"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                            animation: phase >= 2 ? 'sLine 0.6s ease-out 0.3s forwards' : 'none',
                            transform: phase >= 2 ? undefined : 'scaleX(0)',
                        }}
                    />
                </div>

                {/* Role label */}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[6px]"
                    style={{
                        color: theme.accent,
                        animation: phase >= 2 ? 'sLabel 0.8s ease-out 0.5s forwards' : 'none',
                        opacity: phase >= 2 ? undefined : 0,
                    }}
                >
                    {role === 'admin' ? 'Admin Panel' : role === 'referral_partner' ? 'Partner Portal' : role === 'developer' ? 'Dev Portal' : 'Client Portal'}
                </p>
            </div>
        </div>,
        document.body
    );
}
