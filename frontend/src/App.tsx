// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // now your login/register
import DashboardPage from "./pages/DashboardPage";
import VerifyPendingPage from "./pages/VerifyPendingPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verify-pending" element={<VerifyPendingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
