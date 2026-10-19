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

  it("translates by locale", () => {
    expect(t("es", "home.vendor_cta")).toBe("Soy vendedor");
    expect(t("en", "home.vendor_cta")).toBe("I'm a vendor");
  });
});
