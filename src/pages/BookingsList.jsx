import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelBooking } from '../utils/api';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Container, Alert } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import BASE_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('th');
dayjs.tz.setDefault('Asia/Bangkok');

const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: '800px',
  marginTop: theme.spacing(4),
  minHeight: '450px',
  display: 'flex',
  flexDirection: 'column',
}));

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

const alertVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const BookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบก่อน');
          navigate('/login');
          return;
        }
        const response = await axios.get(`${BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลการจองได้');
      }
    };
    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId);
      setMessage(response.data.message);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิก');
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
          รายการเข้าใช้ห้อง
        </Typography>
        <AnimatePresence>
          {message && (
            <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        <List>
          <AnimatePresence>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <motion.div key={booking._id} variants={listItemVariants} initial="hidden" animate="visible" exit="exit">
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleCancelBooking(booking._id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${booking.room} - ${dayjs(booking.startTime).format('DD/MM/YYYY HH:mm')} ถึง ${dayjs(booking.endTime).format('HH:mm')}`}
                      secondary={`ผู้เข้าใช้งาน: ${booking.user?.studentId || 'ไม่ระบุ'}`}
                    />
                  </ListItem>
                </motion.div>
              ))
            ) : (
              <motion.div variants={listItemVariants} initial="hidden" animate="visible">
                <Typography align="center">ไม่มีรายการเข้าใช้งาน</Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </List>
      </StyledContainer>
    </Box>
  );
};

export default BookingsList;
