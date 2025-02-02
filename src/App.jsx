// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Booking from './pages/Booking';
// นำเข้าหน้าอื่นๆ ตามต้องการ

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          {/* เพิ่มเส้นทางอื่นๆ ตามต้องการ */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
