import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [showPatients, setShowPatients] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      api.get(`/api/records/doctor-records/?search=${search}`)
        .then(res => {
          setRecords(res.data);
          setShowRecords(true);
          setShowPatients(false);
        })
        .catch(err => console.error(err));
    }
  };

  const loadPatients = () => {
    api.get("/api/records/doctor-records/")
      .then(res => {
        const unique = [
          ...new Map(res.data.map(item =>
            [item.patient_name, item]
          )).values()
        ];

        setPatients(unique);
        setShowPatients(true);
        setShowRecords(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={styles.page}>

      {/* TOP RIGHT SIGN OUT */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Sign Out
      </button>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Doctor Dashboard</h1>
          <p style={styles.subtitle}>
            Secure Medical Records Access Panel
          </p>
        </div>
      </div>

      {/* SEARCH PANEL */}
      <div style={styles.card}>
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search patient by name and press Enter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            style={styles.searchInput}
          />

          <button style={styles.secondaryBtn} onClick={loadPatients}>
            Assigned Patients
          </button>
        </div>
      </div>

      {/* ASSIGNED PATIENTS */}
      {showPatients && (
        <div style={styles.card}>
          <h3 style={styles.greenTitle}>Assigned Patients</h3>

          {patients.length === 0 ? (
            <p style={styles.emptyText}>No assigned patients.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Patient Name</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr key={index} style={styles.rowHover}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{p.patient_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* SEARCH RESULTS */}
      {showRecords && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Medical Records</h3>

          {records.length === 0 ? (
            <p style={styles.emptyText}>
              No records found for "{search}"
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Record ID</th>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Uploaded At</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.record_id} style={styles.rowHover}>
                    <td style={styles.td}>{record.record_id}</td>
                    <td style={styles.td}>{record.filename}</td>
                    <td style={styles.td}>{record.patient_name}</td>
                    <td style={styles.td}>
                      {new Date(record.uploaded_at).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.primaryBtn}
                        onClick={() =>
                          navigate(`/doctor/records/${record.record_id}?search=${search}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "40px 70px",
    fontFamily: "Segoe UI, sans-serif",
    position: "relative"
  },

  logoutBtn: {
    position: "absolute",
    top: "30px",
    right: "70px",
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0a3d91",
    cursor: "pointer"
  },

  header: {
    marginBottom: "30px"
  },

  title: {
    margin: 0,
    color: "#0a3d91",
    fontSize: "28px"
  },

  subtitle: {
    marginTop: "6px",
    color: "#6c7a96"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
    marginBottom: "25px"
  },

  searchRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },

  searchInput: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #d6e4ff"
  },

  sectionTitle: {
    marginBottom: "15px",
    color: "#1a2b49"
  },

  greenTitle: {
    color: "#1e7e34",
    marginBottom: "15px"
  },

  emptyText: {
    color: "#6c7a96"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  tableHeader: {
    background: "#eef3ff"
  },

  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
    borderBottom: "1px solid #e3ebf7"
  },

  td: {
    padding: "12px",
    fontSize: "14px",
    borderBottom: "1px solid #f0f3f9"
  },

  rowHover: {
    transition: "background 0.2s ease"
  },

  primaryBtn: {
    background: "#0a3d91",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  secondaryBtn: {
    background: "white",
    border: "1px solid #0a3d91",
    color: "#0a3d91",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};