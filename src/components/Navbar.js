import React, { useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Importamos el componente Link
import logo from '../assets/LogoHorizontal.svg';
import { WalletContext } from '../context/WalletContext';  // Asegúrate de importar el contexto

const CustomNavbar = () => {
  const { walletConnected, disconnectWallet } = useContext(WalletContext);  // Accedemos al contexto

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-logo">  {/* Usamos Link para redirigir */}
          <img src={logo} alt="ARAMOTH LEGENDS Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-items">
            <Nav.Link href="#main">Main</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#story">Story</Nav.Link>
            <Nav.Link href="#eng">ENG</Nav.Link>

            {/* Botón "Salir" solo si la wallet está conectada, aplicando estilo similar a los links */}
            {walletConnected && (
              <Nav.Link
                as={Button}
                variant="link"
                className="nav-link" // Aplicamos la clase nav-link para que coincida con el estilo
                onClick={disconnectWallet}
                style={{ color: 'black', textTransform: 'uppercase' }} // Aseguramos que se vea como los otros links
              >
                Go Out
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
