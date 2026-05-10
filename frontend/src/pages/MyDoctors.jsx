import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyDoctors() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [myDoctors, setMyDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  const showMsg = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const loadMyDoctors = () => {
    api.get("/api/users/my-doctors/")
      .then((res) => { setMyDoctors(res.data); setLoading(false); })
      .catch(() => { showMsg("Failed to load your doctors.", "error"); setLoading(false); });
  };

  useEffect(() => {
    api.get("/api/users/").then((res) => setAllDoctors(res.data)).catch(() => showMsg("Failed to load doctors.", "error"));
    loadMyDoctors();
  }, []);

  const addDoctor = () => {
    if (!selectedDoctor) return;
    api.post("/api/users/add-doctor/", { doctor_id: selectedDoctor })
      .then(() => { showMsg("Doctor added successfully.", "success"); setSelectedDoctor(""); loadMyDoctors(); })
      .catch(() => showMsg("Doctor is already added or an error occurred.", "error"));
  };

  const removeDoctor = (doctorId) => {
    api.post("/api/users/remove-doctor/", { doctor_id: doctorId })
      .then(() => { showMsg("Doctor access revoked.", "success"); loadMyDoctors(); })
      .catch(() => showMsg("Failed to remove doctor.", "error"));
  };

  const availableDoctors = allDoctors.filter((d) => !myDoctors.find((m) => m.id === d.id));

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
          <h1 style={s.pageTitle}>My Doctors</h1>
          <p style={s.pageSub}>Manage which doctors can see your medical records</p>
        </div>

        {message.text && (
          <div style={{ ...s.msgBox, ...(message.type === "success" ? s.msgSuccess : message.type === "error" ? s.msgError : s.msgInfo) }}>
            {message.type === "success" ? "✅" : message.type === "error" ? "⚠️" : "ℹ️"} {message.text}
          </div>
        )}

        {/* Add Doctor Card */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardHeaderIcon}>➕</div>
            <div>
              <h3 style={s.cardTitle}>Add a Doctor</h3>
              <p style={s.cardSub}>Select a registered doctor to grant them access</p>
            </div>
          </div>
          <div style={s.addRow}>
            <div style={s.selectWrapper}>
              <span style={s.selectIcon}>👨‍⚕️</span>
              <select
                style={s.select}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Select a doctor…</option>
                {availableDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.department ? `· ${d.department}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              style={{ ...s.addBtn, opacity: !selectedDoctor ? 0.5 : 1 }}
              disabled={!selectedDoctor}
              onClick={addDoctor}
            >
              Add Doctor
            </button>
          </div>
        </div>

        {/* My Doctors Card */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ ...s.cardHeaderIcon, background: "#ccfbf1", color: "#0d9488" }}>👨‍⚕️</div>
            <div>
              <h3 style={s.cardTitle}>Added Doctors</h3>
              <p style={s.cardSub}>{myDoctors.length} doctor{myDoctors.length !== 1 ? "s" : ""} currently have access</p>
            </div>
          </div>

          {loading ? (
            <div style={s.loadingRow}>
              <div style={s.spinner} /> Loading…
            </div>
          ) : myDoctors.length === 0 ? (
            <div style={s.emptyState}>
              <span style={s.emptyIcon}>🏥</span>
              <p style={s.emptyText}>No doctors added yet. Add a doctor above to grant record access.</p>
            </div>
          ) : (
            <div style={s.doctorList}>
              {myDoctors.map((d) => (
                <div key={d.id} style={s.doctorRow}>
                  <div style={s.docAvatar}>{d.name.charAt(0).toUpperCase()}</div>
                  <div style={s.docInfo}>
                    <p style={s.docName}>{d.name}</p>
                    {d.department && <p style={s.docDept}>{d.department}</p>}
                  </div>
                  <div style={s.docBadge}>
                    <span style={s.accessBadge}>Access Granted</span>
                  </div>
                  <button style={s.revokeBtn} onClick={() => removeDoctor(d.id)}>
                    Revoke Access
                  </button>
                </div>
              ))}
            </div>
          )}
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

  body: { padding: "40px 48px", maxWidth: "860px", margin: "0 auto" },
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

  card: {
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    padding: "28px 32px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  cardHeaderIcon: {
    width: "48px",
    height: "48px",
    background: "#e8f0fe",
    color: "#0a3d91",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 3px" },
  cardSub: { fontSize: "13px", color: "#64748b", margin: 0 },

  addRow: { display: "flex", gap: "12px", alignItems: "center" },
  selectWrapper: { flex: 1, position: "relative", display: "flex", alignItems: "center" },
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
    cursor: "pointer",
  },
  addBtn: {
    padding: "11px 24px",
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },

  loadingRow: { display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "14px" },
  spinner: { width: "18px", height: "18px", border: "2px solid #e2e8f0", borderTop: "2px solid #0a3d91", borderRadius: "50%" },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "36px",
    textAlign: "center",
    background: "#f8fafc",
    borderRadius: "12px",
  },
  emptyIcon: { fontSize: "36px", marginBottom: "12px" },
  emptyText: { fontSize: "14px", color: "#64748b", margin: 0 },

  doctorList: { display: "flex", flexDirection: "column", gap: "12px" },
  doctorRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  docAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  docInfo: { flex: 1 },
  docName: { fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" },
  docDept: { fontSize: "12px", color: "#64748b", margin: 0 },
  docBadge: { marginRight: "4px" },
  accessBadge: {
    background: "#d1fae5",
    color: "#065f46",
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "9999px",
    border: "1px solid #6ee7b7",
  },
  revokeBtn: {
    background: "#fff",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
};