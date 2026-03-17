import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const roleRes = await api.get("/api/users/me/");
      const role = roleRes.data.role;

      localStorage.setItem("role", role);

      if (role === "doctor") {
        navigate("/doctor");
      } else if (role === "patient") {
        navigate("/patient");
      } else {
        setError("User role not recognized.");
      }

    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Secure Medical Records</h2>
        <p style={styles.subtitle}>Hospital Staff & Patient Portal</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.divider}></div>

        <p style={styles.newUser}>New User?</p>

        <div style={styles.registerButtons}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/register/patient")}
          >
            Register as Patient
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/register/doctor")}
          >
            Register as Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f4c81, #3b82f6)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    color: "#0f4c81",
  },
  subtitle: {
    marginBottom: "25px",
    fontSize: "14px",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0f4c81",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #0f4c81",
    backgroundColor: "white",
    color: "#0f4c81",
    cursor: "pointer",
    fontSize: "13px",
  },
  registerButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  divider: {
    margin: "20px 0",
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
  newUser: {
    fontSize: "14px",
    marginBottom: "10px",
    color: "#374151",
  },
  error: {
    marginTop: "10px",
    color: "red",
    fontSize: "13px",
  },
};