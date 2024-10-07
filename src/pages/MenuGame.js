import React from 'react';
import Navbar from '../components/Navbar';  // Importa el componente Navbar
import styles from './MenuGame.module.css';  // Importamos los estilos
import play1v1Button from '../assets/play-1v1-button.jpg';
import campaingButton from '../assets/campaing-button.jpg';
import arenaButton from '../assets/arena-button.jpg';
import challengersButton from '../assets/challengers-button.jpg';

const MenuGame = () => {
  return (
    <div className={styles.menuGame}>
      {/* Incluimos el Navbar */}
      <Navbar />
      <div className={styles.heroContent}>
        {/* Botones del menú con imágenes */}
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
    </div>
  );
};

export default MenuGame;
