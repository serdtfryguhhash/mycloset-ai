import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item_id, post_id, user_id, clicked_by } = body;

    if (!item_id || !post_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const click = {
      id: `click-${Date.now()}`,
      item_id,
      post_id,
      user_id,
      clicked_by: clicked_by || "anonymous",
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      converted: false,
      commission_amount: 0,
      created_at: new Date().toISOString(),
    };

    // In production: save to DB, redirect to affiliate URL
    return NextResponse.json({ click, redirect_url: `https://affiliate.link/${item_id}` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const period = req.nextUrl.searchParams.get("period") || "30d";

  return NextResponse.json({
    total_clicks: 12450,
    total_conversions: 892,
    conversion_rate: 7.2,
    total_earnings: 3847.52,
    pending_earnings: 423.18,
    period,
  });
}
