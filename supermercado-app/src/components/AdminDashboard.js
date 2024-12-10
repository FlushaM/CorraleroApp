import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Sidebar } from "./ui/Sidebar";
import { Header } from "./ui/Header";


const AdminDashboard = () => {
  const [entregas, setEntregas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetalles(response.data);
      setEntregaSeleccionada(idEntrega);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener detalles de la entrega:", error);
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setDetalles([]);
    setEntregaSeleccionada(null);
  };

  const exportarExcel = () => {
    if (!detalles || detalles.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(detalles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DetallesEntrega");

    const nombreArchivo = `Entrega_${entregaSeleccionada}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
    alert("Archivo descargado");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Panel de Control</h1>

          {/* Tabla de Entregas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">ID Entrega</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Responsable</th>
                  <th className="px-6 py-3">Supermercado</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entregas.map((entrega) => (
                  <tr key={entrega.id_entrega} className="border-b">
                    <td className="px-6 py-3">{entrega.id_entrega}</td>
                    <td className="px-6 py-3">
                      {new Date(entrega.fecha).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">{entrega.responsable}</td>
                    <td className="px-6 py-3">{entrega.supermercado}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => verDetalles(entrega.id_entrega)}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal para Detalles */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={cerrarModal}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold mb-4">
                  Detalles de la Entrega #{entregaSeleccionada}
                </h2>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-2">Código Producto</th>
                      <th className="px-4 py-2">Descripción</th>
                      <th className="px-4 py-2">Cantidad (Kilos)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{detalle.codigo_producto}</td>
                        <td className="px-4 py-2">{detalle.descripcion}</td>
                        <td className="px-4 py-2">{detalle.cantidad} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={exportarExcel}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Exportar a Excel
                  </button>
                  <button
                    onClick={cerrarModal}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
