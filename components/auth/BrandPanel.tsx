import { FileText } from "lucide-react";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  TECH_STACK_CREDIT,
} from "@/lib/constants/branding";

// The teal branding panel shown on the left side of auth pages.
// Hidden below the md breakpoint by the parent — this component just
// renders the content, layout/visibility is the caller's concern.
export default function BrandPanel() {
  return (
    <div className="hidden md:flex md:w-[45%] bg-teal-700 flex-col justify-between p-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <FileText size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium text-white">{APP_NAME}</span>
      </div>

      <div>
        <p className="text-2xl font-medium text-white leading-snug mb-3">
          {APP_TAGLINE}
        </p>
        <p className="text-sm text-teal-100">{APP_DESCRIPTION}</p>
      </div>

      <p className="text-xs text-teal-200">{TECH_STACK_CREDIT}</p>
    </div>
  );
}