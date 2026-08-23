import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import EmailVerificationPage from "./pages/EmailVerificationPage/EmailVerificationPage.tsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;