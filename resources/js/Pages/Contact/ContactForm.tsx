import { useTranslation } from 'react-i18next';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface Props {
    contactForm: ContactFormData;
    setContactForm: (form: ContactFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    turnstileSiteKey?: string;
    turnstileRef: React.RefObject<HTMLDivElement>;
    turnstileToken: string;
}

export default function ContactForm({ contactForm, setContactForm, onSubmit, processing, errors, turnstileSiteKey, turnstileRef, turnstileToken }: Props) {
    const { t } = useTranslation();

    const inputClasses = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    return (
        <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>{t('Full Name')}</label>
                        <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className={inputClasses}
                            placeholder="John Doe"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>{t('Email Address')}</label>
                        <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className={inputClasses}
                            placeholder="john@example.com"
                            required
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>{t('Subject')}</label>
                    <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className={inputClasses}
                        placeholder={t('How can we help you?')}
                        required
                    />
                </div>
                <div>
                    <label className={labelClasses}>{t('Message')}</label>
                    <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className={`${inputClasses} min-h-[160px] resize-y`}
                        placeholder={t('Project Description')}
                        required
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
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
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-teal-400 text-gray-900 text-base sm:text-lg font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_40px_rgba(94,234,212,0.3)] bebas disabled:opacity-50 disabled:cursor-not-allowed max-w-full"
                        style={{ letterSpacing: '2px' }}
                    >
                        <span className="truncate">{processing ? t('Sending...').toUpperCase() : t('Send Message').toUpperCase()}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
