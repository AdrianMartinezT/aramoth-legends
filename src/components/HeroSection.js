import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import icono from '../assets/Logofinal.svg'; 

const HeroSection = ({ walletConnected, connectWallet, disconnectWallet }) => {
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
