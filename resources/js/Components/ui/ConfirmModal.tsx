import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    processing?: boolean;
}

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    variant = 'danger',
    processing = false,
}: ConfirmModalProps) {
    const { t } = useTranslation();

    if (!open) return null;

    const colors = {
        danger: {
            icon: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        },
        warning: {
            icon: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
            button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
            iconPath: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
        },
        info: {
            icon: 'bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400',
            button: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
            iconPath: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        },
    };

    const c = colors[variant];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                style={{ animation: 'cmFadeIn 0.15s ease-out' }}
                onClick={() => !processing && onClose()}
            />
            <div
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{ animation: 'cmScaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                {title || t('Are you sure?')}
                            </h3>
                            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                {message || t('This action cannot be undone.')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {cancelText || t('Cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 ${c.button}`}
                    >
                        {processing && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {confirmText || t('Confirm')}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes cmFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes cmScaleIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>,
        document.body
    );
}
