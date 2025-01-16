import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://corralerointranet.cl/api/auth/login", {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      // Verifica que los datos del usuario y token son correctos
      console.log("Token recibido:", token);
      console.log("Datos del usuario:", user);
  
      // Guardar el token y el usuario en el localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Guarda el usuario completo
  
      // Redirigir según el rol del usuario
      switch (user.rol) {
        case "admin":
          navigate("/dashboard");
          break;
        case "carnicero":
          navigate("/carniceria");
          break;
        case "verdulero":
          navigate("/verduleria");
          break;
        case "roticeria":
          navigate("/roticeria");
          break;
        default:
          setError("Rol desconocido");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
