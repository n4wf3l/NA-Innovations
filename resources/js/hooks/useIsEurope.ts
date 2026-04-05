import { useState, useEffect } from 'react';

const EUROPE_TIMEZONES = [
    'Europe/', 'Atlantic/Reykjavik', 'Atlantic/Canary', 'Atlantic/Faroe',
    'Atlantic/Madeira', 'Atlantic/Azores',
];

/**
 * Determines if the simulator should be shown based on admin setting + user location.
 * @param mode - 'enabled' (show to everyone), 'europe_only' (only Europe), 'disabled' (hidden for all)
 */
export function useSimulatorVisible(mode: string = 'europe_only'): boolean {
    const [visible, setVisible] = useState(mode === 'enabled');

    useEffect(() => {
        if (mode === 'disabled') {
            setVisible(false);
            return;
        }
        if (mode === 'enabled') {
            setVisible(true);
            return;
        }
        // europe_only — check timezone
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const inEurope = EUROPE_TIMEZONES.some(prefix => tz.startsWith(prefix));
            setVisible(inEurope);
        } catch {
            setVisible(true);
        }
    }, [mode]);

    return visible;
}

// Backwards compat
export function useIsEurope(): boolean {
    return useSimulatorVisible('europe_only');
}
