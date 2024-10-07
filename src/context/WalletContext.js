// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detección de sistema operativo móvil (Android o iOS)
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) setIsAndroid(true);
    else if (/iPad|iPhone|iPod/.test(userAgent)) setIsIOS(true);
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
        .catch((err) => console.error("Error al conectar la wallet Phantom", err));
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
    <WalletContext.Provider value={{ walletConnected, publicKey, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
