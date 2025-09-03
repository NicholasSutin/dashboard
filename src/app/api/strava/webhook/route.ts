// src/app/api/strava/webhook/route.ts
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  if (q.get("hub.verify_token") !== process.env.STRAVA_VERIFY_TOKEN) return NextResponse.json({}, { status: 403 });
  return NextResponse.json({ "hub.challenge": q.get("hub.challenge") });
}
export async function POST(req: Request) { const ev = await req.json(); /* TODO: handle */ return NextResponse.json({ ok:true }); }
