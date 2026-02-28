import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
  const type = req.nextUrl.searchParams.get("type") || "following";

  return NextResponse.json({
    posts: [],
    page,
    limit,
    total: 0,
    has_more: false,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image_url, caption, tags, outfit_id, affiliate_items } = body;

    if (!image_url || !caption) {
      return NextResponse.json({ error: "Image and caption required" }, { status: 400 });
    }

    const post = {
      id: `post-${Date.now()}`,
      image_url,
      caption,
      tags: tags || [],
      outfit_id,
      has_affiliate_links: (affiliate_items?.length || 0) > 0,
      affiliate_items: affiliate_items || [],
      like_count: 0,
      comment_count: 0,
      save_count: 0,
      share_count: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
