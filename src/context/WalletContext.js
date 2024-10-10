// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);

  // Detectar el sistema operativo (Android o iOS)
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  // Detectar si Phantom está instalado en el navegador
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletAlreadyConnected(); // Verificar si la wallet ya estaba conectada previamente
    } else {
      setPhantomInstalled(false);
    }
  }, []);

  // Verificar si la wallet ya estaba conectada previamente
  const checkIfWalletAlreadyConnected = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom && localStorage.getItem('walletConnected') === 'true') {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        toast.success('Tu Wallet sigue conectada 👻');
      }
    } catch (err) {
      console.error('Error al verificar la conexión con Phantom', err);
    }
  };

  // Conectar la wallet manualmente
  const connectWallet = () => {
    if (phantomInstalled) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          localStorage.setItem('walletConnected', 'true');  // Guardamos el estado de conexión en localStorage
          toast.success('Tu Wallet está conectada 👻');
        })
        .catch((err) => console.error('Error al conectar la wallet Phantom', err));
    } else {
      // Redireccionamiento a la app Phantom si no está instalada (deep link)
      const redirectUrl = encodeURIComponent('https://aramoth-legends.vercel.app/'); // URL de regreso al navegador Phantom
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        window.location.href = deepLink; // Redirigir a la app en Android
      } else if (isIOS) {
        window.location.href = deepLink; // Redirigir a la app en iOS
      } else {
        window.open('https://phantom.app/', '_blank'); // Si es escritorio o no se detecta Phantom
      }
    }
  };

  // Desconectar la wallet manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem('walletConnected'); // Quitar el estado de conexión del localStorage
      toast.success('Wallet desconectada 👻');
    }
  };

  // Verificar si la app Phantom está conectada al regresar al navegador
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkIfWalletAlreadyConnected(); // Al volver al navegador, verificar si la wallet está conectada
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
        isAndroid,
        isIOS,
        phantomInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
