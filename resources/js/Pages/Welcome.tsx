import { Head, Link, usePage } from '@inertiajs/react';
import SpinnerLink from '@/Components/landing/SpinnerLink';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import AdminEditButton from '@/Components/landing/AdminEditButton';
import HeroSection from '@/Components/landing/HeroSection';
import StatsSection from '@/Components/landing/StatsSection';
import PortfolioSection from '@/Components/landing/PortfolioSection';
import TestimonialsSection from '@/Components/landing/TestimonialsSection';
import FooterSection from '@/Components/landing/FooterSection';
import WhatsAppButton from '@/Components/landing/WhatsAppButton';
import { ChatModal } from '@/Components/landing/ChatWidget';
import SectionNav from '@/Components/landing/SectionNav';
import ScrollNextButton from '@/Components/landing/ScrollNextButton';

interface PortfolioProject {
    id: number; title: string; slug: string; client_name: string; client_logo: string | null;
    excerpt: string; category: string | null; tech_stack: string[]; tags: string[];
    live_url: string | null; is_featured: boolean; duration_days: number | null;
    images: { id: number; image_path: string; alt_text: string; caption: string | null }[];
    projet?: { nom_societe: string; type_site: string; lieu: string; image: string | null };
}

interface Post {
    id: number; title: string; slug: string; subject: string; description: string;
    excerpt?: string; photo: string | null; cover_image?: string | null; image_url?: string | null;
    category?: string; reading_time?: number; author?: { id: number; name: string };
    published_at?: string; created_at: string;
}

interface PublicServiceData { id: number; title: string; description: string; icon: string; sort_order: number; is_active: boolean; }
interface LandingSectionData { id: number; section_key: string; title: string | null; subtitle: string | null; description: string | null; button_text: string | null; button_url: string | null; background_image: string | null; is_active: boolean; sort_order: number; metadata: Record<string, any> | null; }
interface Testimonial { text: string; author: string; role: string; project: string | null; logo: string | null; }
interface FaqData { id: number; question: string; answer: string; category: string | null; sort_order: number; is_active: boolean; }

interface Props {
    portfolio: PortfolioProject[]; messages: string[]; latestPosts: Post[];
    socialLinks: Record<string, string>; branding: { logo_path: string; company_name: string; tagline: string };
    services: PublicServiceData[]; landingSections?: Record<string, LandingSectionData>;
    testimonials?: Testimonial[]; faqs?: FaqData[];
    publicStats?: { projects_delivered: number; active_clients: number; technologies: number; years_experience: number };
    seo?: { title: string; description: string };
    videoUrl?: string;
}

const socialIcons: Record<string, JSX.Element> = {
    instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    tiktok: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
};

function timeAgo(dateString: string): string {
    const date = new Date(dateString); const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24); if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30); if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

function truncate(text: string, maxLength: number): string {
    const stripped = text.replace(/<[^>]*>/g, '');
    return stripped.length <= maxLength ? stripped : stripped.substring(0, maxLength) + '...';
}

function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
        }, { threshold: 0.1, ...options });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return { ref, isVisible };
}

