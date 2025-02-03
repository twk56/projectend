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
  Link
} from "@mui/material";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ studentId, password });
      localStorage.setItem("token", response.data.token); // ✅ เก็บ Token
      alert("✅ เข้าสู่ระบบสำเร็จ!");

      navigate("/"); // ✅ ไปที่หน้า Profile ทันที
      setTimeout(() => {
        window.location.reload(); // ✅ รีเฟรชหน้าเพื่ออัปเดต Navbar
      }, 100);
    } catch (error) {
      setError(error.response?.data?.error || "❌ รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",             // ให้เต็มความสูงจอ
        display: "flex",                // จัดเรียงลูกภายใน
        alignItems: "center",           // จัดกลางแนวแกน y
        justifyContent: "center",       // จัดกลางแนวแกน x
        background: "linear-gradient(to right, #73c8a9, #373b44)", // พื้นหลังแบบ Gradient
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" component="h2" textAlign="center" mb={2}>
          เข้าสู่ระบบ
        </Typography>

        {/* ถ้ามี error จะแสดง Alert สีแดง */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            margin="normal"
            required
            label="รหัสนักศึกษา"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            required
            type="password"
            label="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            เข้าสู่ระบบ
          </Button>
        </Box>

        <Typography variant="body2" align="center" mt={2}>
          ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
