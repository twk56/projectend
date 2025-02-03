import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api"; // เรียกใช้ API
import { Container, TextField, Button, Typography, Avatar, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

// ปรับแต่ง Avatar
const ProfileAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  margin: "auto",
  cursor: "pointer",
});

// ปรับแต่ง Container
const ProfileContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "2rem",
});

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    studentId: "",
    profileImage: "",
  });

  const [newName, setNewName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/login"; // ส่งกลับไปหน้า Login
        return;
      }

      try {
        const response = await getProfile(token);
        setProfile(response.data);
        setNewName(response.data.name); // เซ็ตค่าเริ่มต้นของชื่อ
        setImagePreview(response.data.profileImage); // โหลดรูปภาพที่มีอยู่แล้ว
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์");
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleNameChange = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await updateProfile(token, { name: newName });
      setProfile((prev) => ({ ...prev, name: newName }));
      alert("✅ อัปเดตชื่อสำเร็จ!");
    } catch (error) {
      alert("❌ ไม่สามารถอัปเดตชื่อได้");
      console.error(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // แสดงตัวอย่างภาพ
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const token = localStorage.getItem("token");
    try {
      const response = await updateProfile(token, formData, true);
      setProfile((prev) => ({ ...prev, profileImage: response.data.profileImage }));
      alert("✅ อัปโหลดรูปสำเร็จ!");
    } catch (error) {
      alert("❌ ไม่สามารถอัปโหลดรูปได้");
      console.error(error);
    }
  };

  return (
    <ProfileContainer maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, textAlign: "center", width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          โปรไฟล์ของคุณ
        </Typography>

        {/* Avatar สำหรับโปรไฟล์ */}
        <ProfileAvatar src={imagePreview || "/default-avatar.png"} />

        {/* อัพโหลดรูปโปรไฟล์ */}
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "1rem" }} />
        <Button variant="contained" color="primary" onClick={handleUploadImage} sx={{ marginTop: 2 }}>
          อัปโหลดรูป
        </Button>

        {/* แสดงข้อมูลผู้ใช้ */}
        <Box sx={{ marginTop: 3, textAlign: "left", width: "100%" }}>
          <Typography variant="h6">อีเมล: {profile.email}</Typography>
          <Typography variant="h6">รหัสนักศึกษา: {profile.studentId}</Typography>

          {/* แก้ไขชื่อ */}
          <TextField
            label="ชื่อของคุณ"
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button variant="contained" color="secondary" fullWidth sx={{ marginTop: 2 }} onClick={handleNameChange}>
            อัปเดตชื่อ
          </Button>
        </Box>
      </Paper>
    </ProfileContainer>
  );
};

export default Profile;
