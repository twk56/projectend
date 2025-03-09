import axios from "axios";

const API_URL = "http://localhost:4999/api";

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response;
};

export const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

    return await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProfile = async (data, isFile = false) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

    return await axios.put(`${API_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFile ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" })
        }
    });
};

export const bookRoom = async (bookingData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อนทำการจอง");

    console.log(" Sending token:", token);

    return await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    });
};