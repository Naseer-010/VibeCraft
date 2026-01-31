import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="patient" title="Patient Dashboard">
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle} onClick={() => navigate("/patient/records")}>
          📄 Medical Records
        </div>

        <div style={cardStyle}>
          🔐 Privacy Control
        </div>
      </div>
    </DashboardLayout>
  );
}

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  width: "220px",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
};

export default PatientDashboard;
