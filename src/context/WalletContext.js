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

  // Detectar si Phantom está instalado
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletConnected();

      // Detectar cambios en el estado de conexión
      window.solana.on('connect', (response) => {
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        toast.success("Wallet conectada desde Phantom 👻");
      });

      window.solana.on('disconnect', () => {
        setWalletConnected(false);
        setPublicKey(null);
        toast.success("Wallet desconectada 👻");
      });
    } else {
      setPhantomInstalled(false);
    }
  }, []);

  // Función para chequear si ya está conectada la wallet
  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
      }
    } catch (err) {
      console.error("Error al verificar conexión con Phantom", err);
    }
  };

  // Función para conectar la wallet manualmente
  const connectWallet = () => {
    if (phantomInstalled) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success("Tu Wallet está conectada 👻");
        })
        .catch((err) => console.error("Error al conectar la wallet Phantom", err));
    } else {
      // Detectar si estamos en Android o iOS y redirigir a la app de Phantom usando deep links
      const redirectUrl = encodeURIComponent(window.location.href);  // La URL a la que regresarás después de loguearte
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        // Enlace profundo específico para Android
        window.location.href = deepLink;
      } else if (isIOS) {
        // Enlace profundo específico para iOS
        window.location.href = deepLink;
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    }
  };

  // Función para desconectar la wallet manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
        isAndroid,
        isIOS,
        phantomInstalled
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
