import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: '500px',
  marginTop: theme.spacing(4),
}));

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:4999/api/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        setError('ไม่สามารถดึงข้อมูลการจองได้');
      }
    };
    fetchBooking();
  }, [id]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!booking) return <Typography>กำลังโหลด...</Typography>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <StyledContainer>
        <Typography variant="h4" align="center" gutterBottom>
          รายละเอียดการจอง
        </Typography>
        <Typography variant="body1">ห้อง: {booking.room}</Typography>
        <Typography variant="body1">ผู้จอง: {booking.user.studentId}</Typography>
        <Typography variant="body1">
          เริ่ม: {new Date(booking.startTime).toLocaleString('th-TH')}
        </Typography>
        <Typography variant="body1">
          สิ้นสุด: {new Date(booking.endTime).toLocaleString('th-TH')}
        </Typography>
      </StyledContainer>
    </Box>
  );
};

export default BookingDetails;