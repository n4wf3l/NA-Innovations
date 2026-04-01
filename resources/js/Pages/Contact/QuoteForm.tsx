import { useTranslation } from 'react-i18next';
import CustomSelect from '@/Components/ui/CustomSelect';

interface QuoteFormData {
    name: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    budget: string;
    timeline: string;
    message: string;
}

interface Props {
    quoteForm: QuoteFormData;
    setQuoteForm: (form: QuoteFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    projectTypes: Record<string, string>;
    errors: Record<string, string>;
    attachments: File[];
    setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
    turnstileSiteKey?: string;
    turnstileRef: React.RefObject<HTMLDivElement>;
    turnstileToken: string;
    refCode?: string;
    setRefCode?: (code: string) => void;
}

export default function QuoteForm({ quoteForm, setQuoteForm, onSubmit, processing, projectTypes, errors, attachments, setAttachments, turnstileSiteKey, turnstileRef, turnstileToken, refCode, setRefCode }: Props) {
    const { t } = useTranslation();

    const inputClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>{t('Full Name')}</label>
                        <input
                            type="text"
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                            className={inputClasses}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Email Address')}</label>
                        <input
                            type="email"
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                            className={inputClasses}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>{t('Company Name')}</label>
                        <input
                            type="text"
                            value={quoteForm.company}
                            onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                            className={inputClasses}
                            placeholder="Your Company"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Phone Number')}</label>
                        <input
                            type="tel"
                            value={quoteForm.phone}
                            onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                            className={inputClasses}
                            placeholder="+32 XXX XX XX XX"
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>{t('Project Type')}</label>
                    <CustomSelect
                        value={quoteForm.service}
                        onChange={(v) => setQuoteForm({ ...quoteForm, service: v })}
                        options={Object.entries(projectTypes).map(([key, label]) => ({ value: key, label: label as string }))}
                        placeholder="Select a project type"
                        required
                        searchable
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>{t('Budget Range')}</label>
                        <CustomSelect
                            value={quoteForm.budget}
                            onChange={(v) => setQuoteForm({ ...quoteForm, budget: v })}
                            options={[
                                { value: '1000', label: 'Less than 1,000 EUR' },
                                { value: '3000', label: '1,000 - 5,000 EUR' },
                                { value: '7500', label: '5,000 - 10,000 EUR' },
                                { value: '15000', label: '10,000 - 25,000 EUR' },
                                { value: '35000', label: '25,000 - 50,000 EUR' },
                                { value: '75000', label: '50,000+ EUR' },
                            ]}
                            placeholder="Select a budget range"
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Timeline')}</label>
                        <CustomSelect
                            value={quoteForm.timeline}
                            onChange={(v) => setQuoteForm({ ...quoteForm, timeline: v })}
                            options={[
                                { value: 'ASAP', label: 'As soon as possible' },
                                { value: '1-2 months', label: '1-2 months' },
                                { value: '3-6 months', label: '3-6 months' },
                                { value: '6+ months', label: '6+ months' },
                                { value: 'flexible', label: 'Flexible / No rush' },
                            ]}
                            placeholder="Select a timeline"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>{t('Project Description')}</label>
                    <textarea
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                        className={`${inputClasses} min-h-[160px] resize-y`}
                        placeholder="Describe your project, goals, and any specific requirements..."
                        required
                    />
                </div>
                {/* File attachments */}
                <div>
                    <label className={labelClasses}>{t('Attachments (optional)')}</label>
                    <p className="text-xs text-gray-400 mb-3">Add any relevant documents: brief, mockups, specifications... (PDF, DOC, images -- max 10MB each)</p>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all group">
                        <div className="flex flex-col items-center">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            <span className="text-sm text-gray-500 group-hover:text-teal-600 mt-1">{t('Click to add files')}</span>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.zip"
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setAttachments(prev => [...prev, ...files]);
                                e.target.value = '';
                            }}
                        />
                    </label>
                    {attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                        <span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                                    </div>
                                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition flex-shrink-0 ml-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Referral code */}
                <div>
                    <label className={labelClasses}>
                        {t('Code partenaire')}
                        <span className="text-gray-400 font-normal ml-1">({t('optional').toLowerCase()})</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={refCode || ''}
                            onChange={e => setRefCode?.(e.target.value.toUpperCase())}
                            className={`${inputClasses} ${refCode ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10' : ''}`}
                            placeholder={t('Ex: JONATHAN')}
                        />
                        {refCode && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Si quelqu\'un vous a recommandé, entrez son code ici.')}</p>
                </div>

                {turnstileSiteKey && (
                    <div className="flex justify-center pt-2">
                        <div ref={turnstileRef} />
                    </div>
                )}
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        disabled={processing || (!!turnstileSiteKey && !turnstileToken)}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-teal-400 text-gray-900 text-lg font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] bebas disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ letterSpacing: '2px' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        {processing ? t('Sending...').toUpperCase() : t('Submit Request').toUpperCase()}
                    </button>
                </div>
            </form>
        </div>
    );
}
