import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import icono from '../assets/logofinal.webp';
import playGameImage from '../assets/PlayGame.png';
import './HeroSection.css';  // Importamos el archivo CSS
import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';  

const HeroSection = () => {
  const { walletConnected, connectWallet, disconnectWallet } = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletConnected) {
      navigate('/Create');
    }
  }, [walletConnected, navigate]);

  return (
    <div className="hero-section">
      <div className="overlay"></div> 
      <Container fluid className="content">
        <Row className="align-items-center text-center">
          <Col>
            <div className="hero-content">
              <img src={icono} alt="ARAMOTH LEGENDS" className="hero-logo" />
              <Button
                variant="light"
                className="play-game-button"
                onClick={walletConnected ? disconnectWallet : connectWallet}
              >
                <img src={playGameImage} alt="Play Game" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
