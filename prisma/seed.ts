import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Cotton Sarees",
    slug: "cotton-sarees",
    description: "Breathable handloom and mill cotton sarees for everyday elegance.",
  },
  {
    name: "Silk Cotton Sarees",
    slug: "silk-cotton-sarees",
    description: "Traditional silk cotton weaves with rich zari borders, perfect for festive wear.",
  },
  {
    name: "Printed Sarees",
    slug: "printed-sarees",
    description: "Contemporary marbled and abstract prints paired with classic zari borders.",
  },
];

const products = [
  {
    folder: "1",
    name: "Olive Handloom Cotton Saree with Temple Border",
    slug: "olive-handloom-cotton-temple-border",
    description:
      "A soft handloom cotton saree in earthy olive, finished with a coral-red temple (zigzag) border and a rich maroon pallu woven with floral motifs. Lightweight and breathable — ideal for daily wear and office.",
    fabric: "Handloom Cotton",
    color: "Olive Green",
    price: 189900,
    compareAtPrice: 229900,
    category: "cotton-sarees",
    featured: true,
    images: 3,
  },
  {
    folder: "2",
    name: "Emerald Green Cotton Silk Saree with Zari Butta",
    slug: "emerald-green-cotton-silk-zari-butta",
    description:
      "A vibrant emerald green cotton silk saree scattered with golden zari butta motifs, framed by a bold red temple border and finished with contrast red-and-green tassels.",
    fabric: "Cotton Silk",
    color: "Emerald Green",
    price: 219900,
    compareAtPrice: null,
    category: "silk-cotton-sarees",
    featured: false,
    images: 4,
  },
  {
    folder: "3",
    name: "Maroon Gold Checked Silk Cotton Saree",
    slug: "maroon-gold-checked-silk-cotton",
    description:
      "A regal maroon and gold checked silk cotton saree with a heavily woven zari pallu, paired with a marbled orange-green contrast petticoat piece. A statement pick for weddings and festive occasions.",
    fabric: "Silk Cotton",
    color: "Maroon",
    price: 249900,
    compareAtPrice: 279900,
    category: "silk-cotton-sarees",
    featured: true,
    images: 5,
  },
  {
    folder: "4",
    name: "Maroon Zari Saree with Abstract Multicolor Pallu",
    slug: "maroon-zari-abstract-multicolor-pallu",
    description:
      "A striking cotton saree pairing a hand-marbled multicolor abstract pallu with a densely woven maroon-and-gold zari body. Contemporary art meets traditional weaving.",
    fabric: "Cotton",
    color: "Maroon Multicolor",
    price: 179900,
    compareAtPrice: null,
    category: "printed-sarees",
    featured: false,
    images: 4,
  },
  {
    folder: "5",
    name: "Mustard Marble-Print Saree with Maroon Zari Border",
    slug: "mustard-marble-print-maroon-zari-border",
    description:
      "A mustard and green marble-print pallu flows into a deep maroon zari body woven with a temple motif, creating a saree that feels both artistic and traditional.",
    fabric: "Cotton",
    color: "Mustard",
    price: 179900,
    compareAtPrice: 199900,
    category: "printed-sarees",
    featured: false,
    images: 4,
  },
  {
    folder: "6",
    name: "Black Checked Cotton Saree with Peacock Pallu",
    slug: "black-checked-cotton-peacock-pallu",
    description:
      "A classic black cotton saree with a fine gold checked weave, finished with a rich mustard pallu depicting woven peacock motifs. Timeless and versatile.",
    fabric: "Handloom Cotton",
    color: "Black",
    price: 199900,
    compareAtPrice: null,
    category: "cotton-sarees",
    featured: true,
    images: 3,
  },
  {
    folder: "7",
    name: "Mustard Gold Jacquard Cotton Saree",
    slug: "mustard-gold-jacquard-cotton",
    description:
      "A refined mustard cotton saree with an allover self-jacquard motif, offering understated texture and shine — an easy everyday-to-office saree.",
    fabric: "Cotton",
    color: "Mustard",
    price: 169900,
    compareAtPrice: null,
    category: "cotton-sarees",
    featured: false,
    images: 3,
  },
  {
    folder: "9",
    name: "Mustard Cotton Saree with Maroon Peacock Border",
    slug: "mustard-cotton-maroon-peacock-border",
    description:
      "A warm mustard handloom cotton saree with woven gold stripes and a deep maroon border showcasing intricate peacock medallions — a festive favourite.",
    fabric: "Handloom Cotton",
    color: "Mustard",
    price: 189900,
    compareAtPrice: 209900,
    category: "cotton-sarees",
    featured: true,
    images: 4,
  },
];

async function main() {
  console.log("Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryMap.set(c.slug, cat.id);
  }

  console.log("Seeding products...");
  for (const p of products) {
    const images = Array.from(
      { length: p.images },
      (_, i) => `/images/products/${p.folder}/photo-${i + 1}.png`
    );
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        fabric: p.fabric,
        color: p.color,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        images: JSON.stringify(images),
        featured: p.featured,
        categoryId: categoryMap.get(p.category)!,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        fabric: p.fabric,
        color: p.color,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: 15,
        images: JSON.stringify(images),
        featured: p.featured,
        categoryId: categoryMap.get(p.category)!,
      },
    });
  }

  console.log("Seeding users...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@saree.shop" },
    update: {},
    create: {
      name: "Store Admin",
      email: "admin@saree.shop",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("customer123", 10);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@saree.shop / admin123");
  console.log("Customer login: customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
