"use client";

export type SiteContent = {
  hero: { eyebrow: string; heading: string; subheading: string };
  whyChooseUs: { title: string; text: string }[];
  stats: { label: string; value: number }[];
  homeCta: { heading: string; text: string };
  about: {
    eyebrow: string;
    heading: string;
    intro: string;
    ctaHeading: string;
    ctaText: string;
  };
  testimonials: { id: number; name: string; location: string; rating: number; quote: string }[];
  faq: { title: string; items: { question: string; answer: string }[] }[];
  contact: { address: string; phone: string; email: string };
  footer: { tagline: string };
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: "Nepal & Beyond",
    heading: "Discover Your Next Adventure",
    subheading: "Handpicked destinations and tour packages, wherever you want to go.",
  },
  whyChooseUs: [
    { title: "Trusted Trips", text: "Verified tours and transparent pricing, every time." },
    { title: "Handpicked Destinations", text: "Curated locations, not generic tourist traps." },
    { title: "Fair Pricing", text: "No hidden fees — what you see is what you pay." },
    { title: "Real Support", text: "Reach a real person before, during, and after your trip." },
  ],
  stats: [
    { label: "Tours Completed", value: 500 },
    { label: "Destinations", value: 40 },
    { label: "Happy Travelers", value: 3200 },
    { label: "Years Experience", value: 8 },
  ],
  homeCta: {
    heading: "Ready to start your journey?",
    text: "Take the first step today.",
  },
  about: {
    eyebrow: "Our Story",
    heading: "Built on the First Step",
    intro:
      "Paila means \"the first step\" in Nepali, and that's exactly what we set out to be for every traveler who works with us. Not another booking form, but the first real step toward a trip that's actually planned by people who know the ground, not just the map.",
    ctaHeading: "Ready to take your first step?",
    ctaText: "Browse packages or tell us what you have in mind.",
  },
  testimonials: [
    { id: 1, name: "Sarah Mitchell", location: "United Kingdom", rating: 5, quote: "Our Everest Base Camp trek was flawlessly organized. The guides were knowledgeable and the whole trip felt effortless." },
    { id: 2, name: "Rajesh Kumar", location: "India", rating: 5, quote: "Bali getaway exceeded expectations. Every detail from hotels to transport was handled smoothly." },
    { id: 3, name: "Emma Rodriguez", location: "Spain", rating: 4, quote: "Santorini escape was beautiful and well-paced. Would book with Paila again for our next trip." },
  ],
  faq: [
    {
      title: "Booking",
      items: [
        { question: "How do I book a tour package?", answer: "Browse our Packages page, open the one you're interested in, and click \"Book This Package.\" You'll be guided through the details and payment from there." },
        { question: "Can I customize a package?", answer: "Yes — reach out through our Contact page with the package you're interested in and what you'd like changed, and our team will get back to you with options." },
        { question: "Do I need an account to book?", answer: "Creating an account lets you save trips to your wishlist and keeps your details on hand for future bookings, but it isn't required just to send an inquiry." },
      ],
    },
    {
      title: "Payment",
      items: [
        { question: "What payment methods do you accept?", answer: "We accept payments through eSewa, Nepal's trusted digital payment platform. You'll be redirected securely to complete your payment." },
        { question: "Is my payment information safe?", answer: "Yes. Payments are processed directly through eSewa's secure platform — we never see or store your payment details on our servers." },
        { question: "Can I get a refund if I cancel?", answer: "Refund eligibility depends on how far in advance you cancel relative to your trip date. Contact our support team with your booking details and we'll walk you through the options." },
      ],
    },
    {
      title: "General",
      items: [
        { question: "How do I save a destination or package for later?", answer: "Click the heart icon on any destination or package card. You can view everything you've saved on your Wishlist page, accessible from the navbar." },
        { question: "How can I contact support?", answer: "Use the Contact page to send us a message directly, or reach out through the details listed there. We typically respond within 1–2 business days." },
      ],
    },
  ],
  contact: {
    address: "Kathmandu, Nepal",
    phone: "+977 000-0000000",
    email: "hello@paila.com",
  },
  footer: {
    tagline: "Paila means \"the first step\" — every great journey begins with one. Handpicked destinations and tour packages, curated for unforgettable adventures.",
  },
};

