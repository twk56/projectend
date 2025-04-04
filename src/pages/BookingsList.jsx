import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BASE_URL from "../config";
import { Trash2 } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("th");
dayjs.tz.setDefault("Asia/Bangkok");

const ConfirmationDialog = lazy(() =>
  import("../components/ConfirmationDialog")
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.1 },
  }),
  exit: { opacity: 0, x: 20 },
};

const fetchBookings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อน");
  const response = await axios.get(`${BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data || [];
};

const cancelBookingAPI = async (bookingId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อน");
  const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const BookingsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentStudentId = localStorage.getItem("studentId") || "";
  const currentUserRole = localStorage.getItem("role");

  useEffect(() => {
    if (!currentStudentId && currentUserRole !== "admin") {
      setError("ไม่พบรหัสนักศึกษา กรุณาล็อกอินใหม่");
    }
  }, [currentStudentId, currentUserRole]);

  const {
    data: bookings = [],
    isLoading,
    isError,
    error: queryError,
  } = useQuery("bookings", fetchBookings, {
    onError: (err) => {
      setError(err.message || "ไม่สามารถดึงข้อมูลการจองได้");
      if (err.message === "กรุณาเข้าสู่ระบบก่อน") navigate("/login");
    },
    refetchOnWindowFocus: true,
  });

  const cancelMutation = useMutation(cancelBookingAPI, {
    onSuccess: (data) => {
      setMessage(data.message || "ยกเลิกการจองสำเร็จ");
      queryClient.invalidateQueries("bookings");
    },
    onError: (err) => {
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการยกเลิกการจอง"
      );
    },
  });

  const handleDeleteClick = useCallback((booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking._id);
      setDialogOpen(false);
      setSelectedBooking(null);
    }
  }, [selectedBooking, cancelMutation]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedBooking(null);
  }, []);

  const myBookings =
    currentUserRole === "admin"
      ? bookings
      : bookings?.filter(
          (b) => String(b.user?.studentId) === currentStudentId
        ) || [];
  const otherBookings =
    currentUserRole === "admin"
      ? []
      : bookings?.filter(
          (b) => String(b.user?.studentId) !== currentStudentId
        ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          รายการเข้าใช้ห้อง
        </h1>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg shadow"
            >
              {message}
            </motion.div>
          )}
          {(error || isError) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow"
            >
              {error || queryError?.message || "เกิดข้อผิดพลาด"}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              รายการเข้าใช้ของฉัน
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {myBookings.length > 0 ? (
                  myBookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      variants={listItemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-lg font-medium text-gray-800">
                          {booking.room} -{" "}
                          {dayjs(booking.startTime).format("DD/MM/YYYY HH:mm")}{" "}
                          ถึง {dayjs(booking.endTime).format("HH:mm")}
                        </p>
                        <p className="text-sm text-gray-600">
                          ผู้เข้าใช้งาน: {booking.user?.studentId || "ไม่ระบุ"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(booking)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 py-4"
                  >
                    ไม่มีรายการเข้าใช้ของคุณ
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {currentUserRole !== "admin" && (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
                  รายการเข้าใช้ของคนอื่น
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {otherBookings.length > 0 ? (
                      otherBookings.map((booking, index) => (
                        <motion.div
                          key={booking._id}
                          variants={listItemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <p className="text-lg font-medium text-gray-800">
                            ห้อง: {booking.room}
                          </p>
                          <p className="text-sm text-gray-600">
                            ผู้เข้าใช้: {booking.user?.studentId || "ไม่ระบุ"}
                          </p>
                          <p className="text-sm text-gray-600">
                            เวลา: {dayjs(booking.startTime).format("HH:mm")} ถึง{" "}
                            {dayjs(booking.endTime).format("HH:mm")}
                          </p>
                          <p className="text-sm text-gray-600">
                            วันที่:{" "}
                            {dayjs(booking.startTime).format("DD/MM/YYYY")}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 py-4"
                      >
                        ไม่มีรายการเข้าใช้ของคนอื่น
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </>
        )}

        <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
          {dialogOpen && (
            <ConfirmationDialog
              open={dialogOpen}
              title="ยืนยันการยกเลิกการใช้งาน"
              content="คุณต้องการยกเลิกการใช้งานหรือไม่?"
              onConfirm={handleConfirmCancel}
              onClose={handleDialogClose}
            />
          )}
        </Suspense>
      </motion.div>
    </div>
  );
};

export default BookingsList;
