import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientRecords from "./pages/PatientRecords";
import DoctorPatientView from "./pages/DoctorPatientView";
import AddReport from "./pages/AddReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/doctor/patient" element={<DoctorPatientView />} />
        <Route path="/doctor/add-report" element={<AddReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
