'use client';

import { useEffect, useState } from 'react';

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  description: string;
  location: string;
  isAllDay: boolean;
  calendarName: string;
  calendarId: string;
}

export default function CalendarDashboard() {
  const [events, setEvents] = useState<(CalendarEvent & { start: Date; end: Date })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0); // 0 = today, -3 = 3 days back, +3 = 3 days forward

  // ----- URL helpers -----
  const normalizeUrl = (u?: string | null) => {
    if (!u) return null;
    const s = u.trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (/^www\./i.test(s)) return `https://${s}`;
    return null;
  };

  const firstUrlInText = (t?: string | null) =>
    t?.match(/(https?:\/\/[^\s)]+|www\.[^\s)]+)/i)?.[0] ?? null;

  const getEventUrl = (e: CalendarEvent) =>
    normalizeUrl(e.description) ??
    normalizeUrl(e.location) ??
    normalizeUrl(firstUrlInText(e.title));

  // ----- Date filtering helper -----
  const isWithinCurrentWindow = (eventDate: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate the start of our current 3-day window
    const windowStart = new Date(today);
    windowStart.setDate(today.getDate() + currentOffset);
    
    // Calculate the end of our current 3-day window (exclusive)
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowStart.getDate() + 3);

    // For comparison, use just the date part of the event
    const eventStartDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    return eventStartDate >= windowStart && eventStartDate < windowEnd;
  };

  // ----- Get day label helper -----
  const getDayLabel = (eventDate: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Handle relative days based on current offset
    if (currentOffset === 0) {
      switch (diffDays) {
        case 0: return 'Today';
        case 1: return 'Tomorrow';
        case 2: return 'In 2 days';
        default: return eventDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
      }
    } else {
      // For other windows, show the full date with day name
      return eventDate.toLocaleDateString([], { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // ----- Get window title -----
  const getWindowTitle = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const windowStart = new Date(today);
    windowStart.setDate(today.getDate() + currentOffset);
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowStart.getDate() + 2);

    if (currentOffset === 0) {
      return 'Next 3 Days';
    }
    
    const startStr = windowStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const endStr = windowEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/calendar');
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`);
        const data = await res.json();

        const parsed = data.events.map((e: CalendarEvent) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        // Sort by start time
        parsed.sort((a: { start: { getTime: () => number; }; }, b: { start: { getTime: () => number; }; }) => a.start.getTime() - b.start.getTime());

        setEvents(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events whenever currentOffset changes
  const filteredEvents = events.filter(event => isWithinCurrentWindow(event.start));

  // Group events by day
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dayLabel = getDayLabel(event.start);
    if (!acc[dayLabel]) {
      acc[dayLabel] = [];
    }
    acc[dayLabel].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  if (loading) return <div>Loading calendar events...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentOffset(currentOffset - 3)}
          className="flex items-center px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          3D
        </button>

        <div className="text-white font-semibold text-sm px-2">
          {getWindowTitle()}
        </div>

        <button
          onClick={() => setCurrentOffset(currentOffset + 3)}
          className="flex items-center px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          3D
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {Object.entries(groupedEvents).map(([dayLabel, dayEvents]) => (
          <div key={dayLabel} className="space-y-3">
            {/* Day header */}
            <h3 className="text-lg font-semibold text-white border-b border-neutral-700 pb-1">
              {dayLabel}
            </h3>
            
            {/* Events for this day */}
            {dayEvents.map((event, i) => {
              const href = getEventUrl(event);

              const card = (
                <div className="flex w-full h-[100px] rounded-md overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors">
                  {/* Left narrow strip (2px) */}
                  <div className="w-[2px] bg-neutral-600 shrink-0" />

                  {/* Right main content */}
                  <div className="flex-1 min-w-0 p-3 text-white">
                    {/* Title */}
                    <div className="font-semibold block truncate">{event.title}</div>

                    {/* Time */}
                    <div className="text-sm text-neutral-300">
                      {event.isAllDay
                        ? 'All day'
                        : `${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </div>

                    {/* Description / calendar name */}
                    <div className="text-xs text-neutral-400 truncate">
                      {event.calendarName}
                    </div>
                  </div>
                </div>
              );

              return href ? (
                <a
                  key={`${dayLabel}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={event.title}
                  className="block focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded-md"
                  title={href}
                >
                  {card}
                </a>
              ) : (
                <div key={`${dayLabel}-${i}`}>{card}</div>
              );
            })}
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-neutral-400 text-center py-8">
            No events in this 3-day period
          </div>
        )}
      </div>
    </div>
  );
}