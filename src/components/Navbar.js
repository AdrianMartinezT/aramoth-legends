import React, { useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Importamos el componente Link
import logo from '../assets/LogoHorizontal.svg';
import { WalletContext } from '../context/WalletContext';  

const CustomNavbar = () => {
  const { walletConnected, disconnectWallet } = useContext(WalletContext);  // Accedemos al contexto

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-logo">  
          <img src={logo} alt="ARAMOTH LEGENDS Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-items">
            <Nav.Link href="#main">Main</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#story">Story</Nav.Link>
            <Nav.Link href="#eng">ENG</Nav.Link>

            {/* Mostrar los botones "Gallery" y "Go Out" solo si la wallet está conectada */}
            {walletConnected && (
              <>
                <Nav.Link
                  as={Link}
                  to="/gallery"
                  className="nav-link" 
                  style={{ color: 'black', textTransform: 'uppercase' }}
                >
                  Gallery
                </Nav.Link>
                
                <Nav.Link
                  as={Button}
                  variant="link"
                  className="nav-link" 
                  onClick={disconnectWallet}
                  style={{ color: 'black', textTransform: 'uppercase' }} 
                >
                  Go Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
