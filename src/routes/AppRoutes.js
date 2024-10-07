// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MenuGame from '../pages/MenuGame';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />       {/* Página principal */}
      <Route path="/menugame" element={<MenuGame />} />  {/* Página del Menú del juego */}
    </Routes>
  );
};

export default AppRoutes;
