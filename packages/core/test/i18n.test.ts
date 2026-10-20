import { describe, expect, it } from "vitest";
import { en, es, t } from "../src/i18n";

describe("i18n", () => {
  it("has an English string for every Spanish key, and nothing extra", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  it("has no empty strings", () => {
    for (const value of [...Object.values(es), ...Object.values(en)]) {
      expect(value.trim()).not.toBe("");
    }
  });

  it("uses the same {placeholders} in both languages", () => {
    const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const key of Object.keys(es) as (keyof typeof es)[]) {
      expect(names(en[key]), key).toEqual(names(es[key]));
    }
  });

  it("fills placeholders", () => {
    expect(t("es", "onboarding.step", { n: 2 })).toBe("Paso 2 de 3");
    expect(t("en", "auth.check_body", { email: "a@b.co" })).toContain("a@b.co");
  });

  it("translates by locale", () => {
    expect(t("es", "home.vendor_cta")).toBe("Soy vendedor");
    expect(t("en", "home.vendor_cta")).toBe("I'm a vendor");
  });
});
