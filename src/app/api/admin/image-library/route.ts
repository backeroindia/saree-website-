import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { response } = await ensureAdmin();
  if (response) return response;

  const root = path.join(process.cwd(), "public", "images", "products");
  const folders: { folder: string; images: string[] }[] = [];

  try {
    const dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const dir of dirs) {
      const files = fs
        .readdirSync(path.join(root, dir.name))
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .sort();
      if (files.length > 0) {
        folders.push({
          folder: dir.name,
          images: files.map((f) => `/images/products/${dir.name}/${f}`),
        });
      }
    }
  } catch {
    // no images directory yet
  }

  return NextResponse.json({ folders });
}
