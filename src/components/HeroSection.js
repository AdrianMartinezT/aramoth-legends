import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir
import icono from '../assets/Logofinal.svg'; 

const HeroSection = ({ walletConnected, connectWallet, disconnectWallet }) => {
  const navigate = useNavigate();  // Inicializamos useNavigate

  useEffect(() => {
    if (walletConnected) {
      navigate('/MenuGame');  // Redirigir a MenuGame si la wallet está conectada
    }
  }, [walletConnected, navigate]);

  return (
    <Container fluid className="hero-section">
      <Row className="align-items-center text-center">
        <Col>
          <div className="hero-content">
            <img src={icono} alt="ARAMOTH LEGENDS" className="hero-logo" />
            <Button
              variant="light"
              className="mt-4 play-button"
              onClick={walletConnected ? disconnectWallet : connectWallet}
            >
              {walletConnected ? "Salir" : "Play Game"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;
