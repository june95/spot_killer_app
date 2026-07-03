"use client";

import { createSpotKillerBrowserClient } from "@spot-killer/api";

let browserClient: ReturnType<typeof createSpotKillerBrowserClient> | undefined;

export function getBrowserSupabaseClient() {
  // A singleton prevents auth listeners from being registered on throwaway clients.
  browserClient ??= createSpotKillerBrowserClient();
  return browserClient;
}
