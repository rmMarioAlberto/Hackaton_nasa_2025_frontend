// src/view/layout/admin/Footer.tsx
import React from 'react';
import './styles/AdminLayout.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="admin-footer">
            <p>&copy; {currentYear} NASA Mission Control. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;  