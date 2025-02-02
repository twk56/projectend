import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// สร้าง Style ของ Container
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
}));

// สร้าง Style ของ Card
const LoginCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '400px',
}));


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // ตรวจสอบความถูกต้องของฟอร์ม
    let valid = true;
    let tempErrors = { email: '', password: '' };

    if (!email) {
      tempErrors.email = 'กรุณากรอกอีเมล';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      valid = false;
    }

    if (!password) {
      tempErrors.password = 'กรุณากรอกรหัสผ่าน';
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      valid = false;
    }

    setErrors(tempErrors);

    if (valid) {
      console.log('Logging in:', email, password);
      // เพิ่มฟังก์ชันการล็อกอินจริงตามต้องการ
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer>
      <LoginCard>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* ไอคอนล็อกอิน */}
            <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              เข้าสู่ระบบ
            </Typography>

            {/* ฟอร์มล็อกอิน */}
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                label="อีเมล"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
              <FormControl variant="outlined" fullWidth margin="normal" required error={Boolean(errors.password)}>
                <InputLabel htmlFor="password">รหัสผ่าน</InputLabel>
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
                  label="รหัสผ่าน"
                />
                <FormHelperText>{errors.password}</FormHelperText>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
              >
                เข้าสู่ระบบ
              </Button>
            </Box>

            {/* ตัวเลือกเข้าสู่ระบบผ่านโซเชียลมีเดีย */}
            <Typography variant="body1" align="center" sx={{ mt: 3, mb: 1 }}>
              หรือเข้าสู่ระบบด้วย
            </Typography>
            {/* ลิงก์สมัครสมาชิก */}
            <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
              <Grid item>
                <Typography variant="body2">
                  ยังไม่มีบัญชี?{' '}
                  <Button href="/register" variant="text" sx={{ textTransform: 'none' }}>
                    สมัครสมาชิก
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </LoginCard>
    </StyledContainer>
  );
};

export default Login;
