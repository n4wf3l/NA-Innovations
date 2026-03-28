import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface Props {
    /** URL that streams the PDF inline (Content-Disposition: inline) */
    previewUrl: string;
    /** URL that downloads the PDF */
    downloadUrl: string;
    /** Filename displayed, e.g. "DEV-2026-010.pdf" */
    filename: string;
    /** Accent color for the PDF icon */
    accentColor?: 'red' | 'blue';
}

export default function PdfPreviewCard({ previewUrl, downloadUrl, filename, accentColor = 'red' }: Props) {
    const { t } = useTranslation();
    const [showViewer, setShowViewer] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setDownloading(true);
        try {
            const res = await fetch(downloadUrl);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch {
            window.location.href = downloadUrl;
        }
        setTimeout(() => setDownloading(false), 800);
    };

    const iconColor = accentColor === 'blue' ? 'text-blue-500' : 'text-red-500';
    const btnGradient = accentColor === 'blue'
        ? 'from-blue-500 to-indigo-600 shadow-blue-500/30'
        : 'from-amber-500 to-orange-500 shadow-amber-500/30';

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                {/* Mini PDF preview — click to open fullscreen */}
                <button
                    type="button"
                    onClick={() => setShowViewer(true)}
                    className="relative w-full bg-gray-100 dark:bg-gray-900/80 cursor-pointer group"
                    style={{ height: 280 }}
                >
                    <iframe
                        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-full border-0 pointer-events-none"
                        title={filename}
                    />
                    {/* Hover overlay with two actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-90 flex items-center gap-3">
                            {/* View button */}
                            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-2xl shadow-xl flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-bold">{t('View')}</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Filename bar with download */}
                <div className="flex items-center border-t border-gray-100 dark:border-gray-700">
                    {/* Click filename area to view */}
                    <button
                        type="button"
                        onClick={() => setShowViewer(true)}
                        className="flex items-center space-x-3 px-4 py-3 flex-1 min-w-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                        <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} viewBox="0 0 32 32" fill="none">
                            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M20 2v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <rect x="7" y="18" width="18" height="8" rx="1.5" fill="currentColor"/>
                            <text x="16" y="24.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="system-ui">PDF</text>
                        </svg>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{filename}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('Click to preview')}</p>
                        </div>
                    </button>
                    {/* Download button */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex-shrink-0 px-4 py-3 border-l border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        title={t('Download PDF')}
                    >
                        {downloading ? (
                            <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        ) : (
                            <svg className={`w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:${iconColor} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Fullscreen PDF Viewer Modal */}
            {showViewer && createPortal(
                <div className="fixed inset-0 z-[99999] flex flex-col bg-black/80 backdrop-blur-sm animate-fade-in">
                    {/* Top bar */}
                    <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-900/90 border-b border-white/10">
                        <div className="flex items-center space-x-3 min-w-0">
                            <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} viewBox="0 0 32 32" fill="none">
                                <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
                                <rect x="7" y="18" width="18" height="8" rx="1.5" fill="currentColor"/>
                                <text x="16" y="24.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="system-ui">PDF</text>
                            </svg>
                            <span className="text-white text-sm font-semibold truncate">{filename}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Download button */}
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading}
                                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${btnGradient} text-white text-sm font-bold rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50`}
                            >
                                {downloading ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                )}
                                {t('Download PDF')}
                            </button>
                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setShowViewer(false)}
                                className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* PDF iframe — full interactive */}
                    <div className="flex-1 p-2 sm:p-6">
                        <iframe
                            src={`${previewUrl}#view=FitH`}
                            className="w-full h-full rounded-lg bg-white"
                            title={filename}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
