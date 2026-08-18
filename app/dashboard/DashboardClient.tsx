"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface DocumentSummary {
  _id: string;
  title: string;
  updatedAt: string;
  owner: { _id: string; name: string; email: string };
  sharedWith: string[];
}

interface DashboardClientProps {
  currentUserName: string;
  currentUserEmail: string;
}

export default function DashboardClient({
  currentUserName,
  currentUserEmail,
}: DashboardClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to load documents");
        return;
      }

      setDocuments(data.documents);
    } catch {
      setErrorMessage("Network error while loading documents");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDocument() {
    setIsCreating(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Document" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to create document");
        return;
      }

      router.push(`/documents/${data.document._id}`);
    } catch {
      setErrorMessage("Network error while creating document");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to upload file");
        return;
      }

      router.push(`/documents/${data.document._id}`);
    } catch {
      setErrorMessage("Network error while uploading file");
    } finally {
      setIsUploading(false);
      // Reset so selecting the same file again still triggers onChange.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteDocument(documentId: string) {
    const confirmed = window.confirm("Delete this document? This cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to delete document");
        return;
      }

      setDocuments((previous) => previous.filter((doc) => doc._id !== documentId));
    } catch {
      setErrorMessage("Network error while deleting document");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4ecd8]">
      <header className="border-b border-[#d9c9a3] bg-[#fffdf7] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-semibold text-[#3d2b1f]">
            Ajaia Docs
          </h1>
          <p className="text-sm text-[#7a6a53] font-serif">
            Signed in as {currentUserName} ({currentUserEmail})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-[#5c4326] border border-[#d9c9a3] rounded-sm px-4 py-2 hover:bg-[#f4ecd8] font-serif transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif text-[#3d2b1f]">Your Documents</h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="border border-[#d9c9a3] text-[#5c4326] rounded-sm px-4 py-2 text-sm font-medium hover:bg-[#f4ecd8] disabled:opacity-50 font-serif transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileSelected}
              className="hidden"
            />
            <button
              onClick={handleCreateDocument}
              disabled={isCreating}
              className="bg-[#5c4326] text-[#fffdf7] rounded-sm px-4 py-2 text-sm font-medium hover:bg-[#4a3620] disabled:opacity-50 font-serif transition-colors"
            >
              {isCreating ? "Creating..." : "+ New Document"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-[#8b3a2f] bg-[#fbe9e4] border border-[#e3b8ac] rounded-sm px-3 py-2 mb-4 font-serif">
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p className="text-[#7a6a53] font-serif text-sm">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-[#7a6a53] font-serif text-sm italic">
            No documents yet. Create your first one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {documents.map((document) => (
              <li
                key={document._id}
                className="bg-[#fffdf7] border border-[#d9c9a3] rounded-sm px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => router.push(`/documents/${document._id}`)}
                  className="text-left flex-1"
                >
                  <p className="font-serif text-[#3d2b1f] font-medium">
                    {document.title}
                  </p>
                  <p className="text-xs text-[#9c8a6c] font-serif">
                    Owner: {document.owner.name} · Updated{" "}
                    {new Date(document.updatedAt).toLocaleString()}
                    {document.sharedWith.length > 0 &&
                      ` · Shared with ${document.sharedWith.length} user(s)`}
                  </p>
                </button>
                {document.owner.email === currentUserEmail && (
                  <button
                    onClick={() => handleDeleteDocument(document._id)}
                    className="text-xs text-[#8b3a2f] hover:underline font-serif ml-4"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}