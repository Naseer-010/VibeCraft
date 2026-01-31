import { FaHome, FaFileMedical, FaUserMd } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar({ role }) {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "230px",
      background: "var(--sidebar)",
      color: "var(--text)",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>
      <h2 style={{ marginBottom: "40px" }}>HealthChain</h2>

      <div
        style={{ marginBottom: "20px", cursor: "pointer" }}
        onClick={() => navigate(role === "patient" ? "/patient" : "/doctor")}
      >
        <FaHome /> <span style={{ marginLeft: "10px" }}>Dashboard</span>
      </div>

      {role === "patient" && (
        <div
          style={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={() => navigate("/patient/records")}
        >
          <FaFileMedical /> <span style={{ marginLeft: "10px" }}>My Records</span>
        </div>
      )}

      {role === "doctor" && (
        <div
          style={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={() => navigate("/doctor/patient")}
        >
          <FaUserMd /> <span style={{ marginLeft: "10px" }}>Patients</span>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
