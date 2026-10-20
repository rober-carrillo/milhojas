"use client";

import { useActionState } from "react";
import { translator, type Locale, type MessageKey } from "@milhojas/core";
import { signIn, type SignInState } from "./actions";

export function SignInForm({ locale, initialError }: { locale: Locale; initialError: MessageKey | null }) {
  const tr = translator(locale);
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {
    step: "email",
    email: "",
    error: initialError,
  });

  if (state.step === "code") {
    return (
      <form action={action} className="stack">
        <h1>{tr("auth.check_title")}</h1>
        <p className="muted">{tr("auth.check_body", { email: state.email })}</p>
        <input type="hidden" name="email" value={state.email} />
        <label className="field">
          <span>{tr("auth.code_label")}</span>
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,12}"
            maxLength={12}
            required
            autoFocus
            className="code-input"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "signin-error" : undefined}
          />
        </label>
        {state.error && (
          <p id="signin-error" className="error" role="alert">
            {tr(state.error)}
          </p>
        )}
        <button type="submit" name="intent" value="verify" className="button primary" disabled={pending}>
          {pending ? tr("auth.verifying") : tr("auth.verify")}
        </button>
        <button type="submit" name="intent" value="reset" className="link-button" formNoValidate>
          {tr("auth.other_email")}
        </button>
      </form>
    );
  }

  return (
    <form action={action} className="stack">
      <h1>{tr("auth.title")}</h1>
      <p className="muted">{tr("auth.body")}</p>
      <label className="field">
        <span>{tr("auth.email_label")}</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={tr("auth.email_placeholder")}
          defaultValue={state.email}
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "signin-error" : undefined}
        />
      </label>
      {state.error && (
        <p id="signin-error" className="error" role="alert">
          {tr(state.error)}
        </p>
      )}
      <button type="submit" name="intent" value="send" className="button primary" disabled={pending}>
        {pending ? tr("auth.sending") : tr("auth.send")}
      </button>
      <p className="fine">{tr("auth.privacy")}</p>
    </form>
  );
}
