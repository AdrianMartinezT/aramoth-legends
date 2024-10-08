import React, { useContext } from 'react';
import CustomNavbar from '../components/Navbar';  // Importa el componente Navbar
import { WalletContext } from '../context/WalletContext';  // Importa el contexto de la wallet
import styles from './Arena.module.css';  // Importamos los estilos de la página Arena
import playGameButtonImage from '../assets/PlayGame.png';  // Imagen de Play Game

const Arena = () => {
  const { walletConnected, connectWallet } = useContext(WalletContext);  // Accedemos al estado de la wallet

  return (
    <div className={walletConnected ? styles.arenaPage : styles.noBackground}>
      <CustomNavbar />
      
      {/* Si la wallet está conectada, mostramos el contenido de la arena */}
      {walletConnected ? (
        <div className={styles.arenaContent}>
          {/* Aquí puedes añadir más contenido de la arena */}
        </div>
      ) : (
        // Si la wallet no está conectada, mostramos el botón "Play Game"
        <div className={styles.connectWalletMessage}>
          <button className={styles.menuButton} onClick={connectWallet}>
            <img src={playGameButtonImage} alt="Play Game" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Arena;
