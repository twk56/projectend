import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

// นำเข้าไอคอนจาก Material-UI
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BookIcon from '@mui/icons-material/Book';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(45deg, #1976d2, #42a5f5)', // Gradient background
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
});

const NavButton = styled(Button)({
  marginLeft: '0.5rem',
  marginRight: '0.5rem',
  transition: 'transform 0.2s ease-in-out',
  textTransform: 'none', // กำหนดปุ่มให้อยู่ในรูปแบบปกติ ไม่ใช่ตัวพิมพ์ใหญ่ทั้งหมด
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.1rem' }}
        >
          อยากนอนเฉยๆอ่ะ
        </Typography>
        <Box>
          <NavButton color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
            Home
          </NavButton>
          <NavButton color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
            Login
          </NavButton>
          <NavButton color="inherit" component={Link} to="/register" startIcon={<PersonAddIcon />}>
            Register
          </NavButton>
          <NavButton color="inherit" component={Link} to="/booking" startIcon={<BookIcon />}>
            Booking
          </NavButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
