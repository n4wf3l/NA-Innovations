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
        <footer className="bg-gray-100 py-12">
            <div className="container mx-auto flex flex-col items-center px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full gap-8">
                    <div className="w-full md:w-1/4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">About {branding.company_name.split(' ').map(w => w[0]).join('')}</h3>
                        <p className="text-sm text-gray-600">NA is a software engineer and fullstack developer graduated in Belgium.</p>
                        {Object.keys(socialLinks).length > 0 && (
                            <div className="flex items-center mt-6 justify-center md:justify-start gap-3">
                                {Object.entries(socialLinks).map(([platform, url]) => (
                                    socialIcons[platform] ? (
                                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300">
                                            {socialIcons[platform]}
                                        </a>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
                        <div className="text-sm text-gray-600">
                            <p className="mb-2">Email: <a href="mailto:info@nainnovations.be" className="hover:underline">info@nainnovations.be</a></p>
                            <p className="mb-2">Phone: <a href="tel:+32490221912" className="hover:underline">+32 490 22 19 12</a></p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('Company Information')}</h3>
                        <div className="text-sm text-gray-600">
                            <p className="mb-2 font-bold">NA Innovations BV</p>
                            <p className="mb-2">Company Registration Number: 1025.939.504</p>
                            <p className="mb-2">VAT Number: BE1025939504</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('Legal')}</h3>
                        <div className="text-sm text-gray-600 flex flex-col gap-2">
                            <Link href="/terms" className="hover:text-teal-500 hover:underline transition">{t('Terms & Conditions')}</Link>
                            <Link href="/privacy" className="hover:text-teal-500 hover:underline transition">{t('Privacy Policy')}</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-300 mt-12 w-full pt-6 text-center">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {branding.company_name}. {t('All rights reserved')}.</p>
                </div>
            </div>
        </footer>
    );
}
