import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = [
  { value: "personal", label: "Personal Details", icon: "🪪" },
  { value: "prescription", label: "Prescription", icon: "💊" },
  { value: "lab", label: "Lab Reports", icon: "🧪" },
  { value: "scan", label: "Scans & Imaging", icon: "🩻" },
  { value: "general", label: "General", icon: "📋" },
];

export default function UploadMedicalRecord() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("general");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMsg({ text: "Please select a file before uploading.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      await api.post("/api/records/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg({ text: "Record uploaded and encrypted successfully.", type: "success" });
      setFile(null);
    } catch {
      setMsg({ text: "Upload failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const selectedCat = CATEGORIES.find((c) => c.value === category);

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
        <button style={s.backBtn} onClick={() => navigate("/patient")}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={s.body}>
        <div style={s.card}>
          {/* Header */}
          <div style={s.cardHeader}>
            <div style={s.headerIcon}>⬆️</div>
            <div>
              <h2 style={s.cardTitle}>Upload Medical Record</h2>
              <p style={s.cardSub}>Files are encrypted end-to-end before storage</p>
            </div>
          </div>

          <div style={s.divider} />

          {/* Category Selection */}
          <div style={s.section}>
            <label style={s.sectionLabel}>Record Category</label>
            <div style={s.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  style={{
                    ...s.catBtn,
                    ...(category === cat.value ? s.catBtnActive : {}),
                  }}
                  onClick={() => setCategory(cat.value)}
                  type="button"
                >
                  <span style={s.catIcon}>{cat.icon}</span>
                  <span style={s.catLabel}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Drop Zone */}
          <div style={s.section}>
            <label style={s.sectionLabel}>Select File</label>
            <div
              style={{
                ...s.dropZone,
                ...(dragging ? s.dropZoneActive : {}),
                ...(file ? s.dropZoneFilled : {}),
              }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file ? (
                <div style={s.filePreview}>
                  <div style={s.filePreviewIcon}>{selectedCat?.icon || "📄"}</div>
                  <div>
                    <p style={s.fileName}>{file.name}</p>
                    <p style={s.fileSize}>{(file.size / 1024).toFixed(1)} KB · {selectedCat?.label}</p>
                  </div>
                  <button
                    style={s.removeFile}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div style={s.dropPlaceholder}>
                  <div style={s.dropIcon}>📂</div>
                  <p style={s.dropText}>Drag & drop a file here</p>
                  <p style={s.dropSub}>or click to browse · PDF, JPG, PNG, TXT supported</p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {msg.text && (
            <div style={{ ...s.msgBox, ...(msg.type === "success" ? s.msgSuccess : s.msgError) }}>
              <span>{msg.type === "success" ? "✅" : "⚠️"}</span>
              {msg.text}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            style={{ ...s.uploadBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Encrypting & Uploading…" : "🔒 Upload Securely"}
          </button>

          <p style={s.securityNote}>
            🛡️ Your file will be encrypted with AES-256 before being stored. Only you and authorised doctors can access it.
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
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px 0",
  },

  body: {
    display: "flex",
    justifyContent: "center",
    padding: "48px 24px",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(10,61,145,0.10)",
    border: "1px solid #e2e8f0",
    padding: "40px 44px",
    width: "100%",
    maxWidth: "620px",
  },

  cardHeader: { display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" },
  headerIcon: {
    width: "56px",
    height: "56px",
    background: "#e8f0fe",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },
  cardTitle: { fontSize: "22px", fontWeight: "700", color: "#0a3d91", margin: "0 0 4px" },
  cardSub: { fontSize: "13px", color: "#64748b", margin: 0 },

  divider: { height: "1px", background: "#f1f5f9", margin: "0 0 28px" },

  section: { marginBottom: "28px" },
  sectionLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0a3d91",
    marginBottom: "12px",
    letterSpacing: "0.3px",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  catBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "14px 10px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit",
  },
  catBtnActive: {
    border: "1.5px solid #0a3d91",
    background: "#e8f0fe",
  },
  catIcon: { fontSize: "22px" },
  catLabel: { fontSize: "11px", fontWeight: "600", color: "#475569", textAlign: "center" },

  dropZone: {
    border: "2px dashed #c7d7fc",
    borderRadius: "14px",
    padding: "36px 24px",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "#f8fafc",
  },
  dropZoneActive: { borderColor: "#0a3d91", background: "#eef4ff" },
  dropZoneFilled: { borderStyle: "solid", borderColor: "#0d9488", background: "#f0fdfa" },

  dropPlaceholder: { textAlign: "center" },
  dropIcon: { fontSize: "40px", marginBottom: "12px" },
  dropText: { fontSize: "15px", fontWeight: "600", color: "#0a3d91", margin: "0 0 6px" },
  dropSub: { fontSize: "13px", color: "#94a3b8", margin: 0 },

  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  filePreviewIcon: { fontSize: "32px", flexShrink: 0 },
  fileName: { fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 3px" },
  fileSize: { fontSize: "12px", color: "#64748b", margin: 0 },
  removeFile: {
    marginLeft: "auto",
    background: "#fee2e2",
    border: "none",
    color: "#dc2626",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  msgBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "20px",
  },
  msgSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #6ee7b7",
  },
  msgError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },

  uploadBtn: {
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
    marginBottom: "16px",
  },

  securityNote: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center",
    margin: 0,
    lineHeight: 1.6,
  },
};