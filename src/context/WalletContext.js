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
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [nonce, setNonce] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  // Detectar si estamos en Android o iOS
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
      const redirectUrl = encodeURIComponent(window.location.href);
      const deepLink = `https://phantom.app/ul/v1/connect?appUrl=${redirectUrl}`;

      if (isAndroid) {
        window.location.href = deepLink;
      } else if (isIOS) {
        window.location.href = deepLink;
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
      localStorage.removeItem('walletConnected');
      toast.success('Wallet desconectada 👻');
    }
  };

  // Encriptar el mensaje
  const encryptMessage = (message, recipientPublicKey) => {
    try {
      const messageUint8 = naclUtil.decodeUTF8(message);
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);

      if (recipientPublicKeyUint8.length !== 32) {
        console.error(`Invalid recipient public key size: ${recipientPublicKeyUint8.length}`);
        return;
      }

      const senderKeyPair = nacl.box.keyPair();
      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);
      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);

      setEncryptedMessage(`Encrypted Message: ${encryptedMessageBase64}, Nonce: ${nonceBase64}`);
      setNonce(nonceBase64);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  // Desencriptar el mensaje
  const decryptMessage = (encryptedMessage, recipientKeyPair) => {
    try {
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage.split(':')[1].trim());
      const nonceUint8 = naclUtil.decodeBase64(nonce);

      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, publicKey, recipientKeyPair.secretKey);
      if (!decrypted) {
        throw new Error('Failed to decrypt the message.');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
    } catch (error) {
      console.error('Decryption failed:', error);
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
        encryptedMessage,
        decryptedMessage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
