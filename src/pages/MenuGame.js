import React, { useContext } from 'react';
import CustomNavbar from '../components/Navbar';  // Importa el componente Navbar
import { WalletContext } from '../context/WalletContext';  // Importa el contexto de la wallet
import styles from '../pages/MenuGame.module.css';  // Importamos los estilos
import play1v1Button from '../assets/play-1v1-button.png';
import campaingButton from '../assets/campaing-button.png';
import arenaButton from '../assets/arena-button.png';
import challengersButton from '../assets/challengers-button.png';
import { Button } from 'react-bootstrap';  // Importa el componente Button

const MenuGame = () => {
  const { walletConnected, connectWallet, disconnectWallet } = useContext(WalletContext);  // Accede al estado de la wallet

  return (
    <div className={styles.menuGame}>
      <CustomNavbar />  {/* Incluimos el Navbar */}
      
      {/* Si la wallet está conectada, mostramos los botones del menú */}
      {walletConnected ? (
        <div className={styles.heroContent}>
          <div className={styles.menuButtons}>
            <button className={styles.menuButton}>
              <img src={play1v1Button} alt="Play 1v1" />
            </button>
            <button className={styles.menuButton}>
              <img src={campaingButton} alt="Campaing" />
            </button>
            <button className={styles.menuButton}>
              <img src={arenaButton} alt="Arena" />
            </button>
            <button className={styles.menuButton}>
              <img src={challengersButton} alt="Challengers" />
            </button>
          </div>
        </div>
      ) : (
        // Si la wallet no está conectada, mostramos el botón para conectar la wallet
        <div className={styles.connectWalletMessage}>
          <Button
            variant="light"
            className="play-button"
            onClick={connectWallet}
          >
            Play Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuGame;
