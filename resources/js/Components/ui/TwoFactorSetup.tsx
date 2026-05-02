import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    enabled: boolean;
}

export default function TwoFactorSetup({ enabled: initialEnabled }: Props) {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(initialEnabled);
    const [step, setStep] = useState<'idle' | 'setup' | 'confirm' | 'recovery' | 'disable'>('idle');
    const [qrSvg, setQrSvg] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const csrf = () => document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

    const startSetup = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/two-factor/setup', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json' },
            });
            const data = await res.json();
            setQrSvg(data.qr_svg);
            setSecret(data.secret);
            setStep('setup');
        } catch {
            setError(t('Erreur lors de la génération du QR code.'));
        } finally {
            setLoading(false);
        }
    };

    const confirmEnable = async () => {
        if (code.length !== 6) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/two-factor/enable', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.success) {
                setEnabled(true);
                setRecoveryCodes(data.recovery_codes);
                setStep('recovery');
                setCode('');
                showToast('success', t('2FA activée avec succès.'));
            } else if (data.errors?.code) {
                setError(data.errors.code[0]);
            }
        } catch {
            setError(t('Code invalide.'));
        } finally {
            setLoading(false);
        }
    };

    const confirmDisable = async () => {
        if (code.length !== 6) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/two-factor/disable', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.success) {
                setEnabled(false);
                setStep('idle');
                setCode('');
                showToast('success', t('2FA désactivée avec succès.'));
            } else if (data.errors?.code) {
                setError(data.errors.code[0]);
            }
        } catch {
            setError(t('Code invalide.'));
        } finally {
            setLoading(false);
        }
    };

    const copyRecoveryCodes = () => {
        navigator.clipboard.writeText(recoveryCodes.join('\n'));
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 2000);
    };

    return (
        <>
        {toast && (
            <div
                style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}
                className={`px-5 py-3 rounded-xl shadow-2xl border animate-fade-in flex items-center gap-3 ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-200'
                        : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50 text-red-800 dark:text-red-200'
                }`}
            >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {toast.type === 'success'
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    }
                </svg>
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Authentification à deux facteurs (2FA)')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('Sécurisez votre compte avec Google Authenticator')}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${enabled ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        {enabled ? t('Activée') : t('Désactivée')}
                    </span>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-sm text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* IDLE - show enable/disable button */}
                {step === 'idle' && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            {enabled
                                ? t("La 2FA est activée. À chaque connexion, vous devrez entrer un code depuis votre application Authenticator en plus de votre mot de passe.")
                                : t("Ajoutez une couche de sécurité supplémentaire à votre compte. Vous aurez besoin d'une application comme Google Authenticator, Microsoft Authenticator ou Authy.")
                            }
                        </p>
                        {enabled ? (
                            <button
                                onClick={() => { setStep('disable'); setError(''); setCode(''); }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                {t('Désactiver la 2FA')}
                            </button>
                        ) : (
                            <button
                                onClick={startSetup}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                {loading ? t('Chargement...') : t('Activer la 2FA')}
                            </button>
                        )}
                    </div>
                )}

                {/* SETUP - show QR code */}
                {step === 'setup' && (
                    <div className="space-y-5">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center leading-relaxed">
                                {t("Scannez ce QR code avec votre application Authenticator, puis entrez le code à 6 chiffres pour confirmer.")}
                            </p>
                            <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
                                <img
                                    src={qrSvg}
                                    alt="QR Code"
                                    className="w-[220px] h-[220px]"
                                />
                            </div>
                            <div className="mt-3 px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{t('Clé manuelle')}</p>
                                <code className="text-sm font-mono text-gray-700 dark:text-gray-300 select-all break-all">{secret}</code>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Code de vérification')}</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                inputMode="numeric"
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setStep('idle'); setCode(''); setError(''); }}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                onClick={confirmEnable}
                                disabled={code.length !== 6 || loading}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('Vérification...') : t('Confirmer et activer')}
                            </button>
                        </div>
                    </div>
                )}

                {/* RECOVERY - show recovery codes after enabling */}
                {step === 'recovery' && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                <div>
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">{t('Sauvegardez ces codes de récupération !')}</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">{t("Si vous perdez l'accès à votre application Authenticator, ces codes vous permettront de vous connecter. Chaque code ne peut être utilisé qu'une seule fois.")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            {recoveryCodes.map((c, i) => (
                                <div key={i} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 text-center border border-gray-100 dark:border-gray-700">
                                    {c}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={copyRecoveryCodes}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                                {copiedCodes ? t('Copié !') : t('Copier les codes')}
                            </button>
                            <button
                                onClick={() => setStep('idle')}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg"
                            >
                                {t("J'ai sauvegardé mes codes")}
                            </button>
                        </div>
                    </div>
                )}

                {/* DISABLE - ask for code to confirm */}
                {step === 'disable' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t("Pour désactiver la 2FA, entrez un code depuis votre application Authenticator pour confirmer votre identité.")}
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Code de vérification')}</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                inputMode="numeric"
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setStep('idle'); setCode(''); setError(''); }}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                onClick={confirmDisable}
                                disabled={code.length !== 6 || loading}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('Vérification...') : t('Désactiver')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
