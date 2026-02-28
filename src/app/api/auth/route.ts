import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, username } = body;

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }
      return NextResponse.json({
        user: {
          id: "user-1",
          email,
          username: "sarahstyles",
          display_name: "Sarah Mitchell",
          subscription_tier: "influencer",
        },
        token: "mock-jwt-token",
      });
    }

    if (action === "signup") {
      if (!email || !password || !name || !username) {
        return NextResponse.json({ error: "All fields required" }, { status: 400 });
      }
      return NextResponse.json({
        user: {
          id: `user-${Date.now()}`,
          email,
          username,
          display_name: name,
          subscription_tier: "free",
        },
        token: "mock-jwt-token",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
