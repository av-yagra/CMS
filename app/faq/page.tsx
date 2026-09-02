import FaqAccordion from "@/components/shared/FaqAccordion";

const faqCategories = [
  {
    title: "Booking",
    items: [
      {
        question: "How do I book a tour package?",
        answer:
          "Browse our Packages page, open the one you're interested in, and click \"Book This Package.\" You'll be guided through the details and payment from there.",
      },
      {
        question: "Can I customize a package?",
        answer:
          "Yes — reach out through our Contact page with the package you're interested in and what you'd like changed, and our team will get back to you with options.",
      },
      {
        question: "Do I need an account to book?",
        answer:
          "Creating an account lets you save trips to your wishlist and keeps your details on hand for future bookings, but it isn't required just to send an inquiry.",
      },
    ],
  },
  {
    title: "Payment",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept payments through eSewa, Nepal's trusted digital payment platform. You'll be redirected securely to complete your payment.",
      },
      {
        question: "Is my payment information safe?",
        answer:
          "Yes. Payments are processed directly through eSewa's secure platform — we never see or store your payment details on our servers.",
      },
      {
        question: "Can I get a refund if I cancel?",
        answer:
          "Refund eligibility depends on how far in advance you cancel relative to your trip date. Contact our support team with your booking details and we'll walk you through the options.",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        question: "How do I save a destination or package for later?",
        answer:
          "Click the heart icon on any destination or package card. You can view everything you've saved on your Wishlist page, accessible from the navbar.",
      },
      {
        question: "How can I contact support?",
        answer:
          "Use the Contact page to send us a message directly, or reach out through the details listed there. We typically respond within 1–2 business days.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
          Support
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-600 mt-2">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a href="/contact" className="text-primary font-medium hover:underline">
            Contact us
          </a>
          .
        </p>
      </div>

      <div className="space-y-10">
        {faqCategories.map((category) => (
          <div key={category.title}>
            <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">
              {category.title}
            </h2>
            <FaqAccordion items={category.items} />
          </div>
        ))}
      </div>
    </section>
  );
}