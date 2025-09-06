"use client";

import { useEffect, useState } from "react";

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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar");
        if (!res.ok) throw new Error("Failed to fetch calendar");
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="p-4 border rounded-lg shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(event.start).toLocaleDateString()} →{" "}
            {new Date(event.end).toLocaleDateString()}
          </p>
          {event.description && (
            <a
              href={event.description}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Details
            </a>
          )}
          <p className="text-sm text-gray-500">{event.calendarName}</p>
        </div>
      ))}
    </div>
  );
}
