import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

// Global fallback for any route that doesn't match — separate from
// app/documents/[id]/not-found.tsx, which handles the more specific
// "document was deleted" case with its own messaging.
export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5">
          <Compass size={26} className="text-teal-700" />
        </div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Error 404
        </p>
        <h1 className="text-lg font-medium text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-teal-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-teal-800 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to your documents
        </Link>
      </div>
    </div>
  );
}