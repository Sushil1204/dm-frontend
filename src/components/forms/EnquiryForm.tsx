"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { enquirySchema, type EnquiryInput } from "@/lib/validation";

type Option = { id: number | string; name: string };

type Props = {
  variant: "contact" | "quote";
  sourcePath: string;
  materialOptions?: Option[];
  applicationOptions?: Option[];
  defaultMaterialId?: number | string | null;
  defaultApplicationId?: number | string | null;
  defaultSubject?: string | null;
};

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors duration-200 focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent/40";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
const errorClass = "mt-1.5 text-[#b42318] text-meta";

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-[#b42318]">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-meta text-muted">{hint}</p> : null}
      {error ? (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm({
  variant,
  sourcePath,
  materialOptions = [],
  applicationOptions = [],
  defaultMaterialId = null,
  defaultApplicationId = null,
  defaultSubject = null,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema) as unknown as Resolver<EnquiryInput>,
    defaultValues: {
      enquiryType: variant,
      name: "",
      email: "",
      company: "",
      phone: "",
      country: "",
      subject: defaultSubject ?? "",
      message: "",
      processingMethod: "",
      specification: "",
      annualVolume: "",
      materialId: defaultMaterialId != null ? Number(defaultMaterialId) : "",
      applicationId: defaultApplicationId != null ? Number(defaultApplicationId) : "",
      consent: false,
      honeypot: "",
    },
  });

  const onSubmit = async (values: EnquiryInput) => {
    setServerError(null);
    try {
      const form = document.getElementById(`enquiry-form-${variant}`) as HTMLFormElement | null;
      const body = new FormData(form ?? undefined);
      /* Ensure validated values win over any stale DOM state. */
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null) continue;
        if (key === "consent") body.set(key, value ? "true" : "");
        else if (typeof value !== "object") body.set(key, String(value));
      }
      body.set("sourcePath", sourcePath);

      const response = await fetch("/api/enquiries", { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !result.ok) {
        setServerError(result.error ?? "Submission failed — please check the form and try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error — please try again.");
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[var(--radius-card)] border border-accent/40 bg-accent/5 px-8 py-10"
      >
        <p className="font-display text-xl font-semibold">Thank you — your enquiry has been received.</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          The team will review your requirement and reply to the email address you provided,
          usually with a few technical questions first.
        </p>
      </div>
    );
  }

  const isQuote = variant === "quote";

  return (
    <form
      id={`enquiry-form-${variant}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 sm:grid-cols-2"
    >
      {/* Honeypot — invisible to humans */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
        </label>
      </div>

      <input type="hidden" {...register("enquiryType")} />

      <Field label="Name" required error={errors.name?.message}>
        <input className={inputClass} autoComplete="name" {...register("name")} />
      </Field>

      <Field label="Work email" required error={errors.email?.message}>
        <input className={inputClass} type="email" autoComplete="email" {...register("email")} />
      </Field>

      <Field label="Company" required error={errors.company?.message}>
        <input className={inputClass} autoComplete="organization" {...register("company")} />
      </Field>

      <Field label="Phone" error={errors.phone?.message}>
        <input className={inputClass} type="tel" autoComplete="tel" {...register("phone")} />
      </Field>

      <Field label="Country" error={errors.country?.message}>
        <input className={inputClass} autoComplete="country-name" {...register("country")} />
      </Field>

      {isQuote ? (
        <Field label="Processing method" error={errors.processingMethod?.message} hint="e.g. extrusion, injection moulding">
          <input className={inputClass} {...register("processingMethod")} />
        </Field>
      ) : (
        <Field label="Subject" error={errors.subject?.message}>
          <input className={inputClass} {...register("subject")} />
        </Field>
      )}

      {isQuote && materialOptions.length > 0 ? (
        <Field label="Material of interest" error={errors.materialId?.message}>
          <select className={inputClass} defaultValue="" {...register("materialId")}>
            <option value="">Not sure yet</option>
            {materialOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      {isQuote && applicationOptions.length > 0 ? (
        <Field label="Application" error={errors.applicationId?.message}>
          <select className={inputClass} defaultValue="" {...register("applicationId")}>
            <option value="">Select an application</option>
            {applicationOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      {isQuote ? (
        <Field label="Estimated annual volume" error={errors.annualVolume?.message} hint="Free text — treated as an estimate, not a commitment">
          <input className={inputClass} {...register("annualVolume")} />
        </Field>
      ) : null}

      <div className="sm:col-span-2">
        <Field
          label={isQuote ? "Specification / target properties" : "Message"}
          required
          error={isQuote ? errors.specification?.message : errors.message?.message}
          hint={isQuote ? "Target properties, processing constraints, standards — as much as you can share." : "Application, processing method, volumes — whatever is useful."}
        >
          <textarea
            rows={isQuote ? 5 : 6}
            className={inputClass}
            {...register(isQuote ? "specification" : "message")}
          />
        </Field>
        {isQuote ? (
          <div className="mt-5">
            <Field label="Additional context (optional)" error={errors.message?.message}>
              <textarea rows={4} className={inputClass} {...register("message")} />
            </Field>
          </div>
        ) : null}
      </div>

      {isQuote ? (
        <div className="sm:col-span-2">
          <Field
            label="Attachment (optional)"
            hint="PDF, DOCX, XLSX, PNG, JPG, TXT or ZIP — up to 4 MB."
          >
            <input
              type="file"
              name="attachment"
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip,.txt"
              className="block w-full text-sm text-muted file:mr-4 file:rounded-[var(--radius-button)] file:border file:border-border file:bg-surface file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-surface-muted"
            />
          </Field>
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            {...register("consent")}
          />
          <span>
            I agree to be contacted about this enquiry. Enquiry details are stored in the
            content management system for follow-up only.
          </span>
        </label>
        {errors.consent ? (
          <p role="alert" className={errorClass}>
            {errors.consent.message as string}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="sm:col-span-2 rounded-[var(--radius-button)] border border-[#b42318]/40 bg-[#b42318]/5 px-4 py-3 text-sm text-[#b42318]"
        >
          {serverError}
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting
            ? "Sending…"
            : isQuote
              ? "Submit quote request"
              : "Send message"}
        </Button>
      </div>
    </form>
  );
}
