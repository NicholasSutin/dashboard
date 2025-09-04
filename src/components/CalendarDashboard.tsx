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

        setEvents(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div>Loading calendar events...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="h-full overflow-y-auto space-y-3">
      {events.map((event, i) => (
        <div
          key={i}
          className="flex w-full h-[100px] rounded-md border border-gray-700 overflow-hidden bg-gray-900"
        >
          {/* Left gray strip (later for calendar color-coding) */}
          <div className="w-2 bg-gray-500 shrink-0"></div>

          {/* Right main content */}
          <div className="flex-1 min-w-0 p-3 bg-gray-800 text-white">
            {/* Title */}
            <div className="font-semibold block truncate">{event.title}</div>

            {/* Time */}
            <div className="text-sm text-gray-300">
              {event.isAllDay
                ? "All day"
                : `${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </div>

            {/* Description */}
            <div className="text-xs text-gray-400 truncate">
              {event.calendarName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
