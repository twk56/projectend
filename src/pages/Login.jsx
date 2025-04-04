import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
  Paper,
  Slide,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "420px",
  backdropFilter: "blur(6px)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: theme.spacing(1.5),
  textTransform: "none",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const Login = () => {
  const [formData, setFormData] = useState({ studentId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId.trim()) newErrors.studentId = "กรุณากรอกรหัสนักศึกษา";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value || "" });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { studentId: formData.studentId, password: formData.password };
    setStatus({ loading: true, error: "" });

    try {
      const response = await loginUser(payload);
      const { token, role } = response;
      localStorage.setItem("token", token);
      setStatus({ loading: false, error: "" });
      navigate("/");
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
      setStatus({ loading: false, error: errorMessage });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #1c92d2, #f2fcfe)",
      }}
    >
      <Container maxWidth="xs">
        <Slide in direction="up" timeout={500}>
          <StyledPaper elevation={3}>
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  align="center"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 4 }}
                >
                  <LoginIcon fontSize="large" sx={{ mb: -0.5, mr: 1 }} />
                  เข้าสู่ระบบ
                </Typography>

                {status.error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    ❌ {status.error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={handleLogin}
                  noValidate
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <TextField
                    fullWidth
                    required
                    autoComplete="off"
                    label="รหัสนักศึกษา"
                    variant="outlined"
                    value={formData.studentId}
                    onChange={handleChange("studentId")}
                    error={!!errors.studentId}
                    helperText={errors.studentId}
                    disabled={status.loading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    required
                    autoComplete="off"
                    type="password"
                    label="รหัสผ่าน"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange("password")}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={status.loading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={status.loading}
                    startIcon={
                      status.loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />
                    }
                  >
                    {status.loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                  </StyledButton>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  ยังไม่มีบัญชี?{" "}
                  <Link
                    href="/register"
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    สมัครสมาชิก
                  </Link>
                </Typography>
              </Box>
            </Fade>
          </StyledPaper>
        </Slide>
      </Container>
    </Box>
  );
};

export default Login;
