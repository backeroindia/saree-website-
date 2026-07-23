"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Power } from "lucide-react";
import { formatINR } from "@/lib/money";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minOrderValue: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
};

const emptyForm = {
  code: "",
  type: "PERCENT" as "PERCENT" | "FLAT",
  value: 10,
  minOrderValue: 0,
  maxUses: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => setCoupons(data.coupons ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: form.type === "FLAT" ? Math.round(Number(form.value) * 100) : Number(form.value),
        minOrderValue: Math.round(Number(form.minOrderValue) * 100),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function handleToggleActive(c: Coupon) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-ink">Coupons</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-green-dark transition-all hover:bg-gold-hover"
        >
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-gold/15 bg-white p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Code</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENT" | "FLAT" })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="PERCENT">Percent off</option>
              <option value="FLAT">Flat amount off (₹)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">
              Value {form.type === "PERCENT" ? "(%)" : "(₹)"}
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Minimum Order (₹)</label>
            <input
              type="number"
              min={0}
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Max Uses (optional)</label>
            <input
              type="number"
              min={1}
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Expires (optional)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-green-dark hover:bg-gold-hover disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create Coupon"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-ink/40">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Discount</th>
              <th className="p-4 font-medium">Min Order</th>
              <th className="p-4 font-medium">Used</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {coupons === null ? (
              <tr><td colSpan={6} className="p-8 text-center text-ink/50">Loading…</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-ink/50">No coupons yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="border-b border-gold/10 last:border-0">
                  <td className="p-4 font-medium text-ink">{c.code}</td>
                  <td className="p-4 text-ink/70">
                    {c.type === "PERCENT" ? `${c.value}%` : formatINR(c.value)}
                  </td>
                  <td className="p-4 text-ink/70">{c.minOrderValue > 0 ? formatINR(c.minOrderValue) : "—"}</td>
                  <td className="p-4 text-ink/70">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/50"}`}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggleActive(c)} className="rounded-full p-2 text-ink/50 hover:bg-gold/10 hover:text-green" aria-label="Toggle active">
                        <Power className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="rounded-full p-2 text-ink/50 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
