"use client";

import { useState } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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

    if (result?.error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    // Login succeeded — but that only proves this is a real account,
    // not that it's an admin. Fetch the fresh session to check the role.
    const session = await getSession();

    if (session?.user?.role !== "admin") {
      setError("This account doesn't have admin access.");
      await fetch("/api/auth/signout", { method: "POST" }).catch(() => { });
      setLoading(false);
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 pr-11 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-surface-dark hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors cursor-pointer"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </section>
  );
}