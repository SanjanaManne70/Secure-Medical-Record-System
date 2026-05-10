// ─── HEALTHCARE APP DESIGN TOKENS ───────────────────────────────────────────
// Primary: Deep Medical Blue  |  Accent: Teal  |  Font: DM Sans + DM Serif Display

export const colors = {
  // Brand
  primary: "#0a3d91",
  primaryDark: "#072d6e",
  primaryLight: "#e8f0fe",
  primaryMid: "#1a56c4",

  // Accent
  teal: "#0d9488",
  tealLight: "#ccfbf1",
  tealDark: "#0f766e",

  // Neutrals
  bg: "#f0f4f8",
  bgCard: "#ffffff",
  bgMuted: "#f8fafc",

  // Text
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  textOnPrimary: "#ffffff",

  // Semantic
  success: "#059669",
  successLight: "#d1fae5",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  warning: "#d97706",
  warningLight: "#fef3c7",

  // Borders
  border: "#e2e8f0",
  borderFocus: "#0a3d91",
};

export const fonts = {
  // Import these in your index.html:
  // <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
  body: "'DM Sans', 'Segoe UI', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export const shadow = {
  sm: "0 1px 3px rgba(10,61,145,0.08), 0 1px 2px rgba(10,61,145,0.04)",
  md: "0 4px 12px rgba(10,61,145,0.10), 0 2px 4px rgba(10,61,145,0.06)",
  lg: "0 10px 30px rgba(10,61,145,0.12), 0 4px 8px rgba(10,61,145,0.06)",
};

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
};

// Shared page wrapper style
export const pageStyle = {
  minHeight: "100vh",
  background: `linear-gradient(160deg, #eef4ff 0%, #f0f4f8 60%, #e8f5f3 100%)`,
  fontFamily: fonts.body,
  color: colors.textPrimary,
};

// Shared card style
export const cardStyle = {
  background: colors.bgCard,
  borderRadius: radius.lg,
  boxShadow: shadow.md,
  border: `1px solid ${colors.border}`,
};

// Shared input style
export const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: radius.md,
  border: `1.5px solid ${colors.border}`,
  fontSize: "14px",
  fontFamily: fonts.body,
  color: colors.textPrimary,
  background: colors.bgMuted,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

// Shared primary button style
export const primaryBtnStyle = {
  width: "100%",
  padding: "12px",
  background: `linear-gradient(135deg, ${colors.primaryMid}, ${colors.primary})`,
  color: "#fff",
  border: "none",
  borderRadius: radius.md,
  fontSize: "15px",
  fontWeight: "600",
  fontFamily: fonts.body,
  cursor: "pointer",
  letterSpacing: "0.3px",
  transition: "opacity 0.2s, transform 0.1s",
};