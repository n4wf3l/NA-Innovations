interface PipelineStepperProps {
    status: string;
}

const stages = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'brief', label: 'Brief' },
    { key: 'quote', label: 'Quote' },
    { key: 'outcome', label: 'Won' },
];

function getStageIndex(status: string): number {
    switch (status) {
        case 'new':
            return 0;
        case 'contacted':
            return 1;
        case 'brief_pending':
        case 'brief_completed':
            return 2;
        case 'quote_draft':
        case 'quote_sent':
        case 'qualified':
        case 'call_scheduled':
            return 3;
        case 'won':
            return 4;
        case 'lost':
        case 'not_qualified':
            return -1; // special branch
        default:
            return 0;
    }
}

function isLost(status: string): boolean {
    return status === 'lost' || status === 'not_qualified';
}

function isWon(status: string): boolean {
    return status === 'won';
}

export default function PipelineStepper({ status }: PipelineStepperProps) {
    const currentStage = getStageIndex(status);
    const lost = isLost(status);
    const won = isWon(status);

    // For lost leads, determine how far they got before being lost
    const lostAtStage = lost ? Math.min(currentStage === -1 ? 3 : currentStage, 3) : -1;

    return (
        <div className="w-full">
            <div className="flex items-center">
                {stages.map((stage, index) => {
                    const isLast = index === stages.length - 1;
                    let circleClass = '';
                    let lineClass = '';
                    let labelClass = 'text-gray-400';
                    let dot: React.ReactNode = null;

                    if (lost) {
                        // Lost branch: show stages up to where lead was, then mark lost
                        if (index < lostAtStage) {
                            // completed before lost
                            circleClass = 'bg-rose-500 border-rose-500';
                            lineClass = 'bg-rose-500';
                            labelClass = 'text-rose-600 font-medium';
                            dot = (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            );
                        } else if (index === lostAtStage) {
                            // the stage where it was lost
                            circleClass = 'bg-red-500 border-red-500';
                            lineClass = 'bg-gray-200';
                            labelClass = 'text-red-600 font-semibold';
                            dot = (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            );
                        } else {
                            // future stages
                            circleClass = 'bg-white border-gray-300';
                            lineClass = 'bg-gray-200';
                            dot = <span className="w-2 h-2 rounded-full bg-gray-300" />;
                        }
                    } else if (won && isLast) {
                        // Won: last stage is green check
                        circleClass = 'bg-emerald-500 border-emerald-500';
                        labelClass = 'text-emerald-600 font-semibold';
                        dot = (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        );
                    } else if (index < currentStage) {
                        // completed
                        circleClass = 'bg-rose-500 border-rose-500';
                        lineClass = 'bg-rose-500';
                        labelClass = 'text-rose-600 font-medium';
                        dot = (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        );
                    } else if (index === currentStage) {
                        // active / current
                        circleClass = 'bg-rose-500 border-rose-500 animate-pulse';
                        lineClass = 'bg-gray-200';
                        labelClass = 'text-rose-600 font-semibold';
                        dot = <span className="w-2 h-2 rounded-full bg-white" />;
                    } else {
                        // future
                        circleClass = 'bg-white border-gray-300';
                        lineClass = 'bg-gray-200';
                        dot = <span className="w-2 h-2 rounded-full bg-gray-300" />;
                    }

                    // For won lead, all previous stages are completed
                    if (won && index < stages.length - 1) {
                        circleClass = 'bg-rose-500 border-rose-500';
                        lineClass = index < stages.length - 2 ? 'bg-rose-500' : 'bg-emerald-500';
                        labelClass = 'text-rose-600 font-medium';
                        dot = (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        );
                    }

                    return (
                        <div key={stage.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                            {/* Circle + label */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${circleClass}`}
                                >
                                    {dot}
                                </div>
                                <span className={`mt-1.5 text-xs whitespace-nowrap ${labelClass}`}>
                                    {isLast && lost ? 'Lost' : stage.label}
                                </span>
                            </div>
                            {/* Connecting line */}
                            {!isLast && (
                                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${lineClass}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lost indicator bar */}
            {lost && (
                <div className="mt-3 flex items-center space-x-2 text-xs text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>This lead was marked as {status === 'not_qualified' ? 'not qualified' : 'lost'}</span>
                </div>
            )}
        </div>
    );
}
