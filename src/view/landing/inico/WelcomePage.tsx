// src/views/WelcomePage.tsx
import React from 'react';
import './WelcomePage.css'; // Estilos para esta página

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-container">
            <h2>¡Bienvenidos!</h2>
            <p>Esta es la página principal de nuestra aplicación.</p>
        </div>
    );
};

export default WelcomePage;