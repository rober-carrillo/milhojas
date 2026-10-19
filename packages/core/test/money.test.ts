import { describe, expect, it } from "vitest";
import { formatMoney, fromMinorUnits, lineProfit, lineTotal, toMinorUnits } from "../src/money";

describe("money", () => {
  it("converts decimal strings to minor units without floats", () => {
    expect(toMinorUnits("4500", "COP")).toBe(450000);
    expect(toMinorUnits("0.1", "USD")).toBe(10);
    expect(toMinorUnits("19.99", "USD")).toBe(1999);
    expect(toMinorUnits("-3.5", "USD")).toBe(-350);
  });

  it("rejects malformed or over-precise amounts", () => {
    expect(() => toMinorUnits("4.5.0", "COP")).toThrow();
    expect(() => toMinorUnits("abc", "USD")).toThrow();
    expect(() => toMinorUnits("1.999", "USD")).toThrow();
  });

  it("round-trips minor units back to decimal strings", () => {
    expect(fromMinorUnits(450050, "COP")).toBe("4500.50");
    expect(fromMinorUnits(5, "USD")).toBe("0.05");
    expect(fromMinorUnits(-350, "USD")).toBe("-3.50");
  });

  it("computes totals and optional profit", () => {
    expect(lineTotal(3, 250000)).toBe(750000);
    expect(lineProfit(3, 250000, 100000)).toBe(450000);
    expect(lineProfit(3, 250000, null)).toBeNull();
    expect(() => lineTotal(1.5, 100)).toThrow();
  });

  it("avoids the classic float error", () => {
    const total = toMinorUnits("0.1", "USD") + toMinorUnits("0.2", "USD");
    expect(fromMinorUnits(total, "USD")).toBe("0.30");
  });

  it("formats COP without zero cents", () => {
    const formatted = formatMoney(450000, "COP");
    expect(formatted).toContain("4.500");
    expect(formatted).not.toContain(",00");
  });
});
