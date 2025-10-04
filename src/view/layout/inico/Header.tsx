// src/components/layout/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <h1>Mi Aplicación Espacial</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/about">Acerca de</a>
            </nav>
        </header>
    );
};

export default Header;