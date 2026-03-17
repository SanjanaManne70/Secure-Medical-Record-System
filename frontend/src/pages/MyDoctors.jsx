import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyDoctors() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [myDoctors, setMyDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/users/")
      .then(res => setAllDoctors(res.data))
      .catch(() => setMessage("Failed to load doctors"));
  }, []);

  const loadMyDoctors = () => {
    api.get("/api/users/my-doctors/")
      .then(res => setMyDoctors(res.data))
      .catch(() => setMessage("Failed to load assigned doctors"));
  };

  useEffect(() => {
    loadMyDoctors();
  }, []);

  const addDoctor = () => {
    if (!selectedDoctor) return;

    api.post("/api/users/add-doctor/", {
      doctor_id: selectedDoctor
    })
    .then(() => {
      setMessage("Doctor added successfully");
      setSelectedDoctor("");
      loadMyDoctors();
    })
    .catch(() => {
      setMessage("Doctor already added or error");
    });
  };

  const removeDoctor = (doctorId) => {
    api.post("/api/users/remove-doctor/", {
      doctor_id: doctorId
    })
    .then(() => {
      setMessage("Doctor removed successfully");
      loadMyDoctors();
    })
    .catch(() => {
      setMessage("Failed to remove doctor");
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>👨‍⚕️ My Doctors</h2>

        {message && <div style={styles.message}>{message}</div>}

        {/* ================= ADD DOCTOR ================= */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>➕ Add Doctor</h3>

          <div style={styles.addRow}>
            <select
              style={styles.select}
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {allDoctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <button style={styles.primaryBtn} onClick={addDoctor}>
              Add
            </button>
          </div>
        </div>

        {/* ================= ASSIGNED DOCTORS ================= */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📋 Added Doctors</h3>

          {myDoctors.length === 0 ? (
            <p style={{ color: "#6c7a96" }}>No doctors added yet</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Doctor Name</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {myDoctors.map(d => (
                  <tr key={d.id}>
                    <td style={styles.td}>{d.name}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.dangerBtn}
                        onClick={() => removeDoctor(d.id)}
                      >
                        Revoke acess
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    padding: "30px 60px",
    fontFamily: "Segoe UI, sans-serif"
  },

  container: {
    maxWidth: "1000px"
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
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },

  sectionTitle: {
    marginBottom: "15px",
    color: "#1a2b49"
  },

  addRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },

  select: {
    padding: "8px",
    minWidth: "250px",
    borderRadius: "4px",
    border: "1px solid #d6e4ff"
  },

  primaryBtn: {
    background: "#0a3d91",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  dangerBtn: {
    background: "#e53935",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  tableHeader: {
    background: "#eef3ff"
  },

  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #e3ebf7"
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #f0f3f9"
  }
};