// src/app/api/strava/summary/route.ts
import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

// Compute month bounds in UTC from a date that's already in the target timezone
function monthBoundsUtcFromLocal(localISO: string) {
  const d = new Date(localISO); // interpreted as UTC here
  const y = d.getUTCFullYear(), m = d.getUTCMonth(); // month 0..11
  const start = Date.UTC(y, m, 1, 0, 0, 0) / 1000;
  const next  = Date.UTC(y, m + 1, 1, 0, 0, 0) / 1000;
  return { after: Math.floor(start), before: Math.floor(next), y, m: m + 1 };
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const tz = u.searchParams.get("tz") ?? "";                  // optional
  const year = Number(u.searchParams.get("year"));
  const month = Number(u.searchParams.get("month"));          // 1..12

  let y = year, m = month;
  if (!y || !m) {
    // “Now” in requested tz (or UTC if none). Trick: format parts in tz, then rebuild ISO.
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz || "UTC", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    const parts = fmt.formatToParts(now).reduce((a,p)=> (a[p.type]=p.value, a), {} as any);
    const localISO = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.000Z`;
    const b = monthBoundsUtcFromLocal(localISO);
    y = b.y; m = b.m;
  }

  // Final bounds in UTC
  const after = Math.floor(Date.UTC(y, m - 1, 1) / 1000);
  const before = Math.floor(Date.UTC(y, m, 1) / 1000);

  const token = await getStravaAccessToken();
  let page = 1, per_page = 200, totalMeters = 0, count = 0;

  for (;;) {
    const r = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&page=${page}&per_page=${per_page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: r.status });
    const batch = await r.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const a of batch) totalMeters += a.distance ?? 0, count++;
    if (batch.length < per_page) break;
    page++;
  }

  return NextResponse.json({
    year: y, month: m, count,
    totalMeters, totalKm: +(totalMeters/1000).toFixed(2),
    totalMiles: +(totalMeters/1609.344).toFixed(2)
  });
}
