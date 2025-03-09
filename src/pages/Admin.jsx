import React, { useEffect, useState } from "react";

const Admin = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [status, setStatus] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [loginCount, setLoginCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoggedInUser("Admin");
    setStatus("ออนไลน์");

    const fetchStats = async () => {
      try {
        console.log("Fetch URL:", "http://localhost:4999/api/admin/stats");
        const response = await fetch("http://localhost:4999/api/admin/stats");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTotalUsers(data.totalUsers);
        setLoginCount(data.loginCount);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>แดชบอร์ดแอดมิน</h1>
      </header>
      <main style={styles.main}>
        <section style={styles.section}>
          <h2>ยินดีต้อนรับ, {loggedInUser}</h2>
          <p>สถานะการเข้าใช้งาน: {status}</p>
          <p>จำนวนผู้ใช้ในระบบ: {totalUsers} คน</p>
          <p>จำนวนผู้ที่เคยเข้าใช้งาน: {loginCount} คน</p>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    maxWidth: "800px",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#282c34",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
  },
  main: {
    marginTop: "20px",
  },
  section: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  footer: {
    marginTop: "40px",
    textAlign: "center",
    fontSize: "0.9em",
    color: "#777",
  },
};

export default Admin;
