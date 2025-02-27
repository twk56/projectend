import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  CardMedia,
  Switch,
  FormControlLabel,
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
  // State สำหรับห้องและ booking
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // ดึงข้อมูลผู้ใช้ (role)
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(response.data.role);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  // ดึงข้อมูลห้อง
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4999/api/admin/rooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(response.data);
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลห้องได้:", error);
        setError("ไม่สามารถดึงข้อมูลห้องได้");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ดึงข้อมูลการจอง
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4999/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลการจองได้:", error);
        setBookingError("ไม่สามารถดึงข้อมูลการจองได้");
      }
    };
    fetchBookings();
  }, []);

  // ฟังก์ชันอัปเดตสถานะห้อง
  const handleStatusChange = async (roomId, status) => {
    try {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, status } : room
        )
      );

      const response = await axios.patch(
        `http://localhost:4999/api/admin/rooms/${roomId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, status: response.data.status } : room
        )
      );
    } catch (error) {
      console.error("ไม่สามารถอัพเดตสถานะห้องได้:", error);
    }
  };

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
        {loading ? (
          <Typography variant="h6" align="center">
            กำลังโหลดข้อมูล...
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => {
              // หา booking ที่ตรงกับห้องนี้ (โดยเปรียบเทียบ room.name กับ booking.room)
              const bookingOfThisRoom = bookings.find((b) => b.room === room.name);
              const isRoomAvailable = room.status === 'available';
              return (
                <Grid item xs={12} sm={6} key={room._id}>
                  <RoomCard status={room.status}>
                  <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:4999/uploads/${room.image}`}
                      alt={`${room.name} Image`}
                      onClick={() => {
                        // ตรวจสอบ role ก่อนที่จะนำไปยังหน้า booking
                        if (role !== 'user' && role !== 'admin' || !isRoomAvailable) {
                          alert('คุณต้องล็อกอินเป็นผู้ใช้หรือผู้ดูแล และห้องต้องว่างก่อน');
                          return;
                        }
                        navigate(`/Booking`); // นำทางไปยังหน้า booking
                      }}
                    />
                    <CardContent
                      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
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
                      <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                        ห้องนี้ {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                      </Typography>

                      {/* แสดงข้อมูลการจอง ถ้ามีการจอง */}
                      {bookingOfThisRoom ? (
                        <Box
                          sx={{
                            backgroundColor: '#fffde7',
                            borderRadius: 1,
                            p: 1,
                            mt: 1,
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            ข้อมูลการจอง
                          </Typography>
                          <Typography variant="body2">
                            ชื่อผู้จอง: {bookingOfThisRoom.name}
                          </Typography>
                          <Typography variant="body2">
                            รหัสห้อง: {bookingOfThisRoom.roomCode}
                          </Typography>
                          <Typography variant="body2">
                            เวลาจอง: {new Date(bookingOfThisRoom.bookingTime).toLocaleString()}
                          </Typography>
                        </Box>
                      ) : (
                        // ถ้าไม่มีการจอง คุณสามารถเลือกที่จะแสดงข้อความ หรือปล่อยว่างไว้ก็ได้
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                          ยังไม่มีการจอง
                        </Typography>
                      )}

                      {/* แสดงสวิตช์สถานะห้อง เมื่อเป็น admin */}
                      {role === 'admin' && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={room.status === 'available'}
                              onChange={() =>
                                handleStatusChange(
                                  room._id,
                                  room.status === 'available'
                                    ? 'unavailable'
                                    : 'available'
                                )
                              }
                              color="primary"
                            />
                          }
                          label="เปิด/ปิด"
                          sx={{ textAlign: 'center', mt: 2 }}
                        />
                      )}
                    </CardContent>
                  </RoomCard>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* แสดง error การดึง bookings ถ้ามี */}
      {bookingError && (
        <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
          {bookingError}
        </Typography>
      )}

      <Footer>
        <Typography variant="body2">
          {role === 'guest' ? 'คุณยังไม่ได้ล็อกอิน' : `ผู้ใช้: ${role}`}
        </Typography>
      </Footer>
    </Box>
  );
};

export default Homepage;
