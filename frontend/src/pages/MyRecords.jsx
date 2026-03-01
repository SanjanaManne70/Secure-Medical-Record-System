import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyRecords() {
  const [records, setRecords] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    api.get("/api/records/patient-records/")
      .then(res => setRecords(res.data))
      .catch(() => setError("Failed to load records"));
  }, []);

  const groupedRecords = records.reduce((acc, record) => {
    acc[record.category] = acc[record.category] || [];
    acc[record.category].push(record);
    return acc;
  }, {});

  const viewRecord = (recordId, filename) => {
    api.get(`/api/records/patient/view/${recordId}/`)
      .then(res => {
        setSelectedContent(res.data.content);
        setSelectedFile(filename);
      })
      .catch(() => alert("Failed to open file"));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📁 My Records</h2>

        {error && <div style={styles.error}>{error}</div>}

        {/* ================= FOLDER TABLE ================= */}
        {!activeFolder && (
          <>
            {Object.keys(groupedRecords).length === 0 ? (
              <p>No records uploaded</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Number of Files</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedRecords).map(folder => (
                    <tr
                      key={folder}
                      style={styles.rowClickable}
                      onClick={() => setActiveFolder(folder)}
                    >
                      <td style={styles.tdLink}>📂 {folder}</td>
                      <td style={styles.td}>
                        {groupedRecords[folder].length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ================= FILE LIST ================= */}
        {activeFolder && (
          <>
            <div style={styles.headerRow}>
              <button
                style={styles.backBtn}
                onClick={() => setActiveFolder(null)}
              >
                ⬅ Back
              </button>

              <h3 style={{ margin: 0 }}>📂 {activeFolder}</h3>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {groupedRecords[activeFolder]?.map(record => (
                  <tr key={record.id}>
                    <td
                      style={styles.tdLink}
                      onClick={() =>
                        viewRecord(
                          record.id,
                          record.filename || "Untitled File"
                        )
                      }
                    >
                      {record.filename || "Untitled File"}
                    </td>
                    <td style={styles.td}>
                      {new Date(record.uploaded_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedContent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{selectedFile}</h3>

            <pre style={styles.pre}>{selectedContent}</pre>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedContent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
    marginBottom: "20px"
  },

  error: {
    background: "#ffe6e6",
    padding: "8px",
    borderRadius: "4px",
    color: "#b30000",
    marginBottom: "15px"
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "15px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
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
  },

  tdLink: {
    padding: "10px",
    borderBottom: "1px solid #f0f3f9",
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "500"
  },

  rowClickable: {
    cursor: "pointer"
  },

  backBtn: {
    background: "#0a3d91",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "25px",
    width: "65%",
    maxHeight: "80%",
    overflowY: "auto",
    borderRadius: "6px"
  },

  pre: {
    whiteSpace: "pre-wrap",
    background: "#f8fbff",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #e3ebf7"
  },

  closeBtn: {
    marginTop: "15px",
    padding: "6px 12px",
    background: "#0a3d91",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};