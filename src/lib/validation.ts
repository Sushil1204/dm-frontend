import { z } from "zod";

/**
 * Shared client/server validation for the enquiry forms.
 * The honeypot field must stay empty; `consent` must be explicitly given.
 * Contact forms require a message; quote forms require a specification.
 */
export const enquirySchema = z
  .object({
    enquiryType: z.enum(["contact", "quote"]),
    name: z.string().trim().min(2, "Please enter your name").max(120),
    email: z.email("Enter a valid email address").max(200),
    company: z.string().trim().min(2, "Please enter your company").max(160),
    phone: z.string().trim().max(60).optional().or(z.literal("")),
    country: z.string().trim().max(80).optional().or(z.literal("")),
    subject: z.string().trim().max(200).optional().or(z.literal("")),
    message: z.string().trim().max(5000).optional().or(z.literal("")),
    processingMethod: z.string().trim().max(160).optional().or(z.literal("")),
    specification: z.string().trim().max(5000).optional().or(z.literal("")),
    annualVolume: z.string().trim().max(160).optional().or(z.literal("")),
    materialId: z.coerce.number().int().positive().optional().or(z.literal("")),
    applicationId: z.coerce.number().int().positive().optional().or(z.literal("")),
    /* Forms post "true"/"" — normalize to boolean, keep a clear consent error. */
    consent: z.preprocess(
      (value) => value === "true" || value === true,
      z.boolean().refine((value) => value, {
        message: "Please confirm consent to be contacted",
      }),
    ),
    honeypot: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.enquiryType === "contact") {
      if ((value.message ?? "").trim().length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["message"],
          message: "Please add a little more detail",
        });
      }
    } else if ((value.specification ?? "").trim().length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["specification"],
        message: "Please describe the specification or requirement",
      });
    }
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

// Vercel Functions cap request bodies at 4.5 MB, so keep headroom for multipart overhead.
export const ATTACHMENT_MAX_BYTES = 4 * 1024 * 1024;
export const ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "text/plain",
];
