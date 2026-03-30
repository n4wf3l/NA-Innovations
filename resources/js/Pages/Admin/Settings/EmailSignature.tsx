import { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface SignatureData {
    enabled: string;
    logo_path: string;
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    linkedin: string;
    instagram: string;
    github: string;
    color: string;
}

interface Props {
    signature: SignatureData;
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';
const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function EmailSignature({ signature }: Props) {
    const { t } = useTranslation();
    const [form, setForm] = useState<SignatureData>(signature);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const update = (key: keyof SignatureData, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        router.put('/admin/settings/email-signature', form, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('logo', file);
        router.post('/admin/settings/email-signature/logo', fd, {
            preserveScroll: true,
            onFinish: () => setUploading(false),
        });
    };

    const handleDeleteLogo = () => {
        router.delete('/admin/settings/email-signature/logo', { preserveScroll: true });
    };

    const previewColors: Record<string, string> = {
        '#0d9488': 'Teal',
        '#3b82f6': 'Blue',
        '#8b5cf6': 'Purple',
        '#ef4444': 'Red',
        '#f59e0b': 'Amber',
        '#10b981': 'Emerald',
        '#6366f1': 'Indigo',
        '#111827': 'Dark',
    };

    const logoUrl = form.logo_path ? (form.logo_path.startsWith('http') ? form.logo_path : `/storage/${form.logo_path}`) : null;

    return (
        <AdminLayout header={t('Signature Email')}>
            <Head title={t('Signature Email')} />

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ─── Form ─── */}
                <div className="space-y-6">
                    {/* Activation */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Signature active')}</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={form.enabled === '1'} onChange={e => update('enabled', e.target.checked ? '1' : '0')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                            </label>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('La signature sera ajoutée automatiquement à tous les emails sortants.')}</p>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Logo')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                {logoUrl ? (
                                    <div className="relative group">
                                        <img src={logoUrl} alt="Logo" className="h-14 w-auto rounded-lg border border-gray-200 dark:border-gray-600 object-contain bg-white p-1" />
                                        <button
                                            onClick={handleDeleteLogo}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >&times;</button>
                                    </div>
                                ) : (
                                    <div className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z" /></svg>
                                    </div>
                                )}
                                <div>
                                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
                                    <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
                                        {uploading ? t('Upload...') : t('Changer le logo')}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1">{t('Recommandé : 200×60px, PNG ou SVG')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infos */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Informations')}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>{t('Nom')}</label>
                                    <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Titre / Fonction')}</label>
                                    <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t('Entreprise')}</label>
                                <input type="text" value={form.company} onChange={e => update('company', e.target.value)} className={inputClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>{t('Téléphone')}</label>
                                    <input type="text" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Email')}</label>
                                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>{t('Site web')}</label>
                                    <input type="text" value={form.website} onChange={e => update('website', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('Adresse')}</label>
                                    <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Réseaux sociaux')}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>LinkedIn</label>
                                <input type="url" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className={labelClass}>Instagram</label>
                                <input type="url" value={form.instagram} onChange={e => update('instagram', e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub</label>
                                <input type="url" value={form.github} onChange={e => update('github', e.target.value)} className={inputClass} placeholder="https://github.com/..." />
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Couleur accent')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(previewColors).map(([hex, name]) => (
                                    <button
                                        key={hex}
                                        onClick={() => update('color', hex)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === hex ? 'border-gray-900 dark:border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: hex }}
                                        title={name}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={form.color}
                                    onChange={e => update('color', e.target.value)}
                                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 dark:border-gray-600"
                                    title={t('Custom')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-teal-500/20"
                    >
                        {saving ? t('Enregistrement...') : t('Enregistrer la signature')}
                    </button>
                </div>

                {/* ─── Live Preview ─── */}
                <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">{t('Aperçu')}</h3>

                    {/* Email preview card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Fake email header */}
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                            </div>
                            <p className="text-[10px] text-gray-400"><span className="font-semibold text-gray-500">From:</span> {form.name} &lt;{form.email}&gt;</p>
                            <p className="text-[10px] text-gray-400"><span className="font-semibold text-gray-500">Subject:</span> {t('Votre devis est prêt')}</p>
                        </div>

                        {/* Email body */}
                        <div className="px-5 py-4">
                            <p className="text-sm text-gray-600 mb-4">{t('Bonjour,')}<br /><br />{t('Veuillez trouver ci-joint votre devis.')}<br /><br />{t('Cordialement,')}</p>

                            {/* Signature */}
                            {form.enabled === '1' && (
                                <div style={{ borderTop: `2px solid ${form.color}`, paddingTop: 16, marginTop: 16 }}>
                                    <table cellPadding={0} cellSpacing={0} style={{ fontFamily: 'Arial, sans-serif' }}>
                                        <tbody>
                                            <tr>
                                                {logoUrl && (
                                                    <td style={{ paddingRight: 16, verticalAlign: 'top' }}>
                                                        <img src={logoUrl} alt="Logo" style={{ height: 50, width: 'auto' }} />
                                                    </td>
                                                )}
                                                <td style={{ verticalAlign: 'top', borderLeft: logoUrl ? `2px solid ${form.color}20` : 'none', paddingLeft: logoUrl ? 16 : 0 }}>
                                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{form.name}</p>
                                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: form.color, fontWeight: 600 }}>{form.title}</p>
                                                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>{form.company}</p>
                                                    <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
                                                        {form.phone && <span><strong style={{ color: '#374151' }}>T.</strong> {form.phone}<br /></span>}
                                                        {form.email && <span><strong style={{ color: '#374151' }}>E.</strong> {form.email}<br /></span>}
                                                        {form.website && <span><strong style={{ color: '#374151' }}>W.</strong> {form.website}<br /></span>}
                                                        {form.address && <span><strong style={{ color: '#374151' }}>A.</strong> {form.address}</span>}
                                                    </div>
                                                    {(form.linkedin || form.instagram || form.github) && (
                                                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                                            {form.linkedin && <a href={form.linkedin} style={{ color: form.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a>}
                                                            {form.instagram && <a href={form.instagram} style={{ color: form.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>Instagram</a>}
                                                            {form.github && <a href={form.github} style={{ color: form.color, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>GitHub</a>}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t('Aperçu en temps réel — les modifications sont visibles immédiatement')}</p>
                </div>
            </div>
        </AdminLayout>
    );
}
