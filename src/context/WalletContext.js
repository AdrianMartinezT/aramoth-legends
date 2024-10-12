import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util'; // Corregimos la importación
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [nonce, setNonce] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

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

  // Conectar la wallet manualmente con seguridad (requiere autorización en Phantom)
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
      // Redireccionamiento a la app Phantom si no está instalada (deep link)
      const redirectUrl = encodeURIComponent("https://aramoth-legends.vercel.app/");
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        window.location.href = deepLink;
      } else if (isIOS) {
        window.location.href = deepLink;
      } else {
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
      localStorage.removeItem("walletConnected");
      toast.success("Wallet desconectada 👻");
    }
  };

  // Cifrado y descifrado de mensajes con seguridad
  const encryptMessage = (message, recipientPublicKey) => {
    try {
      const messageUint8 = naclUtil.decodeUTF8(message);
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);

      if (recipientPublicKeyUint8.length !== 32) {
        console.error("Public key inválida");
        return;
      }

      const senderKeyPair = nacl.box.keyPair();
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);

      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);

      setEncryptedMessage(encryptedMessageBase64);
      setNonce(nonceBase64);

      console.log("Mensaje cifrado con éxito");
    } catch (error) {
      console.error("Error cifrando el mensaje:", error);
    }
  };

  const decryptMessage = (encryptedMessage, nonce, recipientPublicKey) => {
    try {
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);
      const nonceUint8 = naclUtil.decodeBase64(nonce);
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);

      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, recipientPublicKeyUint8, publicKey);
      if (!decrypted) {
        throw new Error("Fallo al descifrar el mensaje.");
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
    } catch (error) {
      console.error("Error descifrando el mensaje:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
        encryptMessage,
        decryptMessage,
        isAndroid,
        isIOS,
        phantomInstalled,
        encryptedMessage,
        nonce,
        decryptedMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
