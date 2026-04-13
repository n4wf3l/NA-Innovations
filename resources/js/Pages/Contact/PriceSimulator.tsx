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
    selectedFeatures, toggleFeature,
    selectedDesign, setSelectedDesign,
    selectedMaintenance, setSelectedMaintenance,
    selectedTimeline, setSelectedTimeline,
    noIdeaDescription, setNoIdeaDescription,
    priceBreakdown,
    onGetQuote,
}: Props) {
    const { t } = useTranslation();
    const featuresForCurrentType = getFeaturesForType(selectedType);

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
                        This is an estimate only. Final pricing depends on project scope.
                    </p>
                </>
            )}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Steps */}
            <div className="flex-1 space-y-12">
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
                                    <span className="text-xs font-bold text-teal-600">from {formatEUR(type.basePrice)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

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
                                            <li>• "Je veux un site pour mon restaurant où les clients peuvent réserver une table"</li>
                                            <li>• "J'ai besoin d'une application pour gérer les rendez-vous de mon salon de coiffure"</li>
                                            <li>• "Je veux vendre mes produits en ligne avec livraison en Belgique"</li>
                                            <li>• "J'ai un site WordPress qui est lent, je veux le refaire en plus moderne"</li>
                                            <li>• "Je veux un portail où mes clients peuvent suivre leurs commandes"</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={noIdeaDescription}
                                onChange={e => setNoIdeaDescription(e.target.value)}
                                rows={6}
                                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-400 focus:ring-teal-400 resize-none"
                                placeholder="Décrivez ce que vous souhaitez : votre activité, ce que le site ou l'application doit faire, vos clients, etc."
                            />
                            <p className="text-xs text-gray-400">{t('Our team will analyze your need and propose the most suitable solution with a detailed quote.')}</p>
                        </div>
                    </div>
                )}

                {selectedType && selectedType !== 'no_idea' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. {t('Features')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('Select the features you need. Some are included by default.')}</p>
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
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{featuresForCurrentType.specificLabel}</h3>
                                    <div className="space-y-2">
                                        {featuresForCurrentType.specific.map(renderFeatureCheckbox)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Design & Branding */}
                {selectedType && selectedType !== 'no_idea' && (
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
                {selectedType && selectedType !== 'no_idea' && (
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
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-400' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />}
                                            </div>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{t(option.name)}</span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${option.price === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                            {option.price === 0 ? t('Free') : `+${formatEUR(option.price)}${option.suffix ? ' ' + option.suffix : ''}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 5: Timeline */}
                {selectedType && selectedType !== 'no_idea' && (
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
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-400' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />}
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-800 block">{t(option.name)}</span>
                                                <span className="text-xs text-gray-500">{t(option.description)}</span>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${option.multiplier === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-amber-100 text-amber-700'}`}>
                                            {option.multiplier === 0 ? t('No extra') : `+${option.multiplier * 100}%`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                {selectedType && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <strong>{t('Disclaimer')} :</strong> {t('This estimate is provided for indicative purposes only and does not constitute a binding offer. The final price may vary depending on the specific requirements, complexity, and scope of your project. Contact us for a detailed, personalized quote.')}
                    </div>
                )}

                {/* Mobile: Price card at bottom */}
                <div className="lg:hidden">
                    {selectedType && <PriceCard />}
                </div>
            </div>

            {/* Right: Sticky Price Card (desktop only) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                    <PriceCard />
                </div>
            </div>
        </div>
    );
}
