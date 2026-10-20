"use client";

import { useActionState } from "react";
import { translator, type Locale } from "@milhojas/core";
import { saveProfile, type FormState } from "./actions";

export function ProfileForm({ locale, defaultName }: { locale: Locale; defaultName: string }) {
  const tr = translator(locale);
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, {
    errors: {},
    values: { display_name: defaultName },
  });
  const error = state.errors.display_name ?? state.errors.form;

  return (
    <form action={action} className="stack">
      <h1>{tr("onboarding.profile_title")}</h1>
      <p className="muted">{tr("onboarding.profile_body")}</p>
      <label className="field">
        <span>{tr("onboarding.name_label")}</span>
        <input
          name="display_name"
          autoComplete="name"
          maxLength={80}
          defaultValue={state.values.display_name}
          required
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "name-error" : undefined}
        />
      </label>
      {error && (
        <p id="name-error" className="error" role="alert">
          {tr(error)}
        </p>
      )}
      <button type="submit" className="button primary" disabled={pending}>
        {pending ? tr("onboarding.saving") : tr("onboarding.next")}
      </button>
    </form>
  );
}
