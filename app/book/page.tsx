"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { AdminPackage } from "@/types/package";

function BookForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package");

  const [packages, setPackages] = useState<AdminPackage[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/packages").then(res => res.json()).then(data => setPackages(data.packages ?? []));
  }, []);

  const preselected = packages.find((p) => p.id === packageId);

  const [form, setForm] = useState({
    packageId: preselected?.id ?? "",
    phone: "",
    nationality: "",
    travelers: 1,
    expectedDate: "",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "travelers" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: form.packageId,
          phone: form.phone,
          nationality: form.nationality,
          travelers: form.travelers,
          expectedDate: form.expectedDate,
          details: form.details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "An error occurred while submitting your booking.");
        return;
      }

      setSubmitted(true);
    } catch (_err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedPackage = packages.find((p) => p.id === form.packageId);

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
          Get A Quote
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Customize Your Trip
        </h1>
        <p className="text-zinc-600 mt-2">
          Tell us your plans and we&apos;ll get back to you with pricing and availability.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <CheckCircle2 className="mx-auto text-primary mb-3" size={36} />
          <p className="font-heading font-semibold text-lg text-zinc-900">
            Request received
          </p>
          <p className="text-sm text-zinc-600 mt-1">
            {selectedPackage
              ? `We'll follow up with a quote for ${selectedPackage.title} within 1–2 business days.`
              : "We'll follow up with a quote within 1–2 business days."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="packageId" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Trip Package
            </label>
            <select
              id="packageId"
              name="packageId"
              required
              value={form.packageId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="" disabled>
                Select a package
              </option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                disabled
                value={session?.user?.name || "User"}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                value={form.nationality}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                value={session?.user?.email || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Contact number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expectedDate" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Expected date
              </label>
              <div className="relative">
                <input
                  id="expectedDate"
                  name="expectedDate"
                  type="date"
                  value={form.expectedDate}
                  onChange={handleChange}
                  className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <CalendarDays size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="travelers" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Number of people
              </label>
              <input
                id="travelers"
                name="travelers"
                type="number"
                min={1}
                value={form.travelers}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Customization details
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
              placeholder="Anything specific you'd like adjusted — dates, pace, accommodation, add-ons..."
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors"
          >
            {loading ? "Submitting..." : "Request Quote"}
          </button>
        </form>
      )}
    </section>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookForm />
    </Suspense>
  );
}