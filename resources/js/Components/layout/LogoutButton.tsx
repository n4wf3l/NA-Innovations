import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface Props {
    collapsed?: boolean;
}

export default function LogoutButton({ collapsed }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        const csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_token';
        csrf.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.appendChild(csrf);
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center w-full px-4 py-2 text-xs text-gray-600 hover:text-red-400 rounded-lg transition-colors ${collapsed ? 'justify-center px-2' : ''}`}
                title={t('Sign Out')}
            >
                <svg className={`w-4 h-4 ${collapsed ? '' : 'mr-2'} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                {!collapsed && t('Sign Out')}
            </button>

            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setShowModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-backdrop" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4 overflow-hidden animate-modal" onClick={e => e.stopPropagation()}>
                        {/* Icon */}
                        <div className="pt-8 pb-2 flex justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </div>
                        </div>

                        <div className="px-6 pb-6 text-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Se déconnecter ?')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('Vous serez redirigé vers la page de connexion.')}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                                >
                                    {t('Annuler')}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                                >
                                    {t('Déconnexion')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
