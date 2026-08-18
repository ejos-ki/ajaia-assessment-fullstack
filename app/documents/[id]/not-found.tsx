import Link from "next/link";
import { FileX, ArrowLeft } from "lucide-react";

// Next.js automatically renders this when notFound() is called inside
// a route segment, or when a dynamic route matches no data. Scoped to
// app/documents/[id]/, so it only applies to document pages, not the
// whole site.
export default function DocumentNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <FileX size={26} className="text-red-600" />
        </div>
        <h1 className="text-lg font-medium text-gray-900 mb-2">
          Document not found
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This document may have been deleted, or you may not have access to it.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-teal-800 transition-colors"
        >
            <ArrowLeft size={15} />
            Go to homepage
        </Link>
      </div>
    </div>
  );
}