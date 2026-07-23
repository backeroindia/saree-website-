import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQs — N.INIYAZHL",
  description: "Answers to common questions about ordering, payment, shipping, and returns at N.INIYAZHL.",
};

const FAQS = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the shop, add sarees to your cart, and proceed to checkout. You'll need to sign in or create a free account before placing an order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Cash on Delivery (COD) is available on every order across India. Online payment via UPI, cards, and netbanking is coming soon.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are dispatched within 1–2 business days and delivered within 4–7 business days depending on your location.",
  },
  {
    question: "Is shipping free?",
    answer:
      "Yes — shipping is free on every order, with no minimum order value.",
  },
  {
    question: "Can I return or exchange a saree?",
    answer:
      "We do not offer returns or exchanges. All sales are final — please review the product details, fabric, and size carefully before ordering.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Sign in and visit My Orders to see the live status of every order — Placed, Confirmed, Shipped, or Delivered.",
  },
  {
    question: "Are the product photos accurate?",
    answer:
      "Yes. Every saree is photographed as-is, without filters or misleading angles, so what you see is what you receive. Minor colour variation due to screen settings is possible.",
  },
  {
    question: "How should I care for a handloom cotton or silk cotton saree?",
    answer:
      "We recommend dry cleaning for silk cotton and zari-bordered sarees, and a gentle hand wash in cold water for plain handloom cotton. Avoid direct sunlight while drying to protect the colours.",
  },
];

export default function FaqPage() {
  return (
    <div className="animate-fade-in-up mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Support</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Frequently Asked Questions</h1>
        <p className="mt-3 text-ink/60">
          Can&rsquo;t find what you&rsquo;re looking for?{" "}
          <a href="/contact" className="font-medium text-green hover:underline">
            Contact our team
          </a>
          .
        </p>
      </div>

      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  );
}
