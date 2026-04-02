import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { DEFAULT_THEME } from "@/lib/siteTheme";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("theme").get();
    const theme = snap.data()?.theme ?? DEFAULT_THEME;
    return NextResponse.json({ ok: true, theme });
  } catch (err) {
    return NextResponse.json(
      { ok: false, theme: DEFAULT_THEME, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

