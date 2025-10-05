// src/view/layout/inico/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <h1>Mi Aplicación Espacial</h1>
            <nav>
                <a href="/">Inicio</a>
            </nav>
        </header>
    );
};

export default Header;