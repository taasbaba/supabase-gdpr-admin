import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// router
import App from "./App";
import SuccessPage from "./SuccessPage";
import VerifyPendingPage from "./VerifyPendingPage";
import DashboardPage from "./DashboardPage";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/verify-pending" element={<VerifyPendingPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  </BrowserRouter>
);
