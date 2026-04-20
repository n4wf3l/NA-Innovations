import DevLayout from '@/Layouts/DevLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatCurrency, formatDate, formatStatus, formatProjectType } from '@/lib/utils';
import UnifiedTimeline from '@/Components/ui/UnifiedTimeline';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useConfirm } from '@/hooks/useConfirm';
import SearchableSelect from '@/Components/ui/SearchableSelect';
import RichTextEditor from '@/Components/ui/RichTextEditor';
import DeliverablesChecklist from '@/Components/project/DeliverablesChecklist';
import { usePage } from '@inertiajs/react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimeEntryData {
    id: number;
    date: string;
    hours: string;
    description: string;
    task_category: string | null;
    is_billable: boolean;
    user?: { id: number; name: string };
}

interface NoteData {
    id: number;
    content: string;
    created_at: string;
    user?: { id: number; name: string };
}

interface DocData {
    id: number;
    title: string;
    content: string;
    category: string | null;
    is_client_visible: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    author_id: number;
    author?: { id: number; name: string };
}

interface MilestoneData {
    id: number;
    label: string;
    description: string | null;
    due_date: string | null;
    status: string;
    sort_order: number;
}

interface DevMessageData {
    id: number;
    sender_id: number;
    recipient_role: string;
    content: string;
    created_at: string;
    sender?: { id: number; name: string; role?: string };
}

interface DevSettings {
    showMilestones: boolean;
    showCredentials: boolean;
    showMessaging: boolean;
    allowBlockedStatus: boolean;
    showUsefulLinks: boolean;
    decloisonedNotes: boolean;
    allowRelease: boolean;
}

interface Props {
    project: any;
    myTimeEntries: TimeEntryData[];
    totalHours: number;
    myNotes: NoteData[];
    authUserId: number;
    projectDocs: DocData[];
    milestones?: MilestoneData[];
    devMessages?: DevMessageData[];
    devSettings?: DevSettings;
}

const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';
const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-700 transition-all';
const labelCls = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

const categoryLabels: Record<string, string> = {
    development: 'Development',
    design: 'Design',
    meeting: 'Meeting',
    testing: 'Testing',
    deployment: 'Deployment',
    other: 'Other',
};

