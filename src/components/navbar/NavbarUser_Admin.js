import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import "../../styles/NavbarUser_Admin.css";

const NavbarUser_Admin = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa các route mặc định cho từng chế độ
  const adminDefaultRoute = "/admin/rooms";
  const userDefaultRoute = "/resident";

  // Các route đặc trưng cho chế độ admin để kiểm tra location
  const adminRoutes = [
    "/admin/rooms",
    "/admin/users",
    "/admin/fees",
    "/admin/guests",
    "/admin/reports",
    "/dashboard"
  ];

  // Xác định chế độ ban đầu dựa trên location.pathname
  const getInitialMode = () => {
    return adminRoutes.some(route => location.pathname.startsWith(route))
      ? "admin"
      : "user";
  };

  const [mode, setMode] = useState(getInitialMode());
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  // Cập nhật mode khi location thay đổi
  useEffect(() => {
    const newMode = adminRoutes.some(route => location.pathname.startsWith(route))
      ? "admin"
      : "user";
    if (newMode !== mode) {
      setMode(newMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Hàm chuyển đổi giữa 2 chế độ, đồng thời điều hướng đến trang mặc định của chế độ đó
  const toggleMode = () => {
    if (mode === "user") {
      setMode("admin");
      navigate(adminDefaultRoute, { replace: true });
    } else {
      setMode("user");
      navigate(userDefaultRoute, { replace: true });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          User & Admin
        </NavLink>
        <div className="navbar-nav ms-auto align-items-center">
          {/* Công tắc chuyển đổi chế độ */}
          <div className="form-check form-switch me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="modeSwitch"
              checked={mode === "admin"}
              onChange={toggleMode}
            />
            <label className="form-check-label" htmlFor="modeSwitch">
              {mode === "admin" ? "Admin" : "User"}
            </label>
          </div>

          {/* Liên kết chung */}
          <NavLink to="/account" className="nav-link">
            Tài khoản
          </NavLink>

          {/* Hiển thị các liên kết dựa trên chế độ */}
          {mode === "user" ? (
            <NavLink to="/resident" className="nav-link">
              Cư dân
            </NavLink>
          ) : (
            <>
              {/* Dropdown cho admin */}
              <div
                className="nav-item dropdown"
                onMouseEnter={() => setShowAdminDropdown(true)}
                onMouseLeave={() => setShowAdminDropdown(false)}
              >
                <NavLink
                  to="#"
                  className="nav-link dropdown-toggle"
                  id="adminDropdown"
                  role="button"
                  aria-expanded="false"
                >
                  Quản trị
                </NavLink>
                {showAdminDropdown && (
                  <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                    <li>
                      <NavLink to="/admin/rooms" className="dropdown-item">
                        Quản lý Phòng
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/users" className="dropdown-item">
                        Quản lý Người dùng
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/fees" className="dropdown-item">
                        Quản lí phí
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/guests" className="dropdown-item">
                        Phê duyệt
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/reports" className="dropdown-item">
                        Báo cáo
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
              <NavLink to="/dashboard" className="nav-link">
                Thống kê
              </NavLink>
            </>
          )}

          <button className="btn btn-light ms-3" onClick={handleLogout}>
            Đăng xuất
          </button>
          <NavLink to="/settings" className="nav-link">
            <FaCog className="settings-icon" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser_Admin;
