import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UploadModal from "../components/UploadModal";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout role="doctor" title="Doctor Dashboard">
      
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <StatCard title="Total Patients" value="24" icon="👥" />
        <StatCard title="Reports Created" value="128" icon="📄" />
        <StatCard title="Pending Reviews" value="6" icon="⏳" />
      </div>

      <button onClick={() => navigate("/doctor/patient")}>
        View Patient History
      </button>

     <button onClick={() => setShowModal(true)}>
        Add New Report
     </button>

     {showModal && <UploadModal onClose={() => setShowModal(false)} />}

    </DashboardLayout>
  );
}

export default DoctorDashboard;
