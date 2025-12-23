import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet /> {/* Renders the specific page (e.g., Home) */}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;