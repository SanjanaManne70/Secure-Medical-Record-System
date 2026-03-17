import { useState } from "react";
import api from "../api/axios";

export default function UploadMedicalRecord() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("general");
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMsg("❌ Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      await api.post("/api/records/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("✅ Record uploaded successfully");
      setFile(null);
    } catch (err) {
      setMsg("❌ Upload failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📤 Upload Medical Record</h2>

        {/* Category */}
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="personal">Personal Details</option>
            <option value="prescription">Prescription</option>
            <option value="lab">Lab Reports</option>
            <option value="scan">Scans</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* File Upload */}
        <div style={styles.field}>
          <label style={styles.label}>Select File</label>
          <div style={styles.fileBox}>
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
              style={{ cursor: "pointer" }}
            />
          </div>
          {file && (
            <p style={styles.fileName}>
              📄 {file.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button onClick={handleUpload} style={styles.button}>
          Upload Securely
        </button>

        {/* Message */}
        {msg && (
          <div
            style={{
              ...styles.message,
              backgroundColor: msg.includes("✅") ? "#e6ffed" : "#ffe6e6",
              color: msg.includes("✅") ? "#067d2f" : "#b30000"
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eef5ff, #f8fbff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },
  title: {
    textAlign: "center",
    color: "#0a3d91",
    marginBottom: "30px"
  },
  field: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#0a3d91"
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d6e4ff",
    backgroundColor: "#f8fbff"
  },
  fileBox: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px dashed #0a3d91",
    backgroundColor: "#f0f6ff"
  },
  fileName: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#0a3d91"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0a3d91",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px"
  },
  message: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "6px",
    textAlign: "center"
  }
};