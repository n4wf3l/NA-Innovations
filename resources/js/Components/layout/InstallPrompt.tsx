import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Read branding from DOM directly — InstallPrompt is mounted outside the
// Inertia <App> tree so usePage() is not available here.
function readBrandingFromDom(): { companyName: string; logoUrl: string | null } {
    try {
        const data = document.getElementById('app')?.getAttribute('data-page');
        if (data) {
            const parsed = JSON.parse(data);
            const b = parsed?.props?.branding;
            return {
                companyName: b?.company_name || 'NA Innovations',
                logoUrl: b?.logo_path ? `/storage/${b.logo_path}` : null,
            };
        }
    } catch { /* ignore */ }
    return { companyName: 'NA Innovations', logoUrl: null };
}

export default function InstallPrompt() {
    const { t } = useTranslation();
    const { companyName, logoUrl } = readBrandingFromDom();
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Only show on dashboard pages (after login), not on public landing
        const path = window.location.pathname;
        const isDashboard = path.startsWith('/admin') || path.startsWith('/client') || path.startsWith('/partner') || path.startsWith('/dev');
        if (!isDashboard) return;

        // Only show on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) return;

        // Don't show if already installed as PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (navigator as any).standalone === true;
        if (isStandalone) return;

        // Don't show if user dismissed permanently
        const dismissed = localStorage.getItem('na_install_dismissed');
        if (dismissed === 'true') return;

        // Don't show if dismissed this session
        const sessionDismissed = sessionStorage.getItem('na_install_dismissed');
        if (sessionDismissed === 'true') return;

        // Detect platform
        setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));

        // Show after a short delay
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setShow(false);
        if (dontShowAgain) {
            localStorage.setItem('na_install_dismissed', 'true');
        } else {
            sessionStorage.setItem('na_install_dismissed', 'true');
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={dismiss} />

            {/* Card - slides up from bottom on mobile */}
            <div className="relative z-10 bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-modal">

                {/* Header illustration */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 pt-8 pb-6 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-4 w-20 h-20 bg-teal-500/10 rounded-full blur-xl" />
                    <div className="relative">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <img src={logoUrl || "/white-logo-small.png"} alt={companyName} className="w-14 h-14 object-contain" />
                        </div>
                        <h3 className="text-white text-lg font-bold">{t('Install')} {companyName}</h3>
                        <p className="text-gray-400 text-xs mt-1">{t('Add to your home screen for the best experience')}</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="px-6 py-5">
                    {isIOS ? (
                        /* iOS Instructions */
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Tap the Share button')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('At the bottom of Safari (square with arrow)')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">1</span>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Add to Home Screen')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('Scroll down and tap "Add to Home Screen"')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">2</span>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Tap Add')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('The app will appear on your home screen')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">3</span>
                            </div>
                        </div>
                    ) : (
                        /* Android Instructions */
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Tap the menu')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('Three dots at the top right of Chrome')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">1</span>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Add to Home screen')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('Select "Add to Home screen" or "Install app"')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">2</span>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{t('Confirm Install')}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('Tap "Install" and find NA on your home screen')}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-300">3</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Don't show again + dismiss */}
                <div className="px-6 pb-6 space-y-4">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={e => setDontShowAgain(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-400"
                        />
                        <span className="ml-2.5 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{t("Don't show this again")}</span>
                    </label>

                    <button
                        onClick={dismiss}
                        className="w-full py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-transform"
                    >
                        {t('Got it')}
                    </button>
                </div>
            </div>
        </div>
    );
}
