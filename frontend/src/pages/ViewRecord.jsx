import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ViewRecord() {
  const { id } = useParams();

  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState("");

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
    let url = "";

    api.get(`/api/records/view/${id}/`, {
      responseType: "blob"
    })
    .then(async (res) => {
      let type = res.headers["content-type"];

      if (!type) type = "application/octet-stream";

      setFileType(type);

      if (type.startsWith("text")) {
        const text = await res.data.text();
        setTextContent(text);
      } else {
        const blob = new Blob([res.data], { type });
        url = URL.createObjectURL(blob);
        setFileUrl(url);
      }
    })
    .catch(() => setError("Access denied or record not found"));

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]);

  return (
    <div style={{ padding: 40 }}>
      <h2>📄 Medical Record #{id}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!fileUrl && !textContent && !error && (
        <p>Decrypting record...</p>
      )}

      {/* IMAGE */}
      {fileType.startsWith("image") && fileUrl && (
        <img
          src={fileUrl}
          alt="record"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
          draggable={false}
        />
      )}

      {/* PDF */}
      {fileType === "application/pdf" && fileUrl && (
        <iframe
          src={fileUrl}
          width="100%"
          height="600px"
          style={{ border: "none" }}
          title="PDF"
        />
      )}

      {/* TEXT */}
      {fileType.startsWith("text") && textContent && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "20px",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
            userSelect: "none"
          }}
        >
          {textContent}
        </pre>
      )}
    </div>
  );
}