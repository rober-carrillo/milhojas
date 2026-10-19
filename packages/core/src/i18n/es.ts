// Spanish is the source language. Add keys here first; en.ts must match.
export const es = {
  "app.name": "Milhojas",
  "app.tagline": "Tu negocio, cuenta por cuenta.",
  "home.vendor_cta": "Soy vendedor",
  "home.consumer_cta": "Quiero comprar cerca",
  "home.coming_soon": "Muy pronto en Pereira y San Francisco.",
  "errors.required": "Este campo es obligatorio.",
  "errors.invalid_amount": "Escribe un valor válido, por ejemplo 4500.",
  "errors.invalid_whatsapp": "Escribe el número con indicativo, por ejemplo +573001234567.",
} as const;

export type MessageKey = keyof typeof es;
