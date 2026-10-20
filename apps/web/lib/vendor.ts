// Per-request vendor state, fetched once and shared by layouts and pages.
import { cache } from "react";
import { getVendorState } from "@milhojas/core";
import { createClient } from "./supabase/server";

export const currentVendor = cache(async () => getVendorState(await createClient()));
