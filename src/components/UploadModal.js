import { useState } from "react";

function UploadModal({ onClose }) {
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report uploaded (frontend demo)");
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Add Medical Report</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Report Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={inputStyle}
          />

          <textarea
            placeholder="Doctor notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={inputStyle}
          />

          <div style={{ marginTop: "20px" }}>
            <button type="submit">Upload</button>
            <button
              type="button"
              style={{ marginLeft: "10px", background: "#64748b" }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  width: "400px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5"
};

export default UploadModal;
