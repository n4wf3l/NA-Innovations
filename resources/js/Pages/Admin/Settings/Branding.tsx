import { useState, FormEvent, ChangeEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/hooks/useConfirm';

interface SocialLink {
    key: string;
    url: string;
    description: string;
}

interface Props {
    socialLinks: SocialLink[];
    branding: {
        logo_path: string;
        company_name: string;
        tagline: string;
        video_url: string;
    };
    simulatorMode?: string;
    coldCallScript?: string;
}

const platformNames: Record<string, string> = {
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    facebook: 'Facebook',
    youtube: 'YouTube',
    tiktok: 'TikTok',
};

const socialIcons: Record<string, JSX.Element> = {
    instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    ),
    facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
    ),
};

export default function Branding({ socialLinks, branding, simulatorMode = 'europe_only', coldCallScript = '' }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [links, setLinks] = useState(socialLinks);
    const [companyName, setCompanyName] = useState(branding.company_name);
    const [tagline, setTagline] = useState(branding.tagline);
    const [videoUrl, setVideoUrl] = useState(branding.video_url || '');
    const [savingSocial, setSavingSocial] = useState(false);
    const [savingBranding, setSavingBranding] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [scriptText, setScriptText] = useState(coldCallScript);
    const [savingScript, setSavingScript] = useState(false);

    const handleScriptSave = (e: FormEvent) => {
        e.preventDefault();
        setSavingScript(true);
        router.put('/admin/settings/branding/cold-call-script', { cold_call_script: scriptText }, {
            preserveScroll: true,
            onFinish: () => setSavingScript(false),
        });
    };

    const handleSocialSave = (e: FormEvent) => {
        e.preventDefault();
        setSavingSocial(true);
        router.put('/admin/settings/branding/social', {
            links: links.map(l => ({ key: l.key, url: l.url })),
        }, {
            preserveScroll: true,
            onFinish: () => setSavingSocial(false),
        });
    };

    const handleBrandingSave = (e: FormEvent) => {
        e.preventDefault();
        setSavingBranding(true);
        router.put('/admin/settings/branding/info', {
            company_name: companyName,
            tagline,
            video_url: videoUrl,
        }, {
            preserveScroll: true,
            onFinish: () => setSavingBranding(false),
        });
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append('logo', e.target.files[0]);
        router.post('/admin/settings/branding/logo', formData, {
            preserveScroll: true,
            onFinish: () => setUploadingLogo(false),
        });
    };

    const handleLogoDelete = async () => {
        const ok = await confirm({
            title: t('Supprimer'),
            message: t('Êtes-vous sûr de vouloir supprimer le logo ?'),
            confirmText: t('Supprimer'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete('/admin/settings/branding/logo', {
            preserveScroll: true,
        });
    };

    const updateLinkUrl = (key: string, url: string) => {
        setLinks(prev => prev.map(l => l.key === key ? { ...l, url } : l));
    };

    return (
        <AdminLayout title={t('Branding')} header={t('Branding')}>
            <Head title={t('Branding')} />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 mb-8">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/20" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
                </div>
                <div className="relative">
                    <h1 className="text-3xl font-bold text-white">{t('Branding & Réseaux sociaux')}</h1>
                    <p className="mt-2 text-indigo-100">{t('Gérez le logo, les informations de marque et les liens vers vos réseaux sociaux.')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Company Branding */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                        </svg>
                        {t('Identité de marque')}
                    </h2>

                    {/* Logo Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('Logo de l\'entreprise')}
                        </label>
                        <div className="flex items-center gap-4">
                            {branding.logo_path ? (
                                <div className="relative group">
                                    <img
                                        src={`/storage/${branding.logo_path}`}
                                        alt={t('Logo')}
                                        className="w-24 h-24 object-contain rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2"
                                    />
                                    <button
                                        onClick={handleLogoDelete}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title={t('Supprimer le logo')}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25m0 0V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v9.75" />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    {uploadingLogo ? t('Envoi en cours...') : t('Télécharger un logo')}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        disabled={uploadingLogo}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, SVG, WebP. Max 2 Mo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Branding form */}
                    <form onSubmit={handleBrandingSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('Nom de l\'entreprise')}
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('Slogan')}
                            </label>
                            <input
                                type="text"
                                value={tagline}
                                onChange={e => setTagline(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder={t('Votre slogan ici...')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('URL vidéo de présentation')}
                            </label>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={e => setVideoUrl(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="https://www.youtube.com/embed/..."
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('URL d\'intégration YouTube ou Vimeo (format embed)')}</p>
                        </div>
                        <button
                            type="submit"
                            disabled={savingBranding}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {savingBranding ? t('Enregistrement...') : t('Enregistrer')}
                        </button>
                    </form>
                </div>

                {/* Section 2: Social Media Links */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.757 8.06a4.5 4.5 0 006.364 6.364l4.5-4.5z" />
                        </svg>
                        {t('Réseaux sociaux')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {t('Les liens renseignés seront affichés sur la page d\'accueil. Laissez vide pour masquer.')}
                    </p>

                    <form onSubmit={handleSocialSave} className="space-y-3">
                        {links.map((link) => (
                            <div key={link.key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                                {/* Status dot */}
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${link.url ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-500'}`} />

                                {/* Platform icon */}
                                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${link.url ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'}`}>
                                    {socialIcons[link.key] || null}
                                </div>

                                {/* Platform name + input */}
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                                        {platformNames[link.key] || link.key}
                                    </label>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={e => updateLinkUrl(link.key, e.target.value)}
                                        placeholder={`https://${link.key}.com/...`}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={savingSocial}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {savingSocial ? t('Enregistrement...') : t('Enregistrer les réseaux sociaux')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Simulator Mode */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('Simulateur de prix')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Contrôlez la visibilité du simulateur de prix sur la landing page')}</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { value: 'enabled', label: t('Activé pour tous'), desc: t('Le simulateur est visible par tous les visiteurs, peu importe leur localisation.'), icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', color: 'emerald' },
                            { value: 'europe_only', label: t('Europe uniquement'), desc: t('Visible uniquement pour les visiteurs avec un fuseau horaire européen.'), icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z', color: 'blue' },
                            { value: 'disabled', label: t('Désactivé'), desc: t('Le simulateur est masqué pour tout le monde.'), icon: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88', color: 'red' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => router.put('/admin/settings/simulator-mode', { mode: opt.value }, { preserveScroll: true })}
                                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                    simulatorMode === opt.value
                                        ? `border-${opt.color}-500 bg-${opt.color}-50 dark:bg-${opt.color}-500/10`
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${simulatorMode === opt.value ? `bg-${opt.color}-500 text-white` : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} /></svg>
                                    </div>
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{opt.label}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{opt.desc}</p>
                                {simulatorMode === opt.value && (
                                    <div className={`mt-2 flex items-center gap-1 text-xs font-semibold text-${opt.color}-600 dark:text-${opt.color}-400`}>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        {t('Mode actif')}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partner cold-call script */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('Script d\'appel — Partenaires')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Ce script est affiché aux partenaires sur la page Prospection > Scripts d\'appel.')}</p>
                    </div>
                </div>
                <form onSubmit={handleScriptSave} className="p-6 space-y-4">
                    <textarea
                        value={scriptText}
                        onChange={e => setScriptText(e.target.value)}
                        rows={10}
                        placeholder={t('Bonjour, je m\'appelle...')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono leading-relaxed focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Astuce : utilisez des placeholders comme [votre nom], [restaurant/club/entreprise] pour que le partenaire personnalise son discours. Les retours à la ligne sont conservés.')}
                    </p>
                    <button
                        type="submit"
                        disabled={savingScript}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {savingScript ? t('Enregistrement...') : t('Enregistrer le script')}
                    </button>
                </form>
            </div>

            <ConfirmDialog />
        </AdminLayout>
    );
}
