"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  otpCodeSchema,
  sendSignInEmail,
  signInEmailSchema,
  verifySignInCode,
  type MessageKey,
} from "@milhojas/core";
import { createClient } from "../../lib/supabase/server";

export interface SignInState {
  step: "email" | "code";
  email: string;
  error: MessageKey | null;
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** One action drives the whole sign-in form: send the email, verify the code, or start over. */
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const intent = formData.get("intent");
  const rawEmail = String(formData.get("email") ?? "");

  if (intent === "reset") return { step: "email", email: "", error: null };

  const email = signInEmailSchema.safeParse(rawEmail);
  if (!email.success) return { step: "email", email: rawEmail, error: "errors.invalid_email" };

  const supabase = await createClient();

  if (intent === "verify") {
    const code = otpCodeSchema.safeParse(String(formData.get("code") ?? ""));
    if (!code.success) return { step: "code", email: email.data, error: "errors.invalid_code" };
    const error = await verifySignInCode(supabase, email.data, code.data);
    if (error) return { step: "code", email: email.data, error: `errors.${error}` };
    redirect("/panel");
  }

  const error = await sendSignInEmail(supabase, email.data, `${await siteOrigin()}/auth/confirm`);
  if (error) return { step: "email", email: email.data, error: `errors.${error}` };
  return { step: "code", email: email.data, error: null };
}
