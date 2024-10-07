// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MenuGame from './pages/MenuGame';  
import './App.css';  // Asegúrate de que los estilos globales estén importados

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para Home */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para MenuGame */}
          <Route path="/MenuGame" element={<MenuGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
