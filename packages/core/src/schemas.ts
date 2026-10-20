// Zod schemas mirroring docs/ARCHITECTURE.md. Validate at every boundary.
import { z } from "zod";
import { CURRENCIES } from "./money";
import { CATEGORIES } from "./places";

export const roleSchema = z.enum(["vendor", "consumer", "admin"]);
export const localeSchema = z.enum(["es", "en"]);
export const currencySchema = z.enum(CURRENCIES);

/** Decimal string as stored in Postgres numeric columns, max 2 decimals, non-negative. */
export const moneyStringSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "invalid_amount");

/** WhatsApp number in E.164 form, e.g. +573001234567. */
export const whatsappSchema = z.string().regex(/^\+[1-9]\d{7,14}$/, "invalid_whatsapp");

/** Email for the sign-in link/code. */
export const signInEmailSchema = z.string().trim().toLowerCase().pipe(z.email("invalid_email"));

/** One-time code from the sign-in email (6 digits by default; Supabase allows up to 10). */
export const otpCodeSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, ""))
  .pipe(z.string().regex(/^\d{6,10}$/, "invalid_code"));

export const vendorProfileInputSchema = z.object({
  display_name: z.string().trim().min(1, "required").max(80),
});
export type VendorProfileInput = z.infer<typeof vendorProfileInputSchema>;

export const categorySchema = z.enum(CATEGORIES, "required");

export const profileSchema = z.object({
  id: z.uuid(),
  role: roleSchema,
  display_name: z.string().trim().min(1).max(80),
  phone: z.string().nullable(),
  locale: localeSchema.default("es"),
  created_at: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;

export const businessInputSchema = z.object({
  name: z.string().trim().min(1, "required").max(80),
  description: z.string().trim().max(500).optional(),
  category: categorySchema,
  lat: z.number().min(-90).max(90).nullable(),
  lng: z.number().min(-180).max(180).nullable(),
  whatsapp: whatsappSchema,
  currency: currencySchema,
});
export type BusinessInput = z.infer<typeof businessInputSchema>;

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "required").max(80),
  price: moneyStringSchema,
  cost: moneyStringSchema.nullable(),
  image_url: z.url().nullable(),
  is_active: z.boolean().default(true),
});
export type ProductInput = z.infer<typeof productInputSchema>;

export const salesEntryInputSchema = z.object({
  product_id: z.uuid(),
  units: z.number().int().min(0).max(100_000),
  sold_on: z.iso.date(),
});
export type SalesEntryInput = z.infer<typeof salesEntryInputSchema>;
