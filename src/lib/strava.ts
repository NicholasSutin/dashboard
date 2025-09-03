export async function getStravaAccessToken() {
  const r = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    }),
  });

  if (!r.ok) throw new Error(`Strava token refresh failed: ${r.status}`);
  const j = await r.json(); // contains access_token, expires_at, maybe new refresh_token
  return j.access_token as string;
}
