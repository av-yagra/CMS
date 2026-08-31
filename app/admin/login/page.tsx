"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  if (session?.user?.role === "admin") {
    router.push("/admin/dashboard");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    // Fetch the session to check the user's role
    // Note: Backend authorization via withAuth is still the real security boundary
    const response = await fetch("/api/auth/session");
    const sessionData = await response.json();
    
    if (sessionData?.user?.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <section className="max-w-sm mx-auto px-6 py-24">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-surface-dark text-white mb-4">
          <ShieldCheck size={22} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-zinc-900">Admin Login</h1>
        <p className="text-sm text-zinc-600 mt-1">Restricted access.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-surface-dark hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </section>
  );
}