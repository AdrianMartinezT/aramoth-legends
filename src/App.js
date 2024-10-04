import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import logo from './assets/logo.jpg'; // Logo para la barra de navegación
import icono from './assets/icono.jpg'; // Icono para la sección hero

function App() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  // Función para verificar si Phantom está disponible en el navegador
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      console.log('Phantom Wallet está disponible');
    } else {
      alert('Phantom Wallet no está instalada. Por favor, instala la extensión.');
    }
  }, []);

  // Función para desconectar Phantom antes de conectar para forzar la apertura del popup
  const disconnectWallet = async () => {
    const provider = window.solana;
    if (provider && provider.disconnect) {
      try {
        await provider.disconnect();
        setWalletAddress(null); // Limpiar el estado de la wallet cuando se desconecte
      } catch (err) {
        console.error('Error al desconectar la wallet:', err);
      }
    }
  };

  // Función para conectar la Phantom Wallet y forzar la apertura del popup
  const connectWallet = async () => {
    const provider = window.solana;

    if (provider && provider.isPhantom) {
      try {
        setLoading(true);
        // Desconectar siempre para forzar la apertura del popup
        await disconnectWallet();

        // Conectar a Phantom y abrir el popup
        const { publicKey } = await provider.connect({ onlyIfTrusted: false });
        setWalletAddress(publicKey.toString());
      } catch (err) {
        console.error('Error al conectar la wallet:', err);
        alert('Error al conectar la wallet');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Phantom Wallet no está disponible. Instalando...');
      window.open('https://phantom.app/', '_blank');
    }
  };

  return (
    <div className="App">
      {/* Barra de Navegación */}
      <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-logo">
            {/* Mostrar el logo de la barra de navegación */}
            <img src={logo} alt="ARAMOTH LEGENDS Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto navbar-items">
              <Nav.Link href="#main">Main</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#story">Story</Nav.Link>
              <Nav.Link href="#eng">ENG</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sección Hero */}
      <Container fluid className="hero-section">
        <Row className="align-items-center text-center">
          <Col>
            <div className="hero-content">
              {/* Mostrar el icono en la sección hero */}
              <img src={icono} alt="ARAMOTH LEGENDS" className="hero-logo" />

              <Button
                variant="light"
                className="mt-4 play-button"
                onClick={connectWallet} // Siempre conecta a Phantom
                disabled={loading}
              >
                {loading ? 'Conectando...' : 'Play Game'}
              </Button>

              {/* Mostrar la wallet conectada (opcional) */}
              {walletAddress && <p className="mt-4">Wallet conectada: {walletAddress}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
