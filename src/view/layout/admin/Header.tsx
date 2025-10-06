import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// 1. Se importa un nuevo ícono para el enlace de planetas
import { LayoutDashboard, LogOut, FileArchive, List } from 'lucide-react'; 
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

                {/* Enlace a Dropbox (existente) */}
                <NavLink 
                    to="/admin/dropbox" 
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                    <FileArchive size={18} />
                    <span>Dropbox</span>
                </NavLink>

                {/* 2. Se agrega el nuevo enlace/botón para la lista de planetas */}
                <NavLink 
                    to="/admin/planets" 
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                    <List size={18} />
                    <span>Planetas</span>
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
