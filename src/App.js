import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { NavbarProvider } from "./context/NavbarContext"; 
import NavbarSelector from "./components/NavbarSelector";
import ProtectedRoute from "./routes/ProtectedRoute";

import Account from "./pages/account/Account";
import Admin from "./pages/auth/admin/Admin";
import Guest from "./pages/auth/guest/Guest";
import Resident from "./pages/auth/resident/Resident";
import Settings from "./pages/addon/settings/Settings";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Splash from "./pages/addon/splash/Splash";
import Waiting from "./pages/addon/waiting/Waiting";
import NotFoundPage from "./pages/notfound/404";
import Lobby from "./pages/lobby/Lobby";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>  {/* ✅ Bọc App trong div để tránh lỗi Bootstrap layout */}
      <NavbarSelector />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Bảo vệ các trang yêu cầu đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/resident" element={<Resident />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
