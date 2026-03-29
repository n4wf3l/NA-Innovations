import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import KanbanBoard, { KanbanColumn } from '@/Components/ui/KanbanBoard';
import { Project, PaginatedData, PageProps } from '@/types';
import { formatDate, cn, formatProjectType } from '@/lib/utils';

function KanbanCard({ hoverColor, onClick, children }: { hoverColor: string; onClick: () => void; children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 transition-all duration-200 cursor-pointer"
            style={{
                border: `1.5px solid ${hovered ? hoverColor : 'transparent'}`,
                boxShadow: hovered ? `0 0 0 1px ${hoverColor}20, 0 4px 12px ${hoverColor}15` : undefined,
            }}
        >
            {children}
        </div>
    );
}

interface Props {
    projects: PaginatedData<Project>;
    kanbanProjects: Record<string, Project[]>;
    totalProjects: number;
    activeProjects: number;
    totalBudget: number;
    completedProjects: number;
}

export default function ProjectsIndex({ projects, kanbanProjects: initialKanban, totalProjects, activeProjects, totalBudget, completedProjects }: Props) {
    const { financialUnlocked } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [kanbanProjects, setKanbanProjects] = useState(initialKanban);
    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return (params.get('view') as 'table' | 'kanban') || (sessionStorage.getItem('projects_view') as 'table' | 'kanban') || 'table';
        }
        return 'table';
    });
    const switchView = (v: 'table' | 'kanban') => { setView(v); sessionStorage.setItem('projects_view', v); };

    const kanbanColumns = [
        { key: 'planning', label: t('Planning'), color: 'border-t-violet-500' },
        { key: 'in_progress', label: t('In Progress'), color: 'border-t-blue-500' },
        { key: 'review', label: t('Review'), color: 'border-t-amber-500' },
        { key: 'completed', label: t('Completed'), color: 'border-t-emerald-500' },
        { key: 'on_hold', label: t('On Hold'), color: 'border-t-gray-500' },
        { key: 'cancelled', label: t('Cancelled'), color: 'border-t-red-500' },
    ];

    const tableColumns = [
        {
            header: t('Company'),
            accessor: (project: Project) => (
                <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-3 group">
                    {project.image ? (
                        <img
                            src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`}
                            alt={project.nom_societe || ''}
                            className="w-8 h-8 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                        </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.nom_societe || `Project #${project.id}`}
                    </span>
                </Link>
            ),
        },
        { header: t('Type'), accessor: (project: Project) => <span className="text-gray-500">{formatProjectType(project.type_site)}</span> },
        { header: t('Client'), accessor: (project: Project) => <span className="text-gray-500">{project.client?.name || '--'}</span> },
        { header: t('Status'), accessor: (project: Project) => <Badge status={project.status} /> },
        { header: t('Deadline'), accessor: (project: Project) => <span className="text-gray-500">{project.deadline ? formatDate(project.deadline) : '--'}</span> },
        { header: t('Budget'), className: 'text-right', accessor: (project: Project) => <span className="text-gray-700 dark:text-gray-200">{project.budget ? <ProtectedAmount amount={project.budget} /> : '--'}</span> },
        { header: t('Developer'), accessor: (project: Project) => <span className="text-gray-500">{project.developer?.name || '--'}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (project: Project) => (
                <span>
                    <Link href={`/admin/projects/${project.id}`} className="text-gray-400 hover:text-indigo-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Projects")} header={t("Projects")}>
            <Head title={t("Projects")} />

            <ModuleBanner
                breadcrumb="Business / Projects"
                title={t('Project Management')}
                description={t('Track development projects from planning to delivery. Monitor budgets and deadlines.')}
                gradient="from-indigo-600 to-blue-600"
                icon="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                actionHref="/admin/projects/create"
                actionLabel={t('New Project')}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t('Total Projects')} value={totalProjects} borderColor="border-l-indigo-500" />
                <StatCard label={t('Active')} value={activeProjects} borderColor="border-l-blue-500" />
                <StatCard label={t('Completed')} value={completedProjects} borderColor="border-l-emerald-500" />
                <StatCard label={t('Total Budget')} value={protectedValue(totalBudget, financialUnlocked)} borderColor="border-l-amber-500" />
            </div>

            {/* View toggle */}
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={() => switchView('table')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'table' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600')}>
                    {t('Table')}
                </button>
                <button onClick={() => switchView('kanban')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'kanban' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600')}>
                    {t('Kanban')}
                </button>
            </div>

            {/* Table View */}
            {view === 'table' && (
                <>
                    {projects.data.length === 0 ? (
                        <EmptyState title={t('No projects yet.')} description={t('Create your first project to get started.')} actionHref="/admin/projects/create" actionLabel={t('New Project')} borderColor="border-t-indigo-500" />
                    ) : (
                        <>
                            <DataTable
                                columns={tableColumns}
                                data={projects.data}
                                keyExtractor={project => project.id}
                            />
                            <div className="mt-2">
                                <Pagination links={projects.links} />
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Kanban View with Drag & Drop */}
            {view === 'kanban' && (
                <KanbanBoard<Project>
                    columns={kanbanColumns}
                    items={kanbanProjects}
                    keyExtractor={p => p.id}
                    onMove={(itemId, fromColumn, toColumn) => {
                        // Optimistic update
                        setKanbanProjects(prev => {
                            const updated = { ...prev };
                            const fromItems = [...(updated[fromColumn] || [])];
                            const toItems = [...(updated[toColumn] || [])];
                            const idx = fromItems.findIndex(p => String(p.id) === String(itemId));
                            if (idx === -1) return prev;
                            const [moved] = fromItems.splice(idx, 1);
                            (moved as any).status = toColumn;
                            toItems.unshift(moved);
                            updated[fromColumn] = fromItems;
                            updated[toColumn] = toItems;
                            return updated;
                        });

                        // Sync with server in background
                        fetch(`/admin/projects/${itemId}/status`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({ status: toColumn }),
                        }).then(res => {
                            if (!res.ok) {
                                // Revert optimistic update on failure
                                setKanbanProjects(initialKanban);
                            }
                        }).catch(() => {
                            setKanbanProjects(initialKanban);
                        });
                    }}
                    renderCard={(project, isDragging) => {
                        const statusColors: Record<string, string> = {
                            planning: '#8b5cf6',
                            in_progress: '#3b82f6',
                            review: '#f59e0b',
                            completed: '#10b981',
                            on_hold: '#6b7280',
                            cancelled: '#ef4444',
                        };
                        return (
                        <KanbanCard
                            hoverColor={statusColors[project.status] || '#3b82f6'}
                            onClick={() => !isDragging && router.visit(`/admin/projects/${project.id}`)}
                        >
                            <div className="flex items-center gap-2 mb-0.5">
                                {project.image ? (
                                    <img src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`} alt="" className="w-6 h-6 rounded-md object-contain bg-gray-50 dark:bg-gray-700 flex-shrink-0" />
                                ) : (
                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                    </div>
                                )}
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.nom_societe || `Project #${project.id}`}</p>
                            </div>
                            {project.client && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{project.client.name}</p>}
                            <div className="flex items-center justify-between mt-2">
                                {project.budget ? <p className="text-xs text-gray-500 dark:text-gray-400 font-medium"><ProtectedAmount amount={project.budget} /></p> : null}
                                {project.deadline && <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(project.deadline)}</p>}
                            </div>
                        </KanbanCard>
                    );
                    }}
                />
            )}
        </AdminLayout>
    );
}
