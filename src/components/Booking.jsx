import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Container,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: '500px',
  marginTop: theme.spacing(4),
}));

const Booking = () => {
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // เพิ่มฟังก์ชันการจองห้องที่นี่
    setMessage(`จองห้อง ${room} เรียบร้อยแล้วสำหรับวันที่ ${date} เวลา ${time} เป็นเวลา ${duration}`);
    // รีเซ็ตฟอร์ม
    setRoom('');
    setDate('');
    setTime('');
    setDuration('');
  };

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
          จองห้อง
        </Typography>
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="เลือกห้อง"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="CO-WORKING">CO-WORKING</MenuItem>
            <MenuItem value="Operating Systems">Operating Systems</MenuItem>
            <MenuItem value="Data Management Systems">Data Management Systems</MenuItem>
            <MenuItem value="Computer Room & Control Systems">Computer Room & Control Systems</MenuItem>
          </TextField>

          <TextField
            label="เลือกวันที่"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="เลือกเวลา"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            select
            label="ระยะเวลา"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="30 นาที">30 นาที</MenuItem>
            <MenuItem value="1 ชั่วโมง">1 ชั่วโมง</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: '30px' }}
          >
            ยืนยันการจอง
          </Button>
        </form>
      </StyledContainer>
    </Box>
  );
};

export default Booking;
