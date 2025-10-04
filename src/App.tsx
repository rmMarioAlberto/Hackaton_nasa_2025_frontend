// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaciones adaptadas a tu estructura de carpetas
import Layout from './view/layout/inico/Layout';
import WelcomePage from './view/landing/inico/WelcomePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Esta es la ruta principal que carga tu WelcomePage */}
          <Route index element={<WelcomePage />} />

          {/* Aquí puedes añadir más rutas en el futuro */}
          {/* Ejemplo: <Route path="chat" element={<ChatPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;