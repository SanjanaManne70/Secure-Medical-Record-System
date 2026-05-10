import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PURPOSES = [
  { value: "treatment", label: "Treatment", icon: "💊", desc: "For ongoing treatment and care" },
  { value: "emergency", label: "Emergency", icon: "🚨", desc: "Emergency medical access" },
  { value: "consultation", label: "Consultation", icon: "📋", desc: "For a one-time consultation" },
];

export default function AccessControl() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [purpose, setPurpose] = useState("treatment");
  const [days, setDays] = useState(7);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  const showMsg = (text, type = "info") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    api.get("/api/users/my-doctors/")
      .then((res) => { setDoctors(res.data); setLoading(false); })
      .catch(() => { showMsg("Failed to load doctors.", "error"); setLoading(false); });
  }, []);

  const grantConsent = () => {
    if (!doctorId) return;
    api.post("/api/consent/grant/", { doctor_id: doctorId, purpose, duration_days: days })
      .then(() => {
        showMsg("Access granted successfully.", "success");
        setDoctorId("");
      })
      .catch(() => showMsg("Failed to grant access. Please try again.", "error"));
  };

  const selectedPurpose = PURPOSES.find((p) => p.value === purpose);
  const selectedDoctor = doctors.find((d) => String(d.id) === String(doctorId));

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18 4v28M4 18h28" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={s.navBrandName}>MediVault</span>
        </div>
        <button style={s.backBtn} onClick={() => navigate("/patient")}>← Dashboard</button>
      </nav>

      <div style={s.body}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Access Control</h1>
          <p style={s.pageSub}>Control which doctors can view your records, and for how long</p>
        </div>

        {msg.text && (
          <div style={{ ...s.msgBox, ...(msg.type === "success" ? s.msgSuccess : msg.type === "error" ? s.msgError : s.msgInfo) }}>
            {msg.type === "success" ? "✅" : msg.type === "error" ? "⚠️" : "ℹ️"} {msg.text}
          </div>
        )}

        <div style={s.layout}>
          {/* Grant Form */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.headerIcon}>🔐</div>
              <div>
                <h3 style={s.cardTitle}>Grant Access</h3>
                <p style={s.cardSub}>Choose a doctor, purpose, and access duration</p>
              </div>
            </div>

            {/* Doctor Select */}
            <div style={s.field}>
              <label style={s.label}>Doctor</label>
              {loading ? (
                <div style={s.loadingRow}><div style={s.spinner} /> Loading doctors…</div>
              ) : (
                <div style={s.selectWrapper}>
                  <span style={s.selectIcon}>👨‍⚕️</span>
                  <select
                    style={s.select}
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                  >
                    <option value="">Select a doctor…</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.department ? `· ${d.department}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Purpose */}
            <div style={s.field}>
              <label style={s.label}>Purpose of Access</label>
              <div style={s.purposeGrid}>
                {PURPOSES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    style={{
                      ...s.purposeBtn,
                      ...(purpose === p.value ? s.purposeBtnActive : {}),
                    }}
                    onClick={() => setPurpose(p.value)}
                  >
                    <span style={s.purposeIcon}>{p.icon}</span>
                    <span style={s.purposeLabel}>{p.label}</span>
                    <span style={s.purposeDesc}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={s.field}>
              <label style={s.label}>
                Access Duration — <span style={s.daysValue}>{days} day{days !== 1 ? "s" : ""}</span>
              </label>
              <input
                type="range"
                min="1"
                max="90"
                step="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={s.slider}
              />
              <div style={s.sliderLabels}>
                <span>1 day</span>
                <span>30 days</span>
                <span>90 days</span>
              </div>
              <div style={s.quickDays}>
                {[1, 7, 14, 30, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    style={{ ...s.quickBtn, ...(days === d ? s.quickBtnActive : {}) }}
                    onClick={() => setDays(d)}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <button
              style={{ ...s.grantBtn, opacity: !doctorId ? 0.5 : 1 }}
              disabled={!doctorId}
              onClick={grantConsent}
            >
              🔓 Grant Access
            </button>
          </div>

          {/* Preview Card */}
          <div style={s.previewCard}>
            <h4 style={s.previewTitle}>Access Summary</h4>

            <div style={s.previewSection}>
              <p style={s.previewKey}>Doctor</p>
              <p style={s.previewVal}>{selectedDoctor ? selectedDoctor.name : "Not selected"}</p>
            </div>

            <div style={s.divider} />

            <div style={s.previewSection}>
              <p style={s.previewKey}>Purpose</p>
              <p style={s.previewVal}>
                {selectedPurpose?.icon} {selectedPurpose?.label}
              </p>
              <p style={s.previewDesc}>{selectedPurpose?.desc}</p>
            </div>

            <div style={s.divider} />

            <div style={s.previewSection}>
              <p style={s.previewKey}>Duration</p>
              <p style={s.previewVal}>{days} day{days !== 1 ? "s" : ""}</p>
              <p style={s.previewDesc}>
                Expires on {new Date(Date.now() + days * 86400000).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </p>
            </div>

            <div style={s.securityNote}>
              🛡️ Access is automatically revoked after the duration expires. You can also manually revoke it any time from the My Doctors section.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #eef4ff 0%, #f0f4f8 60%, #e8f5f3 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#0f172a",
  },
  nav: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 40px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(10,61,145,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navBrandName: { fontSize: "17px", fontWeight: "700", color: "#0a3d91" },
  backBtn: { background: "transparent", border: "none", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer" },

  body: { padding: "40px 48px", maxWidth: "1000px", margin: "0 auto" },
  pageHeader: { marginBottom: "28px" },
  pageTitle: { fontSize: "26px", fontWeight: "700", color: "#0a3d91", margin: "0 0 6px" },
  pageSub: { fontSize: "14px", color: "#64748b", margin: 0 },

  msgBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "20px",
    border: "1px solid",
  },
  msgSuccess: { background: "#d1fae5", color: "#065f46", borderColor: "#6ee7b7" },
  msgError: { background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" },
  msgInfo: { background: "#e8f0fe", color: "#1e40af", borderColor: "#c7d7fc" },

  layout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" },

  card: {
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  headerIcon: {
    width: "52px",
    height: "52px",
    background: "#e8f0fe",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 3px" },
  cardSub: { fontSize: "13px", color: "#64748b", margin: 0 },

  field: { marginBottom: "24px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#0a3d91", marginBottom: "10px", letterSpacing: "0.3px" },
  daysValue: { color: "#0d9488", fontWeight: "700" },

  loadingRow: { display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "14px" },
  spinner: { width: "18px", height: "18px", border: "2px solid #e2e8f0", borderTop: "2px solid #0a3d91", borderRadius: "50%" },

  selectWrapper: { position: "relative", display: "flex", alignItems: "center" },
  selectIcon: { position: "absolute", left: "12px", fontSize: "16px", pointerEvents: "none", zIndex: 1 },
  select: {
    width: "100%",
    padding: "11px 14px 11px 38px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    fontFamily: "inherit",
    appearance: "none",
  },

  purposeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" },
  purposeBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    padding: "14px 10px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  purposeBtnActive: { border: "1.5px solid #0a3d91", background: "#e8f0fe" },
  purposeIcon: { fontSize: "22px" },
  purposeLabel: { fontSize: "12px", fontWeight: "700", color: "#0f172a" },
  purposeDesc: { fontSize: "10px", color: "#94a3b8", textAlign: "center", lineHeight: 1.3 },

  slider: { width: "100%", marginBottom: "8px", accentColor: "#0a3d91" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "12px" },
  quickDays: { display: "flex", gap: "8px" },
  quickBtn: {
    padding: "5px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#475569",
    fontFamily: "inherit",
  },
  quickBtnActive: { background: "#e8f0fe", border: "1px solid #0a3d91", color: "#0a3d91" },

  grantBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.3px",
  },

  // Preview Card
  previewCard: {
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    padding: "28px 24px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  previewTitle: { fontSize: "14px", fontWeight: "700", color: "#0a3d91", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.5px" },
  previewSection: { marginBottom: "16px" },
  previewKey: { fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" },
  previewVal: { fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" },
  previewDesc: { fontSize: "12px", color: "#64748b", margin: 0 },
  divider: { height: "1px", background: "#f1f5f9", margin: "16px 0" },
  securityNote: {
    background: "#e8f0fe",
    border: "1px solid #c7d7fc",
    borderRadius: "10px",
    padding: "14px 16px",
    fontSize: "12px",
    color: "#1e40af",
    lineHeight: 1.6,
    marginTop: "20px",
  },
};