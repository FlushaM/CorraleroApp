import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
    
            const { token, user } = response.data;
    
            // Verifica que los datos del usuario y token son correctos
            console.log('Token recibido:', token);
            console.log('Datos del usuario:', user);
    
            // Guardar el token en el localStorage
            localStorage.setItem('token', token);
    
            // Redirigir según el rol del usuario
            if (user.rol === 'admin') {
                console.log('Redirigiendo al dashboard');
                navigate('/dashboard');
            } else if (user.rol === 'user') {
                console.log('Redirigiendo a carnicería');
                navigate('/carniceria');
            } else {
                setError('Rol desconocido');
                console.log('Rol desconocido:', user.rol);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginPage;
