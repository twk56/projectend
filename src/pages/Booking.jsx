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

// ==== สำหรับ Date/Time Picker และ Day.js ====
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Plugin & Locale
import dayjs from 'dayjs';
import 'dayjs/locale/th'; // Locale ไทย
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('th');
dayjs.tz.setDefault('Asia/Bangkok');

const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: '500px',
  marginTop: theme.spacing(4),
}));

const Booking = () => {
  const availableRooms = [
    'CO-WORKING',
    'Operating Systems',
    'Data Management Systems',
    'Computer Room & Control Systems',
  ];

  const [room, setRoom] = useState('');
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // กำหนด minTime / maxTime ช่วง 09:00 - 18:00
  const minTime = dayjs().tz('Asia/Bangkok').set('hour', 9).set('minute', 0);
  const maxTime = dayjs().tz('Asia/Bangkok').set('hour', 18).set('minute', 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!time) {
      setError('กรุณาเลือกเวลา');
      return;
    }

    // ตรวจสอบว่าค่า time อยู่ในช่วง 09:00-18:00 จริงหรือไม่
    if (time.isBefore(minTime) || time.isAfter(maxTime)) {
      setError('กรุณาเลือกเวลาได้เฉพาะช่วง 09:00 - 18:00 น.');
      return;
    }

    // แสดงผลเวลาในรูปแบบ HH:mm น.
    const timeString = time.format('HH:mm [น.]');
    setMessage(`จองห้อง "${room}" เรียบร้อยแล้ว เวลา ${timeString} ใช้งาน ${duration}`);

    // รีเซ็ตฟอร์ม
    setRoom('');
    setTime(null);
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
          ห้อง
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

          {/* TimePicker ตั้งค่าให้ใช้งาน 24 ชม., ขั้นเวลา 30 นาที ฯลฯ */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="เลือกเวลา (09:00 - 18:00)"
              value={time}
              onChange={(newValue) => setTime(newValue)}
              ampm={false}             // ใช้ระบบ 24 ชั่วโมง
              views={['hours', 'minutes']}   // ให้เลือกแค่ชั่วโมงและนาที
              reduceAnimations={true}  // ลด Animation ให้เปลี่ยนไวขึ้น
              minutesStep={30}         // เลือกทีละ 30 นาที
              minTime={minTime}
              maxTime={maxTime}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            />
          </LocalizationProvider>

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
            <MenuItem value="1 ชั่วโมง 30 นาที">1 ชั่วโมง 30 นาที</MenuItem>
            <MenuItem value="2 ชั่วโมง">2 ชั่วโมง</MenuItem>
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
