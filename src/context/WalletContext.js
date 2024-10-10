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
      if (solana.isPhantom && localStorage.getItem("walletConnected") === "true") {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        toast.success("Tu Wallet sigue conectada 👻");
      }
    } catch (err) {
      console.error("Error al verificar la conexión con Phantom", err);
    }
  };

  // Conectar la wallet manualmente
  const connectWallet = () => {
    if (phantomInstalled) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          localStorage.setItem("walletConnected", "true");  // Guardamos el estado de conexión en localStorage
          toast.success("Tu Wallet está conectada 👻");
        })
        .catch((err) => console.error("Error al conectar la wallet Phantom", err));
    } else {
      const redirectUrl = encodeURIComponent("https://aramoth-legends.vercel.app/"); // URL de regreso al navegador Phantom
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        // En Android, intenta abrir la app de Phantom directamente
        window.location.href = deepLink;
      } else if (isIOS) {
        // En iOS, intenta abrir la app de Phantom
        window.location.href = deepLink;
      } else {
        // Para escritorio o Phantom no detectado
        window.open("https://phantom.app/", "_blank");
      }
    }
  };

  // Desconectar la wallet manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem("walletConnected");  // Quitamos el estado de conexión de localStorage
      toast.success("Wallet desconectada 👻");
    }
  };

  // Detectar si la app está autorizada y redirigir al navegador Phantom (para móviles)
  useEffect(() => {
    if (isAndroid || isIOS) {
      const checkAuthorization = () => {
        if (window.solana && window.solana.isPhantom) {
          window.solana.connect({ onlyIfTrusted: true })
            .then((response) => {
              if (response) {
                setWalletConnected(true);
                setPublicKey(response.publicKey.toString());
                toast.success("Wallet conectada 👻");
                // Redirigir al navegador Phantom
                window.location.href = "https://aramoth-legends.vercel.app/"; 
              }
            })
            .catch(() => {
              setWalletConnected(false);
            });
        }
      };

      checkAuthorization();
    }
  }, [isAndroid, isIOS, phantomInstalled]);

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
