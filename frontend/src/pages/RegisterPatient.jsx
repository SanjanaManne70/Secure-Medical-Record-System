import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPatient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    age: "",
    phone: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/register/patient/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("Patient Registered Successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧑‍🦱 Patient Registration</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.primaryBtn}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eef5ff, #f8fbff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  title: {
    marginBottom: "25px",
    color: "#0a3d91",
    textAlign: "center"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #d6e4ff",
    fontSize: "14px"
  },

  primaryBtn: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0a3d91",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  },

  error: {
    background: "#ffe6e6",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "15px",
    color: "#b30000",
    textAlign: "center"
  }
};