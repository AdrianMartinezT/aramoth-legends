import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/LogoHorizontal.svg'; 

const CustomNavbar = () => {
  return (
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
  );
};

export default CustomNavbar;
