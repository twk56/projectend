import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';

// สร้าง Style ของ Card แต่ละห้อง พร้อมกำหนดความสูงและความกว้างคงที่
const RoomCard = styled(Card)(({ theme, status }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '16px',
  border: `2px solid ${
    status === 'available' ? theme.palette.success.main : theme.palette.error.main
  }`,
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  backgroundColor: status === 'available' ? '#e8f5e9' : '#ffebee',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  width: '100%',       // กำหนดให้การ์ดขยายกว้างเต็มพื้นที่ภายใน Grid item
  minHeight: '300px',  // ความสูงคงที่
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  },
}));

const Homepage = () => {
  const rooms = [
    { id: 1, name: 'CO-WORKING', status: 'available' },
    { id: 2, name: 'Operating Systems', status: 'unavailable' },
    { id: 3, name: 'Data Management Systems', status: 'available' },
    { id: 4, name: 'Computer Room & Control Systems', status: 'unavailable' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
      }}
    >
      {/* Engineering Room ตรงกลางบนสุด */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#1474D3FF',
          }}
        >
          ENGINEERING ROOM
        </Typography>
      </Box>

      {/* คอนเทนเนอร์สำหรับ 4 ห้อง */}
      <Box
        sx={{
          border: '3px solid #fff',
          borderRadius: '16px',
          p: 2,
          width: '100%',
          maxWidth: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="stretch"
        >
          {rooms.map((room) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={room.id}
              sx={{
                display: 'flex',
              }}
            >
              <RoomCard status={room.status}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: room.status === 'available' ? 'green' : 'red',
                      mb: 2,
                    }}
                  >
                    {room.name}
                  </Typography>
                  <Chip
                    label={room.status === 'available' ? 'Available' : 'Unavailable'}
                    color={room.status === 'available' ? 'success' : 'error'}
                    sx={{
                      display: 'block',
                      mx: 'auto',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      py: 0.5,
                      mb: 2,
                    }}
                  />
                  <Button
                    variant="contained"
                    color={room.status === 'available' ? 'success' : 'inherit'}
                    fullWidth
                    disabled={room.status === 'unavailable'}
                    sx={{
                      mt: 'auto',
                      py: 1.2,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: '30px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      backgroundColor:
                        room.status === 'available' ? '#4caf50' : '#f0f0f0',
                      color: room.status === 'available' ? '#fff' : '#9e9e9e',
                      '&:hover': {
                        backgroundColor:
                          room.status === 'available' ? '#388e3c' : '#f0f0f0',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    {room.status === 'available' ? 'Book Now' : 'Unavailable'}
                  </Button>
                </CardContent>
              </RoomCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Homepage;
