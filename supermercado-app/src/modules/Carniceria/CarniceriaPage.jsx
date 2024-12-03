import React, { useState } from "react";
import CarniceriaForm from "./CarniceriaForm";
import CarniceriaList from "./CarniceriaList";

const CarniceriaPage = () => {
  const [ingresos, setIngresos] = useState([]);

  const handleAddIngreso = (nuevoIngreso) => {
    setIngresos((prev) => [...prev, nuevoIngreso]);
  };

  const handleEnviarEntrega = () => {
    if (ingresos.length === 0) {
      alert("No hay ingresos para enviar.");
      return;
    }

    const entrega = {
      fecha: new Date().toLocaleString(),
      cortes: ingresos,
    };

    // Aquí se envían los datos a la base de datos (implementaremos esto más adelante)
    console.log("Enviando entrega:", entrega);

    // Reinicia la tabla después de enviar
    setIngresos([]);
    alert("Entrega enviada con éxito.");
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Carnicería</h1>
      <div className="card shadow p-4">
        <CarniceriaForm onAddIngreso={handleAddIngreso} />
        <hr />
        <CarniceriaList ingresos={ingresos} />
        <div className="text-center mt-3">
          <button
            className="btn btn-success"
            onClick={handleEnviarEntrega}
          >
            Enviar Entrega
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarniceriaPage;
