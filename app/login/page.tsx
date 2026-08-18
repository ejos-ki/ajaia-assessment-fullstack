"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4ecd8] px-4">
      <div className="w-full max-w-sm bg-[#fffdf7] p-8 rounded-sm shadow-[0_2px_10px_rgba(92,64,38,0.15)] border border-[#d9c9a3]">
        <h1 className="text-2xl font-serif font-semibold mb-1 text-[#3d2b1f] tracking-tight">
          Sign in
        </h1>
        <p className="text-sm text-[#7a6a53] mb-6 font-serif italic">
          Use a seeded test account (see README).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5c4326] mb-1 font-serif">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d9c9a3] bg-[#fffdf7] rounded-sm px-3 py-2 text-sm text-[#3d2b1f] placeholder:text-[#b3a488] focus:outline-none focus:ring-2 focus:ring-[#8b6a3f] font-serif"
              placeholder="alice@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5c4326] mb-1 font-serif">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d9c9a3] bg-[#fffdf7] rounded-sm px-3 py-2 text-sm text-[#3d2b1f] placeholder:text-[#b3a488] focus:outline-none focus:ring-2 focus:ring-[#8b6a3f] font-serif"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-[#8b3a2f] bg-[#fbe9e4] border border-[#e3b8ac] rounded-sm px-3 py-2 font-serif">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5c4326] text-[#fffdf7] rounded-sm py-2 text-sm font-medium hover:bg-[#4a3620] disabled:opacity-50 font-serif tracking-wide transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}