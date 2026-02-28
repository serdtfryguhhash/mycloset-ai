import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const search = req.nextUrl.searchParams.get("search");
  const sort = req.nextUrl.searchParams.get("sort") || "trending";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");

  return NextResponse.json({
    items: [],
    total: 0,
    page,
    has_more: false,
  });
}
