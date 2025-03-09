import React, { useState, useEffect } from "react";
import { getProfile } from "../api"; // เรียกใช้ API
import { Container, Typography, Box, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/system";

const ProfileContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "2rem",
});

const Profile = () => {
  const [profile, setProfile] = useState({
    email: "",
    studentId: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await getProfile(token);
        setProfile({
          email: response.data.email,
          studentId: response.data.studentId,
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์");
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ProfileContainer maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, textAlign: "center", width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          โปรไฟล์ของคุณ
        </Typography>
        {/* แสดงรูปโปรไฟล์ */}
        <Avatar
          src={profile.profileImage || "/default-avatar.png"}
          sx={{ width: 100, height: 100, margin: "auto" }}
        />
        <Box sx={{ marginTop: 3, textAlign: "left", width: "100%" }}>
          <Typography variant="h6">อีเมล: {profile.email}</Typography>
          <Typography variant="h6">รหัสนักศึกษา: {profile.studentId}</Typography>
        </Box>
      </Paper>
    </ProfileContainer>
  );
};

export default Profile;
