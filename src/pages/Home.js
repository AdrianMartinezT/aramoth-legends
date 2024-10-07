import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

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

  useEffect(() => {
    const detectPhantomWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success(`Tu Wallet está conectada 👻`);
        } catch (err) {
          console.log('Error al conectar la wallet Phantom', err);
        }
      }
    };

    detectPhantomWallet();
  }, []);

  const connectWallet = () => {
    if (isAndroid) {
      window.location.href = "https://phantom.app/android";
    } else if (isIOS) {
      window.location.href = "https://phantom.app/ios";
    } else if (window.solana && window.solana.isPhantom) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success(`Tu Wallet está conectada 👻`);
        })
        .catch((err) => {
          console.error("Error al conectar la wallet Phantom", err);
        });
    } else {
      alert("Phantom Wallet no está disponible. Por favor, instala la extensión o aplicación.");
      window.open("https://phantom.app/", "_blank");
    }
  };

  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻");
    }
  };

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
      <Navbar />
      {isAndroid && <p style={{color: 'white'}}>Estás usando un dispositivo Android</p>}
      {isIOS && <p style={{color: 'white'}}>Estás usando un dispositivo iOS</p>}
      <HeroSection
        walletConnected={walletConnected}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
    </div>
  );
};

export default Home;
