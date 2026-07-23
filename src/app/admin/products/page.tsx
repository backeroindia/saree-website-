import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { parseImages } from "@/lib/products";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-ink/40">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const image = parseImages(p.images)[0];
              return (
                <tr key={p.id} className="border-b border-gold/10 transition-colors last:border-0 hover:bg-gold/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-ivory">
                        {image && (
                          <Image src={image} alt={p.name} fill sizes="2.75rem" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="line-clamp-1 font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink/40">{p.fabric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-ink/70">{p.category.name}</td>
                  <td className="p-4 text-ink/70">{formatINR(p.price)}</td>
                  <td className="p-4 text-ink/70">
                    {p.stock <= 0 ? (
                      <span className="text-red-600">Out of stock</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="rounded-full px-3 py-1.5 text-xs font-medium text-green hover:bg-gold/10"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
