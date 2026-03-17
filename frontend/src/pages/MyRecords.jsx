import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyRecords() {
  const [records, setRecords] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [textContent, setTextContent] = useState("");

  // 🔥 NEW STATES
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // 🔐 BLOCK COPY / RIGHT CLICK
  useEffect(() => {
    const blockRightClick = (e) => e.preventDefault();

    const blockKeys = (e) => {
      if (e.ctrlKey && ["c", "u", "s"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockRightClick);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockRightClick);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

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

  // 🔥 VIEW FILE
  const viewRecord = async (recordId, filename) => {
    try {
      const res = await api.get(`/api/records/patient/view/${recordId}/`, {
        responseType: "blob"
      });

      let type = res.headers["content-type"];

      if (!type || type === "application/octet-stream") {
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
          type = "image/jpeg";
        } else if (filename.endsWith(".png")) {
          type = "image/png";
        } else if (filename.endsWith(".pdf")) {
          type = "application/pdf";
        } else if (filename.endsWith(".txt")) {
          type = "text/plain";
        } else {
          type = "application/octet-stream";
        }
      }

      setFileType(type);
      setSelectedFile(filename);

      if (type.startsWith("text")) {
        const text = await res.data.text();
        setTextContent(text);
        setFileUrl("");
      } else {
        const blob = new Blob([res.data], { type });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setTextContent("");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to open file");
    }
  };

  // ✏️ RENAME
  const handleRename = async (recordId) => {
    try {
      await api.post(`/api/records/rename/${recordId}/`, {
        filename: newName
      });

      setRecords(prev =>
        prev.map(r =>
          r.id === recordId ? { ...r, filename: newName } : r
        )
      );

      setEditingId(null);
    } catch {
      alert("Rename failed");
    }
  };

  // 🗑️ DELETE
  const handleDelete = async (recordId) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await api.delete(`/api/records/delete/${recordId}/`);

      setRecords(prev => prev.filter(r => r.id !== recordId));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📁 My Medical Records</h2>

        {error && <div style={styles.error}>{error}</div>}

        {!activeFolder ? (
          Object.keys(groupedRecords).length === 0 ? (
            <p>No records uploaded</p>
          ) : (
            <div style={styles.folderGrid}>
              {Object.keys(groupedRecords).map(folder => (
                <div
                  key={folder}
                  style={styles.folderCard}
                  onClick={() => setActiveFolder(folder)}
                >
                  <div style={styles.folderIcon}>📂</div>
                  <div style={styles.folderName}>{folder}</div>
                  <div style={styles.folderCount}>
                    {groupedRecords[folder].length} files
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            <div style={styles.headerRow}>
              <button
                style={styles.backBtn}
                onClick={() => setActiveFolder(null)}
              >
                ⬅ Back
              </button>
              <h3>📂 {activeFolder}</h3>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Uploaded</th>
                  <th style={styles.th}>Rename</th>
                  <th style={styles.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {groupedRecords[activeFolder]?.map(record => (
                  <tr key={record.id}>
                    <td style={styles.tdLink}>
                      {editingId === record.id ? (
                        <input
                          value={newName}
                          autoFocus
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={() => handleRename(record.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(record.id);
                          }}
                          style={styles.input}
                        />
                      ) : (
                        <span
                          onClick={() =>
                            viewRecord(record.id, record.filename)
                          }
                        >
                          📄 {record.filename}
                        </span>
                      )}
                    </td>

                    <td style={styles.td}>
                      {new Date(record.uploaded_at).toLocaleString()}
                    </td>

                    <td
                      style={styles.iconBtn}
                      onClick={() => {
                        setEditingId(record.id);
                        setNewName(record.filename);
                      }}
                    >
                      ✏️
                    </td>

                    <td
                      style={styles.iconBtn}
                      onClick={() => handleDelete(record.id)}
                    >
                      🗑️
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* MODAL */}
      {(fileUrl || textContent) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{selectedFile}</h3>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setFileUrl("");
                  setTextContent("");
                }}
              >
                ✖
              </button>
            </div>

            <div style={styles.previewArea}>
              {fileType.startsWith("image") && (
                <img src={fileUrl} style={styles.image} draggable={false} />
              )}

              {fileType === "application/pdf" && (
                <iframe src={fileUrl} style={styles.pdf} />
              )}

              {fileType.startsWith("text") && (
                <pre style={{ ...styles.text, userSelect: "none" }}>
                  {textContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eef2ff, #f9fbff)",
    padding: "40px",
    fontFamily: "Segoe UI"
  },

  container: {
    maxWidth: "1100px",
    margin: "auto"
  },

  title: {
    fontSize: "28px",
    color: "#1a237e",
    marginBottom: "25px"
  },

  error: {
    background: "#ffe6e6",
    padding: "10px",
    borderRadius: "6px",
    color: "#b30000"
  },

  folderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px"
  },

  folderCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    textAlign: "center"
  },

  folderIcon: {
    fontSize: "40px"
  },

  folderName: {
    marginTop: "10px",
    fontWeight: "600"
  },

  folderCount: {
    fontSize: "13px",
    color: "gray"
  },

  table: {
    width: "100%",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  tableHeader: {
    background: "#e8eaf6"
  },

  th: {
    padding: "12px",
    textAlign: "left"
  },

  td: {
    padding: "12px"
  },

  tdLink: {
    padding: "12px",
    cursor: "pointer",
    color: "#1e88e5",
    fontWeight: "500"
  },

  iconBtn: {
    cursor: "pointer",
    textAlign: "center",
    fontSize: "18px"
  },

  input: {
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "90%"
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px"
  },

  backBtn: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
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
    width: "70%",
    maxHeight: "85%",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  closeBtn: {
    border: "none",
    background: "#e53935",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  previewArea: {
    marginTop: "15px",
    flex: 1,
    overflow: "auto",
    textAlign: "center"
  },

  image: {
    maxWidth: "100%",
    borderRadius: "10px"
  },

  pdf: {
    width: "100%",
    height: "600px",
    border: "none"
  },

  text: {
    textAlign: "left",
    background: "#f4f6ff",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap"
  }
};