import React, { createContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const dappKeyPair = useRef(nacl.box.keyPair()); // Generación de par de claves

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantomInstalled(true);
      checkIfWalletAlreadyConnected();
    } else {
      setPhantomInstalled(false);
    }
  }, []);

  const checkIfWalletAlreadyConnected = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom && localStorage.getItem("walletConnected") === "true") {
        const response = await solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success("Tu Wallet sigue conectada 👻");
        }
      }
    } catch (err) {
      console.error("Error al verificar la conexión con Phantom", err);
    }
  };

  const connectWallet = () => {
    if (phantomInstalled) {
      window.solana.connect()
        .then((response) => {
          if (response.publicKey) {
            setWalletConnected(true);
            setPublicKey(response.publicKey.toString());
            localStorage.setItem("walletConnected", "true");
            toast.success("Tu Wallet está conectada 👻");
          }
        })
        .catch((err) => {
          console.error("Error al conectar la wallet Phantom", err);
          toast.error("Autenticación fallida. No se completó la conexión.");
        });
    } else {
      const appUrl = encodeURIComponent('https://aramoth-legends.vercel.app/');
      const redirectLink = encodeURIComponent(window.location.href);
      const dappEncryptionPublicKey = bs58.encode(dappKeyPair.current.publicKey);
      const link = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}&cluster=mainnet-beta`;
      window.location.href = link;
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      if (params.get('phantom_encryption_public_key')) {
        const phantomEncryptionPublicKey = bs58.decode(params.get('phantom_encryption_public_key'));
        const sharedSecret = nacl.box.before(phantomEncryptionPublicKey, dappKeyPair.current.secretKey);
        const encryptedData = params.get('data');
        const nonce = bs58.decode(params.get('nonce'));
        const decryptedData = nacl.box.open.after(bs58.decode(encryptedData), nonce, sharedSecret);
        if (!decryptedData) {
          console.error("Error al descifrar los datos");
          return;
        }
        const connectionData = JSON.parse(naclUtil.encodeUTF8(decryptedData));
        const { public_key } = connectionData;
        setWalletConnected(true);
        setPublicKey(public_key);
        localStorage.setItem("walletConnected", "true");
        toast.success("Tu Wallet está conectada 👻");
        window.history.replaceState({}, document.title, url.pathname);
      }
    };
    handleRedirect();
  }, []);

  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
    }
    setWalletConnected(false);
    setPublicKey(null);
    localStorage.removeItem("walletConnected");
    toast.success("Wallet desconectada 👻");
  };

  return (
    <WalletContext.Provider value={{
      walletConnected,
      publicKey,
      connectWallet,
      disconnectWallet,
      isAndroid,
      isIOS,
      phantomInstalled
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
