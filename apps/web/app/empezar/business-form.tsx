"use client";

import { useActionState, useState } from "react";
import {
  CATEGORIES,
  CITIES,
  COUNTRIES,
  findCity,
  translator,
  type CountryCode,
  type Locale,
  type MessageKey,
} from "@milhojas/core";
import { saveBusiness, type FormState } from "./actions";

type GeoStatus = "idle" | "locating" | "saved" | "failed";

const COUNTRY_ORDER: CountryCode[] = ["CO", "US"];

export function BusinessForm({ locale }: { locale: Locale }) {
  const tr = translator(locale);
  const [state, action, pending] = useActionState<FormState, FormData>(saveBusiness, {
    errors: {},
    values: {},
  });
  const v = state.values;

  const [cityId, setCityId] = useState(v.city || "pereira");
  const city = findCity(cityId) ?? CITIES[0];
  const [dial, setDial] = useState(v.dial || COUNTRIES[city.country].dialCode);
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(
    v.lat && v.lng ? { lat: v.lat, lng: v.lng } : null,
  );
  const [geo, setGeo] = useState<GeoStatus>(coords ? "saved" : "idle");

  function chooseCity(id: string) {
    setCityId(id);
    const next = findCity(id);
    if (next) setDial(COUNTRIES[next.country].dialCode);
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setGeo("failed");
      return;
    }
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setGeo("saved");
      },
      () => {
        setCoords(null);
        setGeo("failed");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  const err = (field: string): MessageKey | undefined => state.errors[field];
  const describedBy = (field: string) => (err(field) ? `${field}-error` : undefined);
  const fieldError = (field: string) =>
    err(field) ? (
      <p id={`${field}-error`} className="error" role="alert">
        {tr(err(field)!)}
      </p>
    ) : null;

  return (
    <form action={action} className="stack">
      <h1>{tr("onboarding.business_title")}</h1>

      <label className="field">
        <span>{tr("onboarding.business_name")}</span>
        <input
          name="name"
          maxLength={80}
          placeholder={tr("onboarding.business_name_placeholder")}
          defaultValue={v.name}
          required
          autoFocus
          aria-invalid={err("name") ? true : undefined}
          aria-describedby={describedBy("name")}
        />
      </label>
      {fieldError("name")}

      <fieldset className="field" aria-describedby={describedBy("category")}>
        <legend>{tr("onboarding.category")}</legend>
        <div className="chips">
          {CATEGORIES.map((id) => (
            <label key={id} className="chip">
              <input type="radio" name="category" value={id} defaultChecked={v.category === id} required />
              <span>{tr(`category.${id}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {fieldError("category")}

      <label className="field">
        <span>{tr("onboarding.city")}</span>
        <select name="city" value={cityId} onChange={(e) => chooseCity(e.target.value)}>
          {COUNTRY_ORDER.map((country) => (
            <optgroup key={country} label={tr(`onboarding.country_${country}`)}>
              {CITIES.filter((c) => c.country === country).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      {fieldError("city")}

      <div className="field">
        <span>{tr("onboarding.location")}</span>
        <button type="button" className="button" onClick={locate} disabled={geo === "locating"}>
          {geo === "locating" ? tr("onboarding.locating") : tr("onboarding.use_location")}
        </button>
        <p className="fine left" aria-live="polite">
          {geo === "saved"
            ? tr("onboarding.location_saved")
            : geo === "failed"
              ? tr("onboarding.location_failed")
              : tr("onboarding.location_city", { city: city.name })}
        </p>
        <input type="hidden" name="lat" value={coords?.lat ?? ""} />
        <input type="hidden" name="lng" value={coords?.lng ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="whatsapp">{tr("onboarding.whatsapp")}</label>
        <div className="phone-input">
          <select
            name="dial"
            value={dial}
            onChange={(e) => setDial(e.target.value)}
            aria-label={tr("onboarding.whatsapp")}
          >
            {COUNTRY_ORDER.map((country) => (
              <option key={country} value={COUNTRIES[country].dialCode}>
                +{COUNTRIES[country].dialCode}
              </option>
            ))}
          </select>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={dial === "57" ? "300 123 4567" : "415 555 0123"}
            defaultValue={v.whatsapp}
            required
            aria-invalid={err("whatsapp") ? true : undefined}
            aria-describedby={describedBy("whatsapp") ?? "whatsapp-hint"}
          />
        </div>
        <p id="whatsapp-hint" className="fine left">
          {tr("onboarding.whatsapp_hint")}
        </p>
      </div>
      {fieldError("whatsapp")}

      <label className="field">
        <span>{tr("onboarding.description")}</span>
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          placeholder={tr("onboarding.description_placeholder")}
          defaultValue={v.description}
        />
      </label>
      {fieldError("description")}
      {fieldError("form")}

      <button type="submit" className="button primary" disabled={pending}>
        {pending ? tr("onboarding.saving") : tr("onboarding.create_business")}
      </button>
    </form>
  );
}
