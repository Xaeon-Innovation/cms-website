import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
};

export type SiteContactSettings = {
  phone: string;
  email: string;
  address: string;
  social: SocialLinks;
};

export const emptySocialLinks = (): SocialLinks => ({
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  tiktok: "",
  whatsapp: "",
});

export const defaultContactSettings = (): SiteContactSettings => ({
  phone: "",
  email: "",
  address: "",
  social: emptySocialLinks(),
});

function trimSocial(data: Record<string, unknown> | undefined): SocialLinks {
  const s = (data?.social as Record<string, unknown> | undefined) ?? {};
  const pick = (k: keyof SocialLinks) => String(s[k] ?? "").trim();
  return {
    facebook: pick("facebook"),
    instagram: pick("instagram"),
    linkedin: pick("linkedin"),
    twitter: pick("twitter"),
    youtube: pick("youtube"),
    tiktok: pick("tiktok"),
    whatsapp: pick("whatsapp"),
  };
}

/** Normalize Firestore `settings/contact` into a typed object (supports legacy docs without `social`). */
export function parseContactSettingsDoc(data: Record<string, unknown> | undefined): SiteContactSettings {
  if (!data) return defaultContactSettings();
  return {
    phone: String(data.phone ?? "").trim(),
    email: String(data.email ?? "").trim(),
    address: String(data.address ?? "").trim(),
    social: trimSocial(data),
  };
}

export async function fetchContactSettings(): Promise<SiteContactSettings> {
  const snap = await getDoc(doc(db, "settings", "contact"));
  return parseContactSettingsDoc(snap.data() as Record<string, unknown> | undefined);
}

/** Allow only http(s) links for social targets. */
export function safeHttpUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

/** Build https://wa.me/&lt;digits&gt; from a URL or a phone string. */
export function safeWhatsappUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      if (!/whatsapp\.com|wa\.me/i.test(u.hostname)) return null;
      return u.href;
    } catch {
      return null;
    }
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}

export type ResolvedSocialLink = { key: keyof SocialLinks; href: string; label: string };

export function resolveSocialLinks(social: SocialLinks): ResolvedSocialLink[] {
  const out: ResolvedSocialLink[] = [];
  const push = (key: keyof SocialLinks, label: string, href: string | null) => {
    if (href) out.push({ key, label, href });
  };
  push("facebook", "Facebook", safeHttpUrl(social.facebook));
  push("instagram", "Instagram", safeHttpUrl(social.instagram));
  push("linkedin", "LinkedIn", safeHttpUrl(social.linkedin));
  push("twitter", "X (Twitter)", safeHttpUrl(social.twitter));
  push("youtube", "YouTube", safeHttpUrl(social.youtube));
  push("tiktok", "TikTok", safeHttpUrl(social.tiktok));
  push("whatsapp", "WhatsApp", safeWhatsappUrl(social.whatsapp));
  return out;
}
