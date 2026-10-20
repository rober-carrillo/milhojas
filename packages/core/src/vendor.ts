// Vendor onboarding and catalog reads, shared by web and mobile. RLS does the
// access control; these helpers only shape the queries.
import type { Tables } from "./database.types";
import type { BusinessInput, VendorProfileInput } from "./schemas";
import type { MilhojasClient } from "./supabase";

export type ProfileRow = Tables<"profiles">;
export type BusinessRow = Tables<"businesses">;

export interface VendorState {
  userId: string;
  email: string | null;
  profile: ProfileRow | null;
  business: BusinessRow | null;
}

export type OnboardingStep = "profile" | "business" | "done";

/** The signed-in user with their profile and first business, or null when signed out. */
export async function getVendorState(client: MilhojasClient): Promise<VendorState | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const [profile, business] = await Promise.all([
    client.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    client
      .from("businesses")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle(),
  ]);
  if (profile.error) throw profile.error;
  if (business.error) throw business.error;

  return { userId: user.id, email: user.email ?? null, profile: profile.data, business: business.data };
}

export function nextOnboardingStep(state: VendorState): OnboardingStep {
  if (!state.profile || state.profile.role === "consumer") return "profile";
  if (!state.business) return "business";
  return "done";
}

/** Creates the vendor profile, or renames it and turns a consumer into a vendor. */
export async function saveVendorProfile(
  client: MilhojasClient,
  state: VendorState,
  input: VendorProfileInput,
): Promise<void> {
  if (state.profile) {
    const role = state.profile.role === "consumer" ? "vendor" : state.profile.role;
    const { error } = await client
      .from("profiles")
      .update({ display_name: input.display_name, role })
      .eq("id", state.userId);
    if (error) throw error;
    return;
  }
  const { error } = await client
    .from("profiles")
    .insert({ id: state.userId, role: "vendor", display_name: input.display_name });
  if (error) throw error;
}

export async function createBusiness(
  client: MilhojasClient,
  ownerId: string,
  input: BusinessInput,
): Promise<BusinessRow> {
  const { data, error } = await client
    .from("businesses")
    .insert({ ...input, owner_id: ownerId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/** Catalog for the owner, inactive products included. Money comes back as decimal strings. */
export async function listMyProducts(client: MilhojasClient, businessId: string) {
  const { data, error } = await client
    .from("products")
    .select("id, name, price::text, cost::text, image_url, is_active, sort_order")
    .eq("business_id", businessId)
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  return data;
}

export type MyProduct = Awaited<ReturnType<typeof listMyProducts>>[number];
