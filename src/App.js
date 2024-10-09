import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MenuGame from './pages/MenuGame';
import Create from './pages/Create';
import Arena from './pages/Arena';
import Gallery from './pages/Gallery';  
import Story from './pages/Story';  
import CustomNavbar from './components/Navbar';
import WalletProvider from './context/WalletContext'; // Importamos el WalletProvider

import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App">
          <CustomNavbar />  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/MenuGame" element={<MenuGame />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/gallery" element={<Gallery />} />  
            <Route path="/story" element={<Story />} />  
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
