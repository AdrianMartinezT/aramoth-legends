import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import logo from './assets/LogoHorizontal.svg'; // Logo para la barra de navegación
import icono from './assets/Logofinal.svg'; // Icono para la sección hero

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
              >
                Play Game
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
