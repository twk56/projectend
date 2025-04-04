import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Container, Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BASE_URL from "../config";
import dayjs from "../utils/dayjsConfig";
import AddRoom from "../components/AddRoom";
import RoomCard from "../components/RoomCard";
import Footer from "../components/Footer";
import { getImageUrl } from '../utils/getImageUrl';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState("guest");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole("guest");
        setRooms([]);
        return;
      }

      const [profileRes, roomsRes, bookingsRes] = await Promise.all([
        axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/admin/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRole(profileRes.data.role);
      setUserId(profileRes.data._id);
      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const cancelExpiredBookings = async () => {
    const token = localStorage.getItem("token");
    const now = dayjs();

    const expired = bookings.filter((b) => now.isAfter(dayjs(b.endTime)));
    if (expired.length === 0) return;

    try {
      await Promise.all(
        expired.map((b) =>
          axios.delete(`${BASE_URL}/bookings/${b._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setBookings(bookings.filter((b) => now.isBefore(dayjs(b.endTime))));
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "ลบการจองอัตโนมัติผิดพลาด"
      );
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(cancelExpiredBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (roomId, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${BASE_URL}/admin/rooms/${roomId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, status: res.data.status } : room
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "ไม่สามารถเปลี่ยนสถานะห้องได้"
      );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("คุณแน่ใจว่าจะยกเลิกการจองนี้?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("ยกเลิกการจองแล้ว");
    } catch (err) {
      toast.error(err.response?.data?.message || "ยกเลิกการจองล้มเหลว");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("คุณแน่ใจว่าจะลบห้องนี้?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      toast.success("ลบห้องเรียบร้อย");
    } catch (err) {
      toast.error(err.response?.data?.message || "ลบห้องไม่สำเร็จ");
    }
  };

  const handleAddRoom = async (name, image) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/admin/rooms`,
        { name, image, status: "available" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms((prev) => [...prev, res.data]);
      setOpenAddDialog(false);
      toast.success("เพิ่มห้องเรียบร้อย");
    } catch (err) {
      toast.error(err.response?.data?.message || "ไม่สามารถเพิ่มห้องได้");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EBEBEBFF, #FFFBFBFF)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container sx={{ flexGrow: 1, py: 4 }}>
        {role === "admin" && (
          <Box sx={{ mb: 4, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddDialog(true)}
            >
              เพิ่มห้องใหม่
            </Button>
          </Box>
        )}

        {loading ? (
          <Typography align="center">กำลังโหลด...</Typography>
        ) : error ? (
          <Typography align="center" color="error">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => {
              const booking = bookings.find((b) => b.room === room.name);
              return (
                <Grid item xs={12} sm={6} md={4} key={room._id}>
                  <RoomCard
                    room={room}
                    booking={booking}
                    role={role}
                    userId={userId}
                    getImageUrl={getImageUrl}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteRoom}
                    onCancelBooking={handleCancelBooking}
                    onClickImage={() => navigate("/booking")}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {bookingError && (
        <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
          {bookingError}
        </Typography>
      )}

      <Footer role={role} />

      <AddRoom
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleAddRoom={handleAddRoom}
      />

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Box>
  );
};

export default Home;
