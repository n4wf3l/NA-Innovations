import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionNav from '@/Components/landing/SectionNav';
import { useSimulatorVisible } from '@/hooks/useIsEurope';

import {
    projectTypeOptions,
    designOptions,
    maintenanceOptions,
    timelineOptions,
    formatEUR,
    getFeaturesForType,
} from './Contact/SimulatorData';
import PriceSimulator from './Contact/PriceSimulator';
import QuoteForm from './Contact/QuoteForm';
import ContactForm from './Contact/ContactForm';

// ─── Types ───────────────────────────────────────────────────────

interface Props {
    projectTypes: Record<string, string>;
    turnstileSiteKey?: string;
    simulatorMode?: string;
}

// ─── Main Component ─────────────────────────────────────────────

export default function Contact({ projectTypes, turnstileSiteKey, simulatorMode = 'europe_only' }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const showSimulator = useSimulatorVisible(simulatorMode);
    const { flash, errors, brochure } = usePage<{ flash: { success?: string; error?: string }; errors: Record<string, string>; brochure?: { url: string; updated_at: string } }>().props;
    const [activeTab, setActiveTab] = useState<'simulator' | 'quote' | 'contact'>(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'simulator' || hash === 'quote' || hash === 'contact') return hash;
        }
        return 'quote'; // default to quote - simulator shown only if in Europe
    });
    // Referral code from URL or manual entry
    const [refCode, setRefCode] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') || '' : '');

    // Auto-scroll to tabs when arriving via anchor link
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.replace('#', '');
        if (hash === 'simulator' || hash === 'quote' || hash === 'contact' || hash === 'tabs') {
            setTimeout(() => {
                const el = document.getElementById('tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, []);

    const [turnstileToken, setTurnstileToken] = useState('');
    const turnstileRef = useRef<HTMLDivElement>(null);
    const turnstileWidgetId = useRef<string | null>(null);

    // ─── Turnstile ───────────────────────────────────────────────
    useEffect(() => {
        if (!turnstileSiteKey) return;
        if (document.querySelector('script[src*="turnstile"]')) return;
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
        script.async = true;
        document.head.appendChild(script);
    }, [turnstileSiteKey]);

    const renderTurnstile = useCallback(() => {
        if (!turnstileSiteKey || !turnstileRef.current) return;
        if (turnstileWidgetId.current) return;
        const w = window as any;
        if (!w.turnstile) return;
        turnstileWidgetId.current = w.turnstile.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => setTurnstileToken(token),
            'expired-callback': () => setTurnstileToken(''),
            theme: 'light',
        });
    }, [turnstileSiteKey]);

    useEffect(() => {
        (window as any).onTurnstileLoad = renderTurnstile;
        if ((window as any).turnstile) renderTurnstile();
    }, [renderTurnstile]);

    const resetTurnstile = () => {
        const w = window as any;
        if (w.turnstile && turnstileWidgetId.current) {
            w.turnstile.reset(turnstileWidgetId.current);
            setTurnstileToken('');
        }
    };

    useEffect(() => {
        const w = window as any;
        if (!turnstileSiteKey || !w.turnstile) return;
        if (turnstileWidgetId.current) {
            try { w.turnstile.remove(turnstileWidgetId.current); } catch {}
            turnstileWidgetId.current = null;
        }
        setTurnstileToken('');
        const timer = setTimeout(() => {
            if (turnstileRef.current) {
                turnstileWidgetId.current = w.turnstile.render(turnstileRef.current, {
                    sitekey: turnstileSiteKey,
                    callback: (token: string) => setTurnstileToken(token),
                    'expired-callback': () => setTurnstileToken(''),
                    theme: 'light',
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [activeTab, turnstileSiteKey]);

    // ─── Contact form ────────────────────────────────────────────
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

    // ─── Quote form ──────────────────────────────────────────────
    const [quoteForm, setQuoteForm] = useState({ name: '', email: '', company: '', phone: '', service: '', budget: '', timeline: '', message: '' });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [formLoadedAt] = useState(() => Math.floor(Date.now() / 1000));

    // ─── Simulator state ─────────────────────────────────────────
    const [selectedType, setSelectedType] = useState<string>('');
    const [noIdeaDescription, setNoIdeaDescription] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
    const [selectedDesign, setSelectedDesign] = useState<string>('standard');
    const [selectedMaintenance, setSelectedMaintenance] = useState<string>('none');
    const [selectedTimeline, setSelectedTimeline] = useState<string>('standard');
    const [showSimulatorModal, setShowSimulatorModal] = useState(false);
    const [simulatorForm, setSimulatorForm] = useState({ name: '', email: '', phone: '', company: '' });

    // Turnstile for modal
    const modalTurnstileRef = useRef<HTMLDivElement>(null);
    const modalTurnstileWidgetId = useRef<string | null>(null);
    const [modalTurnstileToken, setModalTurnstileToken] = useState('');

    useEffect(() => {
        if (!showSimulatorModal || !turnstileSiteKey) return;
        const w = window as any;
        if (!w.turnstile) return;
        const timer = setTimeout(() => {
            if (modalTurnstileRef.current) {
                if (modalTurnstileWidgetId.current) {
                    try { w.turnstile.remove(modalTurnstileWidgetId.current); } catch {}
                }
                modalTurnstileWidgetId.current = w.turnstile.render(modalTurnstileRef.current, {
                    sitekey: turnstileSiteKey,
                    callback: (token: string) => setModalTurnstileToken(token),
                    'expired-callback': () => setModalTurnstileToken(''),
                    theme: 'light',
                });
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [showSimulatorModal, turnstileSiteKey]);

    const toggleFeature = (featureId: string) => {
        setSelectedFeatures(prev => {
            const next = new Set(prev);
            if (next.has(featureId)) { next.delete(featureId); } else { next.add(featureId); }
            return next;
        });
    };

    useEffect(() => { setSelectedFeatures(new Set()); }, [selectedType]);

    // ─── Price calculation ───────────────────────────────────────
    const priceBreakdown = useMemo(() => {
        const typeObj = projectTypeOptions.find(t => t.id === selectedType);
        const base = typeObj?.basePrice || 0;
        let featuresTotal = 0;
        const { common, specific } = getFeaturesForType(selectedType);
        const allFeatures = [...common, ...specific];
        selectedFeatures.forEach(fId => {
            const f = allFeatures.find(x => x.id === fId);
            if (f && !f.included) featuresTotal += f.price;
        });
        const designObj = designOptions.find(d => d.id === selectedDesign);
        const designTotal = designObj?.price || 0;
        const maintObj = maintenanceOptions.find(m => m.id === selectedMaintenance);
        const maintenanceTotal = maintObj?.price || 0;
        const subtotal = base + featuresTotal + designTotal + maintenanceTotal;
        const timelineObj = timelineOptions.find(t => t.id === selectedTimeline);
        const timelineMultiplier = timelineObj?.multiplier || 0;
        const timelineExtra = Math.round(subtotal * timelineMultiplier);
        const total = subtotal + timelineExtra;
        return { base, featuresTotal, designTotal, maintenanceTotal, timelineExtra, total };
    }, [selectedType, selectedFeatures, selectedDesign, selectedMaintenance, selectedTimeline]);

    const buildConfigJson = () => {
        const typeObj = projectTypeOptions.find(t => t.id === selectedType);
        const { common, specific } = getFeaturesForType(selectedType);
        const allFeatures = [...common, ...specific];
        const selectedFeatureNames = Array.from(selectedFeatures).map(fId => {
            const f = allFeatures.find(x => x.id === fId);
            return f ? { id: f.id, name: f.name, price: f.price } : null;
        }).filter(Boolean);
        return JSON.stringify({
            projectType: { id: selectedType, name: typeObj?.name, basePrice: typeObj?.basePrice },
            features: selectedFeatureNames,
            design: designOptions.find(d => d.id === selectedDesign),
            maintenance: maintenanceOptions.find(m => m.id === selectedMaintenance),
            timeline: timelineOptions.find(t => t.id === selectedTimeline),
            priceBreakdown,
        });
    };

    // ─── Form handlers ──────────────────────────────────────────
    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/send-email', {
            name: contactForm.name, email: contactForm.email, service: contactForm.subject,
            budget: 0, message: contactForm.message, website: '',
            _form_loaded_at: formLoadedAt, 'cf-turnstile-response': turnstileToken,
            ref: refCode,
        }, {
            onFinish: () => { setProcessing(false); resetTurnstile(); },
            onSuccess: () => setContactForm({ name: '', email: '', subject: '', message: '' }),
        });
    };

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        formData.append('name', quoteForm.name); formData.append('email', quoteForm.email);
        formData.append('service', quoteForm.service); formData.append('budget', quoteForm.budget);
        formData.append('company', quoteForm.company); formData.append('phone', quoteForm.phone);
        formData.append('timeline', quoteForm.timeline); formData.append('message', quoteForm.message);
        formData.append('type', 'quote');
        formData.append('website', ''); // honeypot - must stay empty
        formData.append('existing_website', (quoteForm as any).website_url || '');
        formData.append('how_found_us', (quoteForm as any).source || '');
        formData.append('preferred_lang', (quoteForm as any).preferred_lang || '');
        formData.append('_form_loaded_at', String(formLoadedAt));
        formData.append('cf-turnstile-response', turnstileToken);
        if (refCode) formData.append('ref', refCode);
        attachments.forEach((file, i) => { formData.append(`attachments[${i}]`, file); });
        router.post('/send-email', formData, {
            forceFormData: true,
            onFinish: () => { setProcessing(false); resetTurnstile(); },
            onSuccess: () => {
                setQuoteForm({ name: '', email: '', company: '', phone: '', service: '', budget: '', timeline: '', message: '' });
                setAttachments([]);
            },
        });
    };

    const handleSimulatorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/send-email', {
            name: simulatorForm.name, email: simulatorForm.email, phone: simulatorForm.phone,
            company: simulatorForm.company, type: 'simulator', service: selectedType,
            budget: String(priceBreakdown.total), configuration: buildConfigJson(),
            message: selectedType === 'no_idea'
                ? `[Description libre] ${noIdeaDescription}`
                : `Price simulator estimate: ${formatEUR(priceBreakdown.total)}`,
            website: '', _form_loaded_at: formLoadedAt, 'cf-turnstile-response': modalTurnstileToken,
            ref: refCode,
        }, {
            onFinish: () => {
                setProcessing(false);
                const w = window as any;
                if (w.turnstile && modalTurnstileWidgetId.current) {
                    w.turnstile.reset(modalTurnstileWidgetId.current);
                    setModalTurnstileToken('');
                }
            },
            onSuccess: () => {
                setShowSimulatorModal(false);
                setSimulatorForm({ name: '', email: '', phone: '', company: '' });
            },
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    // ─── Simulator modal ─────────────────────────────────────────
    const simulatorModal = showSimulatorModal ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSimulatorModal(false)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowSimulatorModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('Get Your Free Quote')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Your estimated budget: <span className="font-bold text-teal-600">{formatEUR(priceBreakdown.total)}</span>.
                    Fill in your details and we will send you a detailed proposal.
                </p>
                <form onSubmit={handleSimulatorSubmit} className="space-y-4">
                    <div>
                        <label className={labelClasses}>{t('Full Name')} *</label>
                        <input type="text" value={simulatorForm.name} onChange={(e) => setSimulatorForm({ ...simulatorForm, name: e.target.value })} className={inputClasses} placeholder="John Doe" required />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Email Address')} *</label>
                        <input type="email" value={simulatorForm.email} onChange={(e) => setSimulatorForm({ ...simulatorForm, email: e.target.value })} className={inputClasses} placeholder="john@example.com" required />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Phone (optional)')}</label>
                        <input type="tel" value={simulatorForm.phone} onChange={(e) => setSimulatorForm({ ...simulatorForm, phone: e.target.value })} className={inputClasses} placeholder="+32 XXX XX XX XX" />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Company (optional)')}</label>
                        <input type="text" value={simulatorForm.company} onChange={(e) => setSimulatorForm({ ...simulatorForm, company: e.target.value })} className={inputClasses} placeholder={t('Your Company')} />
                    </div>
                    {turnstileSiteKey && (
                        <div className="flex justify-center pt-2"><div ref={modalTurnstileRef} /></div>
                    )}
                    <div className="pt-2">
                        <button type="submit" disabled={processing || (!!turnstileSiteKey && !modalTurnstileToken)}
                            className="w-full py-4 bg-teal-400 text-gray-900 text-lg font-bold rounded-full transition-all duration-300 hover:bg-teal-300 hover:shadow-lg bebas disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ letterSpacing: '2px' }}>
                            {processing ? t('Sending...').toUpperCase() : t('Send My Request').toUpperCase()}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    ) : null;

    // ─── Render ──────────────────────────────────────────────────
    return (
        <PublicLayout title={t('Contact')} description="Get in touch for a free quote. Web development, mobile apps and software solutions.">
            {/* Hero Section */}
            <section className="bg-gray-900 relative overflow-hidden py-32">
                <div aria-hidden="true">
                    <span className="hero-word hero-word-1">CONTACT</span>
                    <span className="hero-word hero-word-2">EMAIL</span>
                    <span className="hero-word hero-word-3">MESSAGE</span>
                    <span className="hero-word hero-word-4">HELLO</span>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bold text-white bebas hero-fade" style={{ letterSpacing: '3px' }}>{t('Get In Touch')}</h1>
                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto hero-fade hero-fade-delay-1">{t('Have a question or a project in mind? We would love to hear from you.')}</p>
                </div>
            </section>

            {/* Contact Section */}
            <section id="section-form" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-8 p-4 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-xl text-teal-700 dark:text-teal-300 text-sm max-w-3xl mx-auto">{flash.success}</div>
                    )}
                    {(flash as any)?.error && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-sm max-w-3xl mx-auto">{(flash as any).error}</div>
                    )}
                    {errors?.captcha && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-sm max-w-3xl mx-auto">{errors.captcha}</div>
                    )}

                    {brochure?.url && (
                        <div className="max-w-3xl mx-auto mb-10">
                            <a
                                href={brochure.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">{t('Découvrez notre brochure')}</p>
                                    <p className="text-xs text-indigo-100 mt-0.5">{t('Téléchargez une présentation complète de nos services (PDF).')}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 group-hover:bg-white/25 text-xs font-semibold transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    <span>{t('Télécharger')}</span>
                                </div>
                            </a>
                        </div>
                    )}

                    {/* Tab Pills */}
                    <div id="tabs" className="flex justify-center mb-12 scroll-mt-24">
                        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex-wrap justify-center gap-1">
                            {(['simulator', 'quote', 'contact'] as const).filter(tab => tab !== 'simulator' || showSimulator).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                        activeTab === tab ? 'bg-teal-400 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab === 'simulator' ? t('Price Simulator') : tab === 'quote' ? t('Request a Quote') : t('Contact')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    {activeTab === 'simulator' && showSimulator && (
                        <div key={activeTab} className="animate-tab-in">
                        <PriceSimulator
                            selectedType={selectedType} setSelectedType={setSelectedType}
                            selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} toggleFeature={toggleFeature}
                            selectedDesign={selectedDesign} setSelectedDesign={setSelectedDesign}
                            selectedMaintenance={selectedMaintenance} setSelectedMaintenance={setSelectedMaintenance}
                            selectedTimeline={selectedTimeline} setSelectedTimeline={setSelectedTimeline}
                            noIdeaDescription={noIdeaDescription} setNoIdeaDescription={setNoIdeaDescription}
                            priceBreakdown={priceBreakdown}
                            onGetQuote={() => setShowSimulatorModal(true)}
                        />
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div key={activeTab} className="animate-tab-in">
                        <ContactForm
                            contactForm={contactForm} setContactForm={setContactForm}
                            onSubmit={handleContactSubmit} processing={processing} errors={errors}
                            turnstileSiteKey={turnstileSiteKey} turnstileRef={turnstileRef as any} turnstileToken={turnstileToken}
                        />
                        </div>
                    )}

                    {activeTab === 'quote' && (
                        <div key={activeTab} className="animate-tab-in">
                        <QuoteForm
                            quoteForm={quoteForm} setQuoteForm={setQuoteForm}
                            onSubmit={handleQuoteSubmit} processing={processing}
                            projectTypes={projectTypes} errors={errors}
                            attachments={attachments} setAttachments={setAttachments}
                            turnstileSiteKey={turnstileSiteKey} turnstileRef={turnstileRef as any} turnstileToken={turnstileToken}
                            refCode={refCode} setRefCode={setRefCode}
                        />
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('Email')}</h3>
                            <a href="mailto:info@nainnovations.be" className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-500 transition">info@nainnovations.be</a>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('Phone')}</h3>
                            <a href="tel:+32490221912" className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-500 transition">+32 490 22 19 12</a>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center justify-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.178 10.21 8.28 14.453 4.5 17.166m5.138-6.291c.94 1.153 2.067 2.152 3.346 2.97m1.48 5.075c-.684-.315-1.377-.687-2.05-1.127" /></svg>
                                {t('Disponible en FR · NL · EN')}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('Location')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t('Belgium')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {simulatorModal}

            <SectionNav sections={[
                { id: 'section-form', label: 'Contact' },
            ]} />
        </PublicLayout>
    );
}
