import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import PipelineStepper from '@/Components/ui/PipelineStepper';

interface Props {
    projects: any[];
}

const statusOrder = ['planning', 'in_progress', 'review', 'completed', 'on_hold'];

export default function ClientProjectsIndex({ projects }: Props) {
    const { t } = useTranslation();

    return (
        <ClientLayout title={t("Projects")}>
            <Head title={t("Projects")} />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Projects')}</h1>
                    <p className="text-teal-200 text-sm">{t('Track the progress of your projects')}</p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-16 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No projects yet.')}</p>
                </div>
            ) : (
                <div className="stagger-children space-y-4">
                    {projects.map((project: any) => (
                        <Link key={project.id} href={`/client/projects/${project.id}`}
                            className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500/50 transition-all group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{project.nom_societe}</h3>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{formatProjectType(project.type_site) !== '--' ? formatProjectType(project.type_site) : project.description?.substring(0, 80) || '--'}</p>
                                    </div>
                                    <Badge status={project.status} />
                                </div>

                                {/* Progress stepper */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-1">
                                        {statusOrder.map((step, i) => {
                                            const currentIdx = statusOrder.indexOf(project.status);
                                            const isDone = i <= currentIdx;
                                            const isCurrent = i === currentIdx;
                                            return (
                                                <div key={step} className="flex items-center flex-1">
                                                    <div className={`h-1.5 w-full rounded-full transition-all ${
                                                        isDone ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('Planning')}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('Completed')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500">
                                    {project.start_date && <span>{t('Start Date')}: {formatDate(project.start_date)}</span>}
                                    {project.deadline && <span>{t('Deadline')}: {formatDate(project.deadline)}</span>}
                                    {project.developer && <span>{t('Developer')}: {project.developer.name}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </ClientLayout>
    );
}
