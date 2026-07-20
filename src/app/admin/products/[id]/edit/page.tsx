import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            fabric: product.fabric,
            color: product.color,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            images: parseImages(product.images),
            featured: product.featured,
            categoryId: product.categoryId,
          }}
        />
      </div>
    </div>
  );
}
