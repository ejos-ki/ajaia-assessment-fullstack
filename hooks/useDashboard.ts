"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface DocumentSummary {
  _id: string;
  title: string;
  updatedAt: string;
  owner: { _id: string; name: string; email: string };
  sharedWith: string[];
}

// Centralizes all dashboard data-fetching and mutation logic, so the
// page component only handles layout/composition.
export function useDashboard(currentUserEmail: string) {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to load documents");
        return;
      }
      setDocuments(data.documents);
    } catch {
      toast.error("Network error while loading documents");
    } finally {
      setIsLoading(false);
    }
  }

  async function createDocument() {
    setIsCreating(true);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled document" }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create document");
        return;
      }
      router.push(`/documents/${data.document._id}`);
    } catch {
      toast.error("Network error while creating document");
    } finally {
      setIsCreating(false);
    }
  }

  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to upload file");
        return;
      }
      router.push(`/documents/${data.document._id}`);
    } catch {
      toast.error("Network error while uploading file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function deleteDocument(documentId: string) {
    try {
      const response = await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete document");
        return;
      }
      setDocuments((previous) => previous.filter((doc) => doc._id !== documentId));
      toast.success("Document deleted");
    } catch {
      toast.error("Network error while deleting document");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return {
    documents,
    recentDocuments,
    isLoading,
    isCreating,
    isUploading,
    fileInputRef,
    createDocument,
    uploadFile,
    deleteDocument,
    logout,
    goToDocument: (id: string) => router.push(`/documents/${id}`),
    refreshDocuments: loadDocuments,
  };
}