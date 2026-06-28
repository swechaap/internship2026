import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ConsultationRoom from './pages/ConsultationRoom';
import MedicalReports from './pages/MedicalReports';
import Analytics from './pages/Analytics';
import MainLayout from './layouts/MainLayout';
import BookConsultation from './pages/BookConsultation';
import VideoConsultationRoom from './pages/VideoConsultationRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="reports" element={<MedicalReports />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        {/* Full screen routes without MainLayout sidebar */}
        <Route path="/book-consultation" element={<BookConsultation />} />
        <Route path="/consultation/room/:roomId" element={<VideoConsultationRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
