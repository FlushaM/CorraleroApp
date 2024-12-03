import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarniceriaPage from "./modules/Carniceria/CarniceriaPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/carniceria">Carnicería</Link>
        <Link to="/verduleria">Verdulería</Link>
        <Link to="/fiambreria">Fiambrería</Link>
      </nav>
      <Routes>
        <Route path="/carniceria" element={<CarniceriaPage />} />
        <Route path="/verduleria" element={<div>Verdulería</div>} />
        <Route path="/fiambreria" element={<div>Fiambrería</div>} />
      </Routes>
    </Router>
  );
}

export default App;
