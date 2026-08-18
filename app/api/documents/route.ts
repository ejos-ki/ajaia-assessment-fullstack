// GET: list documents the current user owns or has been shared.
// POST: create a new blank document owned by the current user.

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Return documents the user owns OR has been shared with.
  const docs = await Document.find({
    $or: [{ owner: session.userId }, { sharedWith: session.userId }],
  })
    .sort({ updatedAt: -1 })
    .populate("owner", "name email")
    .lean();

  return NextResponse.json({ documents: docs });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" && body.title.trim()
    ? body.title.trim()
    : "Untitled Document";

  await connectDB();

  const doc = await Document.create({
    title,
    content: "",
    owner: session.userId,
    sharedWith: [],
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}