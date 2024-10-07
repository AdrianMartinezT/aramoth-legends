// src/components/Button.js
import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ label, onClick, loading }) => (
  <BootstrapButton variant="light" className="play-button" onClick={onClick}>
    {loading ? 'Conectando...' : label}
  </BootstrapButton>
);

export default Button;
