import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // In production: call OpenAI Chat API with fashion context
    const responses: Record<string, string> = {
      default:
        "I'd be happy to help with your style! Try describing what occasion you're dressing for, and I'll suggest outfit combinations from your closet.",
    };

    return NextResponse.json({
      response:
        responses.default,
      suggestions: [
        "What should I wear for a date night?",
        "Help me style my new leather jacket",
        "What are trending styles this season?",
      ],
    });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
