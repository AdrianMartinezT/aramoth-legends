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
      // Intentar usar enlaces profundos en lugar de redirigir a la tienda directamente
      const redirectUrl = encodeURIComponent("https://aramoth-legends.vercel.app/"); // URL de regreso al navegador Phantom
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        // Intentar abrir la app de Phantom en Android
        window.location.href = deepLink;

        // Si no funciona (la app no está instalada), redirigir a la Play Store después de un retraso
        setTimeout(() => {
          window.location.href = 'https://play.google.com/store/apps/details?id=app.phantom';
        }, 2000); // Si después de 2 segundos no conecta, asumimos que no está instalada
      } else if (isIOS) {
        // Intentar abrir la app de Phantom en iOS
        window.location.href = deepLink;

        // Si no funciona (la app no está instalada), redirigir a la App Store después de un retraso
        setTimeout(() => {
          window.location.href = 'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977';
        }, 2000); // Si después de 2 segundos no conecta, asumimos que no está instalada
      } else {
        // Para escritorio o si Phantom no está instalado
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
