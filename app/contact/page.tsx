"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { packages } from "@/lib/dummy-data";

function ContactContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package");
  const relatedPackage = packages.find((p) => p.id === packageId);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO (backend): POST to /api/contact, include packageId + reCAPTCHA token
    setSubmitted(true);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Get In Touch
        </h1>
        <p className="text-zinc-600 mt-2">
          Questions about a trip? We&apos;re happy to help you plan it.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Form */}
        <div className="md:col-span-3">
          {submitted ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
              <CheckCircle2 className="mx-auto text-primary mb-3" size={36} />
              <p className="font-heading font-semibold text-lg text-zinc-900">
                Message sent
              </p>
              <p className="text-sm text-zinc-600 mt-1">
                We&apos;ll get back to you within 1–2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {relatedPackage && (
                <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-zinc-700">
                  Inquiring about: <span className="font-semibold">{relatedPackage.title}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">
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
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Phone
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
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={relatedPackage ? `I'd like to know more about ${relatedPackage.title}...` : "How can we help?"}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* reCAPTCHA widget goes here once you have a site key from Google's reCAPTCHA console */}
              {/* <div className="g-recaptcha" data-sitekey="..." /> */}

              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6 flex items-start gap-3">
            <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-sm text-zinc-900">Office</p>
              <p className="text-sm text-zinc-600 mt-0.5">Lalitpur, Nepal</p>
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 flex items-start gap-3">
            <Phone size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-sm text-zinc-900">Phone</p>
              <p className="text-sm text-zinc-600 mt-0.5">+977 9792120873</p>
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 flex items-start gap-3">
            <Mail size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-sm text-zinc-900">Email</p>
              <p className="text-sm text-zinc-600 mt-0.5">hello@paila.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactContent />
    </Suspense>
  );
}