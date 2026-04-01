import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    emailTemplate: { subject: string; body: string };
    partnerName: string;
    projectTypes: { value: string; label: string; commission_rate: number }[];
}

export default function PartnerLeadSubmit({ emailTemplate, partnerName, projectTypes }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        service_interest: '',
        estimated_budget: '',
        notes: '',
        email_subject: emailTemplate.subject,
        email_body: emailTemplate.body,
    });

    const getPreviewBody = () => {
        return data.email_body
            .replace(/\{\{\s*client_name\s*\}\}/g, `${data.first_name} ${data.last_name}`.trim() || '[Client Name]')
            .replace(/\{\{\s*client_email\s*\}\}/g, data.email || '[Client Email]')
            .replace(/\{\{\s*partner_name\s*\}\}/g, partnerName)
            .replace(/\{\{\s*company_name\s*\}\}/g, data.company_name || '[Company]')
            .replace(/\{\{\s*service_interest\s*\}\}/g, formatProjectType(data.service_interest) !== '--' ? formatProjectType(data.service_interest) : '[Service]')
            .replace(/\{\{\s*estimated_budget\s*\}\}/g, data.estimated_budget || '[Budget]');
    };

    const openModal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.first_name || !data.last_name || !data.email) return;
        setShowModal(true);
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    const confirmSend = () => {
        post('/partner/leads/submit');
    };

    const input = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-rose-400 focus:ring-rose-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors';
    const inputLg = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-2xl px-5 py-4 text-base text-gray-900 dark:text-white focus:border-rose-400 focus:ring-rose-400 placeholder-gray-300 dark:placeholder-gray-500 transition-colors';
    const label = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider';

    const [viewMode, setViewMode] = useState<'split' | 'classic'>(() => {
        if (typeof window !== 'undefined') return (localStorage.getItem('partner_submit_view') as any) || 'split';
        return 'split';
    });
    const toggleView = (mode: 'split' | 'classic') => { setViewMode(mode); localStorage.setItem('partner_submit_view', mode); };

    // Quick mode for mobile — simplified form
    const [quickMode, setQuickMode] = useState(false);

    const selectedType = projectTypes.find((p: any) => p.value === data.service_interest);

    // Live preview card (render function, not component)
    const renderPreviewCard = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-black">
                        {(data.first_name?.[0] || '?').toUpperCase()}{(data.last_name?.[0] || '').toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{data.first_name || t('Prénom')} {data.last_name || t('Nom')}</h3>
                        <p className="text-rose-200 text-sm">{data.company_name || t('Entreprise')}</p>
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    <span className="text-gray-600 dark:text-gray-300">{data.email || 'email@example.com'}</span>
                </div>
                {data.phone && (
                    <div className="flex items-center gap-3 text-sm">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                        <span className="text-gray-600 dark:text-gray-300">{data.phone}</span>
                    </div>
                )}
                {selectedType && (
                    <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-500/10 rounded-xl px-4 py-3 mt-2">
                        <span className="text-sm font-medium text-rose-700 dark:text-rose-300">{selectedType.label}</span>
                        <span className="text-lg font-black text-rose-600 dark:text-rose-400">{selectedType.commission_rate}%</span>
                    </div>
                )}
                {data.estimated_budget && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-400">{t('Budget estimé')}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">€{Number(data.estimated_budget).toLocaleString()}</span>
                    </div>
                )}
                {data.notes && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">{t('Notes')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{data.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const hint = 'text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed';

    // Form fields as a render function (NOT a component — avoids remount on re-render)
    const renderFormFields = (inputStyle: string) => (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={label}>{t('First Name')} <span className="text-rose-400">*</span></label>
                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputStyle} placeholder="John" required />
                    {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                </div>
                <div>
                    <label className={label}>{t('Last Name')}</label>
                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputStyle} placeholder="Doe" />
                    <p className={hint}>{t('Pas obligatoire si vous ne le connaissez pas.')}</p>
                    {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                </div>
            </div>
            <div>
                <label className={label}>{t('Email')} <span className="text-rose-400">*</span></label>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputStyle} placeholder="john@company.com" required />
                <p className={hint}>{t('L\'adresse email professionnelle de la personne. C\'est à cette adresse que nous enverrons la proposition.')}</p>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={label}>{t('Phone')}</label>
                    <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputStyle} placeholder="+32 470 123 456" />
                    <p className={hint}>{t('Optionnel. Si vous l\'avez, ça nous aide à les contacter.')}</p>
                </div>
                <div>
                    <label className={label}>{t('Company')}</label>
                    <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className={inputStyle} placeholder="Acme Inc." />
                    <p className={hint}>{t('Le nom de leur entreprise ou commerce.')}</p>
                </div>
            </div>
            <div>
                <label className={label}>{t('What do they need?')}</label>
                <SearchableSelect
                    value={data.service_interest}
                    onChange={(val) => setData('service_interest', val)}
                    placeholder={t('Sélectionner le type')}
                    options={projectTypes.map((pt: any) => ({ value: pt.value, label: pt.label }))}
                />
                <p className={hint}>{t('Pas sûr ? Choisissez ce qui se rapproche le plus. Nous clarifierons avec le client.')}</p>
            </div>
            <div>
                <label className={label}>{t('Estimated Budget')}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-semibold text-sm">€</span>
                    <input type="number" value={data.estimated_budget} onChange={e => setData('estimated_budget', e.target.value)} className={inputStyle + ' pl-9'} placeholder="5,000" min="0" step="100" />
                </div>
                <p className={hint}>{t('Une estimation approximative suffit. Laissez vide si vous n\'en avez aucune idée.')}</p>
            </div>
            <div>
                <label className={label}>{t('Notes')}</label>
                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className={inputStyle} placeholder={t('Ex: Il veut un site pour son restaurant avec réservation en ligne...')} />
                <p className={hint}>{t('En quelques mots, qu\'est-ce que cette personne recherche ? Pas besoin d\'être technique.')}</p>
            </div>
        </>
    );

    return (
        <PartnerLayout title={t("Submit a Client")}>
            <Head title={t("Submit a Client")} />

            {/* Top bar with view modes */}
            <div className="flex items-center justify-between mb-5">
                <Link href="/partner/leads" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    {t('Mes leads')}
                </Link>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
                    {[
                        { id: 'quick', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', tip: t('Mode rapide') },
                        { id: 'split', icon: 'M9 4.5v15m6-15v15M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z', tip: t('Vue partagée') },
                        { id: 'classic', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z', tip: t('Vue classique') },
                    ].map(v => {
                        const isActive = v.id === 'quick' ? quickMode : (!quickMode && viewMode === v.id);
                        return (
                            <button
                                key={v.id}
                                onClick={() => {
                                    if (v.id === 'quick') { setQuickMode(true); }
                                    else { setQuickMode(false); toggleView(v.id as any); }
                                }}
                                className={`relative group w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                    isActive
                                        ? v.id === 'quick' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title={v.tip}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5}><path strokeLinecap="round" strokeLinejoin="round" d={v.icon} /></svg>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Mode info banner */}
            {quickMode && (
                <div className="mb-4 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                    <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    <p className="text-sm text-rose-700 dark:text-rose-300 flex-1">{t('Mode rapide — remplissez juste l\'essentiel. Vous pourrez compléter les détails plus tard.')}</p>
                    <button onClick={() => setQuickMode(false)} className="text-xs text-rose-500 hover:text-rose-700 font-semibold whitespace-nowrap">{t('Mode complet')}</button>
                </div>
            )}

            {/* ═══ QUICK MODE ═══ */}
            {quickMode && (
                <div key="quick" className="animate-tab-in">
                    <form onSubmit={openModal} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-5">
                            <h2 className="text-lg font-bold text-white">{t('Soumission rapide')}</h2>
                            <p className="text-rose-200 text-xs mt-0.5">{t('Juste l\'essentiel — 30 secondes')}</p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={label}>{t('First Name')} <span className="text-rose-400">*</span></label>
                                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={input} placeholder="John" required autoFocus />
                                </div>
                                <div>
                                    <label className={label}>{t('Last Name')}</label>
                                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={input} placeholder="Doe" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={label}>{t('Email')} <span className="text-rose-400">*</span></label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={input} placeholder="john@company.com" required />
                                </div>
                                <div>
                                    <label className={label}>{t('Phone')}</label>
                                    <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={input} placeholder="+32 470 123 456" />
                                </div>
                            </div>
                            <div>
                                <label className={label}>{t('Type de projet')}</label>
                                <select value={data.service_interest} onChange={e => setData('service_interest', e.target.value)} className={input}>
                                    <option value="">{t('Sélectionner le type')}</option>
                                    {projectTypes.map((pt: any) => (
                                        <option key={pt.value} value={pt.value}>{pt.label} — {pt.commission_rate}%</option>
                                    ))}
                                </select>
                                {selectedType && (
                                    <div className="mt-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3 animate-scale-in">
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{selectedType.commission_rate}%</span>
                                        <span className="text-sm text-emerald-700 dark:text-emerald-300">{t('de commission')}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className={label}>{t('Notes')} <span className="text-gray-300 dark:text-gray-600 font-normal">({t('optional')})</span></label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} className={input + ' resize-none'} rows={2} placeholder={t('Ex: Il a un restaurant sans site web, intéressé par une commande en ligne...')} />
                            </div>
                        </div>
                        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                            <button type="submit" disabled={!data.first_name || !data.email} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                {t('Review & Send')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ═══ SPLIT VIEW ═══ */}
            {!quickMode && viewMode === 'split' && (
                <div key="split" className="animate-tab-in grid grid-cols-1 lg:grid-cols-5 gap-6 pb-8">
                    {/* Left: Form (3/5) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('New Client')}</h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">{t("Fill in the details. We'll prepare a professional email with a PDF summary.")}</p>
                            <form onSubmit={openModal} className="space-y-4">
                                {renderFormFields(input)}
                                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                    {t('Review & Send')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Live preview (2/5) */}
                    <div className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start space-y-4">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Aperçu en direct')}</p>
                        {renderPreviewCard()}
                    </div>
                </div>
            )}

            {/* ═══ CLASSIC VIEW ═══ */}
            {!quickMode && viewMode === 'classic' && (
                <div key="classic" className="animate-tab-in max-w-lg mx-auto pb-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/25">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('New Client')}</h2>
                        <p className="text-gray-400 text-sm mt-1">{t("Fill in the details. We'll prepare a professional email with a PDF summary.")}</p>
                    </div>
                    <form onSubmit={openModal} className="space-y-5">
                        {renderFormFields(inputLg)}
                        <div className="pt-2">
                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                {t('Review & Send')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Email Modal - true fullscreen sheet on mobile, card on desktop */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center">
                    {/* Backdrop - only visible on desktop behind the card */}
                    <div className="hidden sm:block absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !processing && setShowModal(false)} />

                    {/*
                        Mobile: full screen, 3-part layout (fixed header, scrollable body, fixed footer)
                        Desktop: centered card with max-height
                    */}
                    <div className="relative z-10 bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[85vh] sm:rounded-2xl sm:shadow-2xl flex flex-col animate-modal">

                        {/* Fixed header */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between safe-top">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">{t("Review Email")}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">To: {data.first_name} {data.last_name}</p>
                            </div>
                            <button onClick={() => !processing && setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 active:bg-gray-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable body - this is the ONLY scrollable area */}
                        <div ref={modalRef} className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
                            <div className="p-5 space-y-5">
                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Subject")}</label>
                                    <input
                                        type="text"
                                        value={data.email_subject}
                                        onChange={e => setData('email_subject', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:border-rose-400 focus:ring-rose-400"
                                    />
                                </div>

                                {/* Email body */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        {t('Message')} <span className="font-normal normal-case text-gray-300 ml-1">({t('editable')})</span>
                                    </label>
                                    <textarea
                                        value={data.email_body}
                                        onChange={e => setData('email_body', e.target.value)}
                                        rows={10}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-rose-400 focus:ring-rose-400 font-mono leading-relaxed"
                                    />
                                </div>

                                {/* Preview */}
                                <details className="group">
                                    <summary className="cursor-pointer flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5 active:bg-gray-100 transition-colors">
                                        <span className="text-sm font-semibold text-gray-700">{t('Preview with variables replaced')}</span>
                                        <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </summary>
                                    <div className="mt-2 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 whitespace-pre-wrap border border-gray-100 max-h-60 overflow-y-auto">
                                        {getPreviewBody()}
                                    </div>
                                </details>

                                {/* PDF info */}
                                <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                    </svg>
                                    <p className="text-sm text-blue-600">{t("PDF attached automatically")}</p>
                                </div>

                                {/* Extra padding at bottom so content doesn't hide behind footer */}
                                <div className="h-4" />
                            </div>
                        </div>

                        {/* Fixed footer */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center space-x-3 safe-bottom">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={processing}
                                className="flex-1 py-4 text-base font-semibold text-gray-500 bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmSend}
                                disabled={processing}
                                className="flex-[2] py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-base font-black rounded-xl shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        {t('Sending...')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                        {t('Send Email')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </PartnerLayout>
    );
}
