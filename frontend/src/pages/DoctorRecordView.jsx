import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoctorRecordView() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/records/view/${id}/`)
      .then(res => {
        setContent(res.data.plaintext || res.data.content);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Access denied or failed to decrypt");
        setLoading(false);
      });
  }, [id]);

  return (
    <div style={{ padding: 40 }}>
      <h2>📄 Medical Record #{id}</h2>

      {loading ? (
        <p>Decrypting...</p>
      ) : (
        <pre style={{
          background: "#f4f4f4",
          padding: 20,
          whiteSpace: "pre-wrap"
        }}>
          {content}
        </pre>
      )}
    </div>
  );
}