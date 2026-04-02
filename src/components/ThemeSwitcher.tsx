"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ThemeId =
  | "clinical-authority"
  | "healing-sage"
  | "prestige-gold"
  | "trust-lavender"
  | "warm-coral"
  | "light";

const STORAGE_KEY = "cms-theme-override";
const DEFAULT_THEME: ThemeId = "clinical-authority";

type ThemeSwitcherProps = {
  value?: ThemeId;
  onChange?: (themeId: ThemeId) => void;
  persistLocal?: boolean;
};

export function ThemeSwitcher({ value, onChange, persistLocal = true }: ThemeSwitcherProps) {
  const themes = useMemo(
    () =>
      [
        { id: "clinical-authority", label: "Clinical Authority", swatchClassName: "bg-[#3a9fc0]" },
        { id: "healing-sage", label: "Healing Sage", swatchClassName: "bg-[#2e9e6e]" },
        { id: "prestige-gold", label: "Prestige Gold", swatchClassName: "bg-[#c8940e]" },
        { id: "trust-lavender", label: "Trust Lavender", swatchClassName: "bg-[#8060d0]" },
        { id: "warm-coral", label: "Warm Coral", swatchClassName: "bg-[#e8503a]" },
      ] as const,
    []
  );

  const resolvedTheme = value ?? activeThemeFromStorage();
  const [activeTheme, setActiveTheme] = useState<ThemeId>(resolvedTheme);

  function activeThemeFromStorage(): ThemeId {
    if (typeof window === "undefined") return DEFAULT_THEME;
    try {
      const t = (localStorage.getItem(STORAGE_KEY) as ThemeId | null) ?? null;
      return t ?? DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const applyTheme = (themeId: ThemeId) => {
    document.documentElement.setAttribute("data-theme", themeId);
    if (!value) setActiveTheme(themeId);
    onChange?.(themeId);
    if (persistLocal) {
      try {
        localStorage.setItem(STORAGE_KEY, themeId);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {themes.map((theme) => {
        const isActive = theme.id === activeTheme;
        return (
          <button
            key={theme.id}
            type="button"
            title={theme.label}
            onClick={() => applyTheme(theme.id)}
            aria-label={`Switch theme to ${theme.label}`}
            className={cn(
              "h-6 w-6 rounded-full border border-white/20 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low",
              theme.swatchClassName,
              isActive && "ring-2 ring-white/90 ring-offset-2 ring-offset-surface-container-low"
            )}
          />
        );
      })}
    </div>
  );
}

