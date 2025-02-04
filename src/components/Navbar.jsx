import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// นำเข้าไอคอน
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";

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

// ปรับแต่ง AppBar
const StyledAppBar = styled(AppBar)({
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderBottom: "1px solid #000000",
});

// ปรับแต่งปุ่มนำทาง
const NavButton = styled(Button)({
  marginLeft: "16px",
  marginRight: "16px",
  transition: "transform 0.3s ease, background-color 0.3s ease",
  textTransform: "none",
  color: "#000000",
  fontWeight: "500",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});

// ปรับแต่งโลโก้
const Logo = styled(Typography)({
  flexGrow: 1,
  fontWeight: "bold",
  letterSpacing: "0.2rem",
  color: "#000000",
  textDecoration: "none",
  cursor: "pointer",
});

// ปรับแต่งเมนูมือถือ
const MobileMenuButton = styled(IconButton)({
  display: "none",
  "@media (max-width: 600px)": {
    display: "block",
  },
});

// ปรับแต่งเมนูเดสก์ท็อป
const DesktopMenu = styled(Box)({
  display: "flex",
  alignItems: "center",
  "@media (max-width: 600px)": {
    display: "none",
  },
});

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ ตรวจสอบว่ามี Token หรือไม่ (โหลดครั้งแรก)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ Token
    setIsLoggedIn(false);
    navigate("/login"); // กลับไปหน้า Login
    setTimeout(() => window.location.reload(), 100); // ✅ รีเฟรชหลังจากเปลี่ยนเส้นทาง
  };

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
              {isLoggedIn && (
                <NavButton component={Link} to="/booking" startIcon={<BookIcon />}>
                  ห้อง
                </NavButton>
              )}

              {!isLoggedIn ? (
                <>
                  <NavButton component={Link} to="/login" startIcon={<LoginIcon />}>
                    เข้าสู่ระบบ
                  </NavButton>
                  <NavButton component={Link} to="/register" startIcon={<PersonAddIcon />}>
                    สมัครสมาชิก
                  </NavButton>
                </>
              ) : (
                <>
                  <NavButton component={Link} to="/profile" startIcon={<PersonIcon />}>
                    สถานะ
                  </NavButton>
                  <NavButton onClick={handleLogout} startIcon={<ExitToAppIcon />}>
                    ออกจากระบบ
                  </NavButton>
                </>
              )}
            </DesktopMenu>

            {/* เมนูสำหรับมือถือ */}
            <MobileMenuButton color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </MobileMenuButton>
          </Toolbar>
        </StyledAppBar>
      </HideOnScroll>

      {/* Drawer สำหรับเมนูมือถือ */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
          <List>
            {isLoggedIn && (
              <ListItem button component={Link} to="/booking">
                <ListItemIcon style={{ color: "#000000" }}>
                  <BookIcon />
                </ListItemIcon>
                <ListItemText primary="จองห้อง" style={{ color: "#000000" }} />
              </ListItem>
            )}

            {!isLoggedIn ? (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemIcon style={{ color: "#000000" }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="เข้าสู่ระบบ" style={{ color: "#000000" }} />
                </ListItem>

                <ListItem button component={Link} to="/register">
                  <ListItemIcon style={{ color: "#000000" }}>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="สมัครสมาชิก" style={{ color: "#000000" }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemIcon style={{ color: "#000000" }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="โปรไฟล์" style={{ color: "#000000" }} />
                </ListItem>

                <ListItem button onClick={handleLogout}>
                  <ListItemIcon style={{ color: "#000000" }}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="ออกจากระบบ" style={{ color: "#000000" }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
