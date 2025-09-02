import { NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET() {
  try {
    // 1) read tickers from public/mydata.json
    const raw = await fs.readFile("public/mydata.json", "utf-8");
    const json = JSON.parse(raw);
    const tickers: string[] = Array.isArray(json.dailyTickers)
      ? json.dailyTickers
      : String(json.dailyTickers || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    if (!tickers.length) return NextResponse.json({ items: [] });

    // 2) fetch quotes in parallel (Finnhub rate limit is 60/min; this is fine on refresh)
    const key = process.env.FINNHUB_API_KEY!;
    const urls = tickers.map(
      (sym) => `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${key}`
    );

    const results = await Promise.allSettled(urls.map((u) => fetch(u, { cache: "no-store" })));
    const bodies = await Promise.all(
      results.map(async (r, i) => {
        if (r.status !== "fulfilled" || !r.value.ok) {
          return { symbol: tickers[i], error: "fetch_failed" };
        }
        const d = await r.value.json();
        // Finnhub fields: c=current, pc=prev close, d=change, dp=percent change
        const pct = typeof d?.dp === "number" ? d.dp : null;
        return {
          symbol: tickers[i],
          percent: pct,                       // e.g. 0.73 (=> +0.73%)
          text: pct === null ? "?" : `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}% ${pct >= 0 ? "↗" : "↘"}`
        };
      })
    );

    return NextResponse.json({ items: bodies });
  } catch (e) {
    return NextResponse.json({ items: [], error: "server_error" }, { status: 500 });
  }
}
