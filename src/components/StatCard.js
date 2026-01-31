function StatCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "14px",
        width: "220px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <h3>{value}</h3>
      <p style={{ color: "#64748b" }}>{title}</p>
    </div>
  );
}

export default StatCard;
