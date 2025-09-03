import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

export async function GET() {
  const token = await getStravaAccessToken();
  const res = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
