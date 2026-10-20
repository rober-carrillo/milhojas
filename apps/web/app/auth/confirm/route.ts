// Target of the link in the sign-in email:
// {{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email (see supabase/templates).
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { verifySignInLink } from "@milhojas/core";
import { createClient } from "../../../lib/supabase/server";

const LINK_TYPES: readonly EmailOtpType[] = ["email", "magiclink", "signup"];

function isLinkType(value: string | null): value is EmailOtpType {
  return LINK_TYPES.includes(value as EmailOtpType);
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  if (tokenHash && isLinkType(type)) {
    const error = await verifySignInLink(await createClient(), tokenHash, type);
    if (!error) redirect("/panel");
  }
  redirect("/entrar?error=link");
}
