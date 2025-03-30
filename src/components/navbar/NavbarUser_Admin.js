import React from "react";
import { NavLink } from "react-router-dom";
import { FaCog } from "react-icons/fa";

const NavbarUser_Admin = ({ handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <NavLink to="/admin" className="navbar-brand">
          User & Admin
        </NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink to="/account" className="nav-link">Tài khoản</NavLink>
          <NavLink to="/resident" className="nav-link">Cư dân</NavLink>
          <NavLink to="/admin/rooms" className="nav-link">Quản lý Phòng</NavLink>
          <NavLink to="/admin/users" className="nav-link">Quản lý Người dùng</NavLink>
          <NavLink to="/dashboard" className="nav-link">Thống kê</NavLink>
          <button className="btn btn-light ms-3" onClick={handleLogout}>Đăng xuất</button>
          <NavLink to="/settings" className="nav-link"><FaCog className="settings-icon" /></NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser_Admin;
