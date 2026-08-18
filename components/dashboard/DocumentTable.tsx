"use client";

import { FileText, Share2, Trash2 } from "lucide-react";
import type { DocumentSummary } from "@/hooks/useDashboard";

interface DocumentTableProps {
  documents: DocumentSummary[];
  currentUserEmail: string;
  onOpen: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DocumentTable({
  documents,
  currentUserEmail,
  onOpen,
  onShare,
  onDelete,
}: DocumentTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Owner</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Updated</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => {
            const isOwner = document.owner.email === currentUserEmail;
            return (
              <tr
                key={document._id}
                onClick={() => onOpen(document._id)}
                className="group border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
                      <FileText size={13} className="text-teal-700" />
                    </div>
                    <span className="font-medium text-gray-900">{document.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-gray-600">{document.owner.name}</td>
                <td className="px-6 py-3.5 text-gray-600">
                  {new Date(document.updatedAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-3.5">
                  {document.sharedWith.length > 0 ? (
                    <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                      Shared
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    {isOwner && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(document._id);
                          }}
                          aria-label="Share document"
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Share2 size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(document._id);
                          }}
                          aria-label="Delete document"
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}