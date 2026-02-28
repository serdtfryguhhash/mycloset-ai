import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const period = req.nextUrl.searchParams.get("period") || "30d";

  return NextResponse.json({
    total_earnings: 3847.52,
    pending_earnings: 423.18,
    this_month: 423.18,
    last_month: 347.52,
    total_clicks: 12450,
    total_conversions: 892,
    conversion_rate: 7.2,
    daily_earnings: [],
    top_items: [],
    payouts: [],
  });
}
