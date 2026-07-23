"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

type Category = { id: string; name: string };

type ProductInput = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  fabric: string;
  color: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  featured: boolean;
  categoryId: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductInput;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<ProductInput>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      fabric: "",
      color: "",
      price: 0,
      compareAtPrice: null,
      stock: 10,
      images: [],
      featured: false,
      categoryId: categories[0]?.id ?? "",
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [library, setLibrary] = useState<{ folder: string; images: string[] }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/image-library")
      .then((r) => r.json())
      .then((data) => setLibrary(data.folders ?? []));
  }, []);

  function toggleImage(src: string) {
    setForm((f) => ({
      ...f,
      images: f.images.includes(src)
        ? f.images.filter((i) => i !== src)
        : [...f.images, src],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.images.length === 0) {
      setError("Select at least one image from the library below.");
      return;
    }

    setSubmitting(true);
    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stock: Number(form.stock),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gold/15 bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink/60">Product Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: slugTouched ? f.slug : slugify(name),
              }));
            }}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink/60">Slug (URL)</label>
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink/60">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Fabric</label>
          <input
            required
            value={form.fabric}
            onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Colour</label>
          <input
            required
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm text-ink/70">
            Show on homepage (Featured)
          </label>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Price (₹)</label>
          <input
            required
            type="number"
            min={1}
            value={form.price / 100 || ""}
            onChange={(e) => setForm((f) => ({ ...f, price: Math.round(Number(e.target.value) * 100) }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">
            Compare-at Price (₹, optional)
          </label>
          <input
            type="number"
            min={1}
            value={form.compareAtPrice ? form.compareAtPrice / 100 : ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                compareAtPrice: e.target.value ? Math.round(Number(e.target.value) * 100) : null,
              }))
            }
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Stock Quantity</label>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gold/15 bg-white p-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Product Images</label>
          <span className="text-xs text-ink/40">{form.images.length} selected</span>
        </div>
        <p className="mt-1 text-xs text-ink/50">
          Click photos below to select them for this product (from public/images/products).
        </p>

        {form.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.images.map((img) => (
              <div key={img} className="relative h-16 w-14 overflow-hidden rounded-lg border-2 border-gold">
                <Image src={img} alt="" fill sizes="3.5rem" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-4 max-h-80 overflow-y-auto pr-1">
          {library.map((group) => (
            <div key={group.folder}>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink/40">
                Folder {group.folder}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.images.map((img) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => toggleImage(img)}
                    className={clsx(
                      "relative h-16 w-14 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105",
                      form.images.includes(img)
                        ? "border-gold shadow-md shadow-gold/20"
                        : "border-transparent hover:border-gold/40"
                    )}
                  >
                    <Image src={img} alt="" fill sizes="3.5rem" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:active:scale-100"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-gold/30 px-6 py-3 text-sm font-semibold text-ink/60 transition-all duration-300 hover:bg-gold/10 active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
