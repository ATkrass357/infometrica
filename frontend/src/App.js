import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Unternehmen from "@/pages/Unternehmen";
import Dienstleistungen from "@/pages/Dienstleistungen";
import Karriere from "@/pages/Karriere";
import Kontakt from "@/pages/Kontakt";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/unternehmen" element={<><Navbar /><Unternehmen /><Footer /></>} />
          <Route path="/dienstleistungen" element={<><Navbar /><Dienstleistungen /><Footer /></>} />
          <Route path="/karriere" element={<><Navbar /><Karriere /><Footer /></>} />
          <Route path="/kontakt" element={<><Navbar /><Kontakt /><Footer /></>} />
          <Route path="/impressum" element={<><Navbar /><Impressum /><Footer /></>} />
          <Route path="/datenschutz" element={<><Navbar /><Datenschutz /><Footer /></>} />
          
          {/* Admin Login (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
