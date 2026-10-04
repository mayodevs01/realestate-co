import { properties, cities } from "../../src/data/properties";
interface Statement {
  bind: (...values: unknown[]) => Statement;
  first: () => Promise<Record<string, unknown> | null>;
  run: () => Promise<unknown>;
}
interface Env {
  ENQUIRIES: {
    prepare: (query: string) => Statement;
    batch: (statements: Statement[]) => Promise<unknown>;
  };
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function validateEnquiry(data: Record<string, unknown>) {
  const text = (key: string, max = 100) =>
    typeof data[key] === "string" ? String(data[key]).trim().slice(0, max) : "";
  const phone = text("phone", 20).replace(/[\s()+-]/g, "");
  const kind = text("kind");
  const name = text("name", 80);
  const propertyId = text("propertyId");
  const property = properties.find((p) => p.id === propertyId);
  const date = text("date");
  const slot = text("slot");
  if (text("website")) return { error: "Request rejected." };
  if (!["requirement", "visit", "floorplan"].includes(kind))
    return { error: "Invalid request type." };
  if (
    name.length < 2 ||
    !/^(?:91)?[6-9]\d{9}$/.test(phone) ||
    data.consent !== "on"
  )
    return {
      error: "Provide your name, a valid Indian mobile number and consent.",
    };
  if (propertyId && !property) return { error: "Property not found." };
  if (kind === "floorplan" && !property) return { error: "Choose a property." };
  if (property && kind === "visit") {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      date < today ||
      new Date(date).toISOString().slice(0, 10) !== date ||
      date > new Date(Date.now() + 366 * 86400000).toISOString().slice(0, 10) ||
      !["10 am–12 pm", "12 pm–3 pm", "3 pm–6 pm"].includes(slot)
    )
      return {
        error:
          "Choose a valid visit date within the next year and a time slot.",
      };
  }
  if (
    !property &&
    (!cities.includes(text("location") as (typeof cities)[number]) ||
      !text("budget") ||
      !text("configuration") ||
      !["Buy", "Rent", "Lease commercial space"].includes(text("purpose")))
  )
    return {
      error: "Complete your location, budget and property requirement.",
    };
  return {
    value: {
      name,
      phone,
      kind,
      propertyId,
      propertyName: property?.name || "",
      purpose: text("purpose"),
      location: property?.city || text("location"),
      budget: text("budget", 60),
      configuration: text("configuration"),
      date,
      slot,
    },
  };
}
export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  if (request.method !== "POST")
    return json({ error: "Method not allowed." }, 405);
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Invalid origin." }, 403);
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return json({ error: "Use application/json." }, 415);
  if (Number(request.headers.get("Content-Length") || 0) > 8192)
    return json({ error: "Request too large." }, 413);
  if (!env.ENQUIRIES)
    return json(
      { error: "Enquiries are temporarily unavailable. Please use WhatsApp." },
      503,
    );
  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 8192) return json({ error: "Request too large." }, 413);
    data = JSON.parse(body);
    if (!data || Array.isArray(data) || typeof data !== "object")
      throw new Error();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const checked = validateEnquiry(data);
  if (checked.error) return json({ error: checked.error }, 400);
  const reference = `RE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const day = new Date().toISOString().slice(0, 10);
  const raw = new TextEncoder().encode(
    `${day}:${request.headers.get("CF-Connecting-IP") || "local"}`,
  );
  const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", raw))]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
  try {
    const result = await env.ENQUIRIES.prepare(
      "INSERT INTO enquiries (id, payload, created_at, rate_key, consent_version) SELECT ?, ?, datetime('now'), ?, '2026-10-04' WHERE (SELECT count(*) FROM enquiries WHERE rate_key = ? AND created_at > datetime('now','-1 hour')) < 5 RETURNING id",
    )
      .bind(reference, JSON.stringify(checked.value), hash, hash)
      .first();
    if (!result)
      return json(
        { error: "Too many requests. Please try later or use WhatsApp." },
        429,
      );
    await env.ENQUIRIES.batch([
      env.ENQUIRIES.prepare(
        "DELETE FROM enquiries WHERE created_at < datetime('now','-90 days')",
      ),
      env.ENQUIRIES.prepare(
        "UPDATE enquiries SET rate_key = NULL WHERE rate_key IS NOT NULL AND created_at < datetime('now','-1 day')",
      ),
    ]).catch(() => { /* Retention cleanup must not turn a saved request into an error. */ });
    return json({ reference }, 201);
  } catch {
    return json(
      {
        error:
          "We could not save this request. Please contact the advisor on WhatsApp.",
      },
      503,
    );
  }
}
