import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FeatureOption,
    projectTypeOptions,
    designOptions,
    maintenanceOptions,
    timelineOptions,
    formatEUR,
    getFeaturesForType,
} from './SimulatorData';
import NoviceQuestionnaire, { NoviceAnswers, NoviceEffects } from './NoviceQuestionnaire';
import NoviceRecap from './NoviceRecap';

type Familiarity = 'unknown' | 'familiar' | 'novice';
type NoviceStep = 'questions' | 'recap';

// ─── AnimatedNumber Component ────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);

    useEffect(() => {
        const prev = prevRef.current;
        if (prev === value) return;
        prevRef.current = value;
        const diff = value - prev;
        const steps = 20;
        const stepVal = diff / steps;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step >= steps) {
                setDisplay(value);
                clearInterval(interval);
            } else {
                setDisplay(Math.round(prev + stepVal * step));
            }
        }, 15);
        return () => clearInterval(interval);
    }, [value]);

    return <>{formatEUR(display)}</>;
}

// ─── Price Breakdown type ────────────────────────────────────────

interface PriceBreakdown {
    base: number;
    featuresTotal: number;
    designTotal: number;
    maintenanceTotal: number;
    timelineExtra: number;
    total: number;
}

interface Props {
    selectedType: string;
    setSelectedType: (v: string) => void;
    selectedFeatures: Set<string>;
    setSelectedFeatures: (next: Set<string>) => void;
    toggleFeature: (id: string) => void;
    selectedDesign: string;
    setSelectedDesign: (v: string) => void;
    selectedMaintenance: string;
    setSelectedMaintenance: (v: string) => void;
    selectedTimeline: string;
    setSelectedTimeline: (v: string) => void;
    noIdeaDescription: string;
    setNoIdeaDescription: (v: string) => void;
    priceBreakdown: PriceBreakdown;
    onGetQuote: () => void;
}

