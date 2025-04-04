import axios from "axios";
import BASE_URL from '../config';

export const registerUser = async (userData) => {
  return await axios.post(`${BASE_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);
    console.log("Backend response:", response.data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("Stored token:", response.data.token);
    } else {
      console.error("No token returned from backend");
    }
    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  console.log("Frontend Token ที่ได้:", token); 
  if (!token || token === "undefined") {
    throw new Error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
  }

  return await axios.get(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = async (data, isFile = false) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

  return await axios.put(`${BASE_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFile ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" })
    }
  });
};

export const bookRoom = async (bookingData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อนทำการจอง");

  console.log("Sending token:", token);
  console.log("Sending booking data:", bookingData);

  return await axios.post(`${BASE_URL}/bookings`, bookingData, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json" 
    }
  });
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อนยกเลิกการจอง");

  console.log("Canceling booking ID:", bookingId);
  console.log("Sending token:", token);

  return await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json" 
    }
  });
};