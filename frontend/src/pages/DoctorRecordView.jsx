import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoctorRecordView() {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedFilename = location.state?.filename;

  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH DECRYPTED FILE */
  useEffect(() => {

    api.get(`/api/records/view/${id}/`, {
      responseType: "blob"
    })
    .then(async res => {

      const type = res.headers["content-type"];

      const headerFilename =
        res.headers["x-filename"] ||
        res.headers["X-Filename"];

      setFileType(type);
      setFileName(headerFilename);

      const blob = new Blob([res.data], { type });

      if (type && type.startsWith("text")) {

        const text = await blob.text();
        setContent(text);
        setFileUrl(null);

      } else {

        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setContent("");

      }

      setLoading(false);

    })
    .catch(err => {
      console.error(err);
      alert("Access denied or failed to decrypt");
      setLoading(false);
    });

  }, [id]);


  /* DISABLE RIGHT CLICK */
  useEffect(() => {

    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };

  }, []);


  /* DISABLE COPY SHORTCUTS */
  useEffect(() => {

    const blockShortcuts = (e) => {

      if (
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "a") ||
        (e.ctrlKey && e.key === "p")
      ) {
        e.preventDefault();
      }

    };

    document.addEventListener("keydown", blockShortcuts);

    return () => {
      document.removeEventListener("keydown", blockShortcuts);
    };

  }, []);


  /* BLUR SCREEN WHEN TAB INACTIVE */
  useEffect(() => {

    const handleBlur = () => {
      document.body.style.filter = "blur(10px)";
    };

    const handleFocus = () => {
      document.body.style.filter = "none";
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };

  }, []);


  return (
    <div style={styles.page}>

      <button
        onClick={() => navigate(-1)}
        style={styles.backBtn}
      >
        ⬅ Back
      </button>

      <h2 style={styles.title}>
        📄 {passedFilename || fileName || `Medical Record #${id}`}
      </h2>

      {loading ? (
        <p>Decrypting...</p>
      ) : (

        <>
          {content && (
            <pre style={styles.recordBox}>
              {content}
            </pre>
          )}

          {fileUrl && fileType.startsWith("image") && (
            <img
              src={fileUrl}
              alt="record"
              style={{ maxWidth: "100%" }}
              draggable="false"
            />
          )}

          {fileUrl && fileType === "application/pdf" && (
            <iframe
              src={fileUrl}
              width="100%"
              height="600px"
            />
          )}
        </>

      )}

    </div>
  );
}


const styles = {

  page: {
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif"
  },

  title: {
    marginBottom: "20px"
  },

  backBtn: {
    background: "#0a3d91",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "15px"
  },

  recordBox: {
    background: "#f4f4f4",
    padding: "20px",
    whiteSpace: "pre-wrap",
    borderRadius: "6px",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    cursor: "default"
  }

};