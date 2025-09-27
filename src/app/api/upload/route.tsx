// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary"; // your cloudinary.tsx (can be .ts)

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",       // 👈 detect PDFs properly (or use "raw")
          folder: "invoices",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      upload.end(buf);
    });

    // result.secure_url should usually end with .pdf and be previewable inline
    return NextResponse.json(
      {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Cloudinary upload error:", e);
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
