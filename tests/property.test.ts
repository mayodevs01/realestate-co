import { test } from "node:test";
import assert from "node:assert/strict";
import { properties } from "../src/data/properties";
import { validateEnquiry } from "../functions/api/enquiries";
import {
  filterProperties,
  defaultFilters,
  whatsapp,
  yieldRange,
} from "../src/lib/property";
test("search combines location, budget, BHK and ready filters", () => {
  const results = filterProperties(properties, {
    ...defaultFilters,
    city: "Noida",
    bhk: "3",
    budget: "25000000",
    ready: true,
  });
  assert.deepEqual(
    results.map((p) => p.id),
    ["ats-pristine-noida"],
  );
});
test("commercial excludes homes and rental mode uses monthly asking rent", () => {
  assert.equal(
    filterProperties(properties, { ...defaultFilters, purpose: "Commercial" })
      .length,
    3,
  );
  assert.equal(
    filterProperties(properties, {
      ...defaultFilters,
      purpose: "Rent",
      budget: "40000",
    }).length,
    1,
  );
});
test("WhatsApp preserves property context and yield is computed from rent", () => {
  const p = properties[0];
  assert.ok(
    decodeURIComponent(whatsapp(p)).includes("ATS Pristine, Sector 150, Noida"),
  );
  assert.equal(yieldRange(p), "2.6–3.0%");
});
test("demo inventory covers requested types with unique routes and NCR coordinates", () => {
  assert.ok(properties.length >= 12);
  assert.equal(new Set(properties.map((p) => p.id)).size, properties.length);
  assert.equal(new Set(properties.map((p) => p.type)).size, 7);
  for (const p of properties) {
    assert.ok(p.coordinates[0] > 76 && p.coordinates[0] < 78);
    assert.ok(p.coordinates[1] > 28 && p.coordinates[1] < 29);
    assert.ok(p.price > 0);
    assert.ok(p.area > 0);
  }
});
const valid = {
  name: "Test Buyer",
  phone: "9999999999",
  consent: "on",
  kind: "requirement",
  purpose: "Buy",
  location: "Noida",
  budget: "1–2 Cr",
  configuration: "3 BHK",
};
test("valid requirement passes server validation", () =>
  assert.ok(validateEnquiry(valid).value));
test("invalid phone, missing consent and honeypot are rejected", () => {
  for (const patch of [
    { phone: "123" },
    { phone: "5555555555" },
    { consent: "" },
    { website: "spam" },
    { location: "Unknown" },
  ])
    assert.ok(validateEnquiry({ ...valid, ...patch }).error);
});
test("unknown listing and past visit date are rejected", () => {
  assert.ok(validateEnquiry({ ...valid, propertyId: "unknown" }).error);
  assert.ok(
    validateEnquiry({
      ...valid,
      kind: "visit",
      propertyId: properties[0].id,
      date: "2020-01-01",
      slot: "10 am–12 pm",
    }).error,
  );
});
