// src/view/admin/dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Dashboard.css'; // Asegúrate de crear este archivo CSS

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Hook para asegurar que la vista cargue desde arriba
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLogout = () => {
        // Aquí iría la lógica para limpiar tokens o sesión de usuario
        console.log("Cerrando sesión...");
        navigate('/'); // Redirige a la página de inicio
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>🚀 ¡Bienvenido, Ingeniero de la NASA! 🚀</h1>
                <p>Tu panel de control está listo para la misión. Los sistemas están en línea y esperando tus comandos.</p>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Dashboard;