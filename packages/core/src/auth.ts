// Passwordless sign-in: one email carries both a link and a short code. The link
// suits the device that opens the email; the code works when the email is read
// somewhere else (another phone, an in-app browser).
import type { EmailOtpType } from "@supabase/supabase-js";
import type { MilhojasClient } from "./supabase";

export type AuthErrorCode = "rate_limited" | "invalid_code" | "unknown";

interface AuthErrorLike {
  status?: number;
  code?: string;
}

export function classifyAuthError(error: AuthErrorLike): AuthErrorCode {
  if (error.status === 429 || error.code?.startsWith("over_")) return "rate_limited";
  if (error.code === "otp_expired" || error.code === "validation_failed" || error.status === 403) {
    return "invalid_code";
  }
  return "unknown";
}

/** Sends the sign-in email. New emails get an account; profiles are created during onboarding. */
export async function sendSignInEmail(
  client: MilhojasClient,
  email: string,
  redirectTo: string,
): Promise<AuthErrorCode | null> {
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
  });
  return error ? classifyAuthError(error) : null;
}

/** Signs in with the code typed from the email. */
export async function verifySignInCode(
  client: MilhojasClient,
  email: string,
  code: string,
): Promise<AuthErrorCode | null> {
  const { error } = await client.auth.verifyOtp({ email, token: code, type: "email" });
  return error ? classifyAuthError(error) : null;
}

/** Signs in from the link in the email (token_hash flow, works across browsers). */
export async function verifySignInLink(
  client: MilhojasClient,
  tokenHash: string,
  type: EmailOtpType = "email",
): Promise<AuthErrorCode | null> {
  const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
  return error ? classifyAuthError(error) : null;
}
