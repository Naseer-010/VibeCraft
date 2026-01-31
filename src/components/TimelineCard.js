function TimelineCard({ type, doctor, date, visible }) {
  return (
    <div style={{ display: "flex", marginBottom: "30px" }}>
      
      {/* timeline dot */}
      <div style={{
        width: "12px",
        height: "12px",
        background: visible ? "#2563eb" : "#94a3b8",
        borderRadius: "50%",
        marginTop: "6px",
        marginRight: "20px"
      }} />

      {/* content */}
      <div style={{
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        width: "100%",
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)"
      }}>
        <h4>{type}</h4>
        <p>Doctor: {doctor}</p>
        <p>Date: {date}</p>

        <p style={{
          color: visible ? "#22c55e" : "#ef4444",
          fontWeight: "bold"
        }}>
          {visible ? "Public" : "Private"}
        </p>
      </div>
    </div>
  );
}

export default TimelineCard;
