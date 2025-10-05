// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- 1. IMPORTA AMBOS LAYOUTS ---
import Layout from './view/layout/inico/Layout'; // Layout para las páginas públicas
import AdminLayout from './view/layout/admin/AdminLayout'; // Layout para el panel de admin

// --- Vistas ---
import WelcomePage from './view/landing/inico/WelcomePage';
import Login from './view/auth/login/login';
import ChatbotView from './view/chatbot/ChatbotView';
import Dashboard from './view/admin/dashboard/Dashboard';
import ParallaxLanding from './components/landing/ParallaxLanding';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 2. GRUPO DE RUTAS PÚBLICAS --- */}
        {/* Todas las rutas dentro de este grupo usarán el 'Layout' de inicio */}
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="chatbot" element={<ChatbotView />} /> 
          <Route path="parallax" element={<ParallaxLanding />} />
        </Route>

        {/* --- 3. GRUPO DE RUTAS DE ADMINISTRADOR --- */}
        {/* Todas las rutas aquí usarán el 'AdminLayout' que creamos */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Si en el futuro creas más vistas de admin, irían aquí. Ej:
          <Route path="users" element={<UsersPage />} /> 
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;