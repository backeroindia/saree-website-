"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, ArrowLeft } from "lucide-react";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const emptyForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetch("/api/account/addresses")
      .then((r) => r.json())
      .then((data) => setAddresses(data.addresses ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(a: Address) {
    setEditingId(a.id);
    setForm({ ...a, line2: a.line2 ?? "" });
    setError(null);
  }

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const isNew = editingId === "new";
    const url = isNew ? "/api/account/addresses" : `/api/account/addresses/${editingId}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error ?? "Could not delete this address");
      return;
    }
    load();
  }

  async function handleSetDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/account" className="mb-4 flex items-center gap-1 text-sm text-ink/50 hover:text-green">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-ink">Saved Addresses</h1>
        {editingId === null && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-green-dark transition-all hover:bg-gold-hover"
          >
            <Plus className="h-4 w-4" /> Add Address
          </button>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-gold/15 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">
            {editingId === "new" ? "Add New Address" : "Edit Address"}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2" />
            <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2" />
            <input required placeholder="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2" />
            <input placeholder="Address Line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold" />
            <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold" />
            <input
              required
              placeholder="Pincode"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
              className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="h-4 w-4" />
              Set as default address
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={submitting} className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-green-dark hover:bg-gold-hover disabled:opacity-60">
              {submitting ? "Saving…" : "Save Address"}
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-ink/60 hover:bg-gold/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {addresses === null ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : addresses.length === 0 ? (
          <div className="rounded-xl border border-gold/15 bg-white p-10 text-center text-ink/60">
            No saved addresses yet.
          </div>
        ) : (
          addresses.map((a) => (
            <div key={a.id} className="rounded-xl border border-gold/15 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {a.fullName}
                    {a.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-green-dark">
                        <Star className="h-3 w-3 fill-current" /> Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-ink/60">
                    {a.line1}{a.line2 && `, ${a.line2}`}<br />
                    {a.city}, {a.state} - {a.pincode}<br />
                    Phone: {a.phone}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => startEdit(a)} className="rounded-full p-2 text-ink/50 hover:bg-gold/10 hover:text-green" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="rounded-full p-2 text-ink/50 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {!a.isDefault && (
                <button onClick={() => handleSetDefault(a.id)} className="mt-3 text-xs text-green hover:underline">
                  Set as default
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
