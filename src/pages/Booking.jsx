import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
} from '@mui/material';
import { styled } from '@mui/system';
import { MenuItem } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('th');
dayjs.tz.setDefault('Asia/Bangkok');

const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: '500px',
  marginTop: theme.spacing(4),
  minHeight: '450px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Booking = () => {
  const availableRooms = [
    'CO-WORKING',
    'Operating Systems',
    'Data Management Systems',
    'Computer Room & Control Systems',
  ];
  const { roomId } = useParams();
  const [room, setRoom] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const minTime = dayjs().tz('Asia/Bangkok').set('hour', 0).set('minute', 0);
  const maxTime = dayjs().tz('Asia/Bangkok').set('hour', 23).set('minute', 59);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (roomId) {
      try {
        const response = await axios.get(`http://localhost:4999/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        setError('ไม่สามารถดึงข้อมูลห้องได้');
      }
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!startTime || !endTime) {
      setError('กรุณาเลือกช่วงเวลา');
      return;
    }

    if (startTime.isAfter(endTime)) {
      setError('เวลาเริ่มต้นต้องก่อนเวลาเสร็จสิ้น');
      return;
    }

    // คำนวณระยะเวลา
    const durationMinutes = endTime.diff(startTime, 'minute');
    const durationString = `${durationMinutes} นาที`;
    setDuration(durationString);

    // แสดงผลเวลาในรูปแบบที่ง่ายขึ้น
    const startTimeString = startTime.format('HH:mm [น.]');
    const endTimeString = endTime.format('HH:mm [น.]');
    setMessage(`จองห้อง "${room}" เรียบร้อยแล้ว ตั้งแต่เวลา ${startTimeString} ถึง ${endTimeString} ใช้งาน ${durationString}`);

    // รีเซ็ตฟอร์ม
    setRoom('');
    setStartTime(null);
    setEndTime(null);
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* เลือกห้อง */}
          <TextField
            select
            label="เลือกห้อง (ที่ว่าง)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {availableRooms.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          {/* เลือกเวลาเริ่มต้น */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="เวลาเริ่มต้น"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              minTime={minTime}
              maxTime={maxTime}
              ampm={false}  // ปิด AM/PM, ใช้ 24 ชั่วโมง
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />
          </LocalizationProvider>

          {/* เลือกเวลาเสร็จสิ้น */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="เวลาเสร็จสิ้น"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              minTime={startTime || minTime}
              maxTime={maxTime}
              ampm={false}  // ปิด AM/PM, ใช้ 24 ชั่วโมง
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />
          </LocalizationProvider>

          {/* แสดงระยะเวลาที่คำนวณได้ */}
          <TextField
            label="ระยะเวลา"
            value={duration}
            fullWidth
            margin="normal"
            disabled
          />

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
