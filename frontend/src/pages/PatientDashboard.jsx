import { Link, useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e6f0ff, #f5f9ff)",
        padding: "20px 40px",
        position: "relative",
      }}
    >
      {/* 🔥 TOP RIGHT LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            background: "transparent",
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            color: "#0a3d91",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#d32f2f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#0a3d91")
          }
        >
          ↩ Sign Out
        </button>

      {/* CENTER CARD */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "80px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#0a3d91",
              marginBottom: "30px",
            }}
          >
            🧑‍⚕️ Patient Dashboard
          </h2>

          <div style={{ display: "grid", gap: "15px" }}>
            <DashboardCard icon="⬆" text="Upload Medical Record" link="/patient/upload" />
            <DashboardCard icon="📁" text="My Records" link="/patient/records" />
            <DashboardCard icon="👨‍⚕️" text="My Doctors" link="/patient/doctors" />
            <DashboardCard icon="🔐" text="Access Control" link="/patient/consent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, text, link }) {
  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
        background: "#f0f6ff",
        padding: "18px 20px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: "500",
        color: "#0a3d91",
        border: "1px solid #d6e4ff",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#dce9ff")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "#f0f6ff")
      }
    >
      <span style={{ fontSize: "20px", marginRight: "12px" }}>
        {icon}
      </span>
      {text}
    </Link>
  );
}