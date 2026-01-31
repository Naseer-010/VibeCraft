function RecordCard({ type, doctor, date, visible, onToggle }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}>
      <h3>{type}</h3>
      <p>Doctor: {doctor}</p>
      <p>Date: {date}</p>

      <p>
        Status:{" "}
        <strong style={{ color: visible ? "#22c55e" : "#ef4444" }}>
          {visible ? "Public" : "Private"}
        </strong>
      </p>

      <button onClick={onToggle}>
        {visible ? "Hide" : "Make Public"}
      </button>
    </div>
  );
}

export default RecordCard;
