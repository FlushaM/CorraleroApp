import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTrash, FaSyncAlt } from "react-icons/fa"; // Asegúrate de importar FaSyncAlt
import * as XLSX from "xlsx";

import "./DashboardEntregas.css"; // Importar el archivo CSS

const DashboardEntregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);
  const [supermercadoSeleccionado, setSupermercadoSeleccionado] = useState(null);

  const token = localStorage.getItem("token");

  // Función para obtener entregas (ahora está definida correctamente para que se pueda reutilizar)
  const fetchEntregas = async () => {
    try {
      const response = await axios.get("https://corralerointranet.cl/api/entregas/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntregas(response.data);
    } catch (error) {
      console.error("Error al obtener entregas:", error);
    }
  };

  // useEffect para cargar las entregas al inicio
  useEffect(() => {
    fetchEntregas();
  }, [token]);

  const verDetalles = async (idEntrega) => {
    try {
      const response = await axios.get(
        `https://corralerointranet.cl/api/entregas/${idEntrega}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetalles(response.data);
      setEntregaSeleccionada(idEntrega);

      const detallesHtml = `
        <table class="swal2-table">
          <thead>
            <tr>
              <th>Código Producto</th>
              <th>Descripción</th>
              <th>Cantidad (Kilos)</th>
            </tr>
          </thead>
          <tbody>
            ${response.data
              .map(
                (detalle) => `
                  <tr>
                    <td>${detalle.codigo_producto}</td>
                    <td>${detalle.descripcion}</td>
                    <td>${detalle.cantidad} kg</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;

      Swal.fire({
        title: `Detalles de la Entrega #${idEntrega}`,
        html: detallesHtml,
        showCancelButton: true,
        confirmButtonText: "Exportar a Excel",
        cancelButtonText: "Cerrar",
      }).then((result) => {
        if (result.isConfirmed) {
          exportarExcel(response.data, idEntrega);
        }
      });
    } catch (error) {
      console.error("Error al obtener detalles de la entrega:", error);
      Swal.fire("Error", "No se pudieron cargar los detalles.", "error");
    }
  };

  const exportarExcel = (data, idEntrega) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((detalle) => ({
        "Código Producto": detalle.codigo_producto,
        "Descripción": detalle.descripcion,
        "Cantidad (Kilos)": detalle.cantidad,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DetallesEntrega");
    XLSX.writeFile(workbook, `Entrega_${idEntrega}.xlsx`);
    Swal.fire("Éxito", "Archivo descargado correctamente", "success");
  };

  const marcarRevisado = async (idEntrega) => {
    Swal.fire({
      title: "¿Marcar como revisado?",
      text: "¿Deseas marcar esta entrega como revisada?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, marcar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `https://corralerointranet.cl/api/entregas/${idEntrega}`,
            { estado: "revisado" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Éxito", "Entrega marcada como revisada", "success");
          setEntregas((prev) =>
            prev.map((entrega) =>
              entrega.id_entrega === idEntrega
                ? { ...entrega, estado: "revisado" }
                : entrega
            )
          );
        } catch (error) {
          console.error("Error al marcar como revisado:", error);
          Swal.fire("Error", "No se pudo marcar como revisado.", "error");
        }
      }
    });
  };

  const eliminarEntrega = async (idEntrega) => {
    Swal.fire({
      title: "¿Eliminar entrega?",
      text: "Esta acción no se puede deshacer. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://corralerointranet.cl/api/entregas/${idEntrega}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Eliminado", "Entrega eliminada correctamente", "success");
          setEntregas((prev) =>
            prev.filter((entrega) => entrega.id_entrega !== idEntrega)
          );
        } catch (error) {
          console.error("Error al eliminar entrega:", error);
          Swal.fire("Error", "No se pudo eliminar la entrega.", "error");
        }
      }
    });
  };

  return (
    <div className="dashboard-entregas">
      <h1 className="dashboard-title">Tabla de Entregas</h1>
      <div className="filters-container">
        <div>
          <button
            onClick={() => setSupermercadoSeleccionado("corralero1")}
            className="btn btn-success"
          >
            Corralero 1
          </button>
          <button
            onClick={() => setSupermercadoSeleccionado("corralero2")}
            className="btn btn-primary"
          >
            Corralero 2
          </button>
        </div>
        <button
          className="refresh-button"
          onClick={fetchEntregas} // Aquí está correctamente definida y vinculada
          title="Refrescar tabla"
        >
          <FaSyncAlt style={{ marginRight: "5px" }} />
          Refrescar
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID Entrega</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Supermercado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas
            .filter((entrega) =>
              supermercadoSeleccionado
                ? entrega.supermercado === supermercadoSeleccionado
                : true
            )
            .map((entrega) => (
              <tr key={entrega.id_entrega}>
                <td>{entrega.id_entrega}</td>
                <td>{new Date(entrega.fecha).toLocaleString()}</td>
                <td>{entrega.responsable}</td>
                <td>{entrega.supermercado}</td>
                <td>{entrega.estado || "pendiente"}</td>
                <td>
                  <button
                    className="btn btn-info me-2"
                    onClick={() => verDetalles(entrega.id_entrega)}
                  >
                    <FaEye /> Ver
                  </button>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => marcarRevisado(entrega.id_entrega)}
                  >
                    <FaCheck /> Revisar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarEntrega(entrega.id_entrega)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardEntregas;
