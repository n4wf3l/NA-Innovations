import { useState } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface ServiceData {
    id: number;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    services: ServiceData[];
}

const iconOptions = [
    { value: 'globe', label: 'Globe' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'server', label: 'Server' },
    { value: 'code', label: 'Code' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'shield', label: 'Shield' },
];

const emptyForm = {
    title: '',
    description: '',
    icon: 'globe',
    sort_order: 0,
    is_active: true,
};

export default function PublicServices({ services }: Props) {
    const { t } = useTranslation();
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const openCreate = () => {
        setEditingService(null);
        setForm({ ...emptyForm, sort_order: services.length + 1 });
        setShowModal(true);
    };

    const openEdit = (service: ServiceData) => {
        setEditingService(service);
        setForm({
            title: service.title,
            description: service.description,
            icon: service.icon,
            sort_order: service.sort_order,
            is_active: service.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingService(null);
        setForm(emptyForm);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingService) {
            router.put(`/admin/settings/public-services/${editingService.id}`, form, {
                onFinish: () => setProcessing(false),
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/admin/settings/public-services', form, {
                onFinish: () => setProcessing(false),
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        setProcessing(true);
        router.delete(`/admin/settings/public-services/${id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteConfirm(null);
            },
        });
    };

    const toggleActive = (service: ServiceData) => {
        router.put(`/admin/settings/public-services/${service.id}`, {
            ...service,
            is_active: !service.is_active,
        });
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const order = services.map((s, i) => ({
            id: s.id,
            sort_order: i === index ? services[index - 1].sort_order : i === index - 1 ? services[index].sort_order : s.sort_order,
        }));
        router.post('/admin/settings/public-services/reorder', { order });
    };

    const moveDown = (index: number) => {
        if (index === services.length - 1) return;
        const order = services.map((s, i) => ({
            id: s.id,
            sort_order: i === index ? services[index + 1].sort_order : i === index + 1 ? services[index].sort_order : s.sort_order,
        }));
        router.post('/admin/settings/public-services/reorder', { order });
    };

    return (
        <AdminLayout title={t('Services publics')} header={t('Services publics')}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Services du site vitrine')}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Gérez les services affichés sur la page publique.')}</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Ajouter un service')}
                    </button>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-700 dark:text-teal-300 text-sm">
                        {flash.success}
                    </div>
                )}

                {/* Services List */}
                <div className="space-y-4">
                    {services.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">{t('Aucun service configuré.')}</p>
                        </div>
                    )}

                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-start gap-4 transition-all duration-200 ${
                                !service.is_active ? 'opacity-50' : ''
                            }`}
                        >
                            {/* Reorder buttons */}
                            <div className="flex flex-col gap-1 pt-1">
                                <button
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveDown(index)}
                                    disabled={index === services.length - 1}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                        {service.icon}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {service.title}
                                    </h3>
                                    {!service.is_active && (
                                        <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                                            {t('Inactif')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {service.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => toggleActive(service)}
                                    className={`p-2 rounded-lg transition ${
                                        service.is_active
                                            ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200'
                                    }`}
                                    title={service.is_active ? t('Désactiver') : t('Activer')}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        {service.is_active ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        )}
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openEdit(service)}
                                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                                    title={t('Modifier')}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(service.id)}
                                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition"
                                    title={t('Supprimer')}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingService ? t('Modifier le service') : t('Ajouter un service')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Titre')}</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Description')}</label>
                                <RichTextEditor
                                    value={form.description}
                                    onChange={(html) => setForm({ ...form, description: html })}
                                    placeholder={t('Description du service...')}
                                    minHeight={120}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Icône')}</label>
                                    <select
                                        value={form.icon}
                                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition"
                                    >
                                        {iconOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Ordre')}</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                                </label>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Actif')}</span>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                                >
                                    {t('Annuler')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium text-sm disabled:opacity-50"
                                >
                                    {processing ? t('Enregistrement...') : editingService ? t('Mettre à jour') : t('Créer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Confirmer la suppression')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            {t('Cette action est irréversible. Le service sera définitivement supprimé.')}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 transition"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={processing}
                                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm disabled:opacity-50"
                            >
                                {processing ? t('Suppression...') : t('Supprimer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
