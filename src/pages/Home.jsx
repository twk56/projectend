import React, { useState, useEffect } from 'react';
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
  const [rooms, setRooms] = useState([]);  // เก็บข้อมูลห้อง
  const [role, setRole] = useState('guest');  // เก็บ role, ค่าเริ่มต้นคือ guest
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะการโหลด
  const [error, setError] = useState(null); // เก็บข้อความข้อผิดพลาด

  // ดึงข้อมูลของผู้ใช้และ role เมื่อเพจโหลด
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // ดึงข้อมูลห้องจาก API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:4999/api/admin/rooms', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // ส่ง token หากมี
          },
        });
        setRooms(response.data);  // เก็บข้อมูลห้องใน state
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลห้องได้:", error);
        setError("ไม่สามารถดึงข้อมูลห้องได้");
      } finally {
        setLoading(false); // สถานะโหลดเสร็จสิ้น
      }
    };

    fetchRooms();
  }, []);

  // ฟังก์ชันเพื่อจัดการสถานะของห้อง
  const handleStatusChange = async (roomId, status) => {
    try {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, status } : room
        )
      );

      const response = await axios.patch(`/api/admin/rooms/${roomId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ส่ง token หากมี
        },
      });

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
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} key={room._id}>
                <RoomCard status={room.status}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:4999/uploads/${room.image}`}
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

                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                      ห้องนี้ {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                    </Typography>

                    {/* แสดงปุ่มเปิด/ปิด เมื่อเป็น admin เท่านั้น */}
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
                        sx={{ textAlign: 'center' }}
                      />
                    )}
                  </CardContent>
                </RoomCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer>
        <Typography variant="body2">
          {role === 'guest' ? 'คุณยังไม่ได้ล็อกอิน' : `ผู้ใช้: ${role}`}
        </Typography>
      </Footer>
    </Box>
  );
};

export default Homepage;
