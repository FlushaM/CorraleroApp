import React, { useState } from "react";
import CarniceriaForm from "./CarniceriaForm";
import CarniceriaList from "./CarniceriaList";

const CarniceriaPage = () => {
  const [ingresos, setIngresos] = useState([]); // Estado inicial vacío

  const handleAddIngreso = (nuevoIngreso) => {
    setIngresos((prev) => [...prev, nuevoIngreso]);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Carnicería</h1>
      <div className="card shadow p-4">
        <CarniceriaForm onAddIngreso={handleAddIngreso} />
        <hr />
        <CarniceriaList ingresos={ingresos} />
      </div>
    </div>
  );
};

export default CarniceriaPage;