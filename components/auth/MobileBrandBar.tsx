import { FileText } from "lucide-react";
import { APP_NAME } from "@/lib/constants/branding";

// Compact teal accent bar + logo shown only on small screens, where
// the full BrandPanel is hidden. Keeps the theme color visible even
// when space is too tight for the full branding panel.
export default function MobileBrandBar() {
  return (
    <>
      <div className="md:hidden h-1.5 bg-teal-700" />
      <div className="md:hidden flex items-center gap-2 px-8 pt-6">
        <div className="w-6 h-6 rounded-md bg-teal-700 flex items-center justify-center">
          <FileText size={13} className="text-white" />
        </div>
        <span className="text-sm font-medium text-gray-900">{APP_NAME}</span>
      </div>
    </>
  );
}