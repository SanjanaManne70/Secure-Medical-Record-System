import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AccessControl() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [purpose, setPurpose] = useState("treatment");
  const [days, setDays] = useState(7);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api/users/my-doctors/")
      .then(res => setDoctors(res.data))
      .catch(() => setMsg("Failed to load doctors"));
  }, []);

  const grantConsent = () => {
    api.post("/api/consent/grant/", {
      doctor_id: doctorId,
      purpose,
      duration_days: days
    })
    .then(() => setMsg("Access granted successfully"))
    .catch(() => setMsg("Failed to grant access"));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>🔐 Access Control</h2>

        {msg && <div style={styles.message}>{msg}</div>}

        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Doctor</label>
            <select
              style={styles.select}
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Purpose</label>
            <select
              style={styles.select}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
            >
              <option value="treatment">Treatment</option>
              <option value="emergency">Emergency</option>
              <option value="consultation">Consultation</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Duration (days)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              value={days}
              onChange={e => setDays(Number(e.target.value))}
            />
          </div>

          <button
            style={{
              ...styles.primaryBtn,
              opacity: !doctorId ? 0.6 : 1,
              cursor: !doctorId ? "not-allowed" : "pointer"
            }}
            disabled={!doctorId}
            onClick={grantConsent}
          >
            Grant Access
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "40px 60px",
    fontFamily: "Segoe UI, sans-serif"
  },

  container: {
    maxWidth: "600px"
  },

  title: {
    color: "#0a3d91",
    marginBottom: "25px"
  },

  message: {
    background: "#eef3ff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "20px",
    color: "#0a3d91"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },

  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column"
  },

  label: {
    marginBottom: "6px",
    fontWeight: "500",
    color: "#1a2b49"
  },

  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #d6e4ff"
  },

  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #d6e4ff"
  },

  primaryBtn: {
    background: "#0a3d91",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    width: "100%",
    fontWeight: "500"
  }
};