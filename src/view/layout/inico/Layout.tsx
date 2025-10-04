// src/view/layout/inico/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';      // Correcto, está en la misma carpeta
import Footer from './Footer';      // Correcto, está en la misma carpeta
import './styles/Layout.css';       // Ajustado a tu carpeta de estilos

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <Header />
            <main className="app-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
