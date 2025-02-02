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
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/system';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
// ถ้าไฟล์ SVG มีอยู่, ใช้การนำเข้าดังนี้:
// import RegistrationIllustration from "../assets/registration-illustration.svg"; // ตรวจสอบเส้นทางให้ถูกต้อง

// ถ้าไม่มีไฟล์ SVG, ใช้ภาพ Placeholder:
const RegistrationIllustrationPlaceholder = "https://via.placeholder.com/400x300.png?text=Registration+Illustration";

// สร้าง Gradient Border พร้อม Animation
const GradientBorder = styled(Box)(({ theme }) => ({
  padding: '3px', // ความหนาของขอบ
  borderRadius: '16px',
  background:
    'linear-gradient(90deg, #ff6ec4, #7873f5, #3498db, #6bc1d2, #ff6ec4)', // สีไล่ระดับ
  backgroundSize: '200% 200%', // สร้างขนาดให้ใหญ่กว่าปกติ
  animation: 'gradient-animation 8s ease infinite', // เอฟเฟกต์เคลื่อนไหว

  // CSS Animation
  '@keyframes gradient-animation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

// สร้าง Style ของ Card
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  maxWidth: '800px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

// สร้าง Style ของรูปภาพประกอบ
const Illustration = styled('img')(({ theme }) => ({
  width: '50%',
  borderRadius: '16px',
  objectFit: 'cover', // ทำให้ภาพครอบคลุมพื้นที่อย่างสมบูรณ์
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
}));

// สร้าง Style ของ Social Buttons
const SocialButton = styled(Button)(({ theme, color }) => ({
  margin: theme.spacing(1, 0),
  textTransform: 'none',
  backgroundColor:
    color === 'google'
      ? '#DB4437'
      : color === 'facebook'
      ? '#3B5998'
      : color === 'twitter'
      ? '#1DA1F2'
      : '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor:
      color === 'google'
        ? '#c33d2e'
        : color === 'facebook'
        ? '#334d84'
        : color === 'twitter'
        ? '#0d95e8'
        : '#115293',
  },
}));

const Register = () => {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setSuccess(false);
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      setSuccess(false);
      return;
    }
    // เพิ่มฟังก์ชันการตรวจสอบข้อมูลเพิ่มเติมตามต้องการ
    setError('');
    setSuccess(true);
    setStudentId('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #AABEE3FF, #8541EBFF)', // พื้นหลังสีน้ำเงิน
      }}
    >
      <GradientBorder>
        <StyledCard>
          {/* รูปภาพประกอบ */}
          <Illustration
            src={RegistrationIllustrationPlaceholder} // ใช้ภาพ Placeholder ที่ถูกต้อง
            alt="Register Illustration"
          />

          {/* ฟอร์มการลงทะเบียน */}
          <Box sx={{ flex: 1, padding: '16px' }}>
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
                mb: 2,
              }}
            >
              <LockIcon sx={{ mr: 1, color: '#3498db' }} />
              ลงทะเบียน
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
                error={Boolean(error && !/\S+@\S+\.\S+/.test(email))}
                helperText={
                  error && !/\S+@\S+\.\S+/.test(email)
                    ? 'รูปแบบอีเมลไม่ถูกต้อง'
                    : ''
                }
              />
              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                required
                error={Boolean(error && password.length < 6)}
              >
                <InputLabel htmlFor="password">ตั้งรหัสผ่าน</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="ตั้งรหัสผ่าน"
                />
                <FormHelperText>
                  {password.length < 6 && 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'}
                </FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                required
                error={Boolean(error && password !== confirmPassword)}
              >
                <InputLabel htmlFor="confirm-password">ตั้งรหัสผ่านอีกครั้ง</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="ตั้งรหัสผ่านอีกครั้ง"
                />
                <FormHelperText>
                  {password !== confirmPassword && 'รหัสผ่านไม่ตรงกัน'}
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
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
                ลงทะเบียน
              </Button>
            </form>

            {/* ตัวเลือกลงทะเบียนผ่านโซเชียลมีเดีย */}
            <Typography variant="body1" align="center" sx={{ mt: 3, mb: 1 }}>
              หรือ ลงทะเบียนด้วย
            </Typography>
            {/* ลิงก์เข้าสู่ระบบ */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                มีบัญชีอยู่แล้ว?{' '}
                <Button href="/login" variant="text" sx={{ textTransform: 'none', color: '#3498db' }}>
                  เข้าสู่ระบบ
                </Button>
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </GradientBorder>
    </Container>
  );
};

export default Register;
