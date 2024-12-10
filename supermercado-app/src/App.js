import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import CarniceriaPage from './modules/Carniceria/CarniceriaPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/carniceria" element={<CarniceriaPage />} />
            </Routes>
        </Router>
    );
};

export default App;
