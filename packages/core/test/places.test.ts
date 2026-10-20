import { describe, expect, it } from "vitest";
import { CATEGORIES, CITIES, COUNTRIES, findCity, toE164 } from "../src/places";
import { whatsappSchema } from "../src/schemas";
import { es } from "../src/i18n";

describe("toE164", () => {
  it("adds the dial code to a local number, ignoring spaces and dashes", () => {
    expect(toE164("57", "300 123 4567")).toBe("+573001234567");
    expect(toE164("1", "(415) 555-0123")).toBe("+14155550123");
  });

  it("keeps a number that already has + or its country code", () => {
    expect(toE164("57", "+57 300 123 4567")).toBe("+573001234567");
    expect(toE164("57", "573001234567")).toBe("+573001234567");
    expect(toE164("1", "14155550123")).toBe("+14155550123");
  });

  it("produces numbers the WhatsApp schema accepts", () => {
    expect(whatsappSchema.safeParse(toE164("57", "3001234567")).success).toBe(true);
  });
});

describe("places", () => {
  it("finds cities by id and every city has a known country", () => {
    expect(findCity("pereira")?.country).toBe("CO");
    expect(findCity("nowhere")).toBeUndefined();
    for (const city of CITIES) expect(COUNTRIES[city.country]).toBeDefined();
  });

  it("has a label for every category", () => {
    for (const id of CATEGORIES) expect(`category.${id}` in es).toBe(true);
  });
});
