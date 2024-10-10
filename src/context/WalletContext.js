import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [phantomInstalled, setPhantomInstalled] = useState(false);

  // Detección de Phantom Wallet
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletAlreadyConnected();
    } else {
      setPhantomInstalled(false);
    }
  }, []);

  // Verificar si la wallet ya está conectada
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
      console.error("Error al verificar la conexión", err);
    }
  };

  // Conectar la wallet de manera manual
  const connectWallet = () => {
    if (phantomInstalled) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          localStorage.setItem("walletConnected", "true");
          toast.success("Wallet conectada!");
        })
        .catch((err) => console.error("Error en la conexión", err));
    } else {
      // Redirige a la app de Phantom si no está instalada en móviles
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${encodeURIComponent('https://tu-url.com')}`;
      window.location.href = deepLink;
    }
  };

  // Desconectar la wallet manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem("walletConnected");
      toast.success("Wallet desconectada!");
    }
  };

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
