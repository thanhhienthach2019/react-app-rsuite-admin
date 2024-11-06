import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Logo/logo.css';
import { Stack } from 'rsuite';

const Brand = props => {
  return (
    <Stack className="brand" {...props}>
      <Logo height={40} style={{ marginTop: 6 }} />
      <Link to="/">
        <span style={{ marginLeft: 14 }}>Admin System</span>
      </Link>
    </Stack>
  );
};

export default Brand;
