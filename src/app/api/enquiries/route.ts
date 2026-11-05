import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/cms";
import {
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MIME_TYPES,
  enquirySchema,
} from "@/lib/validation";

/**
 * Public enquiry endpoint for the contact and quote forms.
 * - zod-validated, honeypot-trapping, rate-limited (5 / 10 min / IP)
 * - raw Payload REST create stays locked to signed-in editors
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection — please try again shortly." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
  }

  const raw: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  /* Honeypot filled → pretend success, store nothing. */
  if (typeof raw.honeypot === "string" && raw.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: issue?.message ?? "Please check the highlighted fields." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const payload = await getPayloadClient();

    /* Optional attachment — validated MIME and size, stored privately. */
    let attachmentId: number | string | null = null;
    const file = form.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (!ATTACHMENT_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { ok: false, error: "That file type is not supported. Use PDF, DOCX, XLSX, PNG, JPG, TXT or ZIP." },
          { status: 400 },
        );
      }
      if (file.size > ATTACHMENT_MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Attachment is too large — the limit is 4 MB." },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const reference = `ENQ-${Date.now().toString(36).toUpperCase()}`;
      const attachment = await payload.create({
        collection: "attachments",
        data: { enquiryReference: reference },
        file: {
          data: buffer,
          mimetype: file.type,
          name: file.name.slice(0, 120) || "attachment",
          size: buffer.length,
        },
      });
      attachmentId = attachment.id;
    }

    await payload.create({
      collection: "enquiries",
      data: {
        enquiryType: data.enquiryType,
        status: "new",
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone || null,
        country: data.country || null,
        subject: data.subject || null,
        message: data.message || null,
        material: data.materialId || null,
        application: data.applicationId || null,
        processingMethod: data.processingMethod || null,
        specification: data.specification || null,
        annualVolume: data.annualVolume || null,
        attachment: attachmentId,
        consentAt: new Date().toISOString(),
        sourcePath: typeof raw.sourcePath === "string" ? raw.sourcePath.slice(0, 300) : null,
      } as never,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[enquiries] failed to store submission", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong storing your enquiry — please try again." },
      { status: 500 },
    );
  }
}
