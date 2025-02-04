// Homepage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/system';

const RoomCard = styled(Card)(({ theme, status }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '12px',
  border: `1px solid ${
    status === 'available'
      ? theme.palette.success.main
      : theme.palette.error.main
  }`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: status === 'available' ? '#e8f5e9' : '#ffebee',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFFFF',
  color: '#000',
  textAlign: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const Homepage = () => {
  // กำหนดห้องทั้งหมดให้เป็นสถานะ available
  const rooms = [
    { id: 1, name: 'CO-WORKING', status: 'available' },
    { id: 2, name: 'Operating Systems', status: 'available' },
    { id: 3, name: 'Data Management Systems', status: 'available' },
    { id: 4, name: 'Computer Room & Control Systems', status: 'available' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EBEBEBFF, #FFFBFBFF)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} key={room.id}>
              <RoomCard status={room.status}>
                <CardMedia
                  component="img"
                  height="140"
                  image="src/images/co-working.jpeg"
                  alt={`${room.name} Image`}
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color:
                        room.status === 'available'
                          ? 'success.main'
                          : 'error.main',
                      mb: 2,
                    }}
                  >
                    {room.name}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', mb: 1 }}
                  >
                    ห้องนี้ว่าง
                  </Typography>
                </CardContent>
              </RoomCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer>
        <Typography variant="body2">
          © {new Date().getFullYear()} CE-ระบบปฏิบัติการ
        </Typography>
      </Footer>
    </Box>
  );
};

export default Homepage;
