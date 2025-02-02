// Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

// นำเข้าไอคอนจาก Material-UI (ลบ HomeIcon ออก)
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BookIcon from '@mui/icons-material/Book';
import MenuIcon from '@mui/icons-material/Menu';

// ฟังก์ชันซ่อน Navbar เมื่อเลื่อนลง
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// ปรับแต่ง AppBar ให้มีพื้นหลังสีขาวและขอบสีดำ
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF', // พื้นหลังสีขาว
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // เงาเบา
  borderBottom: '1px solid #000000', // ขอบล่างสีดำ
}));

// ปรับแต่งปุ่มนำทางให้มีสีดำ
const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  textTransform: 'none', // ปุ่มไม่ใช้ตัวพิมพ์ใหญ่ทั้งหมด
  color: '#000000', // สีข้อความสีดำ
  fontWeight: '500',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // เปลี่ยนสีพื้นหลังเมื่อโฮเวอร์
  },
}));

// ปรับแต่งโลโก้ให้เป็นสีดำและเพิ่มเคอร์เซอร์เปลี่ยนเป็น pointer
const Logo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: 'bold',
  letterSpacing: '0.2rem',
  color: '#000000', // สีดำ
  textDecoration: 'none',
  cursor: 'pointer',
}));

// ปรับแต่งเมนูสำหรับหน้าจอมือถือ
const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

// ปรับแต่งเมนูสำหรับเดสก์ท็อป
const DesktopMenu = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // ลบรายการ "Home" ออกจาก menuItems
  const menuItems = [
    { text: 'จองห้อง', icon: <BookIcon />, link: '/booking' },
    { text: 'เข้าสู่ระบบ', icon: <LoginIcon />, link: '/login' },
    { text: 'สมัครสมาชิก', icon: <PersonAddIcon />, link: '/register' },
  ];

  return (
    <>
      <HideOnScroll>
        <StyledAppBar position="fixed">
          <Toolbar>
            <Logo variant="h6" component={Link} to="/">
              CE
            </Logo>

            {/* เมนูสำหรับเดสก์ท็อป */}
            <DesktopMenu>
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={Link}
                  to={item.link}
                  startIcon={item.icon}
                >
                  {item.text}
                </NavButton>
              ))}
            </DesktopMenu>

            {/* เมนูสำหรับมือถือ */}
            <MobileMenuButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </MobileMenuButton>
          </Toolbar>
        </StyledAppBar>
      </HideOnScroll>

      {/* Drawer สำหรับเมนูมือถือ */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.link}
              >
                <ListItemIcon style={{ color: '#000000' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} style={{ color: '#000000' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
