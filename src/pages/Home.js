import React, { useState, useEffect, useContext } from 'react';
import HeroSection from '../components/HeroSection';
import CustomNavbar from '../components/Navbar';
import { WalletContext } from '../context/WalletContext';  // Importamos el contexto
import toast, { Toaster } from 'react-hot-toast';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const { walletConnected, connectWallet, disconnectWallet } = useContext(WalletContext); // Usamos el contexto

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  return (
    <div 
      className="App"
      style={{
        backgroundImage: `url('/public/img/Fondo01.png'), radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.7) 300px)`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        height: '100vh'
      }}
    >
      <Toaster position="bottom-center" />
      <CustomNavbar />  {/* Navbar que se adapta al estado de la wallet */}
      {isAndroid && <p style={{color: 'white'}}>Estás usando un dispositivo Android</p>}
      {isIOS && <p style={{color: 'white'}}>Estás usando un dispositivo iOS</p>}
      
      <HeroSection
        walletConnected={walletConnected}  // Usamos el estado de conexión del contexto
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
    </div>
  );
};

export default Home;
