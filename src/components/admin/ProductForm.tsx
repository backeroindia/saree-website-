"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, X, UploadCloud, Loader2 } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/image-library")
      .then((r) => r.json())
      .then((data) => setLibrary(data.folders ?? []));
  }, []);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const body = new FormData();
    Array.from(fileList).forEach((file) => body.append("files", file));
    body.append("folder", form.slug || form.name || "product");

    const res = await fetch("/api/admin/image-library/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setUploadError(data.error ?? "Upload failed");
      return;
    }

    setLibrary((lib) => [{ folder: data.folder, images: data.images }, ...lib]);
    setForm((f) => ({ ...f, images: [...f.images, ...data.images] }));
  }

  function toggleImage(src: string) {
    setForm((f) => ({
      ...f,
      images: f.images.includes(src)
        ? f.images.filter((i) => i !== src)
        : [...f.images, src],
    }));
  }

  function makeFirstImage(src: string) {
    setForm((f) => ({
      ...f,
      images: [src, ...f.images.filter((i) => i !== src)],
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
          <label className="mb-1 block text-xs font-medium text-ink/60">Product Name <span className="text-red-500">*</span></label>
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
          <label className="mb-1 block text-xs font-medium text-ink/60">Slug (URL) <span className="text-red-500">*</span></label>
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
          <label className="mb-1 block text-xs font-medium text-ink/60">Description <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Fabric <span className="text-red-500">*</span></label>
          <input
            required
            value={form.fabric}
            onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Colour <span className="text-red-500">*</span></label>
          <input
            required
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Category <span className="text-red-500">*</span></label>
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
          <label className="mb-1 block text-xs font-medium text-ink/60">Price (₹) <span className="text-red-500">*</span></label>
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
          <label className="mb-1 block text-xs font-medium text-ink/60">Stock Quantity <span className="text-red-500">*</span></label>
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
          <label className="text-sm font-medium text-ink">Product Images <span className="text-red-500">*</span></label>
          <span className="text-xs text-ink/40">{form.images.length} selected</span>
        </div>
        <p className="mt-1 text-xs text-ink/50">
          Upload new photos, or click existing photos below to select them (from public/images/products).
        </p>

        <label
          className={clsx(
            "mt-3 flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gold/30 px-4 py-6 text-center transition-colors hover:border-gold/60 hover:bg-gold/5",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
          ) : (
            <UploadCloud className="h-5 w-5 text-gold" />
          )}
          <span className="text-sm font-medium text-ink/70">
            {uploading ? "Uploading…" : "Upload new photos"}
          </span>
          <span className="text-xs text-ink/40">PNG, JPG or WEBP — up to 10MB each</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            disabled={uploading}
            onChange={(e) => {
              handleUpload(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

        {form.images.length > 0 && (
          <>
            <p className="mt-4 text-xs text-ink/50">
              First photo is the cover image shown in listings — click the star on any other photo to make it the cover.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={img} className="relative h-16 w-14 overflow-hidden rounded-lg border-2 border-gold">
                  <Image src={img} alt="" fill sizes="3.5rem" className="object-cover" />
                  {i === 0 ? (
                    <span className="absolute left-0 top-0 rounded-br-lg bg-gold px-1 py-0.5 text-[9px] font-semibold uppercase text-background">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeFirstImage(img)}
                      title="Set as cover image"
                      className="absolute left-0 top-0 rounded-br-lg bg-black/50 p-1 text-white transition-colors hover:bg-gold"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleImage(img)}
                    title="Remove"
                    className="absolute right-0 top-0 rounded-bl-lg bg-black/50 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </>
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
