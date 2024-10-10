import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [message, setMessage] = useState('');  // Mensaje para cifrar
  const [recipientPublicKey, setRecipientPublicKey] = useState('');  // Clave pública del destinatario
  const [encryptedMessage, setEncryptedMessage] = useState('');  // Mensaje cifrado
  const [nonce, setNonce] = useState('');  // Nonce para el cifrado
  const [decryptedMessage, setDecryptedMessage] = useState('');  // Mensaje descifrado

  // Detectar si la wallet Phantom está conectada automáticamente al cargar la página
  useEffect(() => {
    const checkIfWalletAlreadyConnected = async () => {
      try {
        const { solana } = window;
        if (solana && solana.isPhantom && localStorage.getItem('walletConnected') === 'true') {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success("Wallet conectada automáticamente");
        }
      } catch (err) {
        console.error("Error al verificar la conexión con Phantom", err);
      }
    };
    checkIfWalletAlreadyConnected();
  }, []);

  // Conectar la wallet Phantom manualmente
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        localStorage.setItem('walletConnected', 'true');  // Guardamos la conexión
        toast.success('Wallet conectada correctamente');
      } else {
        toast.error('Phantom Wallet no encontrada. Por favor instálala.');
        window.open('https://phantom.app/', '_blank');
      }
    } catch (err) {
      console.error('Error al conectar la wallet Phantom:', err);
      toast.error('Error al conectar la wallet');
    }
  };

  // Desconectar la wallet Phantom manualmente
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      localStorage.removeItem('walletConnected');  // Limpiamos la conexión
      toast.success('Wallet desconectada correctamente');
    }
  };

  // Cifrar el mensaje
  const encryptMessage = () => {
    try {
      const messageUint8 = naclUtil.decodeUTF8(message);  // Convierte el mensaje en Uint8Array
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);  // Decodifica la clave pública del destinatario

      if (recipientPublicKeyUint8.length !== 32) {
        console.error(`Tamaño de clave pública no válido: ${recipientPublicKeyUint8.length}`);
        return;
      }

      const senderKeyPair = nacl.box.keyPair();  // Genera un par de claves para el remitente
      const nonce = nacl.randomBytes(nacl.box.nonceLength);  // Genera el nonce para el cifrado

      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);  // Cifrado
      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);

      setEncryptedMessage(encryptedMessageBase64);
      setNonce(nonceBase64);
      toast.success('Mensaje cifrado correctamente');
    } catch (error) {
      console.error('Error al cifrar el mensaje:', error);
      toast.error('Error al cifrar el mensaje');
    }
  };

  // Descifrar el mensaje
  const decryptMessage = () => {
    try {
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);  // Convierte el mensaje cifrado de Base64
      const nonceUint8 = naclUtil.decodeBase64(nonce);  // Convierte el nonce de Base64

      const recipientKeyPair = nacl.box.keyPair();  // Usamos un par de claves simuladas para descifrar (debe ser del destinatario real)
      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, publicKey, recipientKeyPair.secretKey);

      if (!decrypted) {
        throw new Error('Error al descifrar el mensaje.');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
      toast.success('Mensaje descifrado correctamente');
    } catch (error) {
      console.error('Error al descifrar el mensaje:', error);
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
        message,
        setMessage,
        recipientPublicKey,
        setRecipientPublicKey,
        encryptedMessage,
        encryptMessage,
        decryptMessage,
        decryptedMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
