import React, { useState } from "react";
import { registerUser } from "../api";
import { Container, TextField, Button, Typography, Alert, Box, Paper } from "@mui/material";

const Register = () => {
  const [user, setUser] = useState({ email: "", studentId: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (user.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      const response = await registerUser({
        email: user.email,
        studentId: user.studentId,
        password: user.password,
      });
      setSuccess(true);
      setError("");
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "มีข้อผิดพลาด");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>สมัครสมาชิก</Typography>
        {success && <Alert severity="success">✅ ลงทะเบียนสำเร็จ!</Alert>}
        {error && <Alert severity="error">❌ {error}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="ขื่อ-นามสกุล" type="email" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <TextField label="อีเมล" type="email" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <TextField label="รหัสสาขา" type="email" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <TextField label="รหัสนักศึกษา" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, studentId: e.target.value })} />
          <TextField label="รหัสผ่าน" type="password" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <TextField label="ยืนยันรหัสผ่าน" type="password" variant="outlined" fullWidth required onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontSize: "1.1rem", padding: 1.5 }}>
            สมัครสมาชิก
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
