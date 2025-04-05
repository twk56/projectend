import React, { useEffect, useState, useMemo, Suspense } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import BASE_URL from "../config";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <motion.h1
          className="text-red-500 text-2xl text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          เกิดข้อผิดพลาดในระบบ
        </motion.h1>
      );
    return this.props.children;
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StatsCard = React.lazy(() =>
  Promise.resolve({
    default: React.memo(({ title, data }) => (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03 }}
        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
      >
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-lg">{data}</p>
      </motion.div>
    )),
  })
);

const Admin = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [status, setStatus] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [loginCount, setLoginCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [chartData, setChartData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]); // state สำหรับเก็บข้อมูลผู้ใช้

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // ดึงข้อมูลประวัติการจอง
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/booking_logs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Bookings fetch failed with status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error("Bookings error:", err.message);
      setError("ไม่สามารถโหลดข้อมูลการจองได้");
    }
  };

  // ดึงข้อมูลสถิติ
  const fetchStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/stats`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`Stats fetch failed with status: ${response.status}`);
      const data = await response.json();
      setTotalUsers(data.totalUsers || 0);
      setLoginCount(data.loginCount || 0);
      setChartData({
        labels: ["ผู้ใช้ทั้งหมด", "จํานวนการเข้าใช้"],
        datasets: [
          {
            label: "สถิติระบบ",
            data: [data.totalUsers || 0, data.loginCount || 0],
            backgroundColor: ["#3498db", "#2ecc71"],
          },
        ],
      });
    } catch (err) {
      console.error("Stats error:", err.message);
      setError("ไม่สามารถโหลดข้อมูลสถิติได้");
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลผู้ใช้
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Users fetch failed with status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Users error:", err.message);
    }
  };

  useEffect(() => {
    setLoggedInUser("Admin");
    setStatus("ออนไลน์");

    fetchStats();
    fetchBookings();
    fetchUsers();
    const interval = setInterval(() => {
      fetchStats();
      fetchBookings();
      fetchUsers();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchStats();
    fetchBookings();
    fetchUsers();
  };

  const containerTheme =
    theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-900 text-gray-100";

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;
    return bookings.filter((log) => {
      const term = searchTerm.toLowerCase();
      const room = (log.bookingId?.room || log.details?.room || "").toLowerCase();
      const user = (log.userId?.fullName || "").toLowerCase();
      const action = (log.action || "").toLowerCase();
      return room.includes(term) || user.includes(term) || action.includes(term);
    });
  }, [bookings, searchTerm]);

  const sortedBookings = useMemo(() => {
    if (!sortColumn) return filteredBookings;
    return [...filteredBookings].sort((a, b) => {
      const getValue = (log) => {
        if (sortColumn === "room") {
          return log.bookingId?.room || log.details?.room || "";
        }
        if (sortColumn === "user") {
          return log.userId?.fullName || "";
        }
        if (sortColumn === "start") {
          return log.bookingId?.startTime || log.details?.startTime || "";
        }
        if (sortColumn === "end") {
          return log.bookingId?.endTime || log.details?.endTime || "";
        }
        return "";
      };
      const valueA = getValue(a);
      const valueB = getValue(b);
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortColumn, sortOrder]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBookings, currentPage]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const formatDate = (date) =>
    date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleString("th-TH")
      : "ไม่ระบุ";

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${containerTheme}`}>
        <motion.div className="text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          กำลังโหลด...
        </motion.div>
      </div>
    );

  return (
    <ErrorBoundary>
      <motion.div
        className={`min-h-screen font-sans ${containerTheme} transition-colors duration-500`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.header
          className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-b-xl shadow-md flex flex-col sm:flex-row justify-between items-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">แดชบอร์ดผู้ดูแล</h1>
          <div className="flex flex-wrap items-center gap-3">
            <motion.input
              type="text"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition duration-300"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? "กำลังโหลด..." : "รีเฟรช"}
            </motion.button>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto p-6">
          {error && (
            <motion.div
              className="bg-red-100 text-red-700 p-4 rounded-md mb-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.main
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Suspense fallback={<div>กำลังโหลด...</div>}>
                <StatsCard title="ข้อมูลผู้ใช้" data={`ชื่อ: ${loggedInUser}`} />
                <StatsCard
                  title="สถานะ"
                  data={<span className="text-green-500 font-bold">{status}</span>}
                />
              </Suspense>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4">ภาพรวมสถิติ</h3>
                <div className="h-48">
                  <Bar
                    data={chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" } },
                    }}
                  />
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 sm:col-span-2"
              >
                <h3 className="text-2xl font-semibold mb-4">ประวัติการเข้าใช้</h3>
                {paginatedBookings.length > 0 ? (
                  <>
                    <motion.div
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th
                              className="px-4 py-2 text-left cursor-pointer"
                              onClick={() => handleSort("room")}
                            >
                              ห้อง
                            </th>
                            <th
                              className="px-4 py-2 text-left cursor-pointer"
                              onClick={() => handleSort("user")}
                            >
                              ผู้ใช้
                            </th>
                            <th
                              className="px-4 py-2 text-left cursor-pointer"
                              onClick={() => handleSort("start")}
                            >
                              เริ่ม
                            </th>
                            <th
                              className="px-4 py-2 text-left cursor-pointer"
                              onClick={() => handleSort("end")}
                            >
                              สิ้นสุด
                            </th>
                            <th className="px-4 py-2 text-left">Action</th>
                            <th className="px-4 py-2 text-left">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedBookings.map((log) => {
                            const startTime =
                              log.bookingId?.startTime || log.details?.startTime
                                ? new Date(
                                    log.bookingId?.startTime || log.details?.startTime
                                  )
                                : null;
                            const endTime =
                              log.bookingId?.endTime || log.details?.endTime
                                ? new Date(
                                    log.bookingId?.endTime || log.details?.endTime
                                  )
                                : null;
                            const timestamp = log.timestamp
                              ? new Date(log.timestamp)
                              : null;

                            return (
                              <motion.tr
                                key={log._id}
                                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                                className="transition-colors duration-300"
                              >
                                <td className="px-4 py-2">
                                  {log.bookingId?.room || log.details?.room || "ไม่ระบุ"}
                                </td>
                                <td className="px-4 py-2">
                                  {log.userId?.fullName || "ไม่ระบุ"}
                                </td>
                                <td className="px-4 py-2">{formatDate(startTime)}</td>
                                <td className="px-4 py-2">{formatDate(endTime)}</td>
                                <td className="px-4 py-2">{log.action || "ไม่ระบุ"}</td>
                                <td className="px-4 py-2">{formatDate(timestamp)}</td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </motion.div>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        ก่อนหน้า
                      </button>
                      <span>
                        หน้า {currentPage} จาก {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                      >
                        ถัดไป
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500">ยังไม่มีประวัติการเข้าใช้</p>
                )}
              </motion.div>
            </div>
          </motion.main>

          {/* ส่วนแสดงรายชื่อผู้ใช้ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg mt-8"
          >
            <h3 className="text-2xl font-semibold mb-4">รายชื่อผู้ใช้</h3>
            {users.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">ชื่อ</th>
                    <th className="px-4 py-2 text-left">อีเมล</th>
                    <th className="px-4 py-2 text-left">รหัสนักศึกษา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-2 text-gray-700">{user.fullName}</td>
                      <td className="px-4 py-2 text-gray-500">{user.email}</td>
                      <td className="px-4 py-2 text-gray-500">{user.studentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูลผู้ใช้</p>
            )}
          </motion.section>

          <motion.footer
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>อัพเดทล่าสุด: {new Date().toLocaleString("th-TH")}</p>
          </motion.footer>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Admin;
