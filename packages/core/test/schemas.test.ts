import { describe, expect, it } from "vitest";
import { businessInputSchema, productInputSchema, salesEntryInputSchema } from "../src/schemas";

describe("schemas", () => {
  it("accepts a valid product and rejects bad prices", () => {
    const ok = productInputSchema.safeParse({ name: "Arepa de choclo", price: "4500", cost: null, image_url: null });
    expect(ok.success).toBe(true);
    const bad = productInputSchema.safeParse({ name: "Arepa", price: "4.500,00", cost: null, image_url: null });
    expect(bad.success).toBe(false);
  });

  it("requires WhatsApp numbers in E.164 form", () => {
    const base = { name: "Doña Rosa", category: "comida", lat: 4.8133, lng: -75.6961, currency: "COP" };
    expect(businessInputSchema.safeParse({ ...base, whatsapp: "+573001234567" }).success).toBe(true);
    expect(businessInputSchema.safeParse({ ...base, whatsapp: "3001234567" }).success).toBe(false);
  });

  it("only allows whole, non-negative units", () => {
    const base = { product_id: "8f14e45f-ceea-4e7a-9c8b-6d1b2a3c4d5e", sold_on: "2026-10-18" };
    expect(salesEntryInputSchema.safeParse({ ...base, units: 3 }).success).toBe(true);
    expect(salesEntryInputSchema.safeParse({ ...base, units: -1 }).success).toBe(false);
    expect(salesEntryInputSchema.safeParse({ ...base, units: 1.5 }).success).toBe(false);
  });
});
