"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

interface ShareDialogProps {
  documentId: string;
  documentTitle: string;
  availableUsers: AvailableUser[];
  initialSharedIds: string[];
  onClose: () => void;
  onShared: () => void;
}

export default function ShareDialog({
  documentId,
  documentTitle,
  availableUsers,
  initialSharedIds,
  onClose,
  onShared,
}: ShareDialogProps) {
  const [sharedIds, setSharedIds] = useState<string[]>(initialSharedIds);
  const [isSaving, setIsSaving] = useState(false);

  async function toggleUser(userId: string) {
    const updated = sharedIds.includes(userId)
      ? sharedIds.filter((id) => id !== userId)
      : [...sharedIds, userId];

    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWith: updated }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update sharing");
        return;
      }

      setSharedIds(updated);
      const isNowShared = updated.includes(userId);
      toast.success(isNowShared ? "Document shared" : "Sharing removed");
      onShared();
    } catch {
      toast.error("Network error while updating sharing");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-medium text-gray-900">Share document</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4 truncate">{documentTitle}</p>

        <div className="space-y-1">
          {availableUsers.map((user) => {
            const isShared = sharedIds.includes(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => toggleUser(user.id)}
                  disabled={isSaving}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    isShared
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isShared ? "Unshare" : "Share"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}