export default function PriceSimulator({
    selectedType, setSelectedType,
    selectedFeatures, setSelectedFeatures, toggleFeature,
    selectedDesign, setSelectedDesign,
    selectedMaintenance, setSelectedMaintenance,
    selectedTimeline, setSelectedTimeline,
    noIdeaDescription, setNoIdeaDescription,
    priceBreakdown,
    onGetQuote,
}: Props) {
    const { t } = useTranslation();
    const featuresForCurrentType = getFeaturesForType(selectedType);
    const step2AnchorRef = useRef<HTMLDivElement | null>(null);
    const prevTypeRef = useRef<string>(selectedType);

    const [familiarity, setFamiliarity] = useState<Familiarity>('unknown');
    const [noviceStep, setNoviceStep] = useState<NoviceStep>('questions');
    const [noviceAnswers, setNoviceAnswers] = useState<NoviceAnswers>({});
    const [noviceIndex, setNoviceIndex] = useState(0);

    useEffect(() => {
        setFamiliarity('unknown');
        setNoviceStep('questions');
        setNoviceAnswers({});
        setNoviceIndex(0);
    }, [selectedType]);

    useEffect(() => {
        if (!selectedType) return;
        if (prevTypeRef.current === selectedType) return;
        prevTypeRef.current = selectedType;

        const prefersReducedMotion = typeof window !== 'undefined'
            && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const timer = setTimeout(() => {
            const el = step2AnchorRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const top = window.scrollY + rect.top - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 250);

        return () => clearTimeout(timer);
    }, [selectedType]);

    const applyNoviceEffects = (effects: NoviceEffects) => {
        setSelectedFeatures(effects.features);
        if (effects.design) setSelectedDesign(effects.design);
        if (effects.maintenance) setSelectedMaintenance(effects.maintenance);
        if (effects.timeline) setSelectedTimeline(effects.timeline);
    };

    const handleQuestionnaireComplete = (effects: NoviceEffects) => {
        applyNoviceEffects(effects);
        setNoviceStep('recap');
    };

    const restartQuestionnaire = () => {
        setNoviceStep('questions');
    };

    const renderFeatureCheckbox = (feature: FeatureOption) => {
        const isSelected = selectedFeatures.has(feature.id);
        return (
            <label
                key={feature.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                        ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10'
                        : feature.included
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={isSelected || !!feature.included}
                            disabled={!!feature.included}
                            onChange={() => !feature.included && toggleFeature(feature.id)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-teal-500 focus:ring-teal-400 flex-shrink-0"
                        />
                        <span className={`text-sm font-medium ${feature.included ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                            {t(feature.name)}
                        </span>
                    </div>
                    {feature.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-8 leading-relaxed">{t(feature.description)}</p>
                    )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    feature.included
                        ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300'
                        : feature.price === 0
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                    {feature.included ? t('Included') : feature.price === 0 ? t('Free') : `+${formatEUR(feature.price)}${feature.suffix ? ' ' + t(feature.suffix) : ''}`}
                </span>
            </label>
        );
    };

    const PriceCard = ({ className = '' }: { className?: string }) => (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 ${className}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider bebas" style={{ letterSpacing: '2px' }}>{t('Your Estimate')}</h3>

            {!selectedType ? (
                <p className="text-sm text-gray-400 text-center py-8">
                    {t('Select a project type to see your estimate.')}
                </p>
            ) : (
                <>
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{t('Base Price')}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatEUR(priceBreakdown.base)}</span>
                        </div>
                        {priceBreakdown.featuresTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('Features')}</span>
                                <span className="font-semibold text-gray-900 dark:text-white">+{formatEUR(priceBreakdown.featuresTotal)}</span>
                            </div>
                        )}
                        {priceBreakdown.designTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('Design')}</span>
                                <span className="font-semibold text-gray-900 dark:text-white">+{formatEUR(priceBreakdown.designTotal)}</span>
                            </div>
                        )}
                        {priceBreakdown.maintenanceTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('Maintenance')}</span>
                                <span className="font-semibold text-gray-900 dark:text-white">+{formatEUR(priceBreakdown.maintenanceTotal)}</span>
                            </div>
                        )}
                        {priceBreakdown.timelineExtra > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('Timeline adjustment')}</span>
                                <span className="font-semibold text-amber-600">+{formatEUR(priceBreakdown.timelineExtra)}</span>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('Estimated Total')}</span>
                            <span className="text-2xl font-bold text-teal-600">
                                <AnimatedNumber value={priceBreakdown.total} />
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onGetQuote}
                        className="w-full py-4 bg-teal-400 text-gray-900 dark:text-white text-lg font-bold rounded-full transition-all duration-300 hover:bg-teal-300 hover:shadow-lg bebas"
                        style={{ letterSpacing: '2px' }}
                    >
                        {t('Get Your Free Quote').toUpperCase()}
                        <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight hidden lg:block">
                        {t('This is an estimate only. Final pricing depends on project scope.')}
                    </p>
                </>
            )}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Steps */}
            <div className="flex-1 space-y-12">
                {/* Market-aligned pricing banner — shown before any step */}
                <div className="p-4 bg-teal-50 dark:bg-teal-500/10 rounded-xl border border-teal-200 dark:border-teal-500/30 flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">
                        <strong>{t('Market-aligned pricing')} :</strong> {t('These estimates reflect the current Belgian and European market rates for web, mobile and SaaS development. We position ourselves at fair market value — neither overpriced nor cut-rate.')}
                    </p>
                </div>

                {/* Step 1: Project Type */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. {t('Project Type')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('Select the type of project you need.')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectTypeOptions.map((type) => {
                            const isSelected = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                                        isSelected
                                            ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-3 right-3">
                                            <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-teal-400 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                        {type.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{t(type.name)}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{t(type.description)}</p>
                                    <span className="text-xs font-bold text-teal-600">{t('from')} {formatEUR(type.basePrice)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 2 anchor - used for auto-scroll after project type selection */}
                <div ref={step2AnchorRef} aria-hidden="true" />

                {/* Familiarity question - shown after type is selected (except no_idea) */}
                {selectedType && selectedType !== 'no_idea' && familiarity === 'unknown' && (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. {t('Votre niveau de familiarité')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('Pour adapter le questionnaire à votre profil, dites-nous comment vous vous situez.')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setFamiliarity('novice')}
                                className="group relative overflow-hidden text-left p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 17.25h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Je ne suis pas familier avec le développement')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t('Nous vous guidons avec un questionnaire simple (Oui/Non) pour identifier vos besoins sans jargon technique.')}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                                    {t('Recommandé')}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </button>

                            <button
                                onClick={() => setFamiliarity('familiar')}
                                className="group relative overflow-hidden text-left p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Je suis familier avec le développement')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t('Mode expert : choisissez vous-même les fonctionnalités, le design, la maintenance et le délai.')}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    {t('Configuration manuelle')}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Novice flow - guided questionnaire then recap */}
                {selectedType && selectedType !== 'no_idea' && familiarity === 'novice' && noviceStep === 'questions' && (
                    <NoviceQuestionnaire
                        selectedType={selectedType}
                        answers={noviceAnswers}
                        setAnswers={setNoviceAnswers}
                        currentIndex={noviceIndex}
                        setCurrentIndex={setNoviceIndex}
                        onComplete={handleQuestionnaireComplete}
                        onExit={() => setFamiliarity('familiar')}
                    />
                )}

                {selectedType && selectedType !== 'no_idea' && familiarity === 'novice' && noviceStep === 'recap' && (
                    <NoviceRecap
                        selectedType={selectedType}
                        selectedFeatures={selectedFeatures}
                        selectedDesign={selectedDesign}
                        selectedMaintenance={selectedMaintenance}
                        selectedTimeline={selectedTimeline}
                        priceBreakdown={priceBreakdown}
                        onGetQuote={onGetQuote}
                        onEditAnswers={restartQuestionnaire}
                    />
                )}

                {/* Step 2: Features or Free description */}
                {selectedType && selectedType === 'no_idea' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. {t('Describe your project')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t("No worries! Describe your idea and we'll guide you to the best solution.")}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-teal-900 dark:text-teal-300">{t('Some examples to inspire you:')}</h4>
                                        <ul className="mt-2 text-xs text-teal-700 dark:text-teal-400 space-y-1">
                                            <li>• {t('simulator.example.restaurant')}</li>
                                            <li>• {t('simulator.example.salon')}</li>
                                            <li>• {t('simulator.example.shop')}</li>
                                            <li>• {t('simulator.example.wordpress')}</li>
                                            <li>• {t('simulator.example.portal')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={noIdeaDescription}
                                onChange={e => setNoIdeaDescription(e.target.value)}
                                rows={6}
                                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                placeholder={t('Describe what you want: your activity, what the site or app should do, your customers, etc.')}
                            />
                            <p className="text-xs text-gray-400">{t('Our team will analyze your need and propose the most suitable solution with a detailed quote.')}</p>
                        </div>
                    </div>
                )}

                {selectedType && selectedType !== 'no_idea' && familiarity === 'familiar' && (
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. {t('Features')}</h2>
                                <p className="text-sm text-gray-500 mt-1">{t('Select the features you need. Some are included by default.')}</p>
                            </div>
                            <button
                                onClick={() => setFamiliarity('novice')}
                                className="text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 underline underline-offset-2"
                            >
                                {t('Passer en mode guidé')}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{t('Common Features')}</h3>
                                <div className="space-y-2">
                                    {featuresForCurrentType.common.map(renderFeatureCheckbox)}
                                </div>
                            </div>

                            {featuresForCurrentType.specific.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{t(featuresForCurrentType.specificLabel)}</h3>
                                    <div className="space-y-2">
                                        {featuresForCurrentType.specific.map(renderFeatureCheckbox)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Design & Branding */}
                {selectedType && selectedType !== 'no_idea' && familiarity === 'familiar' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. {t('Design & Branding')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('Choose the level of design you need.')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {designOptions.map((option) => {
                                const isSelected = selectedDesign === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedDesign(option.id)}
                                        className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                                            isSelected
                                                ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10 shadow-md'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-3 right-3">
                                                <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                            </div>
                                        )}
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 pr-6">{t(option.name)}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{t(option.description)}</p>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${option.price === 0 ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                            {option.price === 0 ? t('Included') : `+${formatEUR(option.price)}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 4: Maintenance & Support */}
                {selectedType && selectedType !== 'no_idea' && familiarity === 'familiar' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. {t('Maintenance & Support')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('Optional post-launch support and maintenance.')}</p>
                        </div>
                        <div className="space-y-2">
                            {maintenanceOptions.map((option) => {
                                const isSelected = selectedMaintenance === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedMaintenance(option.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            isSelected
                                                ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-400' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />}
                                            </div>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{t(option.name)}</span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${option.price === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                            {option.price === 0 ? t('Free') : `+${formatEUR(option.price)}${option.suffix ? ' ' + t(option.suffix) : ''}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 5: Timeline */}
                {selectedType && selectedType !== 'no_idea' && familiarity === 'familiar' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. {t('Timeline')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('How soon do you need your project delivered?')}</p>
                        </div>
                        <div className="space-y-2">
                            {timelineOptions.map((option) => {
                                const isSelected = selectedTimeline === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedTimeline(option.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            isSelected
                                                ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-400' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />}
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-800 dark:text-gray-100 block">{t(option.name)}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{t(option.description)}</span>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${option.multiplier === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
                                            {option.multiplier === 0 ? t('No extra') : `+${option.multiplier * 100}%`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Disclaimer - only in familiar mode (novice has its own in recap) */}
                {selectedType && (familiarity === 'familiar' || selectedType === 'no_idea') && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <strong>{t('Disclaimer')} :</strong> {t('This estimate is provided for indicative purposes only and does not constitute a binding offer. The final price may vary depending on the specific requirements, complexity, and scope of your project. Contact us for a detailed, personalized quote.')}
                    </div>
                )}

                {/* Mobile: Price card at bottom - only in familiar mode */}
                <div className="lg:hidden">
                    {selectedType && familiarity === 'familiar' && <PriceCard />}
                </div>
            </div>

            {/* Right: Sticky Price Card (desktop only) - hidden in novice mode (recap has its own) */}
            {familiarity === 'familiar' && (
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24">
                        <PriceCard />
                    </div>
                </div>
            )}
        </div>
    );
}
