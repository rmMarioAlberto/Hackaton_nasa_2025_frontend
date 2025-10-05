// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaciones adaptadas a tu estructura de carpetas
import Layout from './view/layout/inico/Layout';
import WelcomePage from './view/landing/inico/WelcomePage';
import Login from './view/auth/login/login'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="login" element={<Login />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;