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
  const [events, setEvents] = useState<(CalendarEvent & { start: Date; end: Date; })[]>([]);
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

  if (loading) return <div className="p-4">Loading calendar events...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📅 Calendar Dashboard</h1>
      <ul className="space-y-3">
        {events.map((event, i) => (
          <li
            key={i}
            className="border rounded-lg shadow-sm p-3 hover:bg-gray-50 transition"
          >
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">
              {event.start.toLocaleDateString()} → {event.end.toLocaleDateString()}
            </div>
            {event.description && (
              <a
                href={event.description}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Details
              </a>
            )}
            <div className="text-xs text-gray-500">
              {event.calendarName}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
