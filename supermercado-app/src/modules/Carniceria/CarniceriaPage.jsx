import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CarniceriaPage.css";
import Header from "../../components/Header";



const CarniceriaPage = () => {
  const [codigo, setCodigo] = useState("");
  const [kilos, setKilos] = useState("");
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState({ nombre: "", email: "" }); // Estado para almacenar el usuario

  // Recuperar el token y usuario del localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user")); // Recupera el usuario guardado en localStorage

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const validarProducto = async () => {
    if (!codigo || !kilos || parseFloat(kilos) <= 0) {
      setError("Por favor, ingresa un código válido y una cantidad mayor a 0.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/productos/${codigo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.valido) {
        const nuevoProducto = { ...response.data.producto, kilos: parseFloat(kilos) };
        setProductos([...productos, nuevoProducto]);
        setCodigo("");
        setKilos("");
        setError("");
      } else {
        setError("Código inválido");
      }
    } catch (error) {
      console.error("Error al validar producto:", error);
      setError("Error al validar producto");
    }
  };

  const eliminarProducto = (codigo) => {
    const nuevaLista = productos.filter((producto) => producto.codigo !== codigo);
    setProductos(nuevaLista);
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditando(producto);
    setKilos(producto.kilos);
    setIsModalOpen(true);
  };

  const guardarEdicion = () => {
    const nuevaLista = productos.map((producto) =>
      producto.codigo === productoEditando.codigo ? { ...producto, kilos: parseFloat(kilos) } : producto
    );
    setProductos(nuevaLista);
    cerrarModal();
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setProductoEditando(null);
    setKilos("");
  };

  const enviarEntrega = async () => {
    if (productos.length === 0) {
      Swal.fire("Error", "No hay productos en la lista para enviar.", "error");
      return;
    }

    Swal.fire({
      title: "¿Confirmar envío?",
      text: "¿Estás seguro de que deseas enviar esta entrega?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "http://localhost:5000/api/entregas",
            { productos, responsable: user.nombre || user.email }, // Usa el nombre o email del usuario
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire("¡Éxito!", "Entrega enviada correctamente.", "success");
          setProductos([]);
        } catch (error) {
          console.error("Error al enviar la entrega:", error);
          Swal.fire("Error", "Hubo un problema al enviar la entrega.", "error");
        }
      }
    });
  };

  return (
    <div>
      <Header logo="/img/LOGOCORRALERO.png" userName={user.nombre || user.email} />
      <div className="page-container">
        <div className="container">
          <h1>Carnicería</h1>
          <div className="form-container">
            <input
              type="text"
              placeholder="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <input
              type="number"
              placeholder="Kilos"
              value={kilos}
              onChange={(e) => setKilos(e.target.value)}
            />
            <button className="btn btn-primary" onClick={validarProducto}>
              Agregar
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          {/* Contenedor para hacer la tabla desplazable */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Kilos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.codigo}>
                    <td>{producto.codigo}</td>
                    <td>{producto.descripcion}</td>
                    <td>{`${producto.kilos} kg`}</td>
                    <td>
                      <button className="btn btn-warning">
                        <FaEdit /> Modificar
                      </button>
                      <button className="btn btn-danger">
                        <FaTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-success">Enviar Entrega</button>
        </div>
      </div>
    </div>
  );
};

export default CarniceriaPage;
