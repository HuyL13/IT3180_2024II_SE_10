import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/NavbarAdmin.css";
import { FaCog } from "react-icons/fa";

const NavbarAdmin = ({ username, handleLogout }) => {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  // Thêm meta tag động khi component mount
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = "color-scheme";
    metaTag.content = "light only";
    document.head.appendChild(metaTag);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <NavLink to="/admin" className="navbar-brand">Quản trị viên</NavLink>
        <div className="navbar-nav ms-auto">
          <span className="nav-link">Xin chào, {username}!</span>
          <NavLink to="/account" className="nav-link">Tài khoản</NavLink>
          
          {/* Phần Quản trị với dropdown */}
          <div 
            className="nav-item dropdown-container"
            onMouseEnter={() => setShowAdminDropdown(true)}
            onMouseLeave={() => setShowAdminDropdown(false)}
          >
            <span className="nav-link dropdown-toggle">
              Quản trị
            </span>
            
            {showAdminDropdown && (
              <div 
                className="admin-dropdown"
                onMouseEnter={() => setShowAdminDropdown(true)}
                onMouseLeave={() => setShowAdminDropdown(false)}
              >
                <NavLink to="/admin/rooms" className="dropdown-item">
                  Quản lý Phòng
                </NavLink>
                <NavLink to="/admin/users" className="dropdown-item">
                  Quản lý Người dùng
                </NavLink>
                <NavLink to="/admin/fees" className="dropdown-item">
                  Quản lí phí
                </NavLink>
                <NavLink to="/admin/guests" className="dropdown-item">
                  Phê duyệt
                </NavLink>
                <NavLink to="/admin/reports" className="dropdown-item">
                  Báo cáo
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/dashboard" className="nav-link">Thống kê</NavLink>
          
          <button className="btn btn-light ms-3" onClick={handleLogout}>Đăng xuất</button>
          <NavLink to="/settings" className="nav-link">
            <FaCog className="settings-icon" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;