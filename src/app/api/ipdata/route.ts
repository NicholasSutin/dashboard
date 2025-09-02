import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
    });

    const text = await res.text();
    const kv = Object.fromEntries(
      text.trim().split("\n").map((line) => {
        const [k, ...rest] = line.split("=");
        return [k, rest.join("=")];
      })
    );

    const fl = kv["fl"] ?? "";
    const ip = kv["ip"] ?? "";

    return NextResponse.json({ fl, ip });
  } catch (err) {
    return NextResponse.json({ fl: "?", ip: "?" }, { status: 500 });
  }
}
