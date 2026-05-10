import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const roleRes = await api.get("/api/users/me/");
      const role = roleRes.data.role;
      localStorage.setItem("role", role);

      if (role === "doctor") navigate("/doctor");
      else if (role === "patient") navigate("/patient");
      else setError("User role not recognized.");
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Left Panel */}
      <div style={s.leftPanel}>
        <div style={s.brandArea}>
          <div style={s.logoMark}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="white" fillOpacity="0.15" />
              <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={s.brandName}>MediVault</h1>
          <p style={s.brandTagline}>Secure Healthcare Records Platform</p>
        </div>

        <div style={s.featureList}>
          {[
            { icon: "🔒", text: "End-to-end encrypted records" },
            { icon: "👨‍⚕️", text: "Seamless doctor-patient access" },
            { icon: "📋", text: "Organised by category & date" },
            { icon: "✅", text: "Consent-based access control" },
          ].map((f, i) => (
            <div key={i} style={s.featureItem}>
              <span style={s.featureIcon}>{f.icon}</span>
              <span style={s.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        <p style={s.leftFooter}>Trusted by healthcare professionals</p>
      </div>

      {/* Right Panel — Login Form */}
      <div style={s.rightPanel}>
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Welcome back</h2>
            <p style={s.formSubtitle}>Sign in to your MediVault account</p>
          </div>

          <form onSubmit={handleLogin} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Username</label>
              <div style={s.inputWrapper}>
                <span style={s.inputIcon}>👤</span>
                <input
                  style={s.input}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrapper}>
                <span style={s.inputIcon}>🔑</span>
                <input
                  style={s.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div style={s.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" style={s.primaryBtn} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={s.dividerRow}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>New to MediVault?</span>
            <div style={s.dividerLine} />
          </div>

          <div style={s.registerBtns}>
            <button style={s.outlineBtn} onClick={() => navigate("/register/patient")}>
              Register as Patient
            </button>
            <button style={s.outlineBtn} onClick={() => navigate("/register/doctor")}>
              Register as Doctor
            </button>
          </div>
        </div>

        <p style={s.rightFooter}>
          © MediVault · All data encrypted · HIPAA-aware design
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },

  // ── Left Panel ──
  leftPanel: {
    width: "42%",
    background: "linear-gradient(160deg, #0a3d91 0%, #0d5cc7 60%, #0d9488 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "60px 50px",
    color: "#fff",
  },
  brandArea: { marginBottom: "48px" },
  logoMark: {
    width: "56px",
    height: "56px",
    marginBottom: "20px",
  },
  brandName: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  brandTagline: {
    fontSize: "15px",
    opacity: 0.75,
    margin: 0,
    letterSpacing: "0.2px",
  },
  featureList: { display: "flex", flexDirection: "column", gap: "18px" },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "rgba(255,255,255,0.1)",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  featureIcon: { fontSize: "22px" },
  featureText: { fontSize: "14px", opacity: 0.9 },
  leftFooter: { fontSize: "13px", opacity: 0.55, margin: 0 },

  // ── Right Panel ──
  rightPanel: {
    flex: 1,
    background: "#f0f4f8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 40px",
  },
  formCard: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(10,61,145,0.12), 0 2px 8px rgba(10,61,145,0.06)",
    padding: "48px 44px",
    width: "100%",
    maxWidth: "440px",
  },
  formHeader: { marginBottom: "32px" },
  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0a3d91",
    margin: "0 0 6px",
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  formSubtitle: { fontSize: "14px", color: "#64748b", margin: 0 },

  form: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#0a3d91", letterSpacing: "0.3px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "16px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #fca5a5",
  },
  primaryBtn: {
    padding: "13px",
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s",
    fontFamily: "inherit",
  },

  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "28px 0 20px",
  },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { fontSize: "13px", color: "#94a3b8", whiteSpace: "nowrap" },

  registerBtns: { display: "flex", flexDirection: "column", gap: "12px" },
  outlineBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #0a3d91",
    background: "transparent",
    color: "#0a3d91",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  },

  rightFooter: { marginTop: "32px", fontSize: "12px", color: "#94a3b8", textAlign: "center" },
};