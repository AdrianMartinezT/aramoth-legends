// src/context/WalletContext.js
import React, { createContext, useState } from 'react';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';
import toast from 'react-hot-toast';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [message, setMessage] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [nonce, setNonce] = useState(''); // Para la descifrado
  const [decryptedMessage, setDecryptedMessage] = useState('');

  // Conectar la wallet
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setPublicKey(response.publicKey.toString());
        setWalletConnected(true);
        toast.success("Tu Wallet está conectada 👻");
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al conectar la wallet");
    }
  };

  // Desconectar la wallet
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻");
    }
  };

  // Función para cifrar el mensaje
  const encryptMessage = () => {
    try {
      console.log('Iniciando el proceso de cifrado...');
      
      // Decodificamos el mensaje a Uint8Array
      const messageUint8 = naclUtil.decodeUTF8(message);
      
      // Decodificamos la clave pública del destinatario de Base58 a Uint8Array
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);

      // Verificamos el tamaño correcto de la clave pública
      if (recipientPublicKeyUint8.length !== 32) {
        console.error('Clave pública del destinatario inválida.');
        return;
      }

      // Generar par de claves para el remitente (demostrativo)
      const senderKeyPair = nacl.box.keyPair();
      
      // Generar nonce
      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      // Cifrar el mensaje
      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);

      // Codificar a Base64
      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);

      setEncryptedMessage(`Encrypted Message: ${encryptedMessageBase64}, Nonce: ${nonceBase64}`);
      setNonce(nonceBase64);
    } catch (error) {
      console.error('Cifrado fallido:', error);
    }
  };

  // Función para descifrar el mensaje
  const decryptMessage = () => {
    try {
      console.log('Iniciando el proceso de descifrado...');

      // Decodificar el mensaje cifrado y el nonce desde Base64
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage.split(':')[1].trim());
      const nonceUint8 = naclUtil.decodeBase64(nonce);

      // El destinatario debe tener su par de claves para descifrar
      const recipientKeyPair = nacl.box.keyPair(); // Ejemplo, debería ser la clave secreta real del destinatario

      // Descifrar el mensaje
      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, publicKey, recipientKeyPair.secretKey);
      if (!decrypted) {
        throw new Error('Fallo en el descifrado.');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
    } catch (error) {
      console.error('Descifrado fallido:', error);
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
        recipientPublicKey,
        encryptedMessage,
        decryptedMessage,
        setMessage,
        setRecipientPublicKey,
        encryptMessage,
        decryptMessage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
