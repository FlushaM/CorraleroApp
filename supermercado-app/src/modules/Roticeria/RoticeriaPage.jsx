import React from "react";
import EntregaPage from "../common/EntregaPage";
import "./RoticeriaPage.css";

const RoticeriaPage = () => {
  return (
    <EntregaPage 
      title="Roticeria" 
      endpoint="entregas" // Endpoint del backend para verdulería (reutilizamos el mismo de carnicería si es común)
    />
  );
};

export default RoticeriaPage;
