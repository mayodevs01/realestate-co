import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { cities } from "../data/properties";
import { whatsapp } from "../lib/property";
import type { Property } from "../types/property";
export function RequirementForm({
  property,
  onDone,
  kind = "requirement",
}: {
  property?: Property;
  onDone?: () => void;
  kind?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const number = String(data.phone).replace(/[\s()+-]/g, "");
    if (!/^(?:91)?[6-9]\d{9}$/.test(number)) {
      setState("error");
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setState("sending");
    const body = {
      ...data,
      phone: number,
      kind,
      propertyId: property?.id || "",
      propertyName: property?.name || "",
    };
    setDraft(
      `Hi, I'm ${data.name}. ${property ? `I'd like to ${kind === "floorplan" ? "request a floor plan for" : "schedule a site visit for"} ${property.name}, ${property.locality}, ${property.city}.` : `I'm looking to ${data.purpose} in ${data.location}. Budget: ${data.budget}. Configuration: ${data.configuration}.`} ${data.date ? `Preferred visit: ${data.date}, ${data.slot} (IST).` : ""} My phone is ${number}. I understand the property inventory is illustrative.`,
    );
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Could not save your request.");
      setState("sent");
      setMessage(
        `Request received. Your reference is ${json.reference}. An advisor can confirm suitable options and availability. A visit is confirmed only after speaking to an advisor.`,
      );
    } catch {
      setState("error");
      setMessage(
        "We couldn’t save your request. Please use the WhatsApp button below to send the details directly.",
      );
    }
  }
  return (
    <form className="enquiry-form" onSubmit={submit}>
      {state === "sent" ? (
        <div className="success" role="status">
          <CheckCircle2 size={32} />
          <h3>Thank you. Let’s shortlist your options.</h3>
          <p>{message}</p>
          <a
            className="button"
            href={whatsapp(undefined, draft)}
            target="_blank"
            rel="noreferrer"
          >
            Continue on WhatsApp
            <ArrowUpRight size={17} />
          </a>
          {onDone && (
            <button type="button" className="text-button" onClick={onDone}>
              Close
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="form-grid">
            {!property && (
              <>
                <label>
                  I’m looking to
                  <select name="purpose">
                    <option>Buy</option>
                    <option>Rent</option>
                    <option>Lease commercial space</option>
                  </select>
                </label>
                <label>
                  Preferred location
                  <select name="location" required defaultValue="">
                    <option value="" disabled>
                      Select a location
                    </option>
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Budget
                  <input
                    name="budget"
                    required
                    maxLength={60}
                    placeholder="e.g. ₹1.5–2 Cr / ₹40,000 rent"
                  />
                </label>
                <label>
                  BHK / property type
                  <select name="configuration" required>
                    <option>2 BHK apartment</option>
                    <option>3 BHK apartment</option>
                    <option>4 BHK apartment</option>
                    <option>Builder floor</option>
                    <option>Villa</option>
                    <option>Plot</option>
                    <option>Office</option>
                    <option>Retail</option>
                  </select>
                </label>
              </>
            )}
            <label>
              Your name
              <input
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="Full name"
              />
            </label>
            <label>
              Mobile number
              <input
                name="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                placeholder="10-digit mobile number"
              />
            </label>
            {property && kind !== "floorplan" && (
              <>
                <label>
                  Preferred date
                  <input
                    name="date"
                    required
                    type="date"
                    min={new Date().toLocaleDateString("en-CA", {
                      timeZone: "Asia/Kolkata",
                    })}
                  />
                </label>
                <label>
                  Preferred time (IST)
                  <select name="slot">
                    <option>10 am–12 pm</option>
                    <option>12 pm–3 pm</option>
                    <option>3 pm–6 pm</option>
                  </select>
                </label>
              </>
            )}
          </div>
          <label className="honey" aria-hidden="true">
            Leave empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="consent">
            <input type="checkbox" name="consent" required />{" "}
            <span>
              I agree to be contacted about this request and have read the{" "}
              <a href="/privacy">Privacy Policy</a>.
            </span>
          </label>
          <button className="button" disabled={state === "sending"}>
            {state === "sending"
              ? "Sending request…"
              : property
                ? kind === "floorplan"
                  ? "Request floor plan"
                  : "Request site visit"
                : "Get property options"}
            <ArrowUpRight size={18} />
          </button>
          <p className="form-note">
            No spam. An advisor will contact you regarding your property
            requirement.
          </p>
          {state === "error" && (
            <div className="form-error" role="alert">
              <p>{message}</p>
              <a
                href={whatsapp(undefined, draft)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                Send requirement on WhatsApp
              </a>
            </div>
          )}
        </>
      )}
    </form>
  );
}
export const SiteVisitForm = RequirementForm;
