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

  // Función para verificar si la wallet está conectada
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

  // Conectar la wallet usando deep linking para dispositivos móviles
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
      const redirectUrl = encodeURIComponent("https://aramoth-legends.vercel.app/"); // URL de regreso al navegador
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        // Redirige a la app de Phantom en Android
        window.location.href = deepLink;
      } else if (isIOS) {
        // Redirige a la app de Phantom en iOS
        window.location.href = deepLink;
      } else {
        // Para escritorio o Phantom no detectado
        window.open("https://phantom.app/", "_blank");
      }
    }
  };

  // Desconectar la wallet
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻");
    }
  };

  // Detectar si la app está autorizada y redirigir al navegador (para móviles)
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
                // Redirigir al navegador
                window.location.href = "https://aramoth-legends.vercel.app/"; // Refresca para verificar el estado
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
