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
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      setLoading(true);
      api
        .get(`/api/records/doctor-records/?search=${search}`)
        .then((res) => {
          setRecords(res.data);
          setShowRecords(true);
          setShowPatients(false);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  const loadPatients = () => {
    setLoading(true);
    api
      .get("/api/records/doctor-records/")
      .then((res) => {
        const unique = [
          ...new Map(res.data.map((item) => [item.patient_id, item])).values(),
        ];
        setPatients(unique);
        setShowPatients(true);
        setShowRecords(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const doctorName = localStorage.getItem("name") || "Doctor";

  return (
    <div style={s.page}>
      {/* Top Nav */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18 4v28M4 18h28" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={s.navBrandName}>MediVault</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navBadge}>Doctor Portal</span>
          <button onClick={handleLogout} style={s.logoutBtn}>
            Sign Out →
          </button>
        </div>
      </nav>

      <div style={s.body}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.avatarCircle}>{doctorName.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={s.title}>Dr.Gayatri Srinivas</h1>
              <p style={s.subtitle}>Secure Medical Records Access Panel</p>
            </div>
          </div>
          <div style={s.headerStats}>
            <div style={s.miniStat}>
              <span style={s.miniStatVal}>{patients.length || "—"}</span>
              <span style={s.miniStatLabel}>Patients</span>
            </div>
            <div style={s.statDivider} />
            <div style={s.miniStat}>
              <span style={s.miniStatVal}>{records.length || "—"}</span>
              <span style={s.miniStatLabel}>Records Found</span>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        <div style={s.card}>
          <p style={s.cardLabel}>Search Patient Records</p>
          <div style={s.searchRow}>
            <div style={s.searchBox}>
              <span style={s.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search patient by name and press Enter…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={s.searchInput}
              />
            </div>
            <button style={s.outlineBtn} onClick={loadPatients}>
              👥 Assigned Patients
            </button>
          </div>
        </div>

        {loading && (
          <div style={s.loadingRow}>
            <div style={s.spinner} /> Loading…
          </div>
        )}

        {/* Assigned Patients */}
        {showPatients && !loading && (
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={s.sectionDot} />
              <h3 style={s.sectionTitle}>Assigned Patients</h3>
            </div>

            {patients.length === 0 ? (
              <p style={s.emptyText}>No assigned patients found.</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr style={s.theadRow}>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Patient Name</th>
                    <th style={s.th}>Records</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr key={i} style={s.tr}>
                      <td style={s.tdMuted}>{i + 1}</td>
                      <td style={s.tdBold}>{p.patient_name}</td>
                      <td style={s.td}>
                        <button
                          style={s.miniBtn}
                          onClick={() => {
                            setSearch(p.patient_name);
                            api
                              .get(`/api/records/doctor-records/?search=${p.patient_name}`)
                              .then((res) => {
                                setRecords(res.data);
                                setShowRecords(true);
                                setShowPatients(false);
                              });
                          }}
                        >
                          View Records
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Search Results */}
        {showRecords && !loading && (
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={{ ...s.sectionDot, background: "#0d9488" }} />
              <h3 style={s.sectionTitle}>
                Records for "{search}"
              </h3>
            </div>

            {records.length === 0 ? (
              <p style={s.emptyText}>No records found for "{search}".</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr style={s.theadRow}>
                    <th style={s.th}>File Name</th>
                    <th style={s.th}>Patient</th>
                    <th style={s.th}>Category</th>
                    <th style={s.th}>Uploaded At</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.record_id} style={s.tr}>
                      <td style={s.tdFile}>
                        <span style={s.fileIcon}>📄</span> {record.filename}
                      </td>
                      <td style={s.td}>{record.patient_name}</td>
                      <td style={s.td}>
                        <span style={s.categoryBadge}>
                          {record.category || "General"}
                        </span>
                      </td>
                      <td style={s.tdMuted}>
                        {new Date(record.uploaded_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={s.td}>
                        <button
                          style={s.viewBtn}
                          onClick={() =>
                            navigate(
                              `/doctor/records/${record.record_id}?search=${search}`,
                              {
                                state: {
                                  filename: record.filename,
                                  patient: record.patient_name,
                                  uploadedAt: record.uploaded_at,
                                },
                              }
                            )
                          }
                        >
                          View →
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
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navBadge: {
    background: "#ccfbf1",
    color: "#0f766e",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 12px",
    borderRadius: "9999px",
    border: "1px solid #99f6e4",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
  },

  body: { padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "16px" },
  avatarCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    fontSize: "22px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: "24px", fontWeight: "700", color: "#0a3d91", margin: "0 0 4px" },
  subtitle: { fontSize: "14px", color: "#64748b", margin: 0 },

  headerStats: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px 28px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  miniStat: { display: "flex", flexDirection: "column", alignItems: "center" },
  miniStatVal: { fontSize: "22px", fontWeight: "700", color: "#0a3d91" },
  miniStatLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginTop: "2px" },
  statDivider: { width: "1px", height: "36px", background: "#e2e8f0" },

  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "28px 32px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  cardLabel: { fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "14px", margin: "0 0 14px" },

  searchRow: { display: "flex", gap: "12px", alignItems: "center" },
  searchBox: { flex: 1, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: "14px", fontSize: "16px" },
  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  outlineBtn: {
    padding: "11px 20px",
    borderRadius: "10px",
    border: "1.5px solid #0a3d91",
    background: "transparent",
    color: "#0a3d91",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },

  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "14px",
    padding: "12px 0",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid #e2e8f0",
    borderTop: "2px solid #0a3d91",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },

  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" },
  sectionDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#0a3d91",
    flexShrink: 0,
  },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 },
  emptyText: { color: "#94a3b8", fontSize: "14px" },

  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { background: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" },
  td: { padding: "14px", fontSize: "14px", color: "#0f172a" },
  tdMuted: { padding: "14px", fontSize: "13px", color: "#64748b" },
  tdBold: { padding: "14px", fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  tdFile: { padding: "14px", fontSize: "14px", color: "#0a3d91", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" },
  fileIcon: { fontSize: "16px" },

  categoryBadge: {
    background: "#e8f0fe",
    color: "#1e40af",
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 10px",
    borderRadius: "9999px",
    border: "1px solid #c7d7fc",
  },

  miniBtn: {
    background: "transparent",
    border: "1px solid #0a3d91",
    color: "#0a3d91",
    padding: "5px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  viewBtn: {
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    color: "#fff",
    border: "none",
    padding: "7px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};