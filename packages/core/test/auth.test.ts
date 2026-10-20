import { describe, expect, it } from "vitest";
import { classifyAuthError } from "../src/auth";
import { otpCodeSchema, signInEmailSchema } from "../src/schemas";

describe("sign-in", () => {
  it("classifies Supabase auth errors", () => {
    expect(classifyAuthError({ status: 429, code: "over_email_send_rate_limit" })).toBe("rate_limited");
    expect(classifyAuthError({ status: 403, code: "otp_expired" })).toBe("invalid_code");
    expect(classifyAuthError({ status: 500 })).toBe("unknown");
  });

  it("normalises emails and codes", () => {
    expect(signInEmailSchema.parse("  Ana@Correo.COM ")).toBe("ana@correo.com");
    expect(signInEmailSchema.safeParse("ana@").success).toBe(false);
    expect(otpCodeSchema.parse("123 456")).toBe("123456");
    expect(otpCodeSchema.safeParse("12ab56").success).toBe(false);
  });
});
