import React, { useEffect } from "react";
import { useNavbar } from "../context/NavbarContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarGuest from "./navbar/NavbarGuest";
import NavbarAdmin from "./navbar/NavbarAdmin";
import NavbarResident from "./navbar/NavbarResident";
import NavbarUser_Admin from "./navbar/NavbarUser_Admin";
import NavbarDefault from "./navbar/NavbarDefault";

const NavbarSelector = () => {
  const { navbarType, setNavbarType } = useNavbar();
  const { logout, isAuthenticated, roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm chuẩn hóa roles thành mảng và chuyển về chữ hoa
  const normalizeRoles = () => {
    if (!roles) return [];
    if (Array.isArray(roles)) {
      return roles.map(role => role.toUpperCase());
    }
    if (typeof roles === "string") {
      // Giả sử các role được phân tách bằng dấu phẩy
      return roles.split(",").map(r => r.trim().toUpperCase());
    }
    return [];
  };

  // Xác định loại navbar dựa trên mảng roles
  const determineNavbarType = () => {
    const rolesArray = normalizeRoles();
    if (rolesArray.includes("ADMIN") && rolesArray.includes("USER")) {
      return "user_admin";
    }
    if (rolesArray.includes("ADMIN")) return "admin";
    if (rolesArray.includes("USER")) return "user";
    if (rolesArray.includes("GUEST")) return "guest";
    return "default";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNavbarType("default");
      return;
    }
    const newNavbarType = determineNavbarType();
    setNavbarType(newNavbarType);
  }, [roles, isAuthenticated, setNavbarType]);

  const handleLogout = () => {
    logout();
    setNavbarType("default");
    navigate("/login");
  };

  // Ẩn navbar ở trang chủ nếu cần
  if (["/"].includes(location.pathname)) return null;

  const navbarComponents = {
    admin: <NavbarAdmin handleLogout={handleLogout} />,
    user: <NavbarResident handleLogout={handleLogout} />,
    user_admin: <NavbarUser_Admin handleLogout={handleLogout} />,
    guest: <NavbarGuest handleLogout={handleLogout} />,
    default: <NavbarDefault />
  };

  return isAuthenticated ? navbarComponents[navbarType] : navbarComponents.default;
};

export default NavbarSelector;
