import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoctorRecordView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedFilename = location.state?.filename;
  const passedPatient = location.state?.patient;
  const passedDate = location.state?.uploadedAt;

  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [blurred, setBlurred] = useState(false);

  // Fetch decrypted file
  useEffect(() => {
    api.get(`/api/records/view/${id}/`, { responseType: "blob" })
      .then(async (res) => {
        const type = res.headers["content-type"];
        const headerFilename = res.headers["x-filename"] || res.headers["X-Filename"];
        setFileType(type);
        setFileName(headerFilename);
        const blob = new Blob([res.data], { type });
        if (type && type.startsWith("text")) {
          setContent(await blob.text());
          setFileUrl(null);
        } else {
          setFileUrl(URL.createObjectURL(blob));
          setContent("");
        }
        setLoading(false);
      })
      .catch(() => {
        alert("Access denied or failed to decrypt record.");
        navigate(-1);
      });
  }, [id]);

  // Security: blur on tab switch
  useEffect(() => {
    const handleBlur = () => setBlurred(true);
    const handleFocus = () => setBlurred(false);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Block right-click + shortcuts
  useEffect(() => {
    const blockRC = (e) => e.preventDefault();
    const blockKeys = (e) => {
      if (e.ctrlKey && ["c", "a", "p", "s", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", blockRC);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockRC);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  const displayName = passedFilename || fileName || `Record #${id}`;

  return (
    <div style={{ ...s.page, filter: blurred ? "blur(12px)" : "none", transition: "filter 0.3s" }}>
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
        <div style={s.navRight}>
          <span style={s.securityBadge}>🔒 Secure View Mode</span>
          <button style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>
        </div>
      </nav>

      <div style={s.body}>
        {/* File Info Header */}
        <div style={s.fileCard}>
          <div style={s.fileIconBox}>📄</div>
          <div style={s.fileInfo}>
            <h1 style={s.fileName}>{displayName}</h1>
            <div style={s.fileMeta}>
              {passedPatient && (
                <span style={s.metaChip}>👤 {passedPatient}</span>
              )}
              {passedDate && (
                <span style={s.metaChip}>
                  📅 {new Date(passedDate).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </span>
              )}
              <span style={{ ...s.metaChip, ...s.secureChip }}>🔐 Decrypted · View Only</span>
            </div>
          </div>
        </div>

        {/* Blur Warning */}
        {blurred && (
          <div style={s.blurWarning}>
            🛡️ Screen protected — click here to resume viewing
          </div>
        )}

        {/* Content */}
        <div style={s.contentCard}>
          {loading ? (
            <div style={s.loadingBox}>
              <div style={s.spinner} />
              <p style={s.loadingText}>Decrypting record…</p>
            </div>
          ) : (
            <>
              {content && (
                <pre style={s.textContent}>{content}</pre>
              )}
              {fileUrl && fileType.startsWith("image") && (
                <img
                  src={fileUrl}
                  alt="Medical record"
                  style={s.imageContent}
                  draggable={false}
                />
              )}
              {fileUrl && fileType === "application/pdf" && (
                <iframe
                  src={fileUrl}
                  style={s.pdfContent}
                  title="Medical Record PDF"
                />
              )}
            </>
          )}
        </div>

        {/* Footer Notice */}
        <div style={s.footerNotice}>
          ⚠️ This record is confidential. Unauthorised copying, sharing or printing is prohibited. Access is logged and audited.
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #eef4ff 0%, #f0f4f8 60%)",
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
  securityBadge: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #6ee7b7",
    fontSize: "12px",
    fontWeight: "600",
    padding: "5px 12px",
    borderRadius: "9999px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px 0",
  },

  body: { padding: "40px 48px", maxWidth: "1000px", margin: "0 auto" },

  fileCard: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "24px 28px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  fileIconBox: {
    width: "60px",
    height: "60px",
    background: "#e8f0fe",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    flexShrink: 0,
  },
  fileInfo: { flex: 1 },
  fileName: { fontSize: "20px", fontWeight: "700", color: "#0a3d91", margin: "0 0 10px" },
  fileMeta: { display: "flex", gap: "10px", flexWrap: "wrap" },
  metaChip: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "9999px",
    padding: "4px 12px",
    fontSize: "12px",
    color: "#475569",
    fontWeight: "500",
  },
  secureChip: { background: "#d1fae5", border: "1px solid #6ee7b7", color: "#065f46" },

  blurWarning: {
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: "10px",
    padding: "14px 20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#92400e",
    textAlign: "center",
    marginBottom: "20px",
    cursor: "pointer",
  },

  contentCard: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "32px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e2e8f0", borderTop: "3px solid #0a3d91", borderRadius: "50%" },
  loadingText: { color: "#64748b", fontSize: "14px", margin: 0 },

  textContent: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "24px",
    borderRadius: "12px",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    color: "#0f172a",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    cursor: "default",
    width: "100%",
    margin: 0,
    lineHeight: 1.7,
  },
  imageContent: {
    maxWidth: "100%",
    maxHeight: "70vh",
    borderRadius: "10px",
    objectFit: "contain",
    userSelect: "none",
  },
  pdfContent: {
    width: "100%",
    height: "65vh",
    border: "none",
    borderRadius: "8px",
  },

  footerNotice: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "12px",
    color: "#9a3412",
    fontWeight: "500",
    lineHeight: 1.6,
  },
};