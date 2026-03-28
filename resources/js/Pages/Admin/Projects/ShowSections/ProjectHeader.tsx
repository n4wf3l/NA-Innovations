import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Project } from '@/types';
import { formatDate, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    project: Project & {
        type_societe?: string;
        type_site?: string;
        lieu?: string;
        start_date?: string;
        deadline?: string;
        end_date?: string;
        budget?: number;
        total_billed?: number;
        image?: string;
    };
}

export default function ProjectHeader({ project }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {/* Project Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {project.image ? (
                                <img
                                    src={project.image.startsWith('http') ? project.image : `/storage/${project.image}`}
                                    alt={project.nom_societe}
                                    className="w-14 h-14 rounded-xl object-contain bg-white/20 backdrop-blur-sm shadow-lg flex-shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-white text-lg font-black">{(project.nom_societe || '?').substring(0, 2).toUpperCase()}</span>
                                </div>
                            )}
                            <div>
                                <h2 className="text-white text-xl font-bold">{project.nom_societe}</h2>
                                {project.type_societe && <p className="text-white/80 text-sm mt-1">{project.type_societe}</p>}
                            </div>
                        </div>
                        <Badge status={project.status} className="text-sm" />
                    </div>
                </div>
                <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {project.type_site && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Site Type")}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatProjectType(project.type_site)}</span>
                        </div>
                    )}
                    {project.lieu && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Location")}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{project.lieu}</span>
                        </div>
                    )}
                    {project.start_date && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Start Date")}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.start_date)}</span>
                        </div>
                    )}
                    {project.deadline && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Deadline")}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.deadline)}</span>
                        </div>
                    )}
                    {project.end_date && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("End Date")}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.end_date)}</span>
                        </div>
                    )}
                    {project.budget != null && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Budget")}</span>
                            <span className="font-medium text-gray-900"><ProtectedAmount amount={project.budget} /></span>
                        </div>
                    )}
                    {project.total_billed != null && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400 block">{t("Total Billed")}</span>
                            <span className="font-medium text-gray-900"><ProtectedAmount amount={project.total_billed} /></span>
                        </div>
                    )}
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block">{t("Created")}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            {project.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Description")}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{project.description}</p>
                </div>
            )}
        </>
    );
}
