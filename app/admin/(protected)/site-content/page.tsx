"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Star } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { saveSiteContent, type SiteContent } from "@/lib/siteContentStore";

export default function AdminSiteContentPage() {
  const content = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [savedFlash, setSavedFlash] = useState(false);

  function save() {
    saveSiteContent(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  function inputClass() {
    return "w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  }

  return (
    <div className="max-w-3xl pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Site Content</h1>
          <p className="text-zinc-600 mt-1">Edit the text shown across your public pages.</p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          <Save size={16} />
          {savedFlash ? "Saved!" : "Save All Changes"}
        </button>
      </div>

      {/* Home Hero */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">Home — Hero</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Eyebrow</label>
            <input
              className={inputClass()}
              value={draft.hero.eyebrow}
              onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, eyebrow: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Heading</label>
            <input
              className={inputClass()}
              value={draft.hero.heading}
              onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, heading: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Subheading</label>
            <textarea
              rows={2}
              className={inputClass() + " resize-none"}
              value={draft.hero.subheading}
              onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, subheading: e.target.value } })}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">Home — Why Choose Us</h2>
        <div className="space-y-4">
          {draft.whyChooseUs.map((item, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-3 pb-4 border-b border-black/5 last:border-0 last:pb-0">
              <input
                className={inputClass()}
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const next = [...draft.whyChooseUs];
                  next[i] = { ...next[i], title: e.target.value };
                  setDraft({ ...draft, whyChooseUs: next });
                }}
              />
              <input
                className={inputClass()}
                placeholder="Text"
                value={item.text}
                onChange={(e) => {
                  const next = [...draft.whyChooseUs];
                  next[i] = { ...next[i], text: e.target.value };
                  setDraft({ ...draft, whyChooseUs: next });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">Home — Stats</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {draft.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass()}
                placeholder="Label"
                value={stat.label}
                onChange={(e) => {
                  const next = [...draft.stats];
                  next[i] = { ...next[i], label: e.target.value };
                  setDraft({ ...draft, stats: next });
                }}
              />
              <input
                type="number"
                className={inputClass() + " w-28"}
                value={stat.value}
                onChange={(e) => {
                  const next = [...draft.stats];
                  next[i] = { ...next[i], value: Number(e.target.value) };
                  setDraft({ ...draft, stats: next });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Home CTA */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">Home — CTA Banner</h2>
        <div className="space-y-3">
          <input
            className={inputClass()}
            placeholder="Heading"
            value={draft.homeCta.heading}
            onChange={(e) => setDraft({ ...draft, homeCta: { ...draft.homeCta, heading: e.target.value } })}
          />
          <input
            className={inputClass()}
            placeholder="Text"
            value={draft.homeCta.text}
            onChange={(e) => setDraft({ ...draft, homeCta: { ...draft.homeCta, text: e.target.value } })}
          />
        </div>
      </section>

      {/* About */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">About Page</h2>
        <div className="space-y-3 mb-5">
          <input
            className={inputClass()}
            placeholder="Eyebrow"
            value={draft.about.eyebrow}
            onChange={(e) => setDraft({ ...draft, about: { ...draft.about, eyebrow: e.target.value } })}
          />
          <input
            className={inputClass()}
            placeholder="Heading"
            value={draft.about.heading}
            onChange={(e) => setDraft({ ...draft, about: { ...draft.about, heading: e.target.value } })}
          />
          <textarea
            rows={3}
            className={inputClass() + " resize-none"}
            placeholder="Intro paragraph"
            value={draft.about.intro}
            onChange={(e) => setDraft({ ...draft, about: { ...draft.about, intro: e.target.value } })}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">CTA</p>
        <div className="space-y-3">
          <input
            className={inputClass()}
            placeholder="CTA Heading"
            value={draft.about.ctaHeading}
            onChange={(e) => setDraft({ ...draft, about: { ...draft.about, ctaHeading: e.target.value } })}
          />
          <input
            className={inputClass()}
            placeholder="CTA Text"
            value={draft.about.ctaText}
            onChange={(e) => setDraft({ ...draft, about: { ...draft.about, ctaText: e.target.value } })}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-zinc-900">Testimonials</h2>
          <button
            onClick={() =>
              setDraft({
                ...draft,
                testimonials: [
                  ...draft.testimonials,
                  { id: Date.now(), name: "", location: "", rating: 5, quote: "" },
                ],
              })
            }
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        <div className="space-y-4">
          {draft.testimonials.map((t, i) => (
            <div key={t.id} className="border border-black/5 rounded-xl p-4 space-y-2">
              <div className="grid sm:grid-cols-3 gap-2">
                <input
                  className={inputClass()}
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) => {
                    const next = [...draft.testimonials];
                    next[i] = { ...next[i], name: e.target.value };
                    setDraft({ ...draft, testimonials: next });
                  }}
                />
                <input
                  className={inputClass()}
                  placeholder="Location"
                  value={t.location}
                  onChange={(e) => {
                    const next = [...draft.testimonials];
                    next[i] = { ...next[i], location: e.target.value };
                    setDraft({ ...draft, testimonials: next });
                  }}
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        const next = [...draft.testimonials];
                        next[i] = { ...next[i], rating: n };
                        setDraft({ ...draft, testimonials: next });
                      }}
                    >
                      <Star size={16} className={n <= t.rating ? "fill-accent text-accent" : "text-zinc-300"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                className={inputClass() + " resize-none"}
                placeholder="Quote"
                value={t.quote}
                onChange={(e) => {
                  const next = [...draft.testimonials];
                  next[i] = { ...next[i], quote: e.target.value };
                  setDraft({ ...draft, testimonials: next });
                }}
              />
              <button
                onClick={() => setDraft({ ...draft, testimonials: draft.testimonials.filter((_, idx) => idx !== i) })}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 cursor-pointer"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-zinc-900">FAQ</h2>
          <button
            onClick={() => setDraft({ ...draft, faq: [...draft.faq, { title: "New Category", items: [] }] })}
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add Category
          </button>
        </div>
        <div className="space-y-6">
          {draft.faq.map((category, ci) => (
            <div key={ci} className="border border-black/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  className={inputClass() + " font-semibold"}
                  value={category.title}
                  onChange={(e) => {
                    const next = [...draft.faq];
                    next[ci] = { ...next[ci], title: e.target.value };
                    setDraft({ ...draft, faq: next });
                  }}
                />
                <button
                  onClick={() => setDraft({ ...draft, faq: draft.faq.filter((_, idx) => idx !== ci) })}
                  className="text-red-500 hover:text-red-600 shrink-0 cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="space-y-3">
                {category.items.map((item, ii) => (
                  <div key={ii} className="pl-3 border-l-2 border-black/5 space-y-1.5">
                    <input
                      className={inputClass()}
                      placeholder="Question"
                      value={item.question}
                      onChange={(e) => {
                        const next = [...draft.faq];
                        const items = [...next[ci].items];
                        items[ii] = { ...items[ii], question: e.target.value };
                        next[ci] = { ...next[ci], items };
                        setDraft({ ...draft, faq: next });
                      }}
                    />
                    <textarea
                      rows={2}
                      className={inputClass() + " resize-none"}
                      placeholder="Answer"
                      value={item.answer}
                      onChange={(e) => {
                        const next = [...draft.faq];
                        const items = [...next[ci].items];
                        items[ii] = { ...items[ii], answer: e.target.value };
                        next[ci] = { ...next[ci], items };
                        setDraft({ ...draft, faq: next });
                      }}
                    />
                    <button
                      onClick={() => {
                        const next = [...draft.faq];
                        next[ci] = { ...next[ci], items: next[ci].items.filter((_, idx) => idx !== ii) };
                        setDraft({ ...draft, faq: next });
                      }}
                      className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      Remove question
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...draft.faq];
                    next[ci] = { ...next[ci], items: [...next[ci].items, { question: "", answer: "" }] };
                    setDraft({ ...draft, faq: next });
                  }}
                  className="text-xs font-semibold text-primary cursor-pointer"
                >
                  + Add question
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Footer */}
      <section className="bg-white border border-black/5 rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-zinc-900 mb-4">Contact & Footer</h2>
        <div className="space-y-3">
          <input
            className={inputClass()}
            placeholder="Office address"
            value={draft.contact.address}
            onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, address: e.target.value } })}
          />
          <input
            className={inputClass()}
            placeholder="Phone"
            value={draft.contact.phone}
            onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, phone: e.target.value } })}
          />
          <input
            className={inputClass()}
            placeholder="Email"
            value={draft.contact.email}
            onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })}
          />
          <textarea
            rows={3}
            className={inputClass() + " resize-none"}
            placeholder="Footer tagline"
            value={draft.footer.tagline}
            onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, tagline: e.target.value } })}
          />
        </div>
      </section>
    </div>
  );
}