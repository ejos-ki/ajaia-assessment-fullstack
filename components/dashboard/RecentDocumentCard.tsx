"use client";

import { FileText } from "lucide-react";
import type { DocumentSummary } from "@/hooks/useDashboard";

interface RecentDocumentCardProps {
  document: DocumentSummary;
  onOpen: () => void;
}

export default function RecentDocumentCard({ document, onOpen }: RecentDocumentCardProps) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-white border border-gray-200 rounded-xl p-3.5 hover:border-teal-300 hover:shadow-sm transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-2.5">
        <FileText size={15} className="text-teal-700" />
      </div>
      <p className="text-sm font-medium text-gray-900 truncate">{document.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {new Date(document.updatedAt).toLocaleDateString()}
      </p>
    </button>
  );
}