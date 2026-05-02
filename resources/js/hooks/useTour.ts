import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { TourKey } from '@/data/tourSteps';

interface UseTourReturn {
    isActive: boolean;
    currentStep: number;
    totalSteps: number;
    next: () => void;
    prev: () => void;
    skip: () => void;
    dismiss: (dontShowAgain: boolean) => void;
    restart: () => void;
}

export function useTour(tourKey: TourKey, totalSteps: number): UseTourReturn {
    const { auth } = usePage<PageProps>().props;
    const preferences = auth.user?.preferences;
    const onboarding = preferences?.onboarding || {};
    const alreadyCompleted = !!onboarding[tourKey];

    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-start tour on first visit (if not completed)
    useEffect(() => {
        if (!alreadyCompleted) {
            // Small delay to let the page render first
            const timer = setTimeout(() => setIsActive(true), 800);
            return () => clearTimeout(timer);
        }
    }, [alreadyCompleted]);

    const saveTourCompleted = useCallback(async () => {
        try {
            await fetch('/api/tour-completed', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ tour_key: tourKey }),
            });
        } catch {
            // Silent fail - not critical
        }
    }, [tourKey]);

    const next = useCallback(() => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Last step → finish
            setIsActive(false);
            setCurrentStep(0);
            saveTourCompleted();
        }
    }, [currentStep, totalSteps, saveTourCompleted]);

    const prev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const skip = useCallback(() => {
        setIsActive(false);
        setCurrentStep(0);
        saveTourCompleted();
    }, [saveTourCompleted]);

    const dismiss = useCallback((dontShowAgain: boolean) => {
        setIsActive(false);
        setCurrentStep(0);
        if (dontShowAgain) {
            saveTourCompleted();
        }
    }, [saveTourCompleted]);

    const restart = useCallback(() => {
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    return {
        isActive,
        currentStep,
        totalSteps,
        next,
        prev,
        skip,
        dismiss,
        restart,
    };
}
