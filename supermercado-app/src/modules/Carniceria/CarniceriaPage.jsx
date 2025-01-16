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
  const [token, setToken] = useState("");
  const [user, setUser] = useState({ nombre: "", email: "" });

  // Guardar lista en localStorage
  const guardarListaEnLocalStorage = (productos) => {
    localStorage.setItem("listaProductos", JSON.stringify(productos));
  };

  // Cargar lista desde localStorage
  const cargarListaDesdeLocalStorage = () => {
    const listaGuardada = localStorage.getItem("listaProductos");
    return listaGuardada ? JSON.parse(listaGuardada) : [];
  };

  // Recuperar el token, usuario y lista guardada desde el localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(storedUser);
    }

    // Cargar la lista de productos si existe
    const listaGuardada = cargarListaDesdeLocalStorage();
    if (listaGuardada.length > 0) {
      setProductos(listaGuardada);
    }
  }, []);

  const validarProducto = async () => {
    if (!codigo || !kilos || parseFloat(kilos) <= 0) {
      setError("Por favor, ingresa un código válido y una cantidad mayor a 0.");
      return;
    }
  
    try {
      const response = await axios.get(`https://corralerointranet.cl/api/productos/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.valido) {
        // Verificar que el producto pertenece al mismo supermercado
        if (response.data.producto.supermercado !== user.supermercado) {
          Swal.fire(
            "Error",
            `El producto con el código ${codigo} no pertenece a tu supermercado.`,
            "error"
          );
          setCodigo(""); // Limpiar el campo del código
          return;
        }
  
        const nuevoPeso = parseFloat(kilos);
  
        // Verificar si el código ya existe en la lista
        const productoExistente = productos.find((producto) => producto.codigo === codigo);
  
        if (productoExistente) {
          // Si el producto ya existe, suma los kilos al peso actual
          const nuevaLista = productos.map((producto) =>
            producto.codigo === codigo
              ? { ...producto, kilos: producto.kilos + nuevoPeso }
              : producto
          );
          setProductos(nuevaLista);
          guardarListaEnLocalStorage(nuevaLista); // Guardar en localStorage
          Swal.fire("Actualizado", "El peso se ha actualizado correctamente.", "success");
        } else {
          // Si el producto no existe, agregarlo como nuevo
          const nuevoProducto = { ...response.data.producto, kilos: nuevoPeso };
          const nuevaLista = [...productos, nuevoProducto];
          setProductos(nuevaLista);
          guardarListaEnLocalStorage(nuevaLista); // Guardar en localStorage
          Swal.fire("Agregado", "Producto agregado correctamente.", "success");
        }
  
        // Limpiar los campos de entrada
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
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. ¿Deseas eliminar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaLista = productos.filter((producto) => producto.codigo !== codigo);
        setProductos(nuevaLista);
        guardarListaEnLocalStorage(nuevaLista); // Guardar en localStorage
        Swal.fire("Eliminado", "Producto eliminado correctamente.", "success");
      }
    });
  };

  const abrirSweetAlertEdicion = (producto) => {
    Swal.fire({
      title: "Editar Producto",
      html: `
        <label>Código: ${producto.codigo}</label><br />
        <label for="kilosInput">Kilos:</label>
        <input id="kilosInput" type="number" class="swal2-input" value="${producto.kilos}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nuevoKilos = parseFloat(document.getElementById("kilosInput").value);

        if (isNaN(nuevoKilos) || nuevoKilos <= 0) {
          Swal.showValidationMessage("Por favor, ingresa un peso válido.");
          return false;
        }

        return { nuevoKilos };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nuevoKilos } = result.value;

        // Actualizar solo el peso
        const nuevaLista = productos.map((p) =>
          p.codigo === producto.codigo ? { ...p, kilos: nuevoKilos } : p
        );
        setProductos(nuevaLista);
        guardarListaEnLocalStorage(nuevaLista); // Guardar en localStorage
        Swal.fire("Modificado", "El peso ha sido actualizado correctamente.", "success");
      }
    });
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
            "https://corralerointranet.cl/api/entregas",
            { productos, responsable: user.nombre || user.email },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("¡Éxito!", "Entrega enviada correctamente.", "success");
          setProductos([]);
          guardarListaEnLocalStorage([]); // Limpiar localStorage
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
          className="form-control mb-2"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Kilos"
          value={kilos}
          onChange={(e) => setKilos(e.target.value)}
        />
        <button className="btn btn-primary mb-2" onClick={validarProducto}>
          Agregar
        </button>
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* Diseño de tarjetas responsivo */}
      <div className="card-container">
        {productos.map((producto, index) => (
          <div key={`${producto.codigo}-${index}`} className="card">
            <div className="card-body">
              <p>
                <strong>Código:</strong> {producto.codigo}
              </p>
              <p>
                <strong>Descripción:</strong> {producto.descripcion}
              </p>
              <p>
                <strong>Kilos:</strong> {producto.kilos} kg
              </p>
              <div className="actions">
                <button
                  className="btn btn-warning me-2"
                  onClick={() => abrirSweetAlertEdicion(producto)}
                >
                  <FaEdit /> Modificar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => eliminarProducto(producto.codigo)}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-success mt-3" onClick={enviarEntrega}>
        Enviar Entrega
      </button>
    </div>
  </div>
</div>

  );
};

export default CarniceriaPage;
