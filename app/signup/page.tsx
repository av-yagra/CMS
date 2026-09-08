"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, MailCheck, Eye, EyeOff } from "lucide-react";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_\-]).{8,}$/;

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!PASSWORD_REGEX.test(form.password)) {
      setError(
        "Password needs uppercase, lowercase, a number, a special character, and 8+ characters.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setIsVerifying(true);
      setSuccess("Account created! Please check your email for the verification code.");
      setResendCooldown(60); // 1-minute cooldown for resend initially
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Invalid or expired code.");
        return;
      }

      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login?verified=1");
      }, 1500);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;

    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Could not resend code.");
        return;
      }

      setSuccess("A new verification code has been sent.");
      setResendCooldown(60);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isVerifying) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <MailCheck size={22} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Verify your email</h1>
          <p className="text-sm text-zinc-600 mt-1">
            We sent a 6-digit code to <span className="font-medium text-zinc-900">{form.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">
              {success}
            </p>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            className="text-sm font-medium text-primary hover:underline disabled:text-zinc-400 disabled:no-underline transition-colors"
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive a code? Resend"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
          <UserPlus size={22} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-zinc-900">
          Create an account
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          Book trips and track your inquiries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 mb-1.5"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 mb-1.5"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 mb-1.5"
          >
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
          <p className="text-xs text-zinc-500 mt-1.5">
            8+ characters, with uppercase, lowercase, a number, and a special
            character.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </section>
  );
}
