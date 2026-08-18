// Server component: verifies session and document access before
// rendering anything client-side. The actual editor UI (which needs
// browser APIs for TipTap) lives in the client component below.

import { redirect, notFound } from "next/navigation";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import User from "@/models/User";
import EditorClient from "./EditorClient";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id: documentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    notFound();
  }

  await connectDB();
  const document = await Document.findById(documentId).populate("owner", "name email");

  if (!document) {
    notFound();
  }

  const isOwner = document.owner._id.toString() === session.userId;
  const isSharedCollaborator = document.sharedWith.some(
    (collaboratorId: mongoose.Types.ObjectId) => collaboratorId.toString() === session.userId
  );

  if (!isOwner && !isSharedCollaborator) {
    redirect("/dashboard");
  }

  // Fetch all users for the share picker (excluding the current user).
  // Fine at this scale — would paginate/search in a real multi-tenant product.
  const allUsers = await User.find({ _id: { $ne: session.userId } }).select("name email");

  return (
    <EditorClient
      documentId={documentId}
      initialTitle={document.title}
      initialContent={document.content}
      isOwner={isOwner}
      sharedWithIds={document.sharedWith.map((id: mongoose.Types.ObjectId) => id.toString())}
      availableUsers={allUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }))}
    />
  );
}