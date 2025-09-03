import { NextRequest, NextResponse } from 'next/server';

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

interface CalendarResponse {
  success: boolean;
  events: CalendarEvent[];
  totalEvents: number;
  dateRange: {
    start: string;
    end: string;
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      return NextResponse.json(
        { success: false, error: 'Apps Script URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(appsScriptUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Apps Script responded with status: ${response.status}`);
    }

    const data: CalendarResponse = await response.json();

    // Just return the raw JSON (dates stay as ISO strings)
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch calendar data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
