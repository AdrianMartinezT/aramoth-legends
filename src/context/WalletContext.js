// src/context/WalletContext.js
import React, { createContext, useState } from 'react';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  const connectWallet = () => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success("Tu Wallet está conectada 👻");
        })
        .catch((err) => console.error("Error al conectar la wallet Phantom", err));
    } else {
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
