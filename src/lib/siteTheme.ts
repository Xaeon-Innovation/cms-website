import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";

export type ThemeId =
  | "clinical-authority"
  | "healing-sage"
  | "prestige-gold"
  | "trust-lavender"
  | "warm-coral"
  | "light";

export const DEFAULT_THEME: ThemeId = "clinical-authority";

export async function getGlobalTheme(): Promise<ThemeId> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("theme").get();
    const theme = snap.data()?.theme;
    if (
      theme === "clinical-authority" ||
      theme === "healing-sage" ||
      theme === "prestige-gold" ||
      theme === "trust-lavender" ||
      theme === "warm-coral" ||
      theme === "light"
    ) {
      return theme;
    }
  } catch {
    // fall back
  }

  return DEFAULT_THEME;
}

