// PATCH: updates the list of users a document is shared with.
// Only the document owner may change sharing settings.

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: documentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
  }

  await connectDB();

  const document = await Document.findById(documentId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Only the owner can manage sharing — a shared collaborator shouldn't
  // be able to add/remove other collaborators.
  const isOwner = document.owner.toString() === session.userId;
  if (!isOwner) {
    return NextResponse.json(
      { error: "Only the owner can manage sharing" },
      { status: 403 }
    );
  }

  const requestBody = await request.json().catch(() => ({}));
  const proposedSharedWith = requestBody.sharedWith;

  if (!Array.isArray(proposedSharedWith)) {
    return NextResponse.json(
      { error: "sharedWith must be an array of user IDs" },
      { status: 400 }
    );
  }

  // Validate every proposed ID is a real, valid ObjectId before trusting it.
  const validObjectIds = proposedSharedWith.every(
    (userId: unknown) => typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)
  );
  if (!validObjectIds) {
    return NextResponse.json({ error: "Invalid user ID in sharedWith list" }, { status: 400 });
  }

  // Confirm every proposed user actually exists, so a stale or fabricated
  // ID doesn't silently get stored as a "collaborator."
  const matchingUserCount = await User.countDocuments({
    _id: { $in: proposedSharedWith },
  });
  if (matchingUserCount !== proposedSharedWith.length) {
    return NextResponse.json({ error: "One or more users not found" }, { status: 400 });
  }

  // An owner can't "share" a document with themselves.
  const sharedWithExcludingOwner = proposedSharedWith.filter(
    (userId: string) => userId !== session.userId
  );

  document.sharedWith = sharedWithExcludingOwner;
  await document.save();

  return NextResponse.json({ document });
}