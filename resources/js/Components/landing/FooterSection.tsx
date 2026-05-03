import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props {
    branding: { logo_path: string; company_name: string; tagline: string };
    socialLinks: Record<string, string>;
    socialIcons: Record<string, JSX.Element>;
    navLinks: { href: string; label: string }[];
}

export default function FooterSection({ branding, socialLinks, socialIcons, navLinks }: Props) {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top: Brand + Social */}
                <div className="text-center mb-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{branding.company_name}</h3>
                    {Object.keys(socialLinks).length > 0 && (
                        <div className="flex items-center justify-center gap-3">
                            {Object.entries(socialLinks).map(([platform, url]) => (
                                socialIcons[platform] ? (
                                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300">
                                        {socialIcons[platform]}
                                    </a>
                                ) : null
                            ))}
                        </div>
                    )}
                </div>

                {/* Columns - grid centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Quick Links')}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className="hover:text-teal-500 hover:underline transition">{link.label}</Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Contact')}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2">{t('Email')}: <a href="mailto:info@nainnovations.be" className="hover:underline">info@nainnovations.be</a></p>
                            <p className="mb-2 text-[11px] text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.178 10.21 8.28 14.453 4.5 17.166m5.138-6.291c.94 1.153 2.067 2.152 3.346 2.97m1.48 5.075c-.684-.315-1.377-.687-2.05-1.127" /></svg>
                                {t('Réponse en FR · NL · EN')}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Company Information')}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2 font-bold">{branding.company_name} BV</p>
                            <p className="mb-2">{t('Company Registration Number')}: 1025.939.504</p>
                            <p className="mb-2">{t('VAT Number')}: BE1025939504</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Legal')}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                            <Link href="/terms" className="hover:text-teal-500 hover:underline transition">{t('Terms & Conditions')}</Link>
                            <Link href="/privacy" className="hover:text-teal-500 hover:underline transition">{t('Privacy Policy')}</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-700 mt-12 w-full pt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} {branding.company_name}. {t('All rights reserved')}.</p>
                </div>
            </div>
        </footer>
    );
}
