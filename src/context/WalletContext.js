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

  // Detectar si Phantom está instalado en cualquier entorno (móvil o escritorio)
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletConnected();

      // Detectar eventos de conexión/desconexión
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

  // Chequear si la wallet está conectada
  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        if (response) {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
        }
      }
    } catch (err) {
      console.error("Error al verificar conexión con Phantom", err);
    }
  };

  // Función para conectar la wallet
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
      const deeplinkUrl = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}&dappEncryptionPublicKey=null&cluster=mainnet-beta`;

      if (isAndroid) {
        // Enlace profundo específico para Android
        window.location.href = deeplinkUrl;
      } else if (isIOS) {
        // Enlace profundo específico para iOS
        window.location.href = deeplinkUrl;
      } else {
        // Para el caso de escritorio, abrir Phantom en una nueva pestaña si no está instalado
        window.open("https://phantom.app/", "_blank");
      }
    }
  };

  // Función para desconectar la wallet
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻");
    }
  };

  // Detectar si el usuario regresa al navegador desde la app de Phantom (móviles)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkIfWalletConnected(); // Verificar la conexión cuando el navegador vuelve a estar visible
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
        phantomInstalled
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
