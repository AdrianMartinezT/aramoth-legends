import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detectar el sistema operativo (Android o iOS)
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  // Detectar si Phantom está instalada en el móvil
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      checkIfWalletAlreadyConnected(); // Verificar si la wallet ya estaba conectada previamente
    }
  }, []);

  // Verificar si la wallet ya estaba conectada previamente (sesión)
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

  // Función para conectar la wallet, manejando dispositivos móviles
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        localStorage.setItem('walletConnected', 'true');
        toast.success('Tu Wallet está conectada 👻');
      } else {
        // Deep Link para dispositivos móviles
        const redirectUrl = encodeURIComponent(window.location.href); // URL de regreso
        const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

        if (isAndroid) {
          // En Android, redirige a la app Phantom
          window.location.href = deepLink;
        } else if (isIOS) {
          // En iOS, redirige a la app Phantom
          window.location.href = deepLink;
        } else {
          // En caso de que esté en un entorno de escritorio o la wallet no esté disponible
          window.open('https://phantom.app/', '_blank');
        }
      }
    } catch (err) {
      console.error('Error al conectar la wallet Phantom', err);
      toast.error('Error al conectar la wallet');
    }
  };

  // Función para desconectar la wallet
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem('walletConnected');
      toast.success('Wallet desconectada 👻');
    }
  };

  // Verificación automática al volver de la app de Phantom (móviles)
  useEffect(() => {
    const checkAuthorization = () => {
      if (window.solana && window.solana.isPhantom) {
        window.solana.connect({ onlyIfTrusted: true })
          .then((response) => {
            if (response) {
              setWalletConnected(true);
              setPublicKey(response.publicKey.toString());
              toast.success('Wallet conectada 👻');
              // Redirigir al navegador web después de la autorización
              window.location.href = window.location.href;
            }
          })
          .catch(() => {
            setWalletConnected(false);
          });
      }
    };

    // Intentar reconectar automáticamente después de volver desde la app de Phantom
    if (isAndroid || isIOS) {
      checkAuthorization();
    }
  }, [isAndroid, isIOS]);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
