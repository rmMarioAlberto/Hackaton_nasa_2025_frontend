// src/view/layout/admin/Header.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import './styles/AdminLayout.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Lógica para cerrar sesión (limpiar tokens, etc.)
        console.log("Cerrando sesión del panel de admin...");
        navigate('/'); // Redirige a la página principal
    };

    return (
        <header className="admin-header">
            <div className="admin-header-logo">
                <h2>🚀 Mission Control</h2>
            </div>
            <nav className="admin-nav">
                <NavLink 
                    to="/admin/dashboard" 
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </NavLink>
                {/* Puedes agregar más enlaces de administrador aquí */}
            </nav>
            <div className="admin-header-actions">
                <button onClick={handleLogout} className="admin-logout-button">
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
};

export default Header;