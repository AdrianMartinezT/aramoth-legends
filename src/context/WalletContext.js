// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detectar si estamos en Android o iOS
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  // Verificar si Phantom está instalado en el navegador
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletAlreadyConnected();  // Verificar si la wallet ya estaba conectada previamente
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
      // Redireccionar a la app Phantom para conectarse si no está instalada en el navegador
      const redirectUrl = encodeURIComponent(window.location.href);
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        window.location.href = deepLink;  // Redirigir a la app Phantom en Android
      } else if (isIOS) {
        window.location.href = deepLink;  // Redirigir a la app Phantom en iOS
      } else {
        window.open('https://phantom.app/', '_blank');
      }
    }
  };

  // Desconectar la wallet manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem('walletConnected');  // Quitamos el estado de conexión del almacenamiento local
      toast.success('Wallet desconectada 👻');
    }
  };

  // Detectar si la wallet ya estaba autorizada y conectada cuando se regresa desde la app Phantom
  useEffect(() => {
    const handleWalletConnect = () => {
      if (window.solana && window.solana.isPhantom) {
        window.solana.connect({ onlyIfTrusted: true })
          .then((response) => {
            setWalletConnected(true);
            setPublicKey(response.publicKey.toString());
            toast.success('Wallet conectada 👻');
          })
          .catch((err) => {
            setWalletConnected(false);
            console.error('Error al reconectar la wallet Phantom', err);
          });
      }
    };

    // Escuchar el evento de reconexión cuando se regresa desde la app Phantom
    if (phantomInstalled) {
      window.addEventListener('focus', handleWalletConnect);
    }

    return () => {
      if (phantomInstalled) {
        window.removeEventListener('focus', handleWalletConnect);
      }
    };
  }, [phantomInstalled]);

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