function SplashScreen({ branding, onComplete }: { branding: { logo_path: string; company_name: string }; onComplete: (locale: string) => void }) {
    const [phase, setPhase] = useState<'intro' | 'reveal' | 'language' | 'exit'>('intro');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Particle system
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number }[] = [];
        const cx = canvas.width / 2, cy = canvas.height / 2;

        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 0.8;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 2, alpha: 0, life: Math.random(),
            });
        }

        let frame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life += 0.003;
                p.alpha = Math.sin(p.life * Math.PI) * 0.4;
                if (p.life > 1) { p.life = 0; p.x = cx; p.y = cy; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(94, 234, 212, ${p.alpha})`;
                ctx.fill();
            });
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    // Phase transitions
    useEffect(() => {
        const t1 = setTimeout(() => setPhase('reveal'), 600);
        const t2 = setTimeout(() => setPhase('language'), 2800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const handleSelect = (code: string) => {
        setPhase('exit');
        setTimeout(() => onComplete(code), 600);
    };

    const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

    return (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
             style={{ background: 'radial-gradient(ellipse at center, #111827 0%, #030712 100%)' }}>

            <style>{`
                @keyframes ringExpand {
                    0% { transform: scale(0); opacity: 0.6; }
                    100% { transform: scale(4); opacity: 0; }
                }
                @keyframes logoEntry {
                    0% { opacity: 0; transform: scale(0) rotate(-180deg); }
                    50% { opacity: 1; transform: scale(1.15) rotate(10deg); }
                    70% { transform: scale(0.9) rotate(-5deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes nameReveal {
                    0% { opacity: 0; clip-path: inset(0 100% 0 0); }
                    100% { opacity: 1; clip-path: inset(0 0% 0 0); }
                }
                @keyframes taglineIn {
                    0% { opacity: 0; transform: translateY(8px); }
                    100% { opacity: 0.5; transform: translateY(0); }
                }
                @keyframes lineGrow {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
                @keyframes langCardIn {
                    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes subtitleFade {
                    0% { opacity: 0; letter-spacing: 12px; }
                    100% { opacity: 0.4; letter-spacing: 4px; }
                }
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>

            {/* Particle canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Expanding ring on entry */}
            {phase !== 'intro' && (
                <div className="absolute pointer-events-none" style={{
                    width: 120, height: 120, borderRadius: '50%',
                    border: '2px solid rgba(94,234,212,0.3)',
                    animation: 'ringExpand 2s ease-out forwards',
                }} />
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Logo — always visible after intro */}
                <div className={`transition-all duration-700 ${phase === 'language' ? 'mb-8' : 'mb-0'}`}
                     style={{
                         animation: phase !== 'intro' ? 'logoEntry 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                         opacity: phase === 'intro' ? 0 : undefined,
                         transform: phase === 'language' ? 'scale(0.7)' : undefined,
                     }}>
                    <div className="relative" style={{ animation: phase === 'reveal' ? 'floatSlow 3s ease-in-out infinite' : 'none' }}>
                        {branding.logo_path ? (
                            <img src={`/storage/${branding.logo_path}`} alt="" className="w-32 h-32 object-contain drop-shadow-[0_0_40px_rgba(94,234,212,0.3)]" />
                        ) : (
                            <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-500 rounded-[28px] flex items-center justify-center shadow-[0_0_60px_rgba(94,234,212,0.25)]" style={bebas}>
                                <span className="text-gray-900 text-6xl font-bold tracking-tight">NA</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Company name + tagline — visible in reveal phase */}
                <div className={`text-center transition-all duration-700 ${phase === 'language' ? 'opacity-0 -translate-y-4 absolute pointer-events-none' : ''}`}>
                    {phase !== 'intro' && (
                        <>
                            <h1 className="text-white text-4xl sm:text-5xl font-bold mt-8" style={{
                                ...bebas, letterSpacing: '6px',
                                animation: 'nameReveal 0.8s ease-out 0.6s both',
                            }}>
                                {branding.company_name}
                            </h1>
                            <div className="mx-auto mt-4 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" style={{
                                width: 200, transformOrigin: 'center',
                                animation: 'lineGrow 0.6s ease-out 1.2s both',
                            }} />
                            <p className="text-white mt-4 text-sm tracking-widest uppercase" style={{
                                ...bebas, animation: 'subtitleFade 0.8s ease-out 1.6s both',
                            }}>
                                {t('Web Development & Digital Solutions')}
                            </p>
                        </>
                    )}
                </div>

                {/* Language selection — visible in language phase */}
                <div className={`transition-all duration-700 ${phase === 'language' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute'}`}>
                    <p className="text-white/30 text-xs text-center mb-8 tracking-[0.2em] uppercase" style={bebas}>
                        {t('Select your language')}
                    </p>
                    <div className="flex gap-5">
                        {[
                            { code: 'en', label: 'English', sub: 'EN' },
                            { code: 'fr', label: 'Fran\u00e7ais', sub: 'FR' },
                            { code: 'nl', label: 'Nederlands', sub: 'NL' },
                        ].map((lang, i) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className="group relative flex flex-col items-center gap-4 w-32 py-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm cursor-pointer transition-all duration-500 hover:border-teal-400/40 hover:bg-teal-400/[0.06] hover:shadow-[0_0_40px_rgba(94,234,212,0.1)] hover:-translate-y-1 active:scale-95"
                                style={{ animation: phase === 'language' ? `langCardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 + i * 0.12}s both` : 'none' }}
                            >
                                <span className="text-4xl font-black text-white/[0.08] group-hover:text-teal-400/60 transition-all duration-500 group-hover:scale-110" style={bebas}>
                                    {lang.sub}
                                </span>
                                <span className="text-[13px] font-medium text-white/40 group-hover:text-white transition-colors duration-300">
                                    {lang.label}
                                </span>
                                {/* Hover bottom line */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-teal-400 rounded-full transition-all duration-500 w-0 group-hover:w-12" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom copyright */}
            <p className="absolute bottom-6 text-white/10 text-[10px] tracking-widest uppercase" style={bebas}>
                {branding.company_name}
            </p>
        </div>
    );
}

function TypewriterText() {
    const { t } = useTranslation();
    const phrases = [
        t('Ne cherchez plus, demandez directement ici'),
        t('Combien coûte un site web ?'),
        t('Quelles technologies utilisez-vous ?'),
        t('Pouvez-vous créer une application mobile ?'),
    ];
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const phrase = phrases[currentPhraseIndex];

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, 2000);
            return () => clearTimeout(pauseTimer);
        }

        if (isDeleting) {
            if (displayText.length === 0) {
                setIsDeleting(false);
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                return;
            }
            const timer = setTimeout(() => {
                setDisplayText(displayText.slice(0, -1));
            }, 25);
            return () => clearTimeout(timer);
        }

        if (displayText.length === phrase.length) {
            setIsPaused(true);
            return;
        }

        const timer = setTimeout(() => {
            setDisplayText(phrase.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, isPaused, currentPhraseIndex]);

    return (
        <h2 className="text-2xl md:text-4xl font-bold text-white min-h-[3rem] md:min-h-[3.5rem]">
            {displayText}
            <span className="inline-block w-[3px] h-[1em] bg-teal-400 ml-1 align-middle" style={{ animation: 'blink 1s step-end infinite' }} />
        </h2>
    );
}

function AIAssistantSection({ onOpenChat }: { onOpenChat: () => void }) {
    const { t } = useTranslation();
    return (
        <section className="flex-1 flex flex-col justify-center py-16 bg-gray-900 relative overflow-hidden">
            <style>{`
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                @keyframes aiGlow { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.06; } }
            `}</style>
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" style={{ animation: 'aiGlow 4s ease-in-out infinite' }} />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" style={{ animation: 'aiGlow 4s ease-in-out infinite 2s' }} />
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-400/10 border border-teal-400/20 rounded-full mb-6">
                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span className="text-teal-400 text-xs font-medium uppercase tracking-wider">{t('Assistant IA')}</span>
                </div>

                {/* Typing animation text */}
                <TypewriterText />

                {/* Fake input that opens modal */}
                <div
                    onClick={onOpenChat}
                    className="mt-8 max-w-2xl mx-auto cursor-pointer group"
                >
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(94,234,212,0.08)]">
                        <svg className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <span className="text-gray-500 text-left flex-1 text-sm md:text-base">{t('Posez une question sur nos services...')}</span>
                        <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg font-medium">AI</span>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-600">{t('3 questions gratuites par jour')}</p>

                {/* Scroll arrow handled by fixed global ScrollNextButton */}
            </div>
        </section>
    );
}

export default function Welcome({ portfolio, messages, latestPosts, socialLinks = {}, branding = { logo_path: '', company_name: 'NA Innovations', tagline: '' }, services = [], landingSections = {}, testimonials = [], faqs = [], publicStats, seo, videoUrl }: Props) {
    const { auth, locale } = usePage<{ auth: { user: { id: number } | null }; locale: string }>().props;
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatAvailable, setChatAvailable] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check chatbot availability
    useEffect(() => {
        fetch('/api/chatbot/status')
            .then(r => r.json())
            .then(data => setChatAvailable(data.available))
            .catch(() => setChatAvailable(false));
    }, []);

    const portfolioSection = useInView();
    const statsSection = useInView();
    const testimonialsSection = useInView();

    // Splash screen — only on first visit
    const [showSplash, setShowSplash] = useState(() => {
        if (typeof window === 'undefined') return false;
        return !localStorage.getItem('na_splash_seen');
    });

    const handleSplashComplete = (selectedLocale: string) => {
        localStorage.setItem('na_splash_seen', '1');
        setShowSplash(false);
        // Switch locale if different
        if (selectedLocale !== locale) {
            window.location.href = `/locale/${selectedLocale}`;
        }
    };

    const heroSection = landingSections['hero'];
    const ctaSection = landingSections['cta'];

    const navLinks = [
        { href: '/', label: t('Home') },
        { href: '/services', label: t('Services') },
        { href: '/projects', label: t('Projects') },
        { href: '/products', label: t('Products') },
        { href: '/pricing', label: t('Pricing') },
        { href: '/posts', label: t('News') },
        { href: '/about', label: t('About') },
        { href: '/contact', label: t('Free Quote') },
    ];

    const featuredProjects = portfolio.filter(p => p.is_featured);
    const regularProjects = portfolio.filter(p => !p.is_featured);

    return (
        <>
            {showSplash && <SplashScreen branding={branding} onComplete={handleSplashComplete} />}

            <Head title={seo?.title || branding.company_name}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
                {seo?.description && <meta name="description" content={seo.description} />}
            </Head>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                @keyframes floatWord1 { 0%, 100% { transform: translate(0, 0) rotate(-5deg); } 50% { transform: translate(30px, -20px) rotate(2deg); } }
                @keyframes floatWord2 { 0%, 100% { transform: translate(0, 0) rotate(3deg); } 50% { transform: translate(-20px, 30px) rotate(-3deg); } }
                @keyframes floatWord3 { 0%, 100% { transform: translate(0, 0) rotate(-2deg); } 50% { transform: translate(25px, 15px) rotate(4deg); } }
                @keyframes floatWord4 { 0%, 100% { transform: translate(0, 0) rotate(4deg); } 50% { transform: translate(-15px, -25px) rotate(-2deg); } }
                @keyframes floatWord5 { 0%, 100% { transform: translate(0, 0) rotate(-3deg); } 50% { transform: translate(20px, 20px) rotate(3deg); } }
                @keyframes floatWord6 { 0%, 100% { transform: translate(0, 0) rotate(2deg); } 50% { transform: translate(-25px, -15px) rotate(-4deg); } }
                @keyframes floatWord7 { 0%, 100% { transform: translate(0, 0) rotate(-4deg); } 50% { transform: translate(15px, 25px) rotate(2deg); } }
                @keyframes floatWord8 { 0%, 100% { transform: translate(0, 0) rotate(3deg); } 50% { transform: translate(-30px, 10px) rotate(-3deg); } }
                .hero-word { position: absolute; font-family: 'Bebas Neue', sans-serif; font-size: clamp(4rem, 15vw, 14rem); color: white; opacity: 0.03; white-space: nowrap; user-select: none; pointer-events: none; }
                .hero-word-1 { top: 5%; left: 10%; animation: floatWord1 12s ease-in-out infinite; }
                .hero-word-2 { top: 15%; right: 5%; animation: floatWord2 10s ease-in-out infinite; }
                .hero-word-3 { top: 35%; left: -5%; animation: floatWord3 14s ease-in-out infinite; }
                .hero-word-4 { top: 50%; right: 10%; animation: floatWord4 11s ease-in-out infinite; }
                .hero-word-5 { top: 65%; left: 15%; animation: floatWord5 13s ease-in-out infinite; }
                .hero-word-6 { top: 75%; right: -5%; animation: floatWord6 9s ease-in-out infinite; }
                .hero-word-7 { top: 85%; left: 5%; animation: floatWord7 15s ease-in-out infinite; }
                .hero-word-8 { bottom: 5%; right: 15%; animation: floatWord8 10s ease-in-out infinite; }
                @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .scroll-banner { display: flex; animation: scrollLeft 20s linear infinite; width: max-content; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in-up { animation: fadeInUp 0.7s ease-out forwards; opacity: 0; }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .scale-in { animation: scaleIn 0.5s ease-out forwards; opacity: 0; }
                @keyframes portfolioFadeIn { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
                .portfolio-card-animate { animation: portfolioFadeIn 0.8s ease-out forwards; opacity: 0; }
            `}</style>

            <HeroSection heroSection={heroSection} branding={branding} socialLinks={socialLinks} socialIcons={socialIcons} navLinks={navLinks} locale={locale} auth={auth} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* ═══ Second screen: Estimate + Stats + AI ═══ */}
            <div id="estimate-banner" className="min-h-screen flex flex-col">
                {/* Free Estimate Banner */}
                <div className="bg-gradient-to-r from-gray-100 via-teal-50 to-gray-100 dark:from-gray-900 dark:via-teal-900/40 dark:to-gray-900 border-y border-teal-200 dark:border-teal-500/20 py-3">
                    <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('Get a free estimate in 2 minutes')}</span>
                        <SpinnerLink href="/contact#simulator" className="inline-flex items-center gap-1.5 px-5 py-2 bg-teal-400 text-gray-900 text-sm font-bold rounded-full hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(94,234,212,0.2)] transition-all duration-300 bebas" style={{ letterSpacing: '1px' }}>
                            {t('Try our price simulator').toUpperCase()}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </SpinnerLink>
                    </div>
                </div>

                {/* Scrolling Messages Banner */}
                {messages.length > 0 && (
                    <div className="bg-teal-300 text-white text-3xl bebas overflow-hidden py-4" style={{ letterSpacing: '3px' }}>
                        <div className="scroll-banner">
                            {[...messages, ...messages].map((msg, i) => (<span key={i} className="mx-12 whitespace-nowrap">{msg}</span>))}
                        </div>
                    </div>
                )}

                {/* Presentation Video Section */}
                {videoUrl && (
                    <section className="py-20 bg-gray-900">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="text-center mb-10">
                                <h2 className="text-5xl font-bold text-white bebas" style={{ letterSpacing: '2px' }}>
                                    {t('Watch Our Story')}
                                </h2>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={videoUrl}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={t('Presentation video')}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Stats Section */}
                {publicStats && <StatsSection publicStats={publicStats} sectionRef={statsSection.ref as any} isVisible={statsSection.isVisible} />}

                {/* AI Assistant Section — fills remaining space */}
                {chatAvailable && <AIAssistantSection onOpenChat={() => setChatOpen(true)} />}
                {!chatAvailable && <div className="flex-1 bg-gray-900" />}
            </div>

            {/* Client logos band — infinite seamless scroll */}
            {(() => {
                const logos = portfolio
                    .filter(p => p.projet?.image)
                    .map(p => ({ name: p.projet?.nom_societe || p.title, image: p.projet!.image! }))
                    .filter((v, i, a) => a.findIndex(t => t.image === v.image) === i);

                if (logos.length < 3) return null;

                // Duplicate enough to fill any screen width seamlessly
                const repeatedLogos = [...logos, ...logos, ...logos, ...logos];

                return (
                    <section className="py-12 bg-gray-50 dark:bg-gray-800/50 overflow-hidden" data-section-theme="light">
                        <div className="max-w-6xl mx-auto px-4 mb-8">
                            <p className="text-center text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 bebas">{t('They Trust Us')}</p>
                        </div>
                        <style>{`
                            @keyframes logoScroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-${logos.length * (80 + 64)}px); }
                            }
                        `}</style>
                        <div className="relative w-full">
                            <div
                                className="flex items-center"
                                style={{
                                    animation: `logoScroll ${logos.length * 3}s linear infinite`,
                                    width: 'max-content',
                                }}
                            >
                                {repeatedLogos.map((logo, i) => (
                                    <div key={i} className="flex-shrink-0 px-8" style={{ width: 80 + 64 + 'px' }}>
                                        <img
                                            src={logo.image.startsWith('http') ? logo.image : `/storage/${logo.image}`}
                                            alt={logo.name}
                                            className="h-10 md:h-12 w-20 object-contain opacity-40 hover:opacity-100 transition-opacity duration-300 mx-auto"
                                            title={logo.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* Services Section */}
            {services.length > 0 && (
                <section id="section-services" className="py-20 bg-white dark:bg-gray-900 scroll-mt-2" data-section-theme="light">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-7xl md:text-9xl font-semibold text-black dark:text-white bebas" style={{ letterSpacing: '2px' }}>{t('Our Services')}</h2>
                            <hr className="mt-6 border-black/20 dark:border-white/20 max-w-md mx-auto" />
                            <OriginalLanguageBadge className="mt-4 justify-center" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <div key={service.id} className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-500 flex items-center justify-center mb-6">
                                        {service.icon === 'globe' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
                                        {service.icon === 'mobile' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
                                        {service.icon === 'server' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" /></svg>}
                                        {service.icon === 'code' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>}
                                        {service.icon === 'rocket' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>}
                                        {service.icon === 'shield' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t(service.title)}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t(service.description)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <SpinnerLink href="/services" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-full hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300 bebas" style={{ letterSpacing: '2px' }}>
                                {t('All Services').toUpperCase()}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </SpinnerLink>
                        </div>
                        <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{t('Not sure about the cost?')}</p>
                            <a href="/contact#simulator" className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-500 transition-colors">
                                {t('Get an instant estimate')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </a>
                        </div>

                        {/* Scroll arrow handled by fixed global ScrollNextButton */}
                    </div>
                </section>
            )}

            {/* Process — compact horizontal stepper */}
            {landingSections?.process?.is_active && (landingSections.process.metadata?.steps || []).length > 0 && (
                <section className="py-10 bg-gray-900 border-y border-white/5">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
                            {(landingSections.process.metadata.steps as { title: string; description: string }[]).map((step, i, arr) => (
                                <div key={i} className="flex items-center gap-0">
                                    <div className="flex flex-col items-center text-center px-5 py-2">
                                        <div className="w-10 h-10 rounded-full bg-teal-400 text-gray-900 flex items-center justify-center text-sm font-bold bebas mb-2">
                                            {i + 1}
                                        </div>
                                        <span className="text-xs font-bold text-white bebas" style={{ letterSpacing: '1px' }}>{t(step.title)}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className="hidden md:block w-16 h-px bg-gradient-to-r from-teal-400/40 to-white/10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio Section */}
            <PortfolioSection portfolio={portfolio} featuredProjects={featuredProjects} regularProjects={regularProjects} sectionRef={portfolioSection.ref as any} isVisible={portfolioSection.isVisible} />

            {/* Latest News Section */}
            {latestPosts.length > 0 && (
                <section id="section-news" className="py-20 bg-gray-100 dark:bg-gray-800 scroll-mt-2" data-section-theme="light">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-7xl md:text-9xl font-semibold text-black dark:text-white bebas" style={{ letterSpacing: '2px' }}>{t('Latest News')}</h2>
                            <hr className="mt-6 border-black/20 dark:border-white/20 max-w-md mx-auto" />
                            <OriginalLanguageBadge className="mt-4 justify-center" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.map((post) => (
                                <div key={post.id} className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                    <AdminEditButton href={`/admin/posts/${post.id}/edit`} className="!bg-black/30" />
                                    {post.image_url ? (
                                        <div className="overflow-hidden h-52"><img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                                    ) : post.photo ? (
                                        <div className="overflow-hidden h-52"><img src={`/storage/${post.photo}`} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                                    ) : (
                                        <div className="h-52 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">{post.category || post.subject || t('News')}</p>
                                            {post.reading_time && (<><span className="text-gray-300 dark:text-gray-600">·</span><span className="text-xs text-gray-400 dark:text-gray-500">{post.reading_time} min</span></>)}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">{post.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{truncate(post.excerpt || post.description, 120)}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {post.author && <span className="text-xs text-gray-500 dark:text-gray-400">{post.author.name}</span>}
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(post.published_at || post.created_at)}</span>
                                            </div>
                                            <Link href={`/posts/${post.slug || post.id}`} className="text-sm font-bold text-teal-500 hover:text-teal-600 flex items-center gap-1 transition-colors">
                                                {t('Read more')}
                                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link href="/posts" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-full hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300 bebas" style={{ letterSpacing: '2px' }}>
                                {t('View All Articles').toUpperCase()}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} sectionRef={testimonialsSection.ref as any} isVisible={testimonialsSection.isVisible} />}

            {/* FAQ Section */}
            {faqs.length > 0 && (
                <section className="py-20 bg-gray-100 dark:bg-gray-800">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-7xl md:text-9xl font-semibold text-black dark:text-white bebas" style={{ letterSpacing: '2px' }}>FAQ</h2>
                            <hr className="mt-6 border-black/20 dark:border-white/20 max-w-md mx-auto" />
                            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">{t('Frequently Asked Questions')}</p>
                            <OriginalLanguageBadge className="mt-3 justify-center" />
                        </div>
                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <div key={faq.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md">
                                    <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                                        <span className="text-gray-900 dark:text-white font-semibold pr-4">{faq.question}</span>
                                        <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed text-sm border-t border-gray-100 dark:border-gray-700 pt-4">{faq.answer}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Banner */}
            {(!ctaSection || ctaSection.is_active) && (
                <section id="section-cta" className="py-20 bg-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center" aria-hidden="true">
                        <span className="text-[20vw] font-bold text-white bebas whitespace-nowrap">GET STARTED</span>
                    </div>
                    <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
                        <OriginalLanguageBadge light className="mb-4 justify-center" />
                        <h2 className="text-5xl md:text-7xl font-bold text-white bebas mb-6" style={{ letterSpacing: '2px' }}>{ctaSection?.title || t('Ready to start your project?')}</h2>
                        <p className="text-lg text-gray-400 mb-10">{ctaSection?.subtitle || t('Tell us about your idea and we\'ll get back to you within 24 hours with a tailored proposal.')}</p>
                        <SpinnerLink href={ctaSection?.button_url || '/contact#quote'} className="inline-flex items-center gap-3 px-12 py-6 bg-teal-400 text-gray-900 text-2xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] bebas" style={{ letterSpacing: '3px' }}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                            {(ctaSection?.button_text || t('Request a Quote')).toUpperCase()}
                        </SpinnerLink>
                        <p className="mt-6 text-gray-500 text-sm">
                            <a href="/contact#simulator" className="text-teal-300 hover:text-teal-200 underline underline-offset-2 transition-colors">{t('Try our price simulator')}</a>
                        </p>
                    </div>
                </section>
            )}

            <FooterSection branding={branding} socialLinks={socialLinks} socialIcons={socialIcons} navLinks={navLinks} />

            {/* Fixed portal access */}
            <a href={auth?.user ? '/dashboard' : '/login'} className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-teal-300 hover:border-teal-300/30 hover:bg-gray-900 transition-all duration-300 group" title={auth?.user ? t('Dashboard') : t('Portal')}>
                {auth?.user ? (
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                ) : (
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                )}
            </a>

            {/* Scroll to top — bottom right, above WhatsApp */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-[136px] right-6 z-50 w-11 h-11 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-teal-300 hover:border-teal-300/30 hover:bg-gray-900 transition-all duration-500 group ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                title={t('Back to top')}
            >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
            </button>

            {/* Section navigator */}
            <ScrollNextButton />
            <SectionNav sections={[
                { id: 'ai-assistant', label: 'Assistant IA', highlight: true, onClick: () => setChatOpen(true) },
                { id: 'section-services', label: 'Our Services' },
                { id: 'section-portfolio', label: 'Our Work' },
                { id: 'section-news', label: 'Latest News' },
                { id: 'section-testimonials', label: 'Testimonials' },
            ]} />

            {/* WhatsApp floating button */}
            <WhatsAppButton phoneNumber={socialLinks.whatsapp || ''} />

            {/* AI Chat Modal */}
            <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
    );
}
