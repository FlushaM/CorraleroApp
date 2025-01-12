import React from "react";
import EntregaPage from "../common/EntregaPage";
import "./VerduleriaPage.css";

const VerduleriaPage = () => {
  return (
    <EntregaPage 
      title="Verdulería" 
      endpoint="entregas" // Endpoint del backend para verdulería (reutilizamos el mismo de carnicería si es común)
    />
  );
};

export default VerduleriaPage;
