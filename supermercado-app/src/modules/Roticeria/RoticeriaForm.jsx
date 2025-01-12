import React, { useState } from "react";
import Swal from "sweetalert2";

const RoticeriaForm = ({ onAddIngreso }) => {
  const [codigo, setCodigo] = useState("");
  const [kilo, setKilo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Confirmar envío?",
      text: "¿Estás seguro de que deseas enviar este ingreso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoIngreso = {
          codigo,
          kilo,
          responsable: "Usuario Verdulería", // Temporal, se puede cambiar
          fecha: new Date(),
        };
        onAddIngreso(nuevoIngreso);
        setCodigo("");
        setKilo("");
        Swal.fire("¡Enviado!", "El ingreso ha sido enviado correctamente.", "success");
      } else {
        console.log("Ingreso cancelado por el usuario.");
      }
    });
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

export default RoticeriaForm;
