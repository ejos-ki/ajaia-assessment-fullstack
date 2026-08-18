// GET/PATCH/DELETE for a single document.
// Access control: only the owner or a shared collaborator may read/edit.
// Only the owner may delete.

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Document, { IDocument } from "@/models/Document";
import { getSession } from "@/lib/auth";
import { checkDocumentAccess } from "@/lib/documentAccess";

interface AuthorizationResult {
  document: mongoose.HydratedDocument<IDocument>;
  isOwner: boolean;
}

interface AuthorizationError {
  errorMessage: string;
  statusCode: number;
}

// Verifies the requesting user is allowed to access this document,
// and tells the caller whether they're the owner (needed for delete).
async function authorizeDocumentAccess(
  documentId: string,
  currentUserId: string
): Promise<AuthorizationResult | AuthorizationError> {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return { errorMessage: "Invalid document ID", statusCode: 400 };
  }

  const document = await Document.findById(documentId);
  if (!document) {
    return { errorMessage: "Document not found", statusCode: 404 };
  }

  const access = checkDocumentAccess({
    ownerId: document.owner.toString(),
    sharedWithIds: document.sharedWith.map((id: mongoose.Types.ObjectId) => id.toString()),
    requestingUserId: currentUserId,
  });

  if (!access.canView) {
    return { errorMessage: "Forbidden", statusCode: 403 };
  }

  return { document, isOwner: access.isOwner };
}

function isAuthorizationError(
  result: AuthorizationResult | AuthorizationError
): result is AuthorizationError {
  return "errorMessage" in result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: documentId } = await params;
  await connectDB();

  const authorizationResult = await authorizeDocumentAccess(documentId, session.userId);
  if (isAuthorizationError(authorizationResult)) {
    return NextResponse.json(
      { error: authorizationResult.errorMessage },
      { status: authorizationResult.statusCode }
    );
  }

  return NextResponse.json({
    document: authorizationResult.document,
    isOwner: authorizationResult.isOwner,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: documentId } = await params;
  await connectDB();

  const authorizationResult = await authorizeDocumentAccess(documentId, session.userId);
  if (isAuthorizationError(authorizationResult)) {
    return NextResponse.json(
      { error: authorizationResult.errorMessage },
      { status: authorizationResult.statusCode }
    );
  }

  const requestBody = await request.json().catch(() => ({}));
  const fieldsToUpdate: { title?: string; content?: string } = {};

  if (typeof requestBody.title === "string" && requestBody.title.trim()) {
    fieldsToUpdate.title = requestBody.title.trim().slice(0, 200); // basic length guard
  }
  if (typeof requestBody.content === "string") {
    fieldsToUpdate.content = requestBody.content.slice(0, 500_000); // guard against runaway payloads
  }

  const updatedDocument = await Document.findByIdAndUpdate(documentId, fieldsToUpdate, {
    new: true,
  });

  return NextResponse.json({ document: updatedDocument });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: documentId } = await params;
  await connectDB();

  const authorizationResult = await authorizeDocumentAccess(documentId, session.userId);
  if (isAuthorizationError(authorizationResult)) {
    return NextResponse.json(
      { error: authorizationResult.errorMessage },
      { status: authorizationResult.statusCode }
    );
  }

  // Only the owner can delete, not shared collaborators.
  if (!authorizationResult.isOwner) {
    return NextResponse.json(
      { error: "Only the owner can delete this document" },
      { status: 403 }
    );
  }

  await Document.findByIdAndDelete(documentId);
  return NextResponse.json({ success: true });
}