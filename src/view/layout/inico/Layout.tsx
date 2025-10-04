// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css'; // Importamos los estilos

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <Header />
            <main className="app-content">
                <Outlet /> {/* Aquí se renderizará el contenido de la ruta actual */}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;