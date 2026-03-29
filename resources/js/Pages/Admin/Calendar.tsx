import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    subtitle?: string;
    type: string;
    color: string;
    url: string;
    meta?: string;
}

interface UpcomingEvent {
    date: string;
    title: string;
    type: string;
    color: string;
    url: string;
}

interface Props {
    events: Record<string, CalendarEvent[]>;
    month: string;
    upcoming: UpcomingEvent[];
}

const EVENT_TYPES = [
    { key: 'deadline', label: 'Deadline', color: 'red' },
    { key: 'project_start', label: 'Project Start', color: 'teal' },
    { key: 'invoice_due', label: 'Invoice Due', color: 'amber' },
    { key: 'quote_expiry', label: 'Quote Expiry', color: 'violet' },
    { key: 'commission', label: 'Commission', color: 'emerald' },
    { key: 'service_expiry', label: 'Service Renewal', color: 'blue' },
] as const;

const COLOR_CLASSES: Record<string, { dot: string; bg: string; border: string; text: string; pill: string }> = {
    red: {
        dot: 'bg-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-400',
        text: 'text-red-700 dark:text-red-300',
        pill: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    },
    teal: {
        dot: 'bg-teal-500',
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'border-teal-400',
        text: 'text-teal-700 dark:text-teal-300',
        pill: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
    },
    amber: {
        dot: 'bg-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-400',
        text: 'text-amber-700 dark:text-amber-300',
        pill: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    },
    violet: {
        dot: 'bg-violet-500',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        border: 'border-violet-400',
        text: 'text-violet-700 dark:text-violet-300',
        pill: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    },
    emerald: {
        dot: 'bg-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-400',
        text: 'text-emerald-700 dark:text-emerald-300',
        pill: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    },
    blue: {
        dot: 'bg-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-400',
        text: 'text-blue-700 dark:text-blue-300',
        pill: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
};

function getColorClasses(color: string) {
    return COLOR_CLASSES[color] || COLOR_CLASSES.teal;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
    return day === 0 ? 6 : day - 1;
}

function formatRelativeDate(dateStr: string, t: (key: string, opts?: Record<string, unknown>) => string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr + 'T00:00:00');
    const diffMs = date.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('Today');
    if (diffDays === 1) return t('Tomorrow');
    if (diffDays > 1 && diffDays <= 14) return t('In {{count}} days', { count: diffDays });

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Calendar({ events, month, upcoming }: Props) {
    const { t } = useTranslation();
    const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(() => {
        const filters: Record<string, boolean> = {};
        EVENT_TYPES.forEach((et) => { filters[et.key] = true; });
        return filters;
    });
    const [tooltipEvent, setTooltipEvent] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);

    const [year, monthIdx] = month.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, monthIdx - 1);
    const firstDay = getFirstDayOfWeek(year, monthIdx - 1);

    // Previous month trailing days
    const prevMonthDays = getDaysInMonth(year, monthIdx - 2);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayYear = new Date().getFullYear();
    const todayMonth = new Date().getMonth() + 1;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthLabel = t(monthNames[monthIdx - 1]) + ' ' + year;

    const navigateMonth = (delta: number) => {
        const d = new Date(year, monthIdx - 1 + delta, 1);
        const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.get('/admin/calendar', { month: newMonth }, { preserveState: true, preserveScroll: true });
    };

    const goToday = () => {
        const now = new Date();
        const newMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        router.get('/admin/calendar', { month: newMonth }, { preserveState: true, preserveScroll: true });
    };

    const toggleFilter = (key: string) => {
        setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allActive = Object.values(activeFilters).every(Boolean);
    const toggleAll = () => {
        const newVal = !allActive;
        const updated: Record<string, boolean> = {};
        EVENT_TYPES.forEach((et) => { updated[et.key] = newVal; });
        setActiveFilters(updated);
    };

    // Filter events by active types
    const filteredEvents = useMemo(() => {
        const result: Record<string, CalendarEvent[]> = {};
        Object.entries(events).forEach(([date, dayEvents]) => {
            const filtered = dayEvents.filter((e) => activeFilters[e.type]);
            if (filtered.length > 0) result[date] = filtered;
        });
        return result;
    }, [events, activeFilters]);

    // Build calendar grid cells
    const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean; isWeekend: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        const prevMonth = monthIdx - 1 === 0 ? 12 : monthIdx - 1;
        const prevYear = monthIdx - 1 === 0 ? year - 1 : year;
        const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = (calendarCells.length) % 7;
        calendarCells.push({ day: d, dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isWeekend: dayOfWeek >= 5 });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(monthIdx).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = calendarCells.length % 7;
        calendarCells.push({ day: d, dateStr, isCurrentMonth: true, isToday: dateStr === todayStr, isWeekend: dayOfWeek >= 5 });
    }

    // Next month leading days
    const remaining = 7 - (calendarCells.length % 7);
    if (remaining < 7) {
        for (let d = 1; d <= remaining; d++) {
            const nextMonth = monthIdx + 1 > 12 ? 1 : monthIdx + 1;
            const nextYear = monthIdx + 1 > 12 ? year + 1 : year;
            const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayOfWeek = calendarCells.length % 7;
            calendarCells.push({ day: d, dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isWeekend: dayOfWeek >= 5 });
        }
    }

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handlePillClick = (url: string) => {
        router.visit(url);
    };

    const handlePillHover = (event: CalendarEvent, e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setTooltipEvent({ event, x: rect.left + rect.width / 2, y: rect.top - 8 });
    };

    const totalEventsThisMonth = Object.values(filteredEvents).reduce((sum, arr) => sum + arr.length, 0);

    // Mobile list view: all days with events, sorted
    const sortedEventDates = useMemo(() => {
        return Object.entries(filteredEvents)
            .filter(([date]) => {
                const [y, m] = date.split('-').map(Number);
                return y === year && m === monthIdx;
            })
            .sort(([a], [b]) => a.localeCompare(b));
    }, [filteredEvents, year, monthIdx]);

    return (
        <AdminLayout title={t('Calendar')}>
            <Head title={t('Calendar')} />

            {/* Banner */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-700 dark:to-teal-600 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-white">{monthLabel}</h1>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={goToday}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                        {t('Today')}
                    </button>
                </div>
            </div>

            {/* Filter Toggles */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={toggleAll}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        allActive
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {t('All types')}
                </button>
                {EVENT_TYPES.map((et) => {
                    const colors = getColorClasses(et.color);
                    const active = activeFilters[et.key];
                    return (
                        <button
                            key={et.key}
                            onClick={() => toggleFilter(et.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                active
                                    ? `${colors.pill} border-current`
                                    : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 opacity-50'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            {t(et.label)}
                        </button>
                    );
                })}
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendar Grid (desktop) / List (mobile) */}
                <div className="flex-1 min-w-0">
                    {/* Desktop Grid */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
                            {dayLabels.map((day, i) => (
                                <div
                                    key={day}
                                    className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                                        i >= 5
                                            ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/30'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {t(day)}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7">
                            {calendarCells.map((cell, idx) => {
                                const dayEvents = filteredEvents[cell.dateStr] || [];
                                const maxVisible = 3;
                                const visibleEvents = dayEvents.slice(0, maxVisible);
                                const hiddenCount = dayEvents.length - maxVisible;

                                return (
                                    <div
                                        key={idx}
                                        className={`min-h-[100px] border border-gray-100 dark:border-gray-700 p-1.5 ${
                                            cell.isWeekend ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                                        } ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
                                    >
                                        {/* Date number */}
                                        <div className="flex items-center justify-start mb-1">
                                            <span
                                                className={`inline-flex items-center justify-center w-7 h-7 text-xs ${
                                                    cell.isToday
                                                        ? 'ring-2 ring-teal-400 rounded-full bg-teal-50 dark:bg-teal-900/30 font-bold text-teal-700 dark:text-teal-300'
                                                        : cell.isCurrentMonth
                                                            ? 'font-semibold text-gray-900 dark:text-gray-100'
                                                            : 'text-gray-400 dark:text-gray-600'
                                                }`}
                                            >
                                                {cell.day}
                                            </span>
                                        </div>

                                        {/* Event pills */}
                                        <div className="space-y-0.5">
                                            {visibleEvents.map((event) => {
                                                const colors = getColorClasses(event.color);
                                                return (
                                                    <button
                                                        key={event.id}
                                                        onClick={() => handlePillClick(event.url)}
                                                        onMouseEnter={(e) => handlePillHover(event, e)}
                                                        onMouseLeave={() => setTooltipEvent(null)}
                                                        className={`w-full flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity ${colors.pill}`}
                                                        title={event.title + (event.subtitle ? ' - ' + event.subtitle : '')}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                                                        <span className="truncate">{event.title}</span>
                                                    </button>
                                                );
                                            })}
                                            {hiddenCount > 0 && (
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400 px-2 font-medium">
                                                    {t('+{{count}} more', { count: hiddenCount })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden space-y-3">
                        {sortedEventDates.length === 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
                                {t('No events this month')}
                            </div>
                        )}
                        {sortedEventDates.map(([date, dayEvents]) => {
                            const dateObj = new Date(date + 'T00:00:00');
                            const dayLabel = dateObj.toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            });
                            const isToday = date === todayStr;

                            return (
                                <div
                                    key={date}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
                                >
                                    <div
                                        className={`px-4 py-2 border-b border-gray-100 dark:border-gray-700 ${
                                            isToday ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-gray-50 dark:bg-gray-900/30'
                                        }`}
                                    >
                                        <span
                                            className={`text-sm font-semibold ${
                                                isToday ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {dayLabel}
                                            {isToday && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                                                    {t('Today')}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {dayEvents.map((event) => {
                                            const colors = getColorClasses(event.color);
                                            return (
                                                <button
                                                    key={event.id}
                                                    onClick={() => handlePillClick(event.url)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                                                >
                                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                            {event.title}
                                                        </div>
                                                        {event.subtitle && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {event.subtitle}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 px-1">
                        {EVENT_TYPES.map((et) => {
                            const colors = getColorClasses(et.color);
                            return (
                                <div key={et.key} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                                    {t(et.label)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {t('Upcoming')}
                            </h2>
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                                {upcoming.length}
                            </span>
                        </div>
                        {upcoming.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                {t('No upcoming events')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {upcoming.map((item, idx) => {
                                    const colors = getColorClasses(item.color);
                                    const typeLabel = EVENT_TYPES.find((et) => et.key === item.type)?.label || item.type;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => router.visit(item.url)}
                                            className="w-full flex items-start gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                                        >
                                            <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${colors.dot}`} />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                                    {formatRelativeDate(item.date, t)}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {item.title}
                                                </div>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${colors.pill}`}>
                                                    {t(typeLabel)}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip (rendered as floating element) */}
            {tooltipEvent && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltipEvent.x,
                        top: tooltipEvent.y,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 shadow-lg max-w-[200px]">
                        <div className="font-semibold truncate">{tooltipEvent.event.title}</div>
                        {tooltipEvent.event.subtitle && (
                            <div className="text-gray-300 dark:text-gray-600 mt-0.5 truncate">
                                {tooltipEvent.event.subtitle}
                            </div>
                        )}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                            style={{
                                borderLeft: '5px solid transparent',
                                borderRight: '5px solid transparent',
                                borderTop: '5px solid rgb(17 24 39)',
                            }}
                        />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
