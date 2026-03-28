import { User, Lead } from '@/types';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    form: {
        client_id: string;
        client_name: string;
        client_email: string;
        client_company: string;
        client_vat: string;
        lead_id: string;
        title: string;
        introduction: string;
        scope_of_work: string;
        exclusions: string;
    };
    set: (key: string, val: any) => void;
    handleClientSelect: (id: string) => void;
    clients: User[];
    leads: Lead[];
    input: string;
    label: string;
    errorRing: (name: string) => string;
    FieldError: React.ComponentType<{ name: string }>;
    validateStep1: () => boolean;
    setStep: (step: number) => void;
    ErrorBanner: React.ComponentType;
}

export default function Step1ClientDetails({
    form, set, handleClientSelect, clients, leads,
    input, label, errorRing, FieldError, validateStep1, setStep, ErrorBanner,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-page-in">
            <ErrorBanner />
            {/* Client */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                    <h3 className="text-white font-bold text-sm">{t("Client")}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{t("Who is this quote for?")}</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={label}>{t("Quick Select")}</label>
                            <SearchableSelect
                                value={form.client_id}
                                onChange={handleClientSelect}
                                placeholder={t("-- Manual entry --")}
                                searchPlaceholder={t("Search clients...")}
                                options={[
                                    { value: '', label: t("-- Manual entry --") },
                                    ...clients.map(c => ({
                                        value: String(c.id),
                                        label: c.name,
                                        sublabel: c.company_name || undefined,
                                        icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-white">{c.name.split(' ').map(w => w[0]).join('').slice(0,2)}</span></div>,
                                    })),
                                ]}
                            />
                        </div>
                        <div>
                            <label className={label}>{t("Link to Lead")}</label>
                            <SearchableSelect
                                value={form.lead_id}
                                onChange={val => set('lead_id', val)}
                                placeholder={t("None")}
                                searchPlaceholder={t("Search leads...")}
                                options={[
                                    { value: '', label: t("None") },
                                    ...leads.map(l => ({
                                        value: String(l.id),
                                        label: `${l.first_name} ${l.last_name}`,
                                        sublabel: l.company_name || undefined,
                                    })),
                                ]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={label}>{t("Name")} <span className="text-red-400">*</span></label>
                            <input type="text" value={form.client_name} onChange={e => set('client_name', e.target.value)} className={`${input} ${errorRing('client_name')}`} placeholder="John Doe" />
                            <FieldError name="client_name" />
                        </div>
                        <div>
                            <label className={label}>{t("Email")} <span className="text-red-400">*</span></label>
                            <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} className={`${input} ${errorRing('client_email')}`} placeholder="john@company.com" />
                            <FieldError name="client_email" />
                        </div>
                        <div>
                            <label className={label}>{t("Company")}</label>
                            <input type="text" value={form.client_company} onChange={e => set('client_company', e.target.value)} className={input} placeholder="Acme Inc." />
                        </div>
                        <div>
                            <label className={label}>{t("VAT")}</label>
                            <input type="text" value={form.client_vat} onChange={e => set('client_vat', e.target.value)} className={input} placeholder="BE0123.456.789" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                    <h3 className="text-white font-bold text-sm">{t("Quote Details")}</h3>
                    <p className="text-amber-100 text-xs mt-0.5">{t("Describe what you're proposing")}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className={label}>{t("Title")} <span className="text-red-400">*</span></label>
                        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={`${input} ${errorRing('title')}`} placeholder="e.g. E-commerce Platform Development" />
                        <FieldError name="title" />
                    </div>
                    <div>
                        <label className={label}>{t("Introduction")}</label>
                        <textarea value={form.introduction} onChange={e => set('introduction', e.target.value)} rows={3} className={`${input} ${errorRing('introduction')}`} placeholder="Following our meeting, we're pleased to propose..." />
                        <FieldError name="introduction" />
                    </div>
                    <div>
                        <label className={label}>{t("Scope of Work")}</label>
                        <textarea value={form.scope_of_work} onChange={e => set('scope_of_work', e.target.value)} rows={4} className={input} placeholder="This proposal covers..." />
                    </div>
                    <div>
                        <label className={label}>{t("Exclusions")}</label>
                        <textarea value={form.exclusions} onChange={e => set('exclusions', e.target.value)} rows={2} className={input} placeholder="Not included: content writing, stock photos..." />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={() => { if (validateStep1()) setStep(2); }}
                    className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                    {t("Next")}: {t("Line Items")} →
                </button>
            </div>
        </div>
    );
}
