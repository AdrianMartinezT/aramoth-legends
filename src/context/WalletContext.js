import React, { createContext, useState } from 'react';
import toast from 'react-hot-toast';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [message, setMessage] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [nonce, setNonce] = useState(''); // Nonce para el descifrado
  const [decryptedMessage, setDecryptedMessage] = useState('');

  // Conectar la wallet Phantom
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletConnected(true);
        setPublicKey(response.publicKey.toString());
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

  // Desconectar la wallet Phantom
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success('Wallet desconectada correctamente');
    }
  };

  // Función para cifrar un mensaje
  const encryptMessage = () => {
    try {
      const messageUint8 = naclUtil.decodeUTF8(message);  // Codifica el mensaje a Uint8Array
      const recipientPublicKeyUint8 = bs58.decode(recipientPublicKey);  // Decodifica la clave pública del destinatario desde Base58

      if (recipientPublicKeyUint8.length !== 32) {
        console.error(`Tamaño de clave pública no válido: ${recipientPublicKeyUint8.length}`);
        return;
      }

      const senderKeyPair = nacl.box.keyPair();  // Genera el par de claves del remitente
      const nonce = nacl.randomBytes(nacl.box.nonceLength);  // Genera un nonce aleatorio

      // Cifra el mensaje
      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKeyUint8, senderKeyPair.secretKey);
      const encryptedMessageBase64 = naclUtil.encodeBase64(encrypted);
      const nonceBase64 = naclUtil.encodeBase64(nonce);

      setEncryptedMessage(`Encrypted Message: ${encryptedMessageBase64}, Nonce: ${nonceBase64}`);
      setNonce(nonceBase64);  // Almacena el nonce para el descifrado
    } catch (error) {
      console.error('Error al cifrar el mensaje:', error);
    }
  };

  // Función para descifrar un mensaje
  const decryptMessage = () => {
    try {
      const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage.split(':')[1].trim());
      const nonceUint8 = naclUtil.decodeBase64(nonce);

      const recipientKeyPair = nacl.box.keyPair();  // Suponiendo que este sea el par de claves del destinatario
      const decrypted = nacl.box.open(encryptedMessageUint8, nonceUint8, publicKey, recipientKeyPair.secretKey);

      if (!decrypted) {
        throw new Error('Error al descifrar el mensaje.');
      }

      const decryptedText = naclUtil.encodeUTF8(decrypted);
      setDecryptedMessage(decryptedText);
    } catch (error) {
      console.error('Error al descifrar el mensaje:', error);
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
