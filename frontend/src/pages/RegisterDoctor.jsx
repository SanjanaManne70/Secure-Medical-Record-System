import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterDoctor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    department: "",
    license_no: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/users/register/doctor/", form);
      if (res.status === 200 || res.status === 201) {
        navigate("/", { state: { registered: true } });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", placeholder: "Choose a username", type: "text" },
    { name: "name", placeholder: "Full name",  type: "text" },
    { name: "department", placeholder: "Department (e.g. Cardiology)", type: "text" },
    { name: "license_no", placeholder: "Medical licence number", type: "text" },
    { name: "email", placeholder: "Official email address", type: "email" },
    { name: "password", placeholder: "Create a strong password", type: "password" },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Accent Strip */}
        <div style={s.accentStrip}>
          <div style={s.accentContent}>
            <div style={s.accentLogo}>
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                <path d="M18 4v28M4 18h28" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={s.accentTitle}>Doctor Registration</h2>
            <p style={s.accentSub}>
              Join MediVault to securely access and review your patients' medical records.
            </p>
            <div style={s.accentPoints}>
              {[
                "Instant access to assigned patients",
                "Records decrypted on-demand",
                "Secure & audit-logged viewing",
              ].map((pt, i) => (
                <div key={i} style={s.accentPoint}>
                  <span style={s.accentCheck}>✓</span> {pt}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div style={s.formPanel}>
          <div style={s.formTop}>
            <h2 style={s.formTitle}>Doctor Account</h2>
            <p style={s.formSub}>Register with your professional credentials</p>
          </div>

          {error && (
            <div style={s.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={s.form}>
            {fields.map(({ name, placeholder, icon, type }) => (
              <div key={name} style={s.fieldRow}>
                <label style={s.label}>{placeholder}</label>
                <div style={s.inputWrapper}>
                  <span style={s.icon}>{icon}</span>
                  <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={handleChange}
                    required
                    style={s.input}
                    autoComplete={name}
                  />
                </div>
              </div>
            ))}

            <button type="submit" style={s.primaryBtn} disabled={loading}>
              {loading ? "Registering…" : "Register as Doctor"}
            </button>
          </form>

          <p style={s.loginLink}>
            Already have an account?{" "}
            <span style={s.linkText} onClick={() => navigate("/")}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #eef4ff 0%, #f0f4f8 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: "880px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(10,61,145,0.14)",
  },

  accentStrip: {
    width: "38%",
    background: "linear-gradient(160deg, #0f766e 0%, #0d9488 60%, #0a3d91 100%)",
    display: "flex",
    alignItems: "center",
    padding: "48px 36px",
  },
  accentContent: { color: "#fff" },
  accentLogo: {
    width: "48px",
    height: "48px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  accentTitle: { fontSize: "22px", fontWeight: "700", margin: "0 0 10px", lineHeight: 1.3 },
  accentSub: { fontSize: "13px", opacity: 0.75, margin: "0 0 28px", lineHeight: 1.6 },
  accentPoints: { display: "flex", flexDirection: "column", gap: "12px" },
  accentPoint: { display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", opacity: 0.85 },
  accentCheck: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0,
  },

  formPanel: { flex: 1, background: "#fff", padding: "44px 40px", overflowY: "auto" },
  formTop: { marginBottom: "28px" },
  formTitle: { fontSize: "24px", fontWeight: "700", color: "#0a3d91", margin: "0 0 6px" },
  formSub: { fontSize: "14px", color: "#64748b", margin: 0 },

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
    marginBottom: "20px",
  },

  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldRow: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#0a3d91", letterSpacing: "0.3px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "12px", fontSize: "16px", pointerEvents: "none" },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  primaryBtn: {
    marginTop: "8px",
    padding: "13px",
    background: "linear-gradient(135deg, #0d9488, #0a3d91)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.3px",
  },

  loginLink: { marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#64748b" },
  linkText: { color: "#0a3d91", fontWeight: "600", cursor: "pointer" },
};