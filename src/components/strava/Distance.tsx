// src/components/strava/Distance.tsx
import { headers } from "next/headers";

export const revalidate = 1800;

export default async function Distance() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;

  // fetch /public/mydata.json
  const mydataRes = await fetch(`${base}/mydata.json`, { cache: "no-store" });
  const mydata = await mydataRes.json();

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = mydata?.preferredStravaMonth ?? now.getUTCMonth() + 1;

  const res = await fetch(`${base}/api/strava/summary?year=${year}&month=${month}`, {
    next: { revalidate: 1800 },
  });
  const s = await res.json();

  return <span> | {s.totalMiles} mi in {s.month}/{s.year}</span>;
}
