// Login endpoint. Verifies credentials against seeded users and issues
// a session cookie on success. Rate limited by IP (see lib/rateLimit.ts)
// to slow down brute-force attempts.

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP address. Vercel sets x-forwarded-for; fall back
    // to a constant key if it's ever missing (e.g. local dev) so the
    // limiter doesn't throw on an undefined key.
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimitResult = checkRateLimit(`login:${ipAddress}`);

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${rateLimitResult.retryAfterFormatted}.`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Same error for "no user" and "wrong password" — avoids leaking
    // which emails are registered.
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await setSessionCookie({ userId: user._id.toString(), email: user.email });

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}