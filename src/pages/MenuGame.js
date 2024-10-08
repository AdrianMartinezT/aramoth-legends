import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import CustomNavbar from '../components/Navbar';  // Se Importa el componente Navbar
import { WalletContext } from '../context/WalletContext';  // Se Importa el contexto de la wallet
import styles from '../pages/MenuGame.module.css';  // Se Importan los estilos
import play1v1Button from '../assets/play-1v1-button.png';
import campaingButton from '../assets/campaing-button.png';
import arenaButton from '../assets/arena-button.png';
import challengersButton from '../assets/challengers-button.png';
import playGameButtonImage from '../assets/PlayGame.png';  // Imagen de Play Game

const MenuGame = () => {
  const { walletConnected, connectWallet } = useContext(WalletContext);  //Se Accede al estado de la wallet
  const navigate = useNavigate();  // Inicializamos useNavigate para la navegación

  return (
    <div className={styles.menuGame}>
      <CustomNavbar />

      {walletConnected ? (
        <div className={styles.heroContent}>
          <div className={styles.menuButtons}>
            <button className={styles.menuButton}>
              <img src={play1v1Button} alt="Play 1v1" />
            </button>
            <button className={styles.menuButton}>
              <img src={campaingButton} alt="Campaing" />
            </button>
            {/* Modificamos el botón de Arena para navegar a la página de Arena */}
            <button 
              className={styles.menuButton} 
              onClick={() => navigate('/arena')} // Redirige a arena
            >
              <img src={arenaButton} alt="Arena" />
            </button>
            <button className={styles.menuButton}>
              <img src={challengersButton} alt="Challengers" />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.connectWalletMessage}>
          <button className={styles.menuButton} onClick={connectWallet}>
            <img src={playGameButtonImage} alt="Play Game" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuGame;
