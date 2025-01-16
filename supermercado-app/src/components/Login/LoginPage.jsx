import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react"; // Íconos usados en la plantilla
import "./LoginPage.css"; // Archivo CSS

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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl p-0 shadow-2xl flex overflow-hidden">
        {/* Lado de la imagen de la empresa */}
        <div className="hidden lg:block w-1/2 bg-slate-100 p-12 flex flex-col justify-between">
          <div className="text-slate-800">
            <LogIn className="h-12 w-12 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Bienvenido a Corralero Intranet </h1>
            <p className="text-slate-600">
              Portal de inicio de sesión de su area de Trabajo
            </p>
          </div>
          <img
            src="https://github.com/FlushaM/imagenes-matias/blob/main/LOGOCORRALERO.png?raw=true"
            alt="Edificio Corporativo"
            className="rounded-lg shadow-lg object-contain h-32 w-full"
          />
        </div>

        {/* Formulario de login */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
            <p className="text-slate-600">Por favor, ingresa tus credenciales</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-10 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition duration-200"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-10 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition duration-200"
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-slate-800 text-white rounded-lg py-3 font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
