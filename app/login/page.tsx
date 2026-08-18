"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import BrandPanel from "@/components/auth/BrandPanel";
import MobileBrandBar from "@/components/auth/MobileBrandBar";
import PasswordInput from "@/components/auth/PasswordInput";
import FormError from "@/components/auth/FormError";
import { LOGIN_SUBTITLE } from "@/lib/constants/branding";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } =
    useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF2F1] px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-teal-700 opacity-[0.08] pointer-events-none" />
      <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-teal-700 opacity-[0.06] pointer-events-none" />
      <div className="absolute top-1/3 right-[10%] w-36 h-36 rounded-full bg-teal-700 opacity-[0.05] pointer-events-none" />

      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex relative">
        <BrandPanel />

        <div className="flex-1 flex flex-col">
          <MobileBrandBar />

          <div className="flex-1 flex items-center justify-center px-8 py-12 sm:px-12">
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight">
                Sign in
              </h1>
              <p className="text-sm text-gray-500 mb-7">{LOGIN_SUBTITLE}</p>

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
                  <PasswordInput value={password} onChange={setPassword} />
                </div>

                {error && <FormError message={error} />}

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