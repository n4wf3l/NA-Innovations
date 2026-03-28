import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface DocumentTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    body: string;
    available_variables: string[];
    requires_signature: boolean;
    is_active: boolean;
}

interface Project {
    id: number;
    nom_societe?: string;
    client?: { id: number; name: string; email?: string };
}

function replaceVariables(body: string, project: Project): string {
    const now = new Date();
    const replacements: Record<string, string> = {
        client_name: project.client?.name || '',
        project_name: project.nom_societe || '',
        agency_name: 'NA Innovations',
        date: now.toLocaleDateString('fr-BE'),
        year: String(now.getFullYear()),
    };
    let result = body;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value);
    }
    return result;
}

interface Props {
    show: boolean;
    onClose: () => void;
    templates: DocumentTemplate[];
    project: Project;
}

export default function GenerateModal({ show, onClose, templates, project }: Props) {
    const { t } = useTranslation();
    const [generating, setGenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [generateForm, setGenerateForm] = useState({ title: '', body: '', template_id: 0 });

    const categoryLabels: Record<string, string> = {
        legal: t('Juridique'),
        project: t('Projet'),
        delivery: t('Livraison'),
    };

    const groupedTemplates = templates.reduce<Record<string, DocumentTemplate[]>>((acc, tpl) => {
        const cat = tpl.category || 'project';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tpl);
        return acc;
    }, {});

    const handleSelectTemplate = (tpl: DocumentTemplate) => {
        setSelectedTemplate(tpl);
        const prefilledBody = replaceVariables(tpl.body, project);
        setGenerateForm({
            title: tpl.name,
            body: prefilledBody,
            template_id: tpl.id,
        });
    };

    const handleInsertVariable = (variable: string) => {
        setGenerateForm(f => ({ ...f, body: f.body + `{{ ${variable} }}` }));
    };

    const handleGenerate = () => {
        setGenerating(true);
        router.post(`/admin/projects/${project.id}/documents/generate`, generateForm, {
            onFinish: () => setGenerating(false),
            onSuccess: () => {
                onClose();
                setSelectedTemplate(null);
                setGenerateForm({ title: '', body: '', template_id: 0 });
            },
            preserveScroll: true,
        });
    };

    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !generating && onClose()} />

            <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">{t('Générer un document')}</h3>
                        <p className="text-white/70 text-xs mt-0.5">{project.nom_societe}</p>
                    </div>
                    <button onClick={() => !generating && onClose()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Template selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Choisir un template')}</label>
                        <div className="space-y-3">
                            {Object.entries(groupedTemplates).map(([category, tpls]) => (
                                <div key={category}>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">{categoryLabels[category] || category}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {tpls.map(tpl => (
                                            <button
                                                key={tpl.id}
                                                type="button"
                                                onClick={() => handleSelectTemplate(tpl)}
                                                className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                                                    selectedTemplate?.id === tpl.id
                                                        ? 'border-teal-400 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/10 ring-2 ring-teal-400/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900/50'
                                                }`}
                                            >
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{tpl.name}</p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{tpl.slug}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedTemplate && (
                        <>
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Titre du document')}</label>
                                <input
                                    type="text"
                                    value={generateForm.title}
                                    onChange={e => setGenerateForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            {/* Variables */}
                            {Array.isArray(selectedTemplate.available_variables) && selectedTemplate.available_variables.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Variables disponibles')}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedTemplate.available_variables.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => handleInsertVariable(v)}
                                                className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors cursor-pointer border border-teal-200 dark:border-teal-500/20"
                                                title={t('Cliquer pour insérer')}
                                            >
                                                {`{{ ${v} }}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Contenu du document')}</label>
                                <RichTextEditor
                                    value={generateForm.body}
                                    onChange={body => setGenerateForm(f => ({ ...f, body }))}
                                    placeholder={t('Contenu du document...')}
                                    minHeight={250}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={generating}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t('Annuler')}
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={generating || !selectedTemplate || !generateForm.title.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                    >
                        {generating ? (
                            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Génération...')}</>
                        ) : t('Générer')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
