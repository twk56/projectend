import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Paper,
  Divider,
  Fade,
  CircularProgress,
  Slide,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: theme.spacing(2),
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px) scale(1.01)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!user.fullName.trim()) newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!user.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    if (!/^\d{12}-\d$/.test(user.studentId.trim()))
      newErrors.studentId = "รหัสนักศึกษาต้องเป็นตัวเลข 13 หลัก";
    if (user.password.length < 6)
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (user.password !== user.confirmPassword)
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ loading: true, success: false, error: "" });

    try {
      await registerUser({
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        password: user.password,
      });
      setStatus({ loading: false, success: true, error: "" });
      setUser({
        fullName: "",
        email: "",
        studentId: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียน";
      setStatus({ loading: false, success: false, error: errorMessage });
    }
  };

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value || "" });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleLoginRedirect = () => navigate("/login");

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
      <Container maxWidth="sm">
        <Slide in={true} direction="up" timeout={500}>
          <StyledPaper elevation={3}>
            <Fade in={true} timeout={600}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 4 }}
                >
                  สมัครสมาชิก
                </Typography>

                {status.success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    ✅ ลงทะเบียนสำเร็จ!
                  </Alert>
                )}
                {status.error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    ❌ {status.error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={handleRegister}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  {[
                    { label: "ชื่อ-นามสกุล", field: "fullName" },
                    { label: "อีเมล", field: "email", type: "email" },
                    { label: "รหัสนักศึกษา", field: "studentId" },
                    { label: "รหัสผ่าน", field: "password", type: "password" },
                    {
                      label: "ยืนยันรหัสผ่าน",
                      field: "confirmPassword",
                      type: "password",
                    },
                  ].map(({ label, field, type = "text" }) => (
                    <TextField
                      key={field}
                      label={label}
                      type={type}
                      variant="outlined"
                      fullWidth
                      required
                      autoComplete="off"
                      value={user[field]}
                      onChange={handleChange(field)}
                      error={!!errors[field]}
                      helperText={errors[field]}
                      disabled={status.loading}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  ))}

                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={status.loading}
                    startIcon={status.loading && <CircularProgress size={20} />}
                  >
                    {status.loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                  </StyledButton>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  มีบัญชีแล้ว?{" "}
                  <Button
                    onClick={handleLoginRedirect}
                    color="primary"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    disabled={status.loading}
                  >
                    เข้าสู่ระบบ
                  </Button>
                </Typography>
              </Box>
            </Fade>
          </StyledPaper>
        </Slide>
      </Container>
    </Box>
  );
};

export default Register;
