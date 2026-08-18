// POST: accepts an uploaded .txt or .md file and creates a new document
// from its content. Enforces file type and size limits since this is
// a user-supplied file being read directly into the database.

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import { getSession } from "@/lib/auth";

const ALLOWED_EXTENSIONS = [".txt", ".md"];
const MAX_FILE_SIZE_BYTES = 1_000_000; // 1MB — generous for plain text, blocks abuse

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const uploadedFile = formData?.get("file");

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileName = uploadedFile.name;
  const hasAllowedExtension = ALLOWED_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension)
  );

  if (!hasAllowedExtension) {
    return NextResponse.json(
      { error: `Only ${ALLOWED_EXTENSIONS.join(", ")} files are supported` },
      { status: 400 }
    );
  }

  if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 1MB." },
      { status: 400 }
    );
  }

  const fileContentText = await uploadedFile.text();

  // Wrap plain text in a <p> tag so it renders correctly in the TipTap
  // editor, which expects HTML content. Escaping prevents any HTML the
  // file happens to contain from being interpreted as markup (basic
  // stored-XSS guard, since this content is later rendered in the editor).
  const escapedContent = fileContentText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const documentContentHtml = `<p>${escapedContent.replace(/\n/g, "</p><p>")}</p>`;

  const documentTitle = fileName.replace(/\.(txt|md)$/i, "") || "Untitled Document";

  await connectDB();

  const newDocument = await Document.create({
    title: documentTitle,
    content: documentContentHtml,
    owner: session.userId,
    sharedWith: [],
  });

  return NextResponse.json({ document: newDocument }, { status: 201 });
}