import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirigir
import CustomNavbar from '../components/Navbar';  // Se Importa el componente Navbar
import { WalletContext } from '../context/WalletContext';  // Se Importa el contexto de la wallet
import styles from './Create.module.css';  // Se Importan los estilos
import continueButtonImage from '../assets/ContinueButton.png';  // Imagen del botón Continue
import playGameButtonImage from '../assets/PlayGame.png';  // Imagen del botón Play Game

const Create = () => {
  const { walletConnected, connectWallet } = useContext(WalletContext);  // Se accede al estado de la wallet
  const navigate = useNavigate();  // Inicializamos useNavigate para redirigir

  // Función para manejar la redirección al hacer clic en "Continue"
  const handleContinue = () => {
    navigate('/MenuGame');  // Redirige a la página MenuGame
  };

  return (
    <div className={styles.createPage}>
      <CustomNavbar />

      {/* Si la wallet está conectada, mostramos el textarea y el botón "Continue" */}
      {walletConnected ? (
        <div className={styles.heroContent}>
          <div className={styles.menuButtons}>
            {/* Textarea para que el usuario escriba */}
            <textarea
              className={styles.textareaInput}
              placeholder=""
            />
            {/* Botón Continue */}
            <button className={styles.menuButton} onClick={handleContinue}>
              <img src={continueButtonImage} alt="Continue" />
            </button>
          </div>
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

export default Create;
