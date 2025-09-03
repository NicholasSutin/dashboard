import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");
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
      { error: "token exchange failed", status: r.status },
      { status: r.status }
    );
  }

  // Consume response once (don’t need to expose refresh token anymore)
  await r.json();

  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/`);
}
