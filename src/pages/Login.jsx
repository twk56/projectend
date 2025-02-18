import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api"; // ฟังก์ชันเชื่อมต่อ Backend
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress
} from "@mui/material";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ studentId, password });
      localStorage.setItem("token", response.data.token); // ✅ เก็บ Token
      alert("✅ เข้าสู่ระบบสำเร็จ!");
      navigate("/");

      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      setError(error.response?.data?.error || "❌ รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #1c92d2, #f2fcfe)", // พื้นหลังสีฟ้าสบายตา
      }}
    >
      <Container
        maxWidth="xs"  // ทำให้ฟอร์มกว้างไม่เกินขนาดมือถือ
        sx={{
          p: 4,
          borderRadius: "12px",
          boxShadow: 4,
          backgroundColor: "#fff",
          textAlign: "center",
          width: "100%",  // รองรับมือถือได้ดีขึ้น
          maxWidth: "400px", // กำหนดขนาดสูงสุดสำหรับมือถือ
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          เข้าสู่ระบบ
        </Typography>

        {/* แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            margin="dense"
            required
            label="รหัสนักศึกษา"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2, // เพิ่มระยะห่างระหว่างฟิลด์
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            required
            type="password"
            label="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2, // เพิ่มระยะห่างระหว่างฟิลด์
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "เข้าสู่ระบบ"}
          </Button>
        </Box>

        <Typography variant="body2" mt={2}>
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" sx={{ fontWeight: "bold", textDecoration: "none" }}>
            สมัครสมาชิก
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
