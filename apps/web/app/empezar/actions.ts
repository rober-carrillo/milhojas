"use server";

import { redirect } from "next/navigation";
import {
  businessInputSchema,
  COUNTRIES,
  createBusiness,
  findCity,
  getVendorState,
  saveVendorProfile,
  toE164,
  vendorProfileInputSchema,
  type MessageKey,
} from "@milhojas/core";
import { errorKey } from "../../lib/i18n";
import { createClient } from "../../lib/supabase/server";

export interface FormState {
  errors: Partial<Record<string, MessageKey>>;
  values: Record<string, string>;
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]): FormState["errors"] {
  const errors: FormState["errors"] = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= errorKey(issue.message);
  }
  return errors;
}

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { display_name: text(formData, "display_name") };
  const parsed = vendorProfileInputSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error.issues), values };

  const supabase = await createClient();
  const state = await getVendorState(supabase);
  if (!state) redirect("/entrar");
  try {
    await saveVendorProfile(supabase, state, parsed.data);
  } catch {
    return { errors: { form: "errors.unknown" }, values };
  }
  redirect("/empezar");
}

export async function saveBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: text(formData, "name"),
    category: text(formData, "category"),
    city: text(formData, "city"),
    lat: text(formData, "lat"),
    lng: text(formData, "lng"),
    dial: text(formData, "dial"),
    whatsapp: text(formData, "whatsapp"),
    description: text(formData, "description"),
  };

  const city = findCity(values.city);
  if (!city) return { errors: { city: "errors.required" }, values };
  const exact = values.lat !== "" && values.lng !== "";
  const dial = Object.values(COUNTRIES).some((c) => c.dialCode === values.dial)
    ? values.dial
    : COUNTRIES[city.country].dialCode;

  const parsed = businessInputSchema.safeParse({
    name: values.name,
    description: values.description || undefined,
    category: values.category,
    lat: exact ? Number(values.lat) : city.lat,
    lng: exact ? Number(values.lng) : city.lng,
    whatsapp: values.whatsapp ? toE164(dial, values.whatsapp) : "",
    currency: COUNTRIES[city.country].currency,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error.issues), values };

  const supabase = await createClient();
  const state = await getVendorState(supabase);
  if (!state) redirect("/entrar");
  if (state.business) redirect("/panel/productos");
  try {
    await createBusiness(supabase, state.userId, parsed.data);
  } catch {
    return { errors: { form: "errors.unknown" }, values };
  }
  redirect("/panel/productos?nuevo=1");
}
