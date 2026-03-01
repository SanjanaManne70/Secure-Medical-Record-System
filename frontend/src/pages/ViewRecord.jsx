import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ViewRecord() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/records/view/${id}/`)
      .then(res => setContent(res.data.plaintext))
      .catch(() => setError("Access denied or record not found"));
  }, [id]);

  return (
    <div style={{ padding: 40 }}>
      <h2>📄 Medical Record #{id}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {content ? (
        <pre style={{ background: "#f4f4f4", padding: 20 }}>
          {content}
        </pre>
      ) : (
        !error && <p>Decrypting record...</p>
      )}
    </div>
  );
}