import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message: string;
}

// Reusable inline error banner for forms — icon + message, consistent
// styling wherever a form needs to surface a submission error.
export default function FormError({ message }: FormErrorProps) {
  return (
    <div className="flex items-start gap-2 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
      <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}