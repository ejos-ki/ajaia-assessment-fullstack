"use client";

import { useState } from "react";
import { Upload, Plus, FileText } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DocumentTable from "@/components/dashboard/DocumentTable";
import RecentDocumentCard from "@/components/dashboard/RecentDocumentCard";
import ShareDialog from "@/components/dashboard/ShareDialog";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";

interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

interface DashboardClientProps {
  currentUserName: string;
  currentUserEmail: string;
  availableUsers: AvailableUser[];
}

export default function DashboardClient({
  currentUserName,
  currentUserEmail,
  availableUsers,
}: DashboardClientProps) {
  const {
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
    goToDocument,
    refreshDocuments,
  } = useDashboard(currentUserEmail);

  const [shareTargetId, setShareTargetId] = useState<string | null>(null);
  const shareTarget = documents.find((doc) => doc._id === shareTargetId);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const deleteTarget = documents.find((doc) => doc._id === deleteTargetId);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userName={currentUserName}
        userEmail={currentUserEmail}
        onLogout={logout}
      />

      <main className="px-15 py-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Your documents</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {documents.length} document{documents.length === 1 ? "" : "s"} · Welcome back,{" "}
              {currentUserName.split(" ")[0]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Upload size={15} />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={uploadFile}
              className="hidden"
            />
            <button
              onClick={createDocument}
              disabled={isCreating}
              className="flex items-center gap-1.5 bg-teal-700 text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors"
            >
              <Plus size={15} />
              {isCreating ? "Creating..." : "New document"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white border border-gray-200 rounded-xl">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <FileText size={26} className="text-teal-700" />
            </div>
            <p className="text-base font-medium text-gray-900 mb-1.5">
              Start your first document
            </p>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
              Create a new document or upload a .txt or .md file to get started.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Upload size={15} />
                {isUploading ? "Uploading..." : "Upload file"}
              </button>
              <button
                onClick={createDocument}
                disabled={isCreating}
                className="flex items-center gap-1.5 bg-teal-700 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors"
              >
                <Plus size={15} />
                {isCreating ? "Creating..." : "New document"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {recentDocuments.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Recent
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                  {recentDocuments.map((doc) => (
                    <RecentDocumentCard
                      key={doc._id}
                      document={doc}
                      onOpen={() => goToDocument(doc._id)}
                    />
                  ))}
                </div>
              </>
            )}

            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              All documents
            </p>
            <DocumentTable
              documents={documents}
              currentUserEmail={currentUserEmail}
              onOpen={goToDocument}
              onShare={setShareTargetId}
              onDelete={setDeleteTargetId}
            />
          </>
        )}
      </main>

      {shareTarget && (
        <ShareDialog
          documentId={shareTarget._id}
          documentTitle={shareTarget.title}
          availableUsers={availableUsers}
          initialSharedIds={shareTarget.sharedWith}
          onClose={() => setShareTargetId(null)}
          onShared={refreshDocuments}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete document"
          message={`"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteDocument(deleteTarget._id);
            setDeleteTargetId(null);
          }}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}