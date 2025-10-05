// src/view/layout/admin/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './styles/AdminLayout.css';

const AdminLayout: React.FC = () => {
    return (
        <div className="admin-layout-container">
            <Header />
            <main className="admin-main-content">
                <Outlet /> {/* Aquí se renderizarán tus vistas de admin (ej. Dashboard) */}
            </main>
            <Footer />
        </div>
    );
};

export default AdminLayout;