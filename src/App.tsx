import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- LAYOUTS ---
import Layout from './view/layout/inico/Layout';
import AdminLayout from './view/layout/admin/AdminLayout';

// --- COMPONENTE DE PROTECCIÓN ---
import ProtectedRoute from './components/auth/ProtectedRoute';

// --- Vistas ---
import WelcomePage from './view/landing/inico/WelcomePage';
import Login from './view/auth/login/login';
import ChatbotView from './view/chatbot/ChatbotView';
import Dashboard from './view/admin/dashboard/Dashboard';
import ParallaxLanding from './components/landing/ParallaxLanding';
import Dropbox from './components/dropbox/Dropbox';
import PlanetCharts from './view/admin/planets/PlanetCharts';
// ✅ 1. IMPORTA LA NUEVA VISTA
import PlanetList from './view/admin/planets/PlanetList';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- GRUPO DE RUTAS PÚBLICAS (SIN CAMBIOS) --- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="chatbot" element={<ChatbotView />} /> 
          <Route path="parallax" element={<ParallaxLanding />} />
        </Route>

        {/* --- GRUPO DE RUTAS DE ADMINISTRADOR (PROTEGIDAS) --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dropbox" element={<Dropbox />} />
          <Route path="planets" element={<PlanetList />} />
          <Route path="planets/:planetId/charts" element={<PlanetCharts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
