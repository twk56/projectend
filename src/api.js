import axios from "axios";

const API_URL = "http://localhost:4999/api";

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

export const getProfile = async (token) => {
    return await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProfile = async (token, data, isFile = false) => {
    return await axios.put(`${API_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFile ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" })
        }
    });
};