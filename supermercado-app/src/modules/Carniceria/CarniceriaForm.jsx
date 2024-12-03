import React, { useState } from "react";

const CarniceriaForm = ({ onAddIngreso }) => {
  const [codigo, setCodigo] = useState("");
  const [kilo, setKilo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoIngreso = {
      codigo,
      kilo,
      responsable: "Juan Pérez", // Temporal, se puede cambiar
      fecha: new Date(),
    };
    onAddIngreso(nuevoIngreso);
    setCodigo("");
    setKilo("");
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
      </div>
      <div className="col-md-6">
        <input
          type="number"
          className="form-control"
          placeholder="Kilos"
          value={kilo}
          onChange={(e) => setKilo(e.target.value)}
          required
        />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary w-100">
          Agregar
        </button>
      </div>
    </form>
  );
};

export default CarniceriaForm;

