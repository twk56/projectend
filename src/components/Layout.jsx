// components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          paddingTop: '64px', // ปรับตามความสูงของ Navbar (AppBar ปกติมีความสูง 64px)
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;
