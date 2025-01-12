import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [entregas, setEntregas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supermercadoSeleccionado, setSupermercadoSeleccionado] = useState(null);

  // Token desde localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/entregas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEntregas(response.data);
      } catch (error) {
        console.error("Error al obtener entregas:", error);
      }
    };

    fetchEntregas();
  }, [token]);
  const verDetalles = async (idEntrega) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/entregas/${idEntrega}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Actualizar el estado con los detalles obtenidos
      setDetalles(response.data);
      setEntregaSeleccionada(idEntrega);
  
      // Mostrar el modal con SweetAlert
      const detallesHtml = `
        <table class="swal2-table" style="width: 100%; text-align: left; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 8px;">Código Producto</th>
              <th style="border: 1px solid black; padding: 8px;">Descripción</th>
              <th style="border: 1px solid black; padding: 8px;">Cantidad (Kilos)</th>
            </tr>
          </thead>
          <tbody>
            ${response.data
              .map(
                (detalle) => `
                  <tr>
                    <td style="border: 1px solid black; padding: 8px;">${detalle.codigo_producto}</td>
                    <td style="border: 1px solid black; padding: 8px;">${detalle.descripcion}</td>
                    <td style="border: 1px solid black; padding: 8px;">${detalle.cantidad} kg</td>
                  </tr>
                `
              )
              .join('')}
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

  const cerrarModal = () => {
    setIsModalOpen(false);
    setDetalles([]);
    setEntregaSeleccionada(null);
  };
  const exportarExcel = () => {
    if (!detalles || detalles.length === 0) {
      Swal.fire("Advertencia", "No hay datos para exportar", "warning");
      return;
    }
  
    // Crear hoja de cálculo a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet(
      detalles.map((detalle) => ({
        "Código Producto": detalle.codigo_producto,
        "Descripción": detalle.descripcion,
        "Cantidad (Kilos)": detalle.cantidad,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DetallesEntrega");
  
    // Generar el archivo
    const nombreArchivo = `Entrega_${entregaSeleccionada}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
  
    Swal.fire("Éxito", "Archivo descargado correctamente", "success");
  };
  const marcarRevisado = async (idEntrega) => {
    Swal.fire({
      title: '¿Marcar como revisado?',
      text: '¿Deseas marcar esta entrega como revisada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`http://localhost:5000/api/entregas/${idEntrega}`, { estado: 'revisado' }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Éxito', 'Entrega marcada como revisada', 'success');
          setEntregas((prev) =>
            prev.map((entrega) =>
              entrega.id_entrega === idEntrega ? { ...entrega, estado: 'revisado' } : entrega
            )
          );
        } catch (error) {
          console.error('Error al marcar como revisado:', error);
          Swal.fire('Error', 'No se pudo marcar como revisado.', 'error');
        }
      }
    });
  };
  
  const eliminarEntrega = async (idEntrega) => {
    Swal.fire({
      title: '¿Eliminar entrega?',
      text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/entregas/${idEntrega}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Eliminado', 'Entrega eliminada correctamente', 'success');
          setEntregas((prev) => prev.filter((entrega) => entrega.id_entrega !== idEntrega));
        } catch (error) {
          console.error('Error al eliminar entrega:', error);
          Swal.fire('Error', 'No se pudo eliminar la entrega.', 'error');
        }
      }
    });
  };
  return (
    <div>
      <h1>Dashboard del Administrador</h1>

      {/* Botones de selección de supermercado */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setSupermercadoSeleccionado("corralero1")}
          className="btn btn-success"
          style={{ marginRight: "10px" }}
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

      <table className="table table-striped">
        <thead className="table-dark">
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

      {isModalOpen && (
        <div className="modal">
          <h2>Detalles de la Entrega #{entregaSeleccionada}</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Código Producto</th>
                <th>Descripción</th>
                <th>Cantidad (Kilos)</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.codigo_producto}</td>
                  <td>{detalle.descripcion}</td>
                  <td>{detalle.cantidad} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success me-2" onClick={exportarExcel}>
            Exportar a Excel
          </button>
          <button className="btn btn-danger" onClick={cerrarModal}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
