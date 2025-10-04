// src/view/layout/inico/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <h1>Mi Aplicación Espacial</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/chat">Chat IA</a> {/* Puedes agregar más enlaces */}
            </nav>
        </header>
    );
};

export default Header;