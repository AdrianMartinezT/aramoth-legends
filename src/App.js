import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import logo from './assets/LogoHorizontal.svg'; // Logo para la barra de navegación
import icono from './assets/Logofinal.svg'; // Icono para la sección hero
import toast, { Toaster } from 'react-hot-toast'; // Importar toast y Toaster

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  // Listener para capturar el movimiento del mouse y actualizar las coordenadas
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Detección de sistema operativo móvil (Android o iOS)
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    }
  }, []);

  // Detección de la wallet Phantom en versión escritorio
  useEffect(() => {
    const detectPhantomWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success(`Tu Wallet está conectada 👻`); // Mostrar el toast al conectar la wallet
        } catch (err) {
          console.log('Error al conectar la wallet Phantom', err);
        }
      }
    };

    detectPhantomWallet();
  }, []);

  // Función para conectar la wallet según el dispositivo
  const connectWallet = () => {
    if (isAndroid) {
      // Abrir la aplicación de Phantom en Android o redirigir a Google Play
      window.location.href = "https://phantom.app/android";
    } else if (isIOS) {
      // Abrir la aplicación de Phantom en iOS o redirigir a la App Store
      window.location.href = "https://phantom.app/ios";
    } else if (window.solana && window.solana.isPhantom) {
      // Abrir la extensión de Phantom en escritorio
      window.solana.connect()
        .then((response) => {
          setWalletConnected(true);
          setPublicKey(response.publicKey.toString());
          toast.success(`Tu Wallet está conectada 👻`); // Mostrar el toast al conectar
        })
        .catch((err) => {
          console.error("Error al conectar la wallet Phantom", err);
        });
    } else {
      alert("Phantom Wallet no está disponible. Por favor, instala la extensión o aplicación.");
      window.open("https://phantom.app/", "_blank");
    }
  };

  // Función para desconectar la wallet
  const disconnectWallet = () => {
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
      setWalletConnected(false);
      setPublicKey(null);
      toast.success("Wallet desconectada 👻"); // Mostrar el toast al desconectar
    }
  };

  return (
    <div 
      className="App"
      style={{
        backgroundImage: `url('/public/img/Fondo01.png'), radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.7) 300px)`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        height: '100vh'
      }}
    >
      <Toaster position="bottom-center" /> {/* Componente para mostrar los toasts */}

      {/* Mostrar mensajes dependiendo del sistema operativo */}
      {isAndroid && <p style={{color: 'white'}}>Estás usando un dispositivo Android</p>}
      {isIOS && <p style={{color: 'white'}}>Estás usando un dispositivo iOS</p>}

      {/* Barra de Navegación */}
      <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-logo">
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
    </div>
  );
}

export default App;
