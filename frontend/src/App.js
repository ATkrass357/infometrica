import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Unternehmen from "@/pages/Unternehmen";
import Dienstleistungen from "@/pages/Dienstleistungen";
import Kontakt from "@/pages/Kontakt";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unternehmen" element={<Unternehmen />} />
          <Route path="/dienstleistungen" element={<Dienstleistungen />} />
          <Route path="/kontakt" element={<Kontakt />} />
        </Routes>
        <Footer />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
