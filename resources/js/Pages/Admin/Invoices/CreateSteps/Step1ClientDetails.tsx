import { User } from '@/types';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    form: {
        client_id: string;
        client_name: string;
        client_email: string;
        client_company: string;
        client_vat: string;
        type: string;
        title: string;
        issue_date: string;
        due_date: string;
        tax_rate: number;
    };
    set: (key: string, val: any) => void;
    handleClientSelect: (id: string) => void;
    clients: User[];
    input: string;
    label: string;
    errorRing: (name: string) => string;
    FieldError: React.ComponentType<{ name: string }>;
    validateStep1: () => boolean;
    setStep: (step: number) => void;
    ErrorBanner: React.ComponentType;
    invoiceTypes: { value: string; label: string }[];
}

export default function Step1ClientDetails({
    form, set, handleClientSelect, clients,
    input, label, errorRing, FieldError, validateStep1, setStep, ErrorBanner, invoiceTypes,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-page-in">
            <ErrorBanner />
            {/* Client */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                    <h3 className="text-white font-bold text-sm">{t("Client")}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{t("Who is this invoice for?")}</p>
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
                                        icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-white">{c.name.split(' ').map((w: string) => w[0]).join('').slice(0,2)}</span></div>,
                                    })),
                                ]}
                            />
                        </div>
                        <div>
                            <label className={label}>{t("Invoice Type")}</label>
                            <SearchableSelect
                                value={form.type}
                                onChange={(val) => set('type', val)}
                                options={invoiceTypes}
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
                            <input type="text" value={form.client_company} onChange={e => set('client_company', e.target.value)} className={input} />
                        </div>
                        <div>
                            <label className={label}>{t("VAT")}</label>
                            <input type="text" value={form.client_vat} onChange={e => set('client_vat', e.target.value)} className={input} placeholder="BE0123.456.789" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <h3 className="text-white font-bold text-sm">{t("Invoice Details")}</h3>
                    <p className="text-blue-200 text-xs mt-0.5">{t("Fill in the invoice information")}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className={label}>{t("Title")} <span className="text-red-400">*</span></label>
                        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={`${input} ${errorRing('title')}`} placeholder="e.g. Website Development - Final Invoice" />
                        <FieldError name="title" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={label}>{t("Issue Date")} <span className="text-red-400">*</span></label>
                            <input type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)} className={`${input} ${errorRing('issue_date')}`} />
                            <FieldError name="issue_date" />
                        </div>
                        <div>
                            <label className={label}>{t("Due Date")} <span className="text-red-400">*</span></label>
                            <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} className={`${input} ${errorRing('due_date')}`} />
                            <FieldError name="due_date" />
                        </div>
                        <div>
                            <label className={label}>{t("Tax Rate %")}</label>
                            <input type="number" value={form.tax_rate} onChange={e => set('tax_rate', parseFloat(e.target.value) || 0)} className={input} />
                        </div>
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
