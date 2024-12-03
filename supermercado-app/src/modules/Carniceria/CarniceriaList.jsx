import React from "react";

const CarniceriaList = ({ ingresos }) => {
  return (
    <div>
      <h2 className="text-center">Lista de Ingresos</h2>
      {ingresos.length > 0 ? (
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Kilos</th>
              <th>Responsable</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso, index) => (
              <tr key={index}>
                <td>{ingreso.codigo}</td>
                <td>{ingreso.kilo}</td>
                <td>{ingreso.responsable}</td>
                <td>{ingreso.fecha.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted text-center mt-3">No hay ingresos registrados aún.</p>
      )}
    </div>
  );
};

export default CarniceriaList;

