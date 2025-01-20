import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Alert,
  InputAdornment,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/system';

// สร้าง Gradient Border พร้อม Animation
const GradientBorder = styled(Box)(({ theme }) => ({
  padding: '3px', // ความหนาของขอบ
  borderRadius: '16px',
  background:
    'linear-gradient(90deg, #ff6ec4, #7873f5, #3498db, #6bc1d2, #ff6ec4)', // สีไล่ระดับ
  backgroundSize: '200% 200%', // สร้างขนาดให้ใหญ่กว่าปกติ
  animation: 'gradient-animation 4s ease infinite', // เอฟเฟกต์เคลื่อนไหว

  // CSS Animation
  '@keyframes gradient-animation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const Register = () => {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setSuccess(false);
      return;
    }
    setError('');
    setSuccess(true);
    setStudentId('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #AABEE3FF, #8541EBFF)', // พื้นหลังสีน้ำเงิน
      }}
    >
      <GradientBorder>
        <Card
          sx={{
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 'bold',
                color: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockIcon sx={{ mr: 1, color: '#3498db' }} />
              Register
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ลงทะเบียนสำเร็จ!
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <TextField
                label="รหัสนักศึกษา"
                fullWidth
                margin="normal"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: '#8e44ad' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="อีเมล"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#8e44ad' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="ตั้งรหัสผ่าน"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#8e44ad' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="ตั้งรหัสผ่านอีกครั้ง"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#8e44ad' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  borderRadius: '30px',
                  backgroundColor: '#3498db',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                  },
                }}
              >
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </GradientBorder>
    </Container>
  );
};

export default Register;
