import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import CustomNavbar from '../components/Navbar';  // Se Importa el componente Navbar
import { WalletContext } from '../context/WalletContext';  // Se Importa el contexto de la wallet
import styles from './Gallery.module.css';  // Se Importan los estilos de Gallery
import playGameButtonImage from '../assets/PlayGame.png';  // Imagen del botón Play Game

// Agrega las imágenes de las cartas de la galería
import card1 from '../assets/Card01.png';  // Imagen ejemplo de la carta 1
import card2 from '../assets/Card02.png';  // Imagen ejemplo de la carta 2
import card3 from '../assets/Card03.png';  // Imagen ejemplo de la carta 3
import card4 from '../assets/Card04.png';  // Imagen ejemplo de la carta 4
import card5 from '../assets/Card05.png';  // Imagen ejemplo de la carta 5
import cardBack from '../assets/cardBack.jpg';  // Imagen del dorso de la carta
import galleryTitleImage from '../assets/gallery.jpg';

const Gallery = () => {
  const { walletConnected, connectWallet } = useContext(WalletContext);  // Accedemos al estado de la wallet

  // Estado para las cartas visibles cuando se hace hover
  const [hoveredCard, setHoveredCard] = useState(null); // null cuando no hay hover

  // Lista de cartas que se mostrarán al hacer hover
  const hoverCards = [card1, card2, card3, card4, card5]; 

  return (
    <div className={styles.galleryPage}>
      <CustomNavbar />

      {/* Si la wallet está conectada, mostramos la galería */}
      {walletConnected ? (
        <div className={styles.galleryContent}>
          <div className={styles.galleryTitle}>
            <img src={galleryTitleImage} alt="Gallery" />  {/* Imagen del título Galery */}
          </div>
          <div className={styles.cardsContainer}>
            {/* Fila de cartas */}
            <div className={styles.cardRow}>
              <img src={card1} alt="Carta 1" className={styles.cardImage} />
              <img src={card2} alt="Carta 2" className={styles.cardImage} />
              <img src={card3} alt="Carta 3" className={styles.cardImage} />
              <img src={card4} alt="Carta 4" className={styles.cardImage} />
              <img src={card5} alt="Carta 5" className={styles.cardImage} />
            </div>
            {/* Fila con dorso de las cartas */}
            <div className={styles.cardRow}>
              {/* Recorremos el array de cartas y aplicamos hover */}
              {hoverCards.map((hoverCard, index) => (
                <img
                  key={index}
                  src={hoveredCard === index ? hoverCard : cardBack} // Si hay hover, muestra la carta correspondiente
                  alt={`Dorso de la carta ${index + 1}`}
                  className={styles.cardImage}
                  onMouseEnter={() => setHoveredCard(index)} // Muestra la carta en hover
                  onMouseLeave={() => setHoveredCard(null)}  // Al quitar el hover, vuelve a mostrar el dorso
                />
              ))}
            </div>
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

export default Gallery;
