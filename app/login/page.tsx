"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Login failed";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF2F1] px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-teal-700 opacity-[0.08] pointer-events-none" />
      <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-teal-700 opacity-[0.06] pointer-events-none" />
      <div className="absolute top-1/3 right-[10%] w-36 h-36 rounded-full bg-teal-700 opacity-[0.05] pointer-events-none" />

      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex relative">
        {/* Left branding panel — hidden below md breakpoint */}
        <div className="hidden md:flex md:w-[45%] bg-teal-700 flex-col justify-between p-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-white">Ajaia Docs</span>
          </div>

          <div>
            <p className="text-2xl font-medium text-white leading-snug mb-3">
              Write, share, and edit documents together.
            </p>
            <p className="text-sm text-teal-100">
              A lightweight document editor built for the Ajaia AI-native assessment.
            </p>
          </div>

          <p className="text-xs text-teal-200">
            Built with Next.js, MongoDB, and TipTap
          </p>
        </div>

        {/* Right form panel — full width on small screens */}
        <div className="flex-1 flex flex-col">
          {/* Mobile-only accent bar + logo, hidden once the left panel shows at md+ */}
          <div className="md:hidden h-1.5 bg-teal-700" />
          <div className="md:hidden flex items-center gap-2 px-8 pt-6">
            <div className="w-6 h-6 rounded-md bg-teal-700 flex items-center justify-center">
              <FileText size={13} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Ajaia Docs</span>
          </div>

          <div className="flex-1 flex items-center justify-center px-8 py-12 sm:px-12">
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight">Sign in</h1>
              <p className="text-sm text-gray-500 mb-7">
                Use a seeded test account (see README).
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-colors"
                    placeholder="alice@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((visible) => !visible)}
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}