
// src/view/landing/inico/WelcomePage.tsx
import React from 'react';
import './css/WelcomePage.css'; // Correcto, el CSS está en la misma carpeta

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-container">
            <h2>¡Bienvenidos!</h2>
            <p>Esta es la página principal de nuestra aplicación del reto NASA.</p>
        </div>
    );
};

export default WelcomePage;