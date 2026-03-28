import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { User, Lead } from '@/types';
import { useState, useMemo, useRef } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

import Step1ClientDetails from './CreateSteps/Step1ClientDetails';
import Step2LineItems from './CreateSteps/Step2LineItems';
import Step3Settings from './CreateSteps/Step3Settings';

interface Props {
    clients: User[];
    leads: Lead[];
    savedSignature?: string | null;
}

interface LineItem {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    is_optional: boolean;
}

export default function QuoteCreate({ clients, leads, savedSignature }: Props) {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'platform' | 'external'>('platform');
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // External upload state
    const [externalFile, setExternalFile] = useState<File | null>(null);
    const [externalIsSigned, setExternalIsSigned] = useState(false);
    const [externalForm, setExternalForm] = useState({
        title: '', client_id: '', client_name: '', client_email: '', client_company: '',
        total: '', issue_date: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], notes: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const setExt = (key: string, val: any) => {
        setExternalForm(prev => ({ ...prev, [key]: val }));
        setValidationErrors(prev => { const next = { ...prev }; delete next[`ext_${key}`]; return next; });
    };
    const handleExternalClientSelect = (id: string) => {
        setExt('client_id', id);
        const c = clients.find(c => c.id === Number(id));
        if (c) {
            setExternalForm(prev => ({ ...prev, client_id: id, client_name: c.name, client_email: c.email, client_company: c.company_name || '' }));
        }
    };
    const handleExternalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!externalForm.title.trim()) errors.ext_title = t('Ce champ est requis');
        if (!externalForm.client_name.trim()) errors.ext_client_name = t('Ce champ est requis');
        if (!externalForm.client_email.trim()) errors.ext_client_email = t('Ce champ est requis');
        if (!externalForm.total || parseFloat(externalForm.total) < 0) errors.ext_total = t('Ce champ est requis');
        if (!externalFile) errors.ext_file = t('Ce champ est requis');
        if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', externalFile!);
        formData.append('title', externalForm.title);
        formData.append('client_name', externalForm.client_name);
        formData.append('client_email', externalForm.client_email);
        formData.append('client_company', externalForm.client_company);
        if (externalForm.client_id) formData.append('client_id', externalForm.client_id);
        formData.append('total', externalForm.total);
        formData.append('issue_date', externalForm.issue_date);
        formData.append('valid_until', externalForm.valid_until);
        formData.append('notes', externalForm.notes);
        formData.append('is_signed', externalIsSigned ? '1' : '0');
        router.post('/admin/quotes/upload-external', formData, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
        });
    };

    // Form state
    const [form, setForm] = useState({
        title: '', client_id: '', client_name: '', client_email: '', client_company: '',
        client_address: '', client_vat: '', lead_id: '', introduction: '', scope_of_work: '',
        exclusions: '', tax_rate: 21, deposit_percentage: 30, valid_until: '', terms_and_conditions: '', notes: '', locale: 'fr',
    });

    const [items, setItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false },
    ]);

    const [includeSignature, setIncludeSignature] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(savedSignature || null);

    const set = (key: string, val: any) => {
        setForm(prev => ({ ...prev, [key]: val }));
        setValidationErrors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleClientSelect = (id: string) => {
        set('client_id', id);
        const c = clients.find(c => c.id === Number(id));
        if (c) {
            setForm(prev => ({ ...prev, client_id: id, client_name: c.name, client_email: c.email,
                client_company: c.company_name || '', client_vat: c.vat_number || '',
                client_address: [c.address, c.city, c.postal_code, c.country].filter(Boolean).join(', ') }));
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next['client_name'];
                delete next['client_email'];
                return next;
            });
        }
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false }]);
    const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof LineItem, val: any) => {
        const u = [...items]; u[i] = { ...u[i], [field]: val }; setItems(u);
        setValidationErrors(prev => {
            const next = { ...prev };
            delete next[`items.${i}.${field}`];
            return next;
        });
    };

    const subtotal = useMemo(() => items.filter(i => !i.is_optional).reduce((s, i) => s + i.quantity * i.unit_price, 0), [items]);
    const tax = useMemo(() => subtotal * (form.tax_rate / 100), [subtotal, form.tax_rate]);
    const total = subtotal + tax;
    const deposit = total * (form.deposit_percentage / 100);

    // FieldError inline component
    const FieldError = ({ name }: { name: string }) => {
        const pageErrors = (usePage().props as any).errors as Record<string, string> || {};
        const error = validationErrors[name] || pageErrors[name];
        if (!error) return null;
        return <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            {error}
        </p>;
    };

    // Validation
    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};
        if (!form.client_name.trim()) errors.client_name = t('Ce champ est requis');
        if (!form.client_email.trim()) {
            errors.client_email = t('Ce champ est requis');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) {
            errors.client_email = t('Adresse e-mail invalide');
        }
        if (!form.title.trim()) errors.title = t('Ce champ est requis');
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {};
        items.forEach((item, i) => {
            if (!item.description.trim()) errors[`items.${i}.description`] = t('La description est requise');
            if (item.quantity <= 0) errors[`items.${i}.quantity`] = t('La quantité doit être supérieure à 0');
            if (item.unit_price < 0) errors[`items.${i}.unit_price`] = t('Le prix ne peut pas être négatif');
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const stepHasErrors = (stepNum: number): boolean => {
        const pageErrors = (usePage().props as any).errors as Record<string, string> || {};
        const allErrors = { ...validationErrors, ...pageErrors };
        const keys = Object.keys(allErrors);
        if (stepNum === 1) return keys.some(k => ['client_name', 'client_email', 'title', 'introduction', 'scope_of_work', 'exclusions'].includes(k));
        if (stepNum === 2) return keys.some(k => k.startsWith('items.'));
        return false;
    };

    const goToStep = (target: number) => {
        if (target < step) { setStep(target); return; }
        if (step === 1 && target >= 2) { if (!validateStep1()) return; }
        if (step === 2 && target >= 3) { if (!validateStep2()) return; }
        if (step === 1 && target === 3) { if (!validateStep1()) return; setStep(2); return; }
        setStep(target);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const step1Errors: Record<string, string> = {};
        if (!form.client_name.trim()) step1Errors.client_name = t('Ce champ est requis');
        if (!form.client_email.trim()) {
            step1Errors.client_email = t('Ce champ est requis');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) {
            step1Errors.client_email = t('Adresse e-mail invalide');
        }
        if (!form.title.trim()) step1Errors.title = t('Ce champ est requis');
        if (Object.keys(step1Errors).length > 0) { setValidationErrors(step1Errors); setStep(1); return; }

        const step2Errors: Record<string, string> = {};
        items.forEach((item, i) => {
            if (!item.description.trim()) step2Errors[`items.${i}.description`] = t('La description est requise');
            if (item.quantity <= 0) step2Errors[`items.${i}.quantity`] = t('La quantité doit être supérieure à 0');
            if (item.unit_price < 0) step2Errors[`items.${i}.unit_price`] = t('Le prix ne peut pas être négatif');
        });
        if (Object.keys(step2Errors).length > 0) { setValidationErrors(step2Errors); setStep(2); return; }

        if (total === 0) {
            if (!window.confirm(t('Le total du devis est de 0 €. Voulez-vous continuer ?'))) return;
        }

        setSubmitting(true);
        router.post('/admin/quotes', {
            ...form, items, locale: form.locale,
            include_signature: includeSignature,
            signature_data: includeSignature ? signatureData : null,
        } as any, {
            onFinish: () => setSubmitting(false),
            onError: (errors) => {
                const keys = Object.keys(errors);
                if (keys.some(k => ['client_name', 'client_email', 'title', 'introduction', 'scope_of_work', 'exclusions'].includes(k))) setStep(1);
                else if (keys.some(k => k.startsWith('items.'))) setStep(2);
            },
        });
    };

    const pageErrors = (usePage().props as any).errors as Record<string, string> || {};
    const hasFieldError = (name: string) => !!(validationErrors[name] || pageErrors[name]);
    const errorRing = (name: string) => hasFieldError(name) ? 'ring-2 ring-red-400 border-red-300' : '';

    const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-teal-400 transition-all';
    const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';

    const ErrorBanner = () => Object.keys(validationErrors).length > 0 ? (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            <div><p className="text-sm font-bold text-red-800 dark:text-red-300">{t('Veuillez corriger les erreurs ci-dessous')}</p></div>
        </div>
    ) : null;

    return (
        <AdminLayout title={t("New Quote")} header={t("New Quote")}>
            <Head title={t("New Quote")} />

            {/* Mode selector */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setMode('platform')}
                            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mode === 'platform' ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode === 'platform' ? 'bg-teal-400 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-bold ${mode === 'platform' ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('Create on platform')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Use our quote builder with automatic calculations')}</p>
                            </div>
                        </button>
                        <button type="button" onClick={() => setMode('external')}
                            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mode === 'external' ? 'border-teal-400 bg-teal-50 dark:bg-teal-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode === 'external' ? 'bg-teal-400 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-bold ${mode === 'external' ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('Upload my own document')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Upload an existing quote as PDF')}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* External upload mode */}
            {mode === 'external' && (
                <form onSubmit={handleExternalSubmit} className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <div>
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{t('External document requirements')}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{t('The uploaded quote must be signed by both parties (your company and the client) to be valid. Unsigned documents are for reference only and have no legal value on the platform.')}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Client')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>{t('Quick Select')}</label>
                                <SearchableSelect value={externalForm.client_id} onChange={handleExternalClientSelect} placeholder={t("-- Manual entry --")} searchPlaceholder={t("Search clients...")}
                                    options={[{ value: '', label: t("-- Manual entry --") }, ...clients.map(c => ({ value: String(c.id), label: c.name, sublabel: c.company_name || undefined, icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-white">{c.name.split(' ').map(w => w[0]).join('').slice(0,2)}</span></div> }))]} />
                            </div>
                            <div><label className={label}>{t('Company')}</label><input type="text" value={externalForm.client_company} onChange={e => setExt('client_company', e.target.value)} className={input} /></div>
                            <div><label className={label}>{t('Name')} <span className="text-red-400">*</span></label><input type="text" value={externalForm.client_name} onChange={e => setExt('client_name', e.target.value)} className={`${input} ${validationErrors.ext_client_name ? 'ring-2 ring-red-400 border-red-300' : ''}`} placeholder="John Doe" />{validationErrors.ext_client_name && <p className="text-xs text-red-500 mt-1.5">{validationErrors.ext_client_name}</p>}</div>
                            <div><label className={label}>{t('Email')} <span className="text-red-400">*</span></label><input type="email" value={externalForm.client_email} onChange={e => setExt('client_email', e.target.value)} className={`${input} ${validationErrors.ext_client_email ? 'ring-2 ring-red-400 border-red-300' : ''}`} placeholder="john@company.com" />{validationErrors.ext_client_email && <p className="text-xs text-red-500 mt-1.5">{validationErrors.ext_client_email}</p>}</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Document details')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className={label}>{t('Title')} <span className="text-red-400">*</span></label><input type="text" value={externalForm.title} onChange={e => setExt('title', e.target.value)} className={`${input} ${validationErrors.ext_title ? 'ring-2 ring-red-400 border-red-300' : ''}`} placeholder={t('e.g. Website Development Proposal')} />{validationErrors.ext_title && <p className="text-xs text-red-500 mt-1.5">{validationErrors.ext_title}</p>}</div>
                            <div><label className={label}>{t('Total amount (incl. tax)')} <span className="text-red-400">*</span></label><input type="number" step="0.01" min="0" value={externalForm.total} onChange={e => setExt('total', e.target.value)} className={`${input} ${validationErrors.ext_total ? 'ring-2 ring-red-400 border-red-300' : ''}`} placeholder="0.00" />{validationErrors.ext_total && <p className="text-xs text-red-500 mt-1.5">{validationErrors.ext_total}</p>}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className={label}>{t('Issue date')}</label><input type="date" value={externalForm.issue_date} onChange={e => setExt('issue_date', e.target.value)} className={input} /></div>
                            <div><label className={label}>{t('Valid until')}</label><input type="date" value={externalForm.valid_until} onChange={e => setExt('valid_until', e.target.value)} className={input} /></div>
                        </div>
                        <div><label className={label}>{t('Notes')}</label><textarea value={externalForm.notes} onChange={e => setExt('notes', e.target.value)} rows={3} className={input} placeholder={t('Internal notes (not shown on quote)...')} /></div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t('Document file')}</h3>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${validationErrors.ext_file ? 'border-red-300 bg-red-50 dark:bg-red-500/5' : 'border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 bg-gray-50 dark:bg-gray-700/30'}`}
                            onClick={() => fileInputRef.current?.click()} onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={e => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files[0]; if (f) { setExternalFile(f); setValidationErrors(prev => { const n = {...prev}; delete n.ext_file; return n; }); } }}>
                            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) { setExternalFile(f); setValidationErrors(prev => { const n = {...prev}; delete n.ext_file; return n; }); } }} />
                            {!externalFile ? (<><svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg><p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Click or drag a file here')}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG — {t('Max')} 20 MB</p></>) : (
                                <div className="flex items-center justify-center gap-3"><svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg><div className="text-left"><p className="text-sm font-bold text-gray-900 dark:text-white">{externalFile.name}</p><p className="text-xs text-gray-400">{(externalFile.size / 1024 / 1024).toFixed(2)} MB</p></div><button type="button" onClick={e => { e.stopPropagation(); setExternalFile(null); }} className="ml-4 p-1.5 text-gray-400 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                            )}
                        </div>
                        {validationErrors.ext_file && <p className="text-xs text-red-500 mt-1.5">{validationErrors.ext_file}</p>}
                        <div className="mt-4 flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={externalIsSigned} onChange={e => setExternalIsSigned(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" /></label>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{t('This document is signed by both parties')}</span>
                        </div>
                        {!externalIsSigned && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-14">{t("This document will be marked as 'Draft' and won't be sent to the client.")}</p>}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Link href="/admin/quotes" className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{t('Cancel')}</Link>
                        <button type="submit" disabled={submitting} className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 flex items-center gap-2">
                            {submitting ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Uploading...')}</>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>{t('Upload quote')}</>)}
                        </button>
                    </div>
                </form>
            )}

            {/* Platform mode - Progress stepper */}
            {mode === 'platform' && (<>
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[t('Client & Details'), t('Line Items'), t('Settings & Review')].map((s, i) => (
                        <button key={s} onClick={() => goToStep(i + 1)} className="flex items-center space-x-2 group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                stepHasErrors(i + 1) ? 'bg-red-500 text-white ring-2 ring-red-300' :
                                step > i + 1 ? 'bg-teal-500 text-white' :
                                step === i + 1 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' :
                                'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            }`}>{stepHasErrors(i + 1) ? '!' : step > i + 1 ? '\u2713' : i + 1}</div>
                            <span className={`text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
                        </button>
                    ))}
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl mx-auto">
                {step === 1 && (
                    <Step1ClientDetails form={form} set={set} handleClientSelect={handleClientSelect} clients={clients} leads={leads}
                        input={input} label={label} errorRing={errorRing} FieldError={FieldError} validateStep1={validateStep1} setStep={setStep} ErrorBanner={ErrorBanner} />
                )}
                {step === 2 && (
                    <Step2LineItems items={items} addItem={addItem} removeItem={removeItem} updateItem={updateItem}
                        subtotal={subtotal} tax={tax} total={total} errorRing={errorRing} FieldError={FieldError}
                        validateStep2={validateStep2} setStep={setStep} goToStep={goToStep} ErrorBanner={ErrorBanner} />
                )}
                {step === 3 && (
                    <Step3Settings form={form} set={set} subtotal={subtotal} tax={tax} total={total} deposit={deposit}
                        items={items} submitting={submitting} includeSignature={includeSignature} setIncludeSignature={setIncludeSignature}
                        signatureData={signatureData} setSignatureData={setSignatureData} savedSignature={savedSignature}
                        input={input} label={label} goToStep={goToStep} ErrorBanner={ErrorBanner} />
                )}
            </form>
            </>)}
        </AdminLayout>
    );
}
