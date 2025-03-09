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
  Button,
} from '@mui/material';
import { styled } from '@mui/system';

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

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);

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
        console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4999/api/admin/rooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(response.data);
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลห้องได้:', error);
        setError('ไม่สามารถดึงข้อมูลห้องได้');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4999/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลการจองได้:', error);
        setBookingError('ไม่สามารถดึงข้อมูลการจองได้');
      }
    };
    fetchBookings();
  }, []);

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
      console.error('ไม่สามารถอัพเดตสถานะห้องได้:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4999/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        alert('ยกเลิกการจองสำเร็จ');
      } catch (error) {
        console.error('ไม่สามารถยกเลิกการจองได้:', error);
        alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`);
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
              const bookingOfThisRoom = bookings.find((b) => b.room === room.name);
              // const isRoomAvailable = !bookings.some((b) => b.room === room.name);
              const isRoomAvailable = !bookingOfThisRoom;
              // const isRoomAvailable = room.status === 'available';

              return (
                <Grid item xs={12} sm={6} key={room._id}>
                  <RoomCard status={room.status}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:4999/uploads/${room.image}`}
                      alt={`${room.name} Image`}
                      onClick={() => {
                        if (role !== 'user' && role !== 'admin') {
                          alert('คุณต้องล็อกอินเป็นผู้ใช้หรือผู้ดูแล');
                          return;
                        }
                        if (!isRoomAvailable) {
                          alert('ห้องนี้ไม่ว่าง');
                          return;
                        }
                        navigate('/booking');
                      }}
                      sx={{
                        pointerEvents:
                          (role !== 'user' && role !== 'admin') || !isRoomAvailable
                            ? 'none'
                            : 'auto',
                        opacity:
                          (role !== 'user' && role !== 'admin') || !isRoomAvailable
                            ? 0.5
                            : 1,
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
                          color: isRoomAvailable ? 'success.main' : 'error.main',
                          opacity: isRoomAvailable ? 1 : 0.5,
                        }}
                      >
                        {room.name}
                      </Typography>

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
                            ผู้จอง: {bookingOfThisRoom.user.studentId}
                          </Typography>
                          <Typography variant="body2">
                            เริ่ม: {new Date(bookingOfThisRoom.startTime).toLocaleString('th-TH')}
                          </Typography>
                          <Typography variant="body2">
                            สิ้นสุด: {new Date(bookingOfThisRoom.endTime).toLocaleString('th-TH')}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDetails(bookingOfThisRoom._id)}
                            >
                              ดูรายละเอียด
                            </Button>
                            {(role === 'user' || role === 'admin') && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleCancelBooking(bookingOfThisRoom._id)}
                              >
                                ยกเลิกการจอง
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                          ยังไม่มีการจอง
                        </Typography>
                      )}

                      {role === 'admin' && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={room.status === 'available'}
                              onChange={() =>
                                handleStatusChange(
                                  room._id,
                                  room.status === 'available' ? 'unavailable' : 'available'
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

export default Home;