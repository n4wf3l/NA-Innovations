import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { TourStep } from '@/data/tourSteps';

interface Props {
    steps: TourStep[];
    isActive: boolean;
    currentStep: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    onDismiss: (dontShowAgain: boolean) => void;
    accentColor?: string;
}

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const PADDING = 10;
const TOOLTIP_GAP = 12;
const BORDER_RADIUS = 16;

export default function GuidedTour({
    steps,
    isActive,
    currentStep,
    onNext,
    onPrev,
    onSkip,
    onDismiss,
    accentColor = 'teal',
}: Props) {
    const { t } = useTranslation();
    const [targetRect, setTargetRect] = useState<Rect | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrowSide: string }>({ top: 0, left: 0, arrowSide: 'top' });
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const step = steps[currentStep];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // Block body scroll when tour is active
    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isActive]);

    // Find and measure the target element
    const measureTarget = useCallback(() => {
        if (!step || !isActive) return;

        const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement;
        if (!el) {
            setTargetRect(null);
            return;
        }

        const rect = el.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (!isVisible) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                const newRect = el.getBoundingClientRect();
                setTargetRect({
                    x: newRect.left - PADDING,
                    y: newRect.top - PADDING,
                    width: newRect.width + PADDING * 2,
                    height: newRect.height + PADDING * 2,
                });
            }, 400);
        } else {
            setTargetRect({
                x: rect.left - PADDING,
                y: rect.top - PADDING,
                width: rect.width + PADDING * 2,
                height: rect.height + PADDING * 2,
            });
        }
    }, [step, isActive]);

    useEffect(() => {
        if (!isActive) return;
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);

        measureTarget();

        const handleResize = () => measureTarget();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [currentStep, isActive, measureTarget]);

    // Position tooltip relative to target
    useEffect(() => {
        if (!targetRect || !tooltipRef.current) return;

        const tooltip = tooltipRef.current;
        const tooltipW = tooltip.offsetWidth;
        const tooltipH = tooltip.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw < 640;

        // On mobile: always use bottom or top (never left/right)
        let placement = step?.placement || 'bottom';
        if (mobile && (placement === 'left' || placement === 'right')) {
            placement = 'bottom';
        }

        let top = 0;
        let left = 0;
        let arrowSide = 'top';

        if (mobile) {
            // Mobile: tooltip is full-width at bottom, positioned relative to spotlight
            left = (vw - tooltipW) / 2;

            const spaceBelow = vh - (targetRect.y + targetRect.height);
            const spaceAbove = targetRect.y;

            if (spaceBelow >= tooltipH + TOOLTIP_GAP + 20) {
                top = targetRect.y + targetRect.height + TOOLTIP_GAP;
                arrowSide = 'top';
            } else if (spaceAbove >= tooltipH + TOOLTIP_GAP + 20) {
                top = targetRect.y - tooltipH - TOOLTIP_GAP;
                arrowSide = 'bottom';
            } else {
                // Not enough space either way — dock to bottom of viewport
                top = vh - tooltipH - 16;
                arrowSide = 'none';
            }
        } else {
            // Desktop positioning
            switch (placement) {
                case 'bottom':
                    top = targetRect.y + targetRect.height + TOOLTIP_GAP;
                    left = targetRect.x + targetRect.width / 2 - tooltipW / 2;
                    arrowSide = 'top';
                    if (top + tooltipH > vh - 20) {
                        top = targetRect.y - tooltipH - TOOLTIP_GAP;
                        arrowSide = 'bottom';
                    }
                    break;
                case 'top':
                    top = targetRect.y - tooltipH - TOOLTIP_GAP;
                    left = targetRect.x + targetRect.width / 2 - tooltipW / 2;
                    arrowSide = 'bottom';
                    if (top < 20) {
                        top = targetRect.y + targetRect.height + TOOLTIP_GAP;
                        arrowSide = 'top';
                    }
                    break;
                case 'right':
                    top = targetRect.y + targetRect.height / 2 - tooltipH / 2;
                    left = targetRect.x + targetRect.width + TOOLTIP_GAP;
                    arrowSide = 'left';
                    if (left + tooltipW > vw - 20) {
                        left = targetRect.x - tooltipW - TOOLTIP_GAP;
                        arrowSide = 'right';
                    }
                    break;
                case 'left':
                    top = targetRect.y + targetRect.height / 2 - tooltipH / 2;
                    left = targetRect.x - tooltipW - TOOLTIP_GAP;
                    arrowSide = 'right';
                    if (left < 20) {
                        left = targetRect.x + targetRect.width + TOOLTIP_GAP;
                        arrowSide = 'left';
                    }
                    break;
            }
        }

        // Clamp within viewport
        left = Math.max(12, Math.min(left, vw - tooltipW - 12));
        top = Math.max(12, Math.min(top, vh - tooltipH - 12));

        setTooltipPos({ top, left, arrowSide });
    }, [targetRect, step, currentStep]);

    // Keyboard navigation
    useEffect(() => {
        if (!isActive) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss(dontShowAgain);
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isActive, onDismiss, onNext, onPrev, dontShowAgain]);

    // Touch swipe navigation
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        touchStartRef.current = null;

        // Only trigger if horizontal swipe > 60px and more horizontal than vertical
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) onNext();  // Swipe left → next
            else onPrev();         // Swipe right → prev
        }
    }, [onNext, onPrev]);

    if (!isActive || !step) return null;

    const accentColors: Record<string, { bg: string; text: string; ring: string; dot: string; btnHover: string }> = {
        teal: { bg: 'bg-teal-500', text: 'text-teal-500', ring: 'ring-teal-500/30', dot: 'bg-teal-500', btnHover: 'hover:bg-teal-600' },
        rose: { bg: 'bg-rose-500', text: 'text-rose-500', ring: 'ring-rose-500/30', dot: 'bg-rose-500', btnHover: 'hover:bg-rose-600' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', ring: 'ring-indigo-500/30', dot: 'bg-indigo-500', btnHover: 'hover:bg-indigo-600' },
    };

    const colors = accentColors[accentColor] || accentColors.teal;
    const isLast = currentStep === steps.length - 1;

    return createPortal(
        <div
            className="fixed inset-0 z-[9998]"
            style={{ pointerEvents: 'auto' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* SVG overlay with spotlight hole */}
            <svg
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                style={{ pointerEvents: 'none' }}
            >
                <defs>
                    <mask id="tour-spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.x}
                                y={targetRect.y}
                                width={targetRect.width}
                                height={targetRect.height}
                                rx={BORDER_RADIUS}
                                fill="black"
                                className="transition-all duration-500 ease-out"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.78)"
                    mask="url(#tour-spotlight-mask)"
                    style={{ pointerEvents: 'auto', cursor: 'default' }}
                    onClick={() => onDismiss(dontShowAgain)}
                />
            </svg>

            {/* Spotlight ring glow */}
            {targetRect && (
                <div
                    className={`absolute rounded-2xl ring-4 ${colors.ring} transition-all duration-500 ease-out pointer-events-none`}
                    style={{
                        left: targetRect.x,
                        top: targetRect.y,
                        width: targetRect.width,
                        height: targetRect.height,
                    }}
                />
            )}

            {/* Tooltip card */}
            <div
                ref={tooltipRef}
                className={`absolute z-[9999] w-[calc(100vw-24px)] sm:w-[380px] transition-all duration-300 ease-out ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
                style={{
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1 bg-gray-100 dark:bg-gray-700">
                        <div
                            className={`h-full ${colors.bg} transition-all duration-500 ease-out`}
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-4 sm:p-5">
                        {/* Step counter */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className={`text-[11px] sm:text-xs font-bold ${colors.text} uppercase tracking-wider`}>
                                {t('Étape')} {currentStep + 1}/{steps.length}
                            </span>
                            <button
                                onClick={() => onDismiss(dontShowAgain)}
                                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                            {t(step.title)}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 sm:mb-5">
                            {t(step.description)}
                        </p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            {/* Dots */}
                            <div className="flex items-center gap-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === currentStep
                                                ? `w-5 sm:w-6 ${colors.bg}`
                                                : i < currentStep
                                                ? `w-1.5 ${colors.bg} opacity-40`
                                                : 'w-1.5 bg-gray-200 dark:bg-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {currentStep > 0 && (
                                    <button
                                        onClick={onPrev}
                                        className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {t('Précédent')}
                                    </button>
                                )}
                                {!isLast && currentStep === 0 && (
                                    <button
                                        onClick={onSkip}
                                        className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg"
                                    >
                                        {t('Passer')}
                                    </button>
                                )}
                                <button
                                    onClick={onNext}
                                    className={`px-4 sm:px-5 py-2 ${colors.bg} ${colors.btnHover} text-white text-xs sm:text-sm font-bold rounded-xl transition-all`}
                                >
                                    {isLast ? t('Terminer') : t('Suivant')}
                                </button>
                            </div>
                        </div>

                        {/* Don't show again checkbox */}
                        {currentStep === 0 && (
                            <label className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                    className={`w-4 h-4 rounded border-gray-300 dark:border-gray-600 ${colors.text} focus:ring-2 ${colors.ring}`}
                                />
                                <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                    {t('Ne plus afficher cette présentation')}
                                </span>
                            </label>
                        )}

                        {/* Mobile swipe hint — first step only */}
                        {currentStep === 0 && isMobile && (
                            <p className="text-[10px] text-gray-300 dark:text-gray-600 text-center mt-2">
                                {t('Swipez pour naviguer')} ←→
                            </p>
                        )}
                    </div>
                </div>

                {/* Arrow — hidden when docked or on mobile */}
                {tooltipPos.arrowSide !== 'none' && !isMobile && (
                    <>
                        {tooltipPos.arrowSide === 'top' && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-100 dark:border-gray-700" />
                        )}
                        {tooltipPos.arrowSide === 'bottom' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700" />
                        )}
                        {tooltipPos.arrowSide === 'left' && (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700" />
                        )}
                        {tooltipPos.arrowSide === 'right' && (
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-r border-t border-gray-100 dark:border-gray-700" />
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

// Small "?" button to re-trigger the tour
export function TourTriggerButton({ onClick, accentColor = 'teal' }: { onClick: () => void; accentColor?: string }) {
    const { t } = useTranslation();

    const colors: Record<string, string> = {
        teal: 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/25',
        rose: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25',
        indigo: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25',
    };

    return (
        <button
            onClick={onClick}
            title={t('Visite guidée')}
            className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full ${colors[accentColor] || colors.teal} text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        </button>
    );
}
