import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin; // e.g., http://localhost:3000

  const debugAsked = url.searchParams.get("debug") === "1";
  const allowDebug =
    process.env.NODE_ENV !== "production" &&
    (process.env.STRAVA_DEBUG === "1" || url.hostname === "localhost");

  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: `${origin}/api/strava/callback${
      debugAsked && allowDebug ? "?debug=1" : ""
    }`,
    response_type: "code",
    scope: "read,activity:read_all", // adjust as needed
    approval_prompt: "auto",
  });

  return NextResponse.redirect(
    `https://www.strava.com/oauth/authorize?${params}`
  );
}
