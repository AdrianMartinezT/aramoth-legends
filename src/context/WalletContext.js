import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [nonce, setNonce] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  // Verificar si Phantom está instalada en el navegador
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      checkIfWalletAlreadyConnected();
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

  // Conectar la wallet manualmente
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setPublicKey(response.publicKey.toString());
        setWalletConnected(true);
        localStorage.setItem('walletConnected', 'true');
        toast.success('Tu Wallet está conectada 👻');
      } else {
        window.open('https://phantom.app/', '_blank');
        toast.error('Phantom Wallet no encontrada');
      }
    } catch (err) {
      console.error('Error al conectar la wallet Phantom', err);
      toast.error('Error al conectar la wallet');
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

  // Cifrar un mensaje usando la clave pública del destinatario
  const encryptMessage = (message, recipientPublicKey) => {
    try {
      const messageUint8 = naclUtil.decodeUTF8(message);
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);

      if (recipientPublicKeyUint8.length !== 32) {
        toast.error('Clave pública del destinatario inválida');
        return;
      }

      const senderKeyPair = nacl.box.keyPair();
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      const encrypted = nacl.box(
        messageUint8,
        nonce,
        recipientPublicKeyUint8,
        senderKeyPair.secretKey
      );

      setNonce(naclUtil.encodeBase64(nonce));
      setEncryptedMessage(naclUtil.encodeBase64(encrypted));

      toast.success('Mensaje cifrado con éxito');
    } catch (error) {
      console.error('Error al cifrar el mensaje', error);
      toast.error('Error al cifrar el mensaje');
    }
  };

  // Descifrar un mensaje usando la clave privada del destinatario
  const decryptMessage = (encryptedMessage, recipientPrivateKey) => {
    try {
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);
      const nonceUint8 = naclUtil.decodeBase64(nonce);

      const recipientPrivateKeyUint8 = bs58.decode(recipientPrivateKey);

      const decrypted = nacl.box.open(
        encryptedMessageUint8,
        nonceUint8,
        publicKey,
        recipientPrivateKeyUint8
      );

      if (!decrypted) {
        throw new Error('Error al descifrar el mensaje');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
      toast.success('Mensaje descifrado con éxito');
    } catch (error) {
      console.error('Error al descifrar el mensaje', error);
      toast.error('Error al descifrar el mensaje');
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
        encryptedMessage,
        decryptMessage,
        decryptedMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
