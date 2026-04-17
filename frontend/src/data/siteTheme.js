export const siteTheme = {
  colors: {
    bgPrimary: "#F8FAFC",
    bgSecondary: "#FFFFFF",
    borderSubtle: "#E2E8F0",
    textPrimary: "#0F172A",
    textMuted: "#64748b",
    accent: "#2563EB",
    accentRgb: "37, 99, 235",
    accentDeep: "#1D4ED8",
    accentGreen: "#22C55E",
    accentGreenRgb: "34, 197, 94",
    secondaryAmber: "#22C55E",
    secondaryAmberRgb: "34, 197, 94",
    teal: "#22C55E",
    tealRgb: "34, 197, 94",
    shadowSoft: "0 16px 42px rgba(15, 23, 42, 0.08)",
  },
  fonts: {
    heading: '"DM Sans", "Inter", system-ui, sans-serif',
    body: '"Inter", "DM Sans", system-ui, sans-serif',
    script: '"DM Sans", "Inter", system-ui, sans-serif',
  },
};

export function applySiteTheme(theme = siteTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const { colors, fonts } = theme;

  root.style.setProperty("--bg-primary", colors.bgPrimary);
  root.style.setProperty("--bg-secondary", colors.bgSecondary);
  root.style.setProperty("--border-subtle", colors.borderSubtle);
  root.style.setProperty("--text-primary", colors.textPrimary);
  root.style.setProperty("--text-muted", colors.textMuted);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-rgb", colors.accentRgb);
  root.style.setProperty("--accent-deep", colors.accentDeep);
  root.style.setProperty("--accent-green", colors.accentGreen);
  root.style.setProperty("--accent-green-rgb", colors.accentGreenRgb);
  root.style.setProperty("--secondary-amber", colors.secondaryAmber);
  root.style.setProperty("--secondary-amber-rgb", colors.secondaryAmberRgb);
  root.style.setProperty("--teal", colors.teal);
  root.style.setProperty("--teal-rgb", colors.tealRgb);
  root.style.setProperty("--shadow-soft", colors.shadowSoft);

  root.style.setProperty("--font-heading", fonts.heading);
  root.style.setProperty("--font-body", fonts.body);
  root.style.setProperty("--font-script", fonts.script);
}
