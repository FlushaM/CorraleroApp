import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarniceriaPage from "./modules/Carniceria/CarniceriaPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/carniceria">Carnicería</Link>
        <Link to="/verduleria">Verdulería</Link>
        <Link to="/fiambreria">Fiambrería</Link>
        <Link to="/dashboard">Dashboard</Link> {/* Agregamos el enlace al Dashboard */}
      </nav>
      <Routes>
        <Route path="/carniceria" element={<CarniceriaPage />} />
        <Route path="/verduleria" element={<div>Verdulería</div>} />
        <Route path="/fiambreria" element={<div>Fiambrería</div>} />
        <Route path="/dashboard" element={<AdminDashboard />} /> {/* Ruta para el Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;

