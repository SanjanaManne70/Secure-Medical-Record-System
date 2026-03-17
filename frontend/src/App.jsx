import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import UploadRecord from "./pages/UploadRecord";
import MyRecords from "./pages/MyRecords";
import MyDoctors from "./pages/MyDoctors";
import AccessControl from "./pages/AccessControl";
import ViewRecord from "./pages/ViewRecord";
import DoctorRecordView from "./pages/DoctorRecordView";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";

export default function App() {
  return (
    <Routes>

      {/* 🔐 DEFAULT → LOGIN */}
      <Route path="/" element={<Login />} />

      {/* 👨‍⚕️ DOCTOR */}
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor/records/:id" element={<ViewRecord />} />

      {/* 🧑‍🦱 PATIENT */}
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient/upload" element={<UploadRecord />} />
      <Route path="/patient/records" element={<MyRecords />} />
      <Route path="/patient/doctors" element={<MyDoctors />} />
      <Route path="/patient/consent" element={<AccessControl />} />

      <Route path="/doctor/records/:id" element={<DoctorRecordView />} />
      <Route path="/register/patient" element={<RegisterPatient />} />
      <Route path="/register/doctor" element={<RegisterDoctor />} />

      {/* ❌ FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}