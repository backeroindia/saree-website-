"use client";

import { useState } from "react";
import { Mail, Clock, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Get in Touch</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">We&rsquo;d love to hear from you</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Questions about an order, a saree, or a custom request — reach out and our team will
          get back to you within one business day.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            { icon: Mail, title: "Email us", value: "n.niyazhl@gmail.com" },
            { icon: Clock, title: "Working hours", value: "Mon–Sat, 10am–7pm IST" },
            { icon: MapPin, title: "Studio", value: "Tiruppur, Tamil Nadu, India" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl border border-gold/15 bg-white p-4 transition-shadow hover:shadow-md">
              <div className="rounded-full bg-green/10 p-2 text-green">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-sm text-ink/60">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          {status === "sent" ? (
            <div className="animate-scale-in rounded-xl border border-gold/15 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
                <Send className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Message sent!</h2>
              <p className="mt-2 text-sm text-ink/60">
                Thanks for reaching out — we&rsquo;ll reply to your email shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-gold px-5 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-background active:scale-95"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gold/15 bg-white p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
                <input
                  required
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>
              <input
                required
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
              {/* Honeypot field — hidden from real users, catches simple bots */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
