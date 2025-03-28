import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/NavbarAdmin.css";
import { FaCog } from "react-icons/fa";
const NavbarAdmin = ({ username, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <NavLink to="/admin" className="navbar-brand">Quản trị viên</NavLink>
        <div className="navbar-nav ms-auto">
          <span className="nav-link">Xin chào, {username}!</span>
          <NavLink to="/account" className="nav-link">Tài khoản</NavLink>
          
          <NavLink to="/admin" className="nav-link">Quản trị</NavLink>
          <NavLink to="/dashboard" className="nav-link">Thống kê</NavLink>
          
          <button className="btn btn-light ms-3" onClick={handleLogout}>Đăng xuất</button>
          <NavLink to="/settings" className="nav-link-default">
                      <FaCog className="settings-icon" />
                      
                    </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
