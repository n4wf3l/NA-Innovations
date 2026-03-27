import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SignaturePadLib from 'signature_pad';

interface Props {
    /** Current signature as data URL (base64 PNG) */
    value?: string | null;
    /** Called when the user finishes drawing or clears */
    onChange: (dataUrl: string | null) => void;
    /** Width of the pad */
    width?: number;
    /** Height of the pad */
    height?: number;
    /** Label above the pad */
    label?: string;
    /** Whether the pad is read-only (just shows the signature) */
    readOnly?: boolean;
}

export default function SignaturePad({ value, onChange, width = 500, height = 200, label, readOnly }: Props) {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const padRef = useRef<SignaturePadLib | null>(null);
    const [isEmpty, setIsEmpty] = useState(!value);

    // Initialize signature pad
    useEffect(() => {
        if (!canvasRef.current || readOnly) return;

        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d')?.scale(ratio, ratio);

        const pad = new SignaturePadLib(canvas, {
            backgroundColor: 'rgba(0,0,0,0)',
            penColor: '#1e293b',
            minWidth: 1.5,
            maxWidth: 3,
        });

        // Adapt pen color to dark mode
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            pad.penColor = '#e2e8f0';
        }

        // Load existing signature
        if (value) {
            pad.fromDataURL(value, { width: canvas.offsetWidth, height: canvas.offsetHeight });
            setIsEmpty(false);
        }

        pad.addEventListener('endStroke', () => {
            setIsEmpty(pad.isEmpty());
            onChange(pad.toDataURL('image/png'));
        });

        padRef.current = pad;

        return () => {
            pad.off();
        };
    }, [readOnly]);

    const handleClear = () => {
        padRef.current?.clear();
        setIsEmpty(true);
        onChange(null);
    };

    // Read-only: just show the image
    if (readOnly) {
        if (!value) return null;
        return (
            <div className="inline-block">
                {label && <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>}
                <img src={value} alt="Signature" className="max-h-20 object-contain" />
            </div>
        );
    }

    return (
        <div>
            {label && <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>}

            <div className="relative rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 overflow-hidden group transition-colors hover:border-gray-300 dark:hover:border-gray-500">
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: `${height}px` }}
                    className="cursor-crosshair touch-none"
                />

                {/* Signing line */}
                <div className="absolute bottom-10 left-8 right-8 border-b border-gray-200 dark:border-gray-700" />
                <div className="absolute bottom-5 left-8 text-[10px] text-gray-300 dark:text-gray-600 font-medium uppercase tracking-widest">
                    {t('Signature')}
                </div>

                {/* Placeholder when empty */}
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('Draw your signature here')}</p>
                        </div>
                    </div>
                )}

                {/* Clear button */}
                {!isEmpty && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        title={t('Clear')}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{t('Use your mouse or finger to sign')}</p>
                {!isEmpty && (
                    <button type="button" onClick={handleClear} className="text-[10px] text-red-400 hover:text-red-500 font-medium">
                        {t('Clear')}
                    </button>
                )}
            </div>
        </div>
    );
}
