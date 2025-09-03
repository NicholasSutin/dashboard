import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "no code" }, { status: 400 });
  }

  const r = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!r.ok) {
    return NextResponse.json(
      { error: "token exchange failed", status: r.status, detail: await r.text() },
      { status: r.status }
    );
  }

  const data = await r.json(); // { access_token, refresh_token, expires_at, athlete, ... }

  // Dev-only token viewer (never shows in production)
  const debugAsked = url.searchParams.get("debug") === "1";
  const allowDebug =
    process.env.NODE_ENV !== "production" &&
    (process.env.STRAVA_DEBUG === "1" || url.hostname === "localhost");

  if (debugAsked && allowDebug) {
    return NextResponse.json({
      note: "TEMP viewer — copy refresh_token into STRAVA_REFRESH_TOKEN (.env.local), then disable debug",
      athleteId: data.athlete?.id,
      scope: url.searchParams.get("scope"),
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    });
  }

  // Normal flow: just redirect home
  return NextResponse.redirect(`${url.origin}/`);
}
