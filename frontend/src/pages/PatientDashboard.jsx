import { Link, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    icon: "⬆️",
    label: "Upload Record",
    sub: "Add a new medical file",
    link: "/patient/upload",
    color: "#0d9488",
    bg: "#ccfbf1",
  },
  {
    icon: "📁",
    label: "My Records",
    sub: "Browse your medical history",
    link: "/patient/records",
    color: "#0a3d91",
    bg: "#e8f0fe",
  },
  {
    icon: "👨‍⚕️",
    label: "My Doctors",
    sub: "Manage assigned doctors",
    link: "/patient/doctors",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    icon: "🔐",
    label: "Access Control",
    sub: "Control who sees your data",
    link: "/patient/consent",
    color: "#b45309",
    bg: "#fef3c7",
  },
];

export default function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const patientName = localStorage.getItem("name") || "Patient";

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
        <div style={s.navRight}>
          <span style={s.navBadge}>Patient Portal</span>
          <button onClick={handleLogout} style={s.logoutBtn}>
            Sign Out →
          </button>
        </div>
      </nav>

      <div style={s.body}>
        {/* Hero greeting */}
        <div style={s.hero}>
          <div style={s.heroAvatar}>{patientName.charAt(0).toUpperCase()}</div>
          <div>
            <h1 style={s.heroGreeting}>Good day, {patientName}</h1>
            <p style={s.heroSub}>Your health records are safe and accessible.</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { label: "Records Stored", value: "—", icon: "📋" },
            { label: "Access Grants", value: "—", icon: "🔐" },
            { label: "Doctors Linked", value: "—", icon: "👨‍⚕️" },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <span style={s.statIcon}>{stat.icon}</span>
              <div>
                <p style={s.statValue}>{stat.value}</p>
                <p style={s.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nav Cards */}
        <h2 style={s.sectionTitle}>Quick Actions</h2>
        <div style={s.grid}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.link} to={item.link} style={s.cardLink}>
              <div style={s.card}>
                <div style={{ ...s.cardIconBox, background: item.bg, color: item.color }}>
                  <span style={s.cardIcon}>{item.icon}</span>
                </div>
                <div style={s.cardBody}>
                  <p style={{ ...s.cardLabel, color: item.color }}>{item.label}</p>
                  <p style={s.cardSub}>{item.sub}</p>
                </div>
                <span style={s.cardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer notice */}
        <div style={s.notice}>
          🔒 All your records are encrypted and stored securely. Only doctors you authorise can view your data.
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #eef4ff 0%, #f0f4f8 60%, #e8f5f3 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#0f172a",
  },

  // Nav
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
  navBadge: {
    background: "#e8f0fe",
    color: "#0a3d91",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 12px",
    borderRadius: "9999px",
    border: "1px solid #c7d7fc",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px 0",
    transition: "color 0.2s",
  },

  // Body
  body: { padding: "40px 48px", maxWidth: "1100px", margin: "0 auto" },

  // Hero
  hero: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" },
  heroAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1a56c4, #0a3d91)",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroGreeting: { fontSize: "26px", fontWeight: "700", color: "#0a3d91", margin: "0 0 4px" },
  heroSub: { fontSize: "14px", color: "#64748b", margin: 0 },

  // Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
  },
  statIcon: { fontSize: "26px" },
  statValue: { fontSize: "22px", fontWeight: "700", color: "#0a3d91", margin: "0 0 2px" },
  statLabel: { fontSize: "12px", color: "#94a3b8", margin: 0, fontWeight: "500" },

  // Section
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "16px",
    letterSpacing: "0.2px",
  },

  // Grid Cards
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  cardLink: { textDecoration: "none" },
  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "22px 24px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 2px 8px rgba(10,61,145,0.05)",
    cursor: "pointer",
    transition: "box-shadow 0.2s, transform 0.15s",
  },
  cardIconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardIcon: { fontSize: "24px" },
  cardBody: { flex: 1 },
  cardLabel: { fontSize: "15px", fontWeight: "700", margin: "0 0 3px" },
  cardSub: { fontSize: "13px", color: "#64748b", margin: 0 },
  cardArrow: { fontSize: "18px", color: "#94a3b8" },

  // Notice
  notice: {
    background: "#e8f0fe",
    border: "1px solid #c7d7fc",
    borderRadius: "12px",
    padding: "16px 20px",
    fontSize: "13px",
    color: "#1e40af",
    fontWeight: "500",
  },
};