const categoryColors: Record<string, string> = {
    development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    design: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    meeting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    testing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    deployment: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const docCategoryColors: Record<string, string> = {
    architecture: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    api: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    deployment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    database: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    setup: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const docCategoryLabels: Record<string, string> = {
    architecture: 'Architecture',
    api: 'API',
    deployment: 'Deployment',
    database: 'Database',
    setup: 'Setup',
    other: 'Other',
};

const allowedTransitions: Record<string, string[]> = {
    planning: ['in_progress'],
    in_progress: ['review'],
    review: ['in_progress'],
};

function SortableMilestoneRow({ m, t, children }: { m: MilestoneData; t: any; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
            <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label={t('Déplacer')}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
            </button>
            {children}
        </div>
    );
}

export default function ProjectShow({ project, myTimeEntries, totalHours, myNotes, authUserId, projectDocs = [], milestones = [], devMessages = [], devSettings }: Props) {
    const ds: DevSettings = devSettings || { showMilestones: false, showCredentials: false, showMessaging: false, allowBlockedStatus: false, showUsefulLinks: false, decloisonedNotes: false, allowRelease: false };
    const milestoneForm = useForm({ label: '', description: '', due_date: '', status: 'pending' });
    const [orderedMilestones, setOrderedMilestones] = useState<MilestoneData[]>(milestones);
    useEffect(() => {
        setOrderedMilestones(milestones);
    }, [milestones.map(m => m.id).join(',')]);
    const milestoneSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const handleMilestoneDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = orderedMilestones.findIndex(m => m.id === active.id);
        const newIndex = orderedMilestones.findIndex(m => m.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;
        const next = arrayMove(orderedMilestones, oldIndex, newIndex);
        setOrderedMilestones(next);
        router.post(`/dev/projects/${project.id}/milestones/reorder`, { ids: next.map(m => m.id) }, { preserveScroll: true, preserveState: true });
    };
    const messageForm = useForm({ content: '', recipient_role: 'admin' });
    const credForm = useForm({ project_credentials: project.project_credentials || '', project_env: project.project_env || '' });
    const blockedForm = useForm({ status: '' });
    const usefulLinks = Array.isArray(project.useful_links)
        ? project.useful_links
        : (typeof project.useful_links === 'string'
            ? (() => { try { return JSON.parse(project.useful_links); } catch { return []; } })()
            : []);
    const estimated = parseFloat(project.estimated_hours || 0);
    const loggedPct = estimated > 0 ? Math.min(100, Math.round((totalHours / estimated) * 100)) : 0;
    const loggedColor = loggedPct < 70 ? 'bg-emerald-500' : loggedPct < 100 ? 'bg-amber-500' : 'bg-rose-500';
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const { post, processing } = useForm({});
    const isUnassigned = !project.developer_id;
    const isAssigned = project.developer_id === authUserId;
    const partnerName = project.lead?.referral_partner?.user?.name;

    // Documentation state
    const [showDocModal, setShowDocModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocData | null>(null);
    const [expandedDocId, setExpandedDocId] = useState<number | null>(null);

    const docForm = useForm({
        title: '',
        content: '',
        category: 'other',
    });

    function openDocCreate() {
        setEditingDoc(null);
        docForm.reset();
        docForm.setData({ title: '', content: '', category: 'other' });
        setShowDocModal(true);
    }

    function openDocEdit(doc: DocData) {
        setEditingDoc(doc);
        docForm.setData({
            title: doc.title,
            content: doc.content,
            category: doc.category || 'other',
        });
        setShowDocModal(true);
    }

    function handleDocSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingDoc) {
            docForm.put(`/dev/project-docs/${editingDoc.id}`, {
                preserveScroll: true,
                onSuccess: () => { setShowDocModal(false); docForm.reset(); setEditingDoc(null); },
            });
        } else {
            docForm.post(`/dev/projects/${project.id}/docs`, {
                preserveScroll: true,
                onSuccess: () => { setShowDocModal(false); docForm.reset(); },
            });
        }
    }

    // Time entry form
    const timeForm = useForm({
        date: new Date().toISOString().split('T')[0],
        hours: '1.00',
        description: '',
        task_category: 'development',
        is_billable: true,
    });

    // Editing time entry
    const [editingTimeId, setEditingTimeId] = useState<number | null>(null);
    const editTimeForm = useForm({
        date: '',
        hours: '',
        description: '',
        task_category: '',
        is_billable: true,
    });

    // Note form
    const noteForm = useForm({ content: '' });

    // Status form
    const statusForm = useForm({ status: '' });

    async function handleClaim(e: React.FormEvent) {
        e.preventDefault();
        const ok = await confirm({
            title: t('Claim Project'),
            message: t('Are you sure you want to claim this project?'),
            confirmText: t('Claim'),
            variant: 'info',
        });
        if (!ok) return;
        post(`/dev/projects/${project.id}/claim`);
    }

    function handleTimeSubmit(e: React.FormEvent) {
        e.preventDefault();
        timeForm.post(`/dev/projects/${project.id}/time`, {
            preserveScroll: true,
            onSuccess: () => {
                timeForm.reset();
                timeForm.setData('date', new Date().toISOString().split('T')[0]);
                timeForm.setData('task_category', 'development');
                timeForm.setData('is_billable', true);
            },
        });
    }

    function startEditTime(entry: TimeEntryData) {
        setEditingTimeId(entry.id);
        editTimeForm.setData({
            date: entry.date?.split('T')[0] || entry.date,
            hours: String(entry.hours),
            description: entry.description,
            task_category: entry.task_category || 'development',
            is_billable: entry.is_billable,
        });
    }

    function handleEditTimeSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingTimeId) return;
        editTimeForm.put(`/dev/time/${editingTimeId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingTimeId(null),
        });
    }

    async function handleDeleteTime(id: number) {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Delete this time entry?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/dev/time/${id}`, { preserveScroll: true });
    }

    function handleNoteSubmit(e: React.FormEvent) {
        e.preventDefault();
        noteForm.post(`/dev/projects/${project.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => noteForm.reset(),
        });
    }

    async function handleDeleteNote(id: number) {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Delete this note?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/dev/notes/${id}`, { preserveScroll: true });
    }

    async function handleStatusUpdate(newStatus: string) {
        const ok = await confirm({
            title: t('Update Status'),
            message: t('Update project status to') + ' ' + newStatus.replace('_', ' ') + '?',
            confirmText: t('Update'),
            variant: 'info',
        });
        if (!ok) return;
        router.patch(`/dev/projects/${project.id}/status`, { status: newStatus }, { preserveScroll: true });
    }

    const possibleTransitions = allowedTransitions[project.status] || [];

    return (
        <DevLayout title={project.nom_societe || t('Project Details')}>
            <Head title={project.nom_societe || t('Project Details')} />

            {/* Back link */}
            <div className="mb-6">
                <Link href="/dev/projects" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    {t('Back to Projects')}
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{project.nom_societe || t('Untitled Project')}</h1>
                            <Badge status={project.status} />
                        </div>
                        {project.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{project.description}</p>
                        )}
                    </div>
                    {isUnassigned && (
                        <form onSubmit={handleClaim} className="flex-shrink-0">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? t('Claiming...') : t('Claim This Project')}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Project Details')}</h3>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label={t('Type')} value={formatProjectType(project.type_site)} />
                                <DetailItem label={t('Technology')} value={project.langage_programmation || '-'} />
                                <DetailItem label={t('Budget')} value={project.budget ? formatCurrency(project.budget) : '-'} />
                                <DetailItem label={t('Total Billed')} value={project.total_billed ? formatCurrency(project.total_billed) : '-'} />
                                <DetailItem label={t('Start Date')} value={project.start_date ? formatDate(project.start_date) : '-'} />
                                <DetailItem label={t('Deadline')} value={project.deadline ? formatDate(project.deadline) : '-'} />
                                <DetailItem label={t('Location')} value={project.lieu || '-'} />
                                <DetailItem label={t('Dev Days')} value={project.jours_developpement ? `${project.jours_developpement} ${t('days')}` : '-'} />
                            </dl>
                        </div>
                    </div>

                    {/* Briefs Section */}
                    {project.briefs && project.briefs.length > 0 && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Briefs')}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{t('Client briefs and project requirements')}</p>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {project.briefs.map((brief: any) => (
                                    <div key={brief.id} className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {brief.title || `Brief #${brief.id}`}
                                                </span>
                                                <Badge status={brief.status || 'pending'} />
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {brief.created_at ? new Date(brief.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        {brief.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{brief.description}</p>
                                        )}
                                        {brief.answers && typeof brief.answers === 'object' && Object.keys(brief.answers).length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-2">
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Answers')}</p>
                                                {Object.entries(brief.answers).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex flex-col">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{key.replace(/_/g, ' ')}</span>
                                                        <span className="text-sm text-gray-800 dark:text-gray-200">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {brief.details && (
                                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{brief.details}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Time Logging Section */}
                    {isAssigned && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Time Tracking')}</h3>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    {totalHours}h {t('logged')}
                                </span>
                            </div>
                            <div className="p-6">
                                {/* Quick time entry form */}
                                <form onSubmit={handleTimeSubmit} className="space-y-3 mb-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className={labelCls}>{t('Date')}</label>
                                            <input type="date" className={input} value={timeForm.data.date} onChange={e => timeForm.setData('date', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>{t('Hours')}</label>
                                            <input type="number" step="0.25" min="0" max="24" className={input} value={timeForm.data.hours} onChange={e => timeForm.setData('hours', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>{t('Category')}</label>
                                            <SearchableSelect
                                                value={timeForm.data.task_category}
                                                onChange={(val) => timeForm.setData('task_category', val)}
                                                options={[
                                                    { value: 'development', label: t('Development') },
                                                    { value: 'design', label: t('Design') },
                                                    { value: 'meeting', label: t('Meeting') },
                                                    { value: 'testing', label: t('Testing') },
                                                    { value: 'deployment', label: t('Deployment') },
                                                    { value: 'other', label: t('Other') },
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelCls}>{t('Billable')}</label>
                                            <div className="flex items-center h-[42px]">
                                                <button
                                                    type="button"
                                                    onClick={() => timeForm.setData('is_billable', !timeForm.data.is_billable)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${timeForm.data.is_billable ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${timeForm.data.is_billable ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{timeForm.data.is_billable ? t('Yes') : t('No')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>{t('Description')}</label>
                                        <input type="text" className={input} value={timeForm.data.description} onChange={e => timeForm.setData('description', e.target.value)} placeholder={t('What did you work on?')} />
                                    </div>
                                    {timeForm.errors && Object.values(timeForm.errors).map((err, i) => <p key={i} className="text-xs text-red-500">{err}</p>)}
                                    <div className="flex justify-end">
                                        <button type="submit" disabled={timeForm.processing} className="px-5 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50">
                                            {timeForm.processing ? t('Adding...') : t('Log Time')}
                                        </button>
                                    </div>
                                </form>

                                {/* Recent time entries */}
                                {myTimeEntries.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('Recent Entries')}</h4>
                                        <div className="space-y-2">
                                            {myTimeEntries.map(entry => (
                                                <div key={entry.id}>
                                                    {editingTimeId === entry.id ? (
                                                        <form onSubmit={handleEditTimeSubmit} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 space-y-2">
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                                <input type="date" className={input} value={editTimeForm.data.date} onChange={e => editTimeForm.setData('date', e.target.value)} />
                                                                <input type="number" step="0.25" min="0" max="24" className={input} value={editTimeForm.data.hours} onChange={e => editTimeForm.setData('hours', e.target.value)} />
                                                                <SearchableSelect
                                                                    value={editTimeForm.data.task_category}
                                                                    onChange={(val) => editTimeForm.setData('task_category', val)}
                                                                    options={[
                                                                        { value: 'development', label: t('Development') },
                                                                        { value: 'design', label: t('Design') },
                                                                        { value: 'meeting', label: t('Meeting') },
                                                                        { value: 'testing', label: t('Testing') },
                                                                        { value: 'deployment', label: t('Deployment') },
                                                                        { value: 'other', label: t('Other') },
                                                                    ]}
                                                                />
                                                                <div className="flex items-center">
                                                                    <button type="button" onClick={() => editTimeForm.setData('is_billable', !editTimeForm.data.is_billable)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editTimeForm.data.is_billable ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${editTimeForm.data.is_billable ? 'translate-x-5' : 'translate-x-1'}`} />
                                                                    </button>
                                                                    <span className="ml-1 text-xs text-gray-500">{t('Billable')}</span>
                                                                </div>
                                                            </div>
                                                            <input type="text" className={input} value={editTimeForm.data.description} onChange={e => editTimeForm.setData('description', e.target.value)} />
                                                            <div className="flex justify-end space-x-2">
                                                                <button type="button" onClick={() => setEditingTimeId(null)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">{t('Cancel')}</button>
                                                                <button type="submit" disabled={editTimeForm.processing} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 disabled:opacity-50">{t('Save')}</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                                            <div className="flex items-center space-x-3 min-w-0">
                                                                <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(entry.date)}</span>
                                                                <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{entry.hours}h</span>
                                                                {entry.task_category && (
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[entry.task_category] || categoryColors.other}`}>
                                                                        {t(categoryLabels[entry.task_category] || entry.task_category)}
                                                                    </span>
                                                                )}
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.description}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => startEditTime(entry)} className="p-1 text-gray-400 hover:text-indigo-500" title={t('Edit')}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                                                </button>
                                                                <button onClick={() => handleDeleteTime(entry.id)} className="p-1 text-gray-400 hover:text-red-500" title={t('Delete')}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dev Notes Section */}
                    {isAssigned && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Dev Notes')}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{t('Internal notes, not visible to the client')}</p>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleNoteSubmit} className="mb-4">
                                    <textarea
                                        className={`${input} min-h-[80px]`}
                                        value={noteForm.data.content}
                                        onChange={e => noteForm.setData('content', e.target.value)}
                                        placeholder={t('Add a development note...')}
                                        rows={3}
                                    />
                                    {noteForm.errors.content && <p className="text-xs text-red-500 mt-1">{noteForm.errors.content}</p>}
                                    <div className="flex justify-end mt-2">
                                        <button type="submit" disabled={noteForm.processing || !noteForm.data.content.trim()} className="px-5 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50">
                                            {noteForm.processing ? t('Adding...') : t('Add Note')}
                                        </button>
                                    </div>
                                </form>

                                {myNotes.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                                        {myNotes.map((note: NoteData) => (
                                            <div key={note.id} className="flex items-start justify-between py-2 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{note.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(note.created_at).toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" title={t('Delete')}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Technical Documentation Section */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Technical Documentation')}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{t('Project wiki and technical notes')}</p>
                            </div>
                            {isAssigned && (
                                <button
                                    onClick={openDocCreate}
                                    className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                    {t('Add Documentation')}
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            {projectDocs.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-14.524A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.524v14.524" /></svg>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No documentation yet')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {projectDocs.map((doc: DocData) => (
                                        <div key={doc.id} className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="px-4 py-3 flex items-start justify-between gap-3">
                                                <button
                                                    onClick={() => setExpandedDocId(expandedDocId === doc.id ? null : doc.id)}
                                                    className="text-left flex-1 min-w-0"
                                                >
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                            {doc.title}
                                                        </h4>
                                                        {doc.category && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${docCategoryColors[doc.category] || docCategoryColors.other}`}>
                                                                {t(docCategoryLabels[doc.category] || doc.category)}
                                                            </span>
                                                        )}
                                                        {doc.is_client_visible && (
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                                {t('Client visible')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {doc.author && <span className="text-xs text-gray-400">{doc.author.name}</span>}
                                                        <span className="text-xs text-gray-400">{formatDate(doc.updated_at)}</span>
                                                    </div>
                                                </button>
                                                {isAssigned && doc.author_id === authUserId && (
                                                    <button
                                                        onClick={() => openDocEdit(doc)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex-shrink-0"
                                                        title={t('Edit')}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                            {expandedDocId === doc.id && (
                                                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                                                    <div
                                                        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                                        dangerouslySetInnerHTML={{ __html: doc.content }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Doc Create/Edit Modal */}
                    {showDocModal && createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDocModal(false)} />
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {editingDoc ? t('Edit Documentation') : t('Add Documentation')}
                                    </h3>
                                    <button onClick={() => setShowDocModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleDocSubmit} className="p-6 space-y-5">
                                    <div>
                                        <label className={labelCls}>{t('Title')}</label>
                                        <input
                                            type="text"
                                            value={docForm.data.title}
                                            onChange={e => docForm.setData('title', e.target.value)}
                                            className={input}
                                            placeholder={t('Documentation title')}
                                            required
                                        />
                                        {docForm.errors.title && <p className="text-xs text-red-500 mt-1">{docForm.errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>{t('Category')}</label>
                                        <select
                                            value={docForm.data.category}
                                            onChange={e => docForm.setData('category', e.target.value)}
                                            className={input}
                                        >
                                            <option value="architecture">{t('Architecture')}</option>
                                            <option value="api">{t('API')}</option>
                                            <option value="deployment">{t('Deployment')}</option>
                                            <option value="database">{t('Database')}</option>
                                            <option value="setup">{t('Setup')}</option>
                                            <option value="other">{t('Other')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>{t('Content')}</label>
                                        <RichTextEditor
                                            value={docForm.data.content}
                                            onChange={val => docForm.setData('content', val)}
                                            placeholder={t('Write your documentation here...')}
                                            minHeight={250}
                                        />
                                        {docForm.errors.content && <p className="text-xs text-red-500 mt-1">{docForm.errors.content}</p>}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setShowDocModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                            {t('Cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={docForm.processing}
                                            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                                        >
                                            {docForm.processing ? t('Saving...') : editingDoc ? t('Update') : t('Create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Unified Timeline (events + commits) */}
                    <UnifiedTimeline
                        events={project.timeline_events || []}
                        projectId={project.id}
                        githubRepo={project.github_repo}
                        showCommits={true}
                    />

                    {/* Quotes */}
                    {project.quotes && project.quotes.length > 0 && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Quotes')}</h3>
                            </div>
                            <div>
                                {project.quotes.map((quote: any) => (
                                    <div key={quote.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{quote.quote_number}</p>
                                            <p className="text-xs text-gray-400">{quote.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(quote.total)}</p>
                                            <Badge status={quote.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Invoices */}
                    {project.invoices && project.invoices.length > 0 && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Invoices')}</h3>
                            </div>
                            <div>
                                {project.invoices.map((invoice: any) => (
                                    <div key={invoice.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</p>
                                            <p className="text-xs text-gray-400">{invoice.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</p>
                                            <Badge status={invoice.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Update */}
                    {isAssigned && possibleTransitions.length > 0 && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Update Status')}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-gray-400 mb-3">{t('Current')}: <Badge status={project.status} /></p>
                                <div className="space-y-2">
                                    {possibleTransitions.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(status)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left"
                                        >
                                            {t('Move to')} {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Client Info */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Client')}</h3>
                        </div>
                        <div className="p-6">
                            {project.client ? (
                                <div>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">{project.client.name?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.client.name}</p>
                                            <p className="text-xs text-gray-400">{project.client.email}</p>
                                        </div>
                                    </div>
                                    {project.client.company_name && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('Company')}: {project.client.company_name}</p>
                                    )}
                                    {project.client.phone && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Phone')}: {project.client.phone}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">{t('No client assigned')}</p>
                            )}
                        </div>
                    </div>

                    {/* Developer Info */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Developer')}</h3>
                        </div>
                        <div className="p-6">
                            {project.developer ? (
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{project.developer.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{project.developer.name}</p>
                                        <p className="text-xs text-gray-400">{project.developer.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-sm text-gray-400 mb-3">{t('No developer assigned')}</p>
                                    <form onSubmit={handleClaim}>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? t('Claiming...') : t('Claim This Project')}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Referral Info */}
                    {partnerName && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Referral')}</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{partnerName}</p>
                                        <p className="text-xs text-gray-400">{t('Referral Partner')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Info */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Status')}</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{t('Current Status')}</span>
                                <Badge status={project.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{t('Created')}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-300">{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                            {project.start_date && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{t('Started')}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{formatDate(project.start_date)}</span>
                                </div>
                            )}
                            {project.deadline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{t('Deadline')}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{formatDate(project.deadline)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Dev portal feature sections */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {estimated > 0 && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Heures estimées vs réalisées')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>{totalHours} / {estimated} h</span>
                                <span>{loggedPct}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full ${loggedColor}`} style={{ width: `${loggedPct}%` }} />
                            </div>
                        </div>
                    </div>
                )}

                {ds.showMilestones && isAssigned && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Étapes du projet')}</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {orderedMilestones.length === 0 && <p className="text-xs text-gray-400">{t('Aucune étape')}</p>}
                            <DndContext sensors={milestoneSensors} collisionDetection={closestCenter} onDragEnd={handleMilestoneDragEnd}>
                                <SortableContext items={orderedMilestones.map(m => m.id)} strategy={verticalListSortingStrategy}>
                                    {orderedMilestones.map(m => (
                                        <SortableMilestoneRow key={m.id} m={m} t={t}>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p>
                                                {m.due_date && <p className="text-xs text-gray-400">{formatDate(m.due_date)}</p>}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-lg ${m.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : m.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : m.status === 'blocked' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {t(m.status)}
                                            </span>
                                            <button
                                                onClick={() => router.delete(`/dev/milestones/${m.id}`, { preserveScroll: true })}
                                                className="text-xs text-rose-500 hover:text-rose-700"
                                            >{t('Supprimer')}</button>
                                        </SortableMilestoneRow>
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <form
                                onSubmit={(e) => { e.preventDefault(); milestoneForm.post(`/dev/projects/${project.id}/milestones`, { preserveScroll: true, onSuccess: () => milestoneForm.reset() }); }}
                                className="space-y-2 pt-2"
                            >
                                <input className={input} placeholder={t('Nouvelle étape')} value={milestoneForm.data.label} onChange={e => milestoneForm.setData('label', e.target.value)} />
                                <div className="flex gap-2">
                                    <input type="date" className={input} value={milestoneForm.data.due_date} onChange={e => milestoneForm.setData('due_date', e.target.value)} />
                                    <select className={input} value={milestoneForm.data.status} onChange={e => milestoneForm.setData('status', e.target.value)}>
                                        <option value="pending">{t('pending')}</option>
                                        <option value="in_progress">{t('in_progress')}</option>
                                        <option value="done">{t('done')}</option>
                                        <option value="blocked">{t('blocked')}</option>
                                    </select>
                                </div>
                                <button className="w-full px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600">{t('Ajouter une étape')}</button>
                            </form>
                        </div>
                    </div>
                )}

                {ds.showCredentials && isAssigned && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Identifiants & variables d\'environnement')}</h3>
                            <p className="text-xs text-gray-400 mt-1">{t('Chiffré au repos')}</p>
                        </div>
                        <form
                            onSubmit={(e) => { e.preventDefault(); credForm.put(`/dev/projects/${project.id}/credentials`, { preserveScroll: true }); }}
                            className="p-6 space-y-3"
                        >
                            <div>
                                <label className={labelCls}>{t('Identifiants')}</label>
                                <textarea className={input} rows={4} value={credForm.data.project_credentials} onChange={e => credForm.setData('project_credentials', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>{t('Variables d\'environnement')}</label>
                                <textarea className={input} rows={6} value={credForm.data.project_env} onChange={e => credForm.setData('project_env', e.target.value)} />
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600">{t('Enregistrer')}</button>
                        </form>
                    </div>
                )}

                {ds.showUsefulLinks && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Liens utiles')}</h3>
                        </div>
                        <div className="p-6 space-y-2 text-sm">
                            {project.staging_url && <a href={project.staging_url} target="_blank" rel="noreferrer" className="block text-indigo-500 hover:underline">Staging: {project.staging_url}</a>}
                            {project.preview_url && <a href={project.preview_url} target="_blank" rel="noreferrer" className="block text-indigo-500 hover:underline">Preview: {project.preview_url}</a>}
                            {project.github_repo && <a href={project.github_repo} target="_blank" rel="noreferrer" className="block text-indigo-500 hover:underline">GitHub: {project.github_repo}</a>}
                            {usefulLinks.map((l: any, i: number) => (
                                <a key={i} href={typeof l === 'string' ? l : l.url} target="_blank" rel="noreferrer" className="block text-indigo-500 hover:underline">
                                    {typeof l === 'string' ? l : (l.label || l.url)}
                                </a>
                            ))}
                            {!project.staging_url && !project.preview_url && !project.github_repo && usefulLinks.length === 0 && (
                                <p className="text-xs text-gray-400">{t('Aucun lien')}</p>
                            )}
                        </div>
                    </div>
                )}

                {ds.showMessaging && isAssigned && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Messagerie')}</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {devMessages.length === 0 && <p className="text-xs text-gray-400">{t('Aucun message')}</p>}
                                {devMessages.map(m => (
                                    <div key={m.id} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{m.sender?.name || t('Utilisateur')}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{m.content}</p>
                                    </div>
                                ))}
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); messageForm.post(`/dev/projects/${project.id}/messages`, { preserveScroll: true, onSuccess: () => messageForm.reset('content') }); }}
                                className="space-y-2"
                            >
                                <select className={input} value={messageForm.data.recipient_role} onChange={e => messageForm.setData('recipient_role', e.target.value)}>
                                    <option value="admin">{t('Admin')}</option>
                                    <option value="client">{t('Client')}</option>
                                    <option value="dev">{t('Développeur')}</option>
                                </select>
                                <textarea className={input} rows={3} placeholder={t('Votre message...')} value={messageForm.data.content} onChange={e => messageForm.setData('content', e.target.value)} />
                                <button className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600">{t('Envoyer')}</button>
                            </form>
                        </div>
                    </div>
                )}

                {ds.allowBlockedStatus && isAssigned && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Statut bloqué / en attente')}</h3>
                        </div>
                        <div className="p-6 flex flex-wrap gap-2">
                            {['blocked', 'waiting_client', 'on_hold', 'in_progress'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => router.patch(`/dev/projects/${project.id}/blocked-status`, { status: s }, { preserveScroll: true })}
                                    className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                >{t(s)}</button>
                            ))}
                        </div>
                    </div>
                )}

                {ds.allowRelease && isAssigned && (
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Libérer le projet')}</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('Vous pouvez libérer ce projet pour qu\'un autre développeur le reprenne.')}</p>
                            <button
                                onClick={async () => {
                                    const ok = await confirm({ title: t('Libérer le projet'), message: t('Êtes-vous sûr ?'), confirmText: t('Libérer'), variant: 'danger' });
                                    if (ok) router.post(`/dev/projects/${project.id}/release`);
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600"
                            >{t('Libérer le projet')}</button>
                        </div>
                    </div>
                )}

                <DeliverablesChecklistSection project={project} />
            </div>

            <ConfirmDialog />
        </DevLayout>
    );
}

function DeliverablesChecklistSection({ project }: { project: any }) {
    const page = usePage<any>();
    const enabled = page.props?.auth?.user?.deliverables_checklist_enabled;
    const deliverables = project.deliverables || [];
    if (!enabled && deliverables.length === 0) return null;
    return (
        <div className="mt-6">
            <DeliverablesChecklist
                projectId={project.id}
                deliverables={deliverables}
                mode={enabled ? 'dev' : 'dev-disabled'}
            />
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</dt>
            <dd className="text-sm text-gray-900 dark:text-white mt-0.5">{value}</dd>
        </div>
    );
}
