import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { Project, PaginatedData } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Props {
    projects: PaginatedData<Project>;
    kanbanProjects: Record<string, Project[]>;
    totalProjects: number;
    activeProjects: number;
    totalBudget: number;
    completedProjects: number;
}

export default function ProjectsIndex({ projects, kanbanProjects, totalProjects, activeProjects, totalBudget, completedProjects }: Props) {
    const [view, setView] = useState<'table' | 'kanban'>('table');

    const kanbanColumns = [
        { key: 'planning', label: 'Planning', color: 'border-t-violet-500' },
        { key: 'in_progress', label: 'In Progress', color: 'border-t-blue-500' },
        { key: 'review', label: 'Review', color: 'border-t-amber-500' },
        { key: 'completed', label: 'Completed', color: 'border-t-emerald-500' },
        { key: 'on_hold', label: 'On Hold', color: 'border-t-gray-500' },
        { key: 'cancelled', label: 'Cancelled', color: 'border-t-red-500' },
    ];

    const tableColumns = [
        {
            header: 'Company',
            accessor: (project: Project) => (
                <Link href={`/admin/projects/${project.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                    {project.nom_societe || `Project #${project.id}`}
                </Link>
            ),
        },
        { header: 'Type', accessor: (project: Project) => <span className="text-gray-500 capitalize">{project.type_site?.replace(/_/g, ' ') || '--'}</span> },
        { header: 'Client', accessor: (project: Project) => <span className="text-gray-500">{project.client?.name || '--'}</span> },
        { header: 'Status', accessor: (project: Project) => <Badge status={project.status} /> },
        { header: 'Deadline', accessor: (project: Project) => <span className="text-gray-500">{project.deadline ? formatDate(project.deadline) : '--'}</span> },
        { header: 'Budget', className: 'text-right', accessor: (project: Project) => <span className="text-gray-700">{project.budget ? formatCurrency(project.budget) : '--'}</span> },
        { header: 'Developer', accessor: (project: Project) => <span className="text-gray-500">{project.developer?.name || '--'}</span> },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (project: Project) => (
                <span>
                    <Link href={`/admin/projects/${project.id}`} className="text-gray-400 hover:text-indigo-600 mr-2">View</Link>
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-gray-400 hover:text-gray-600">Edit</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Projects" header="Projects">
            <Head title="Projects" />

            <ModuleBanner
                breadcrumb="Business / Projects"
                title="Project Management"
                description="Track development projects from planning to delivery. Monitor budgets and deadlines."
                gradient="from-indigo-600 to-blue-600"
                icon="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                actionHref="/admin/projects/create"
                actionLabel="New Project"
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Projects" value={totalProjects} borderColor="border-l-indigo-500" />
                <StatCard label="Active" value={activeProjects} borderColor="border-l-blue-500" />
                <StatCard label="Completed" value={completedProjects} borderColor="border-l-emerald-500" />
                <StatCard label="Total Budget" value={formatCurrency(totalBudget)} borderColor="border-l-amber-500" />
            </div>

            {/* View toggle */}
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={() => setView('table')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300')}>
                    Table
                </button>
                <button onClick={() => setView('kanban')} className={cn('px-3 py-1.5 text-sm font-medium rounded-lg transition-colors', view === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300')}>
                    Kanban
                </button>
            </div>

            {/* Table View */}
            {view === 'table' && (
                <>
                    {projects.data.length === 0 ? (
                        <EmptyState title="No projects yet" description="Create your first project to get started." actionHref="/admin/projects/create" actionLabel="New Project" borderColor="border-t-indigo-500" />
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

            {/* Kanban View */}
            {view === 'kanban' && (
                <div className="flex overflow-x-auto space-x-4 pb-4">
                    {kanbanColumns.map(col => (
                        <div key={col.key} className="min-w-[280px] w-[280px] flex-shrink-0">
                            <div className={`bg-gray-100 rounded-lg border-t-4 ${col.color}`}>
                                <div className="px-3 py-2.5 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700">{col.label}</h4>
                                    <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                        {(kanbanProjects[col.key] || []).length}
                                    </span>
                                </div>
                                <div className="px-3 pb-3 space-y-2 min-h-[200px]">
                                    {(kanbanProjects[col.key] || []).map(project => (
                                        <Link key={project.id} href={`/admin/projects/${project.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
                                            <p className="text-sm font-medium text-gray-900">{project.nom_societe || `Project #${project.id}`}</p>
                                            {project.client && <p className="text-xs text-gray-400 mt-0.5">{project.client.name}</p>}
                                            <div className="flex items-center justify-between mt-2">
                                                {project.budget && <p className="text-xs text-gray-500 font-medium">{formatCurrency(project.budget)}</p>}
                                                {project.deadline && <p className="text-xs text-gray-400">{formatDate(project.deadline)}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
