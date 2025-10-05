// src/view/layout/admin/Header.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// --- 1. Importa un nuevo ícono para el enlace ---
import { LayoutDashboard, LogOut, FileArchive } from 'lucide-react'; 
import './styles/AdminLayout.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Cerrando sesión y limpiando almacenamiento...");
        localStorage.clear();
        navigate('/');
    };

    return (
        <header className="admin-header">
            <div className="admin-header-logo">
                <h2>🚀 Mission Control</h2>
            </div>
            <nav className="admin-nav">
                {/* Enlace al Dashboard (existente) */}
                <NavLink 
                    to="/admin/dashboard" 
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </NavLink>

                {/* --- 2. Agrega el nuevo enlace a Dropbox aquí --- */}
                <NavLink 
                    to="/admin/dropbox" 
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                    <FileArchive size={18} />
                    <span>Dropbox</span>
                </NavLink>
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