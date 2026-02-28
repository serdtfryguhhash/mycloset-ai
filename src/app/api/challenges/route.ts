import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ challenges: [], total: 0 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, challenge_id, post_id, user_id } = body;

    if (action === "enter") {
      return NextResponse.json({
        entry: {
          id: `entry-${Date.now()}`,
          challenge_id,
          post_id,
          user_id,
          vote_count: 0,
          created_at: new Date().toISOString(),
        },
      });
    }

    if (action === "vote") {
      return NextResponse.json({ message: "Vote recorded", entry_id: body.entry_id });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Challenge operation failed" }, { status: 500 });
  }
}
