// Homepage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/system';
import BookIcon from '@mui/icons-material/Book';

// สร้าง Style ของ Card แต่ละห้อง พร้อมกำหนดความสูงและความกว้างคงที่
const RoomCard = styled(Card)(({ theme, status }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '12px',
  border: `1px solid ${
    status === 'available' ? theme.palette.success.main : theme.palette.error.main
  }`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: status === 'available' ? '#e8f5e9' : '#ffebee',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  height: '100%', // ให้การ์ดยืดสูงตามเนื้อหา
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFFFF', // สี Gradient เดียวกับ Navbar
  color: '#000',
  textAlign: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const HomepageHeader = styled(Box)(({ theme }) => ({
  mb: 6,
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  width: '100%',
  textAlign: 'center',
  margin: '0 auto',
}));

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#FFFFFFFF', // สีที่เข้ากับ Navbar
}));

const StyledTypographySubtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: '#555',
}));

const StyledButton = styled(Button)(({ theme, status }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1),
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor:
    status === 'available' ? theme.palette.success.main : '#f0f0f0',
  color: status === 'available' ? '#fff' : '#9e9e9e',
  '&:hover': {
    backgroundColor:
      status === 'available' ? theme.palette.success.dark : '#f0f0f0',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const Homepage = () => {
  const rooms = [
    { id: 1, name: 'CO-WORKING', status: 'available', image: 'src/images/co-working.jpeg' },
    { id: 2, name: 'Operating Systems', status: 'unavailable', image: 'src/images/co-working.jpeg' },
    { id: 3, name: 'Data Management Systems', status: 'available', image: 'src/images/co-working.jpeg' },
    { id: 4, name: 'Computer Room & Control Systems', status: 'unavailable', image: 'src/images/co-working.jpeg' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EBEBEBFF, #FFFBFBFF)', // สี Gradient เข้ากับ Navbar
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* เนื้อหาหลัก */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        {/* คอนเทนเนอร์สำหรับห้อง */}
        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} key={room.id}>
              <RoomCard status={room.status}>
                {/* เพิ่มรูปภาพของห้อง */}
                <CardMedia
                  component="img"
                  height="140"
                  image={room.image} // เปลี่ยนเป็น path ของรูปภาพจริง
                  alt={`${room.name} Image`}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: room.status === 'available' ? 'success.main' : 'error.main',
                      mb: 2,
                    }}
                  >
                    {room.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    ห้องนี้ {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'} สามารถจองได้ผ่านปุ่มด้านล่าง
                  </Typography>

                  <StyledButton
                    variant="contained"
                    startIcon={<BookIcon />}
                    status={room.status}
                    fullWidth
                    disabled={room.status === 'unavailable'}
                  >
                    {room.status === 'available' ? 'จองห้อง' : 'ไม่สามารถจองได้'}
                  </StyledButton>
                </CardContent>
              </RoomCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Footer>
        <Typography variant="body2">
          © {new Date().getFullYear()} CE-ระบบปฏิบัติการ
        </Typography>
      </Footer>
    </Box>
  );
};

export default Homepage;
