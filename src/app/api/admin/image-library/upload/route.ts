import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ensureAdmin } from "@/lib/admin-guard";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";
}

export async function POST(req: NextRequest) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || file.name}. Use PNG, JPG or WEBP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `${file.name} is larger than 10MB.` },
        { status: 400 }
      );
    }
  }

  const root = path.join(process.cwd(), "public", "images", "products");
  fs.mkdirSync(root, { recursive: true });

  const requestedFolder = slugify(String(form.get("folder") ?? ""));
  let folder = requestedFolder;
  let suffix = 1;
  while (fs.existsSync(path.join(root, folder))) {
    suffix += 1;
    folder = `${requestedFolder}-${suffix}`;
  }
  const folderPath = path.join(root, folder);
  fs.mkdirSync(folderPath, { recursive: true });

  const savedImages: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = ALLOWED_TYPES[file.type];
    const filename = `photo-${i + 1}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(folderPath, filename), buffer);
    savedImages.push(`/images/products/${folder}/${filename}`);
  }

  return NextResponse.json({ folder, images: savedImages });
}
