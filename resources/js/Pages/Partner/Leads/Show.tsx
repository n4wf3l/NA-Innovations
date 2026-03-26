import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import PipelineStepper from '@/Components/ui/PipelineStepper';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { formatDate } from '@/lib/utils';

interface Props {
    lead: any;
    project: any;
    commissionRate: number;
}

export default function PartnerLeadShow({ lead, project, commissionRate }: Props) {
    const partnerShare = lead.estimated_budget
        ? (parseFloat(lead.estimated_budget) * (commissionRate / 100))
        : null;

    return (
        <PartnerLayout title={`${lead.first_name} ${lead.last_name}`}>
            <Head title={`${lead.first_name} ${lead.last_name}`} />

            <Link href="/partner/leads" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
                &larr; Back to Leads
            </Link>

            {/* Header with Pipeline Stepper */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {lead.first_name} {lead.last_name}
                        </h2>
                        {lead.company_name && (
                            <p className="text-gray-500 mt-0.5">{lead.company_name}</p>
                        )}
                    </div>
                    <Badge status={lead.status} />
                </div>
                <PipelineStepper status={lead.status} />
            </div>

            {/* Lost Alert */}
            {(lead.status === 'lost' || lead.status === 'not_qualified') && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Lead {lead.status === 'not_qualified' ? 'Not Qualified' : 'Lost'}
                            </p>
                            {lead.lost_reason && (
                                <p className="text-sm text-red-700 mt-1">Reason: {lead.lost_reason}</p>
                            )}
                            {lead.lost_at && (
                                <p className="text-xs text-red-500 mt-1">
                                    Date: {formatDate(lead.lost_at)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Contact Info Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Contact Information
                    </h3>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-400">Email</dt>
                            <dd className="text-gray-900 font-medium">
                                <a href={`mailto:${lead.email}`} className="text-rose-600 hover:text-rose-700">
                                    {lead.email}
                                </a>
                            </dd>
                        </div>
                        {lead.phone && (
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Phone</dt>
                                <dd className="text-gray-900 font-medium">{lead.phone}</dd>
                            </div>
                        )}
                        {lead.company_name && (
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Company</dt>
                                <dd className="text-gray-900 font-medium">{lead.company_name}</dd>
                            </div>
                        )}
                        {lead.service_interest && (
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Service Interest</dt>
                                <dd className="text-gray-900 font-medium">{lead.service_interest}</dd>
                            </div>
                        )}
                        {lead.estimated_budget && (
                            <>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Estimated Budget</dt>
                                    <dd className="text-gray-900 font-medium">
                                        <ProtectedAmount amount={parseFloat(lead.estimated_budget)} />
                                    </dd>
                                </div>
                                {partnerShare !== null && (
                                    <div className="flex justify-between border-t border-gray-100 pt-3">
                                        <dt className="text-gray-400">Your Share ({commissionRate}%)</dt>
                                        <dd className="text-rose-600 font-bold">
                                            <ProtectedAmount amount={partnerShare} />
                                        </dd>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-gray-400">Submitted</dt>
                            <dd className="text-gray-900 font-medium">{formatDate(lead.created_at)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Project Section (if won) */}
                {lead.status === 'won' && project && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Project Details
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Project Name</dt>
                                <dd className="text-gray-900 font-medium">{project.nom_societe || 'Untitled'}</dd>
                            </div>
                            <div className="flex justify-between items-center">
                                <dt className="text-gray-400">Status</dt>
                                <dd><Badge status={project.status || 'planning'} /></dd>
                            </div>
                            {project.developer && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Developer</dt>
                                    <dd className="text-gray-900 font-medium">{project.developer.name}</dd>
                                </div>
                            )}
                            {project.budget && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Budget</dt>
                                    <dd className="text-gray-900 font-medium"><ProtectedAmount amount={parseFloat(project.budget)} /></dd>
                                </div>
                            )}
                        </dl>

                        {/* Quote info */}
                        {lead.quotes && lead.quotes.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Quotes</p>
                                {lead.quotes.map((quote: any) => (
                                    <div key={quote.id} className="flex items-center justify-between py-1.5">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-700 font-medium">
                                                {quote.quote_number || quote.title}
                                            </span>
                                            <Badge status={quote.status} />
                                        </div>
                                        {quote.total && (
                                            <span className="text-sm font-bold text-gray-900">
                                                <ProtectedAmount amount={parseFloat(quote.total)} />
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* If not won but has quotes, show them in a separate card */}
                {lead.status !== 'won' && lead.quotes && lead.quotes.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Quotes
                        </h3>
                        <div className="space-y-2">
                            {lead.quotes.map((quote: any) => (
                                <div key={quote.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-700 font-medium">
                                            {quote.quote_number || quote.title}
                                        </span>
                                        <Badge status={quote.status} />
                                    </div>
                                    {quote.total && (
                                        <span className="text-sm font-bold text-gray-900">
                                            <ProtectedAmount amount={parseFloat(quote.total)} />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Commission Card */}
            {lead.commissions && lead.commissions.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Commissions
                    </h3>
                    <div className="space-y-3">
                        {lead.commissions.map((commission: any) => (
                            <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-bold text-gray-900">
                                            <ProtectedAmount amount={parseFloat(commission.commission_amount)} />
                                        </span>
                                        <Badge status={commission.status} />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {commission.commission_rate}% on <ProtectedAmount amount={parseFloat(commission.base_amount)} />
                                    </p>
                                </div>
                                <div className="text-right text-xs text-gray-400 space-y-1">
                                    {commission.scheduled_payment_date && (
                                        <p>Scheduled: {formatDate(commission.scheduled_payment_date)}</p>
                                    )}
                                    {commission.paid_date && (
                                        <p className="text-emerald-600 font-medium">Paid: {formatDate(commission.paid_date)}</p>
                                    )}
                                    {commission.payment_reference && (
                                        <p>Ref: {commission.payment_reference}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            {lead.timeline_events && lead.timeline_events.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Timeline
                    </h3>
                    <div className="relative">
                        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200" />
                        <div className="space-y-4">
                            {lead.timeline_events.map((event: any) => (
                                <div key={event.id} className="flex items-start space-x-4 relative">
                                    <div className="w-7 h-7 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 pb-1">
                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                        {event.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(event.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Public Notes */}
            {lead.notes && lead.notes.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Notes
                    </h3>
                    <div className="space-y-3">
                        {lead.notes.map((note: any) => (
                            <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(note.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PartnerLayout>
    );
}
