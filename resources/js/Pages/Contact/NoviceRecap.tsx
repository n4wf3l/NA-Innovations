import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    projectTypeOptions,
    designOptions,
    maintenanceOptions,
    timelineOptions,
    formatEUR,
    getFeaturesForType,
    FeatureOption,
} from './SimulatorData';

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
    selectedFeatures: Set<string>;
    selectedDesign: string;
    selectedMaintenance: string;
    selectedTimeline: string;
    priceBreakdown: PriceBreakdown;
    onGetQuote: () => void;
    onEditAnswers: () => void;
}

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);

    useEffect(() => {
        const prev = prevRef.current;
        if (prev === value) return;
        prevRef.current = value;
        const diff = value - prev;
        const steps = 25;
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
        }, 20);
        return () => clearInterval(interval);
    }, [value]);

    return <>{formatEUR(display)}</>;
}

export default function NoviceRecap({
    selectedType,
    selectedFeatures,
    selectedDesign,
    selectedMaintenance,
    selectedTimeline,
    priceBreakdown,
    onGetQuote,
    onEditAnswers,
}: Props) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const top = window.scrollY + rect.top - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, []);

    const typeObj = projectTypeOptions.find(t => t.id === selectedType);
    const { common, specific } = getFeaturesForType(selectedType);
    const allFeatures = [...common, ...specific];
    const selectedFeatureObjs: FeatureOption[] = Array.from(selectedFeatures)
        .map(id => allFeatures.find(f => f.id === id))
        .filter(Boolean) as FeatureOption[];
    const includedFeatures = allFeatures.filter(f => f.included);
    const designObj = designOptions.find(d => d.id === selectedDesign);
    const maintObj = maintenanceOptions.find(m => m.id === selectedMaintenance);
    const timelineObj = timelineOptions.find(t => t.id === selectedTimeline);

    return (
        <div ref={containerRef} className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/30 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('Voici votre projet sur mesure')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    {t('Sur la base de vos réponses, nous avons identifié les éléments essentiels pour votre projet.')}
                </p>
            </div>

            {/* Project type */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        {typeObj?.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1">{t('Type de projet')}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{typeObj ? t(typeObj.name) : ''}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Base')}</p>
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{formatEUR(priceBreakdown.base)}</p>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">{t('Fonctionnalités retenues')}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('Ce que votre projet inclut')}</h3>
                    </div>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        +{formatEUR(priceBreakdown.featuresTotal)}
                    </span>
                </div>

                <div className="space-y-2">
                    {includedFeatures.map(f => (
                        <div key={f.id} className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/20">
                            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t(f.name)}</p>
                                {f.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(f.description)}</p>}
                            </div>
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">{t('Inclus')}</span>
                        </div>
                    ))}

                    {selectedFeatureObjs.length === 0 && includedFeatures.length === 0 && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4 text-center">
                            {t('Aucune fonctionnalité supplémentaire sélectionnée')}
                        </p>
                    )}

                    {selectedFeatureObjs.map(f => (
                        <div key={f.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t(f.name)}</p>
                                {f.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(f.description)}</p>}
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                +{formatEUR(f.price)}{f.suffix ? ` ${t(f.suffix)}` : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Design / Maintenance / Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2">{t('Design')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{designObj ? t(designObj.name) : ''}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{designObj ? t(designObj.description) : ''}</p>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {priceBreakdown.designTotal === 0 ? t('Inclus') : `+${formatEUR(priceBreakdown.designTotal)}`}
                    </span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2">{t('Maintenance')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">{maintObj ? t(maintObj.name) : ''}</p>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {priceBreakdown.maintenanceTotal === 0 ? t('Gratuit') : `+${formatEUR(priceBreakdown.maintenanceTotal)}`}
                    </span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2">{t('Délai de livraison')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{timelineObj ? t(timelineObj.name) : ''}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{timelineObj ? t(timelineObj.description) : ''}</p>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {priceBreakdown.timelineExtra === 0 ? t('Pas de supplément') : `+${formatEUR(priceBreakdown.timelineExtra)}`}
                    </span>
                </div>
            </div>

            {/* Total + CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl shadow-teal-500/30 p-8 text-white">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
                }} />
                <div className="relative">
                    <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-2">{t('Estimation totale personnalisée')}</p>
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-5xl md:text-6xl font-bold">
                            <AnimatedNumber value={priceBreakdown.total} />
                        </span>
                        <span className="text-lg text-white/70">{t('HTVA')}</span>
                    </div>
                    <p className="text-sm text-white/90 mb-6 max-w-xl leading-relaxed">
                        {t("Cette estimation reflète vos besoins réels d'après vos réponses. Obtenez un devis détaillé et gratuit en moins de 24h.")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onGetQuote}
                            className="flex-1 py-4 px-6 bg-white text-teal-600 text-lg font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 bebas"
                            style={{ letterSpacing: '2px' }}
                        >
                            {t('Obtenir mon devis').toUpperCase()}
                            <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                        <button
                            onClick={onEditAnswers}
                            className="py-4 px-6 bg-white/10 border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-colors"
                        >
                            {t('Modifier mes réponses')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <strong>{t('Disclaimer')} :</strong> {t('This estimate is provided for indicative purposes only and does not constitute a binding offer. The final price may vary depending on the specific requirements, complexity, and scope of your project. Contact us for a detailed, personalized quote.')}
            </div>
        </div>
    );
}
