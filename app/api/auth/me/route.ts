// Returns the currently logged-in user, or null. Used by client
// components to check auth state on load.

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  await connectDB();
  const user = await User.findById(session.userId).select("name email");
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });
}