// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [recipientPublicKey, setRecipientPublicKey] = useState(''); // Para manejar la clave pública del destinatario
  const [encryptedMessage, setEncryptedMessage] = useState(''); // Para manejar el mensaje cifrado
  const [nonce, setNonce] = useState(''); // Para manejar el nonce usado para desencriptar
  const [decryptedMessage, setDecryptedMessage] = useState(''); // Para manejar el mensaje desencriptado

  // Conectar a la wallet Phantom
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
        toast.success('Wallet conectada 👻');
      } else {
        toast.error('Phantom wallet no encontrada. Instálala para continuar.');
        window.open('https://phantom.app/', '_blank');
      }
    } catch (err) {
      console.error('Error al conectar la wallet Phantom:', err);
    }
  };

  // Desconectar la wallet Phantom
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success('Wallet desconectada 👻');
    }
  };

  // Función para encriptar un mensaje
  const encryptMessage = () => {
    try {
      console.log('Iniciando proceso de encriptación...');
      
      // Convertir el mensaje a Uint8Array
      const messageUint8 = naclUtil.decodeUTF8(encryptedMessage);
      console.log('Mensaje convertido a Uint8Array:', messageUint8);
      
      // Decodificar la clave pública del destinatario desde Base58 a Uint8Array
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);
      console.log('Clave pública del destinatario convertida desde Base58:', recipientPublicKeyUint8);

      if (recipientPublicKeyUint8.length !== 32) {
        console.error(`Tamaño inválido de clave pública del destinatario: ${recipientPublicKeyUint8.length}`);
        return;
      }

      // Generar un par de claves para el remitente
      const senderKeyPair = nacl.box.keyPair();
      console.log('Par de claves del remitente generado.');

      // Generar el nonce
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      console.log('Nonce generado:', nonce);

      // Encriptar el mensaje
      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);
      console.log('Mensaje encriptado:', encrypted);

      // Convertir el mensaje cifrado y el nonce a Base64 para transmitir
      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);
      console.log(`Mensaje encriptado (Base64): ${encryptedMessageBase64}, Nonce (Base64): ${nonceBase64}`);
      
      setEncryptedMessage(encryptedMessageBase64);
      setNonce(nonceBase64);
    } catch (error) {
      console.error('Error al encriptar el mensaje:', error);
    }
  };

  // Función para desencriptar el mensaje
  const decryptMessage = () => {
    try {
      console.log('Iniciando proceso de desencriptación...');

      // Decodificar el mensaje encriptado y el nonce desde Base64
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage);
      const nonceUint8 = naclUtil.decodeBase64(nonce);

      // Usamos las claves del receptor para desencriptar (para este ejemplo, asumimos que es la clave pública actual)
      const recipientKeyPair = nacl.box.keyPair(); 

      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, publicKey, recipientKeyPair.secretKey);
      if (!decrypted) {
        throw new Error('Fallo al desencriptar el mensaje.');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      console.log('Mensaje desencriptado:', decryptedText);

      setDecryptedMessage(decryptedText);
    } catch (error) {
      console.error('Error al desencriptar el mensaje:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
        encryptedMessage,
        recipientPublicKey,
        setRecipientPublicKey,
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
