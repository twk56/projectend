import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookRoom } from "../utils/api";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BASE_URL from "../config";
import { motion, AnimatePresence } from "framer-motion";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("th");
dayjs.tz.setDefault("Asia/Bangkok");

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const alertVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const minTime = dayjs().tz("Asia/Bangkok").startOf("day");
  const maxTime = dayjs().tz("Asia/Bangkok").endOf("day");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/admin/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const available = response.data.filter((r) => r.status === "available");
        setAvailableRooms(available);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลห้องจากฐานข้อมูลได้");
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (roomId) {
        try {
          const response = await axios.get(`${BASE_URL}/rooms/${roomId}`);
          setRoom(response.data.name);
        } catch (err) {
          setError("ไม่สามารถดึงข้อมูลห้องได้");
        }
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!startTime || !endTime) {
      setError("กรุณาเลือกช่วงเวลา");
      return;
    }

    if (startTime.isAfter(endTime)) {
      setError("เวลาเริ่มต้นต้องก่อนเวลาเสร็จสิ้น");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      navigate("/login");
      return;
    }

    const bookingData = {
      room,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    try {
      const response = await bookRoom(bookingData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4"
    >
      <motion.div
        variants={formItemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">เข้าใช้ห้อง</h2>

        <AnimatePresence>
          {message && (
            <motion.div
              variants={alertVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-4 p-4 bg-green-100 text-green-800 rounded-xl text-center"
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              variants={alertVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ห้อง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลือกห้อง (ที่ว่าง)
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              <option value="">-- เลือกห้อง --</option>
              {availableRooms.length > 0 ? (
                availableRooms.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))
              ) : (
                <option disabled>ไม่มีห้องว่าง</option>
              )}
            </select>
          </div>

          {/* เวลา */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เวลาเริ่มต้น
              </label>
              <TimePicker
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                minTime={minTime}
                maxTime={maxTime}
                ampm={false}
                slotProps={{
                  textField: {
                    required: true,
                    className:
                      "w-full p-3 rounded-xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200",
                  },
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เวลาเสร็จสิ้น
              </label>
              <TimePicker
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                minTime={startTime || minTime}
                maxTime={maxTime}
                ampm={false}
                slotProps={{
                  textField: {
                    required: true,
                    className:
                      "w-full p-3 rounded-xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200",
                  },
                }}
              />
            </div>
          </LocalizationProvider>

          {/* ปุ่ม */}
          <motion.button
            type="submit"
            variants={formItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:from-indigo-700 hover:to-blue-600 transition duration-300"
          >
            ยืนยัน
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Booking;
