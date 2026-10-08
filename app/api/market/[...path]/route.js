import { NextResponse } from "next/server";
import { fetchUpstream } from "@/lib/api";

export async function GET(request, { params }) {
  const { path } = await params;
  const search = new URL(request.url).search;
  try {
    const data = await fetchUpstream(`/${path.join("/")}${search}`, { revalidate: 60 });
    if (data === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Upstream API unavailable" }, { status: 502 });
  }
}
