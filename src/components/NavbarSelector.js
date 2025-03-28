import React, { useEffect } from "react";
import { useNavbar } from "../context/NavbarContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarGuest from "./navbar/NavbarGuest";
import NavbarAdmin from "./navbar/NavbarAdmin";
import NavbarResident from "./navbar/NavbarResident";
import NavbarDefault from "./navbar/NavbarDefault";

const NavbarSelector = () => {
  const { navbarType, setNavbarType } = useNavbar();
  const { logout, isAuthenticated, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Danh sách route được phép cho mỗi role
  const getAllowedPaths = (currentRole) => {
    const protectedPaths = ["/settings", "/account"];
    const rolePaths = {
      admin: ["/admin", "/dashboard", ...protectedPaths],
      resident: ["/resident", ...protectedPaths],
      guest: ["/guest", "/join-resident", ...protectedPaths]
    };
    return rolePaths[currentRole] || [];
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNavbarType("default");
      return;
    }

    const allowedPaths = getAllowedPaths(role);
    const isAllowed = allowedPaths.some(path => 
      location.pathname.startsWith(path)
    ) || location.pathname === "/"; // Cho phép trang chủ

    if (!isAllowed) {
      navigate("/404");
    } else {
      setNavbarType(role);
    }
  }, [role, isAuthenticated, location.pathname, navigate, setNavbarType]);

  const handleLogout = () => {
    logout();
    setNavbarType("default"); // Reset navbar khi logout
    navigate("/login");
  };

  if (["/"].includes(location.pathname)) return null;

  const navbarComponents = {
    admin: <NavbarAdmin handleLogout={handleLogout} />,
    resident: <NavbarResident handleLogout={handleLogout} />,
    guest: <NavbarGuest handleLogout={handleLogout} />,
    default: <NavbarDefault />
  };

  // Luôn hiển thị default nếu chưa đăng nhập
  return isAuthenticated ? navbarComponents[navbarType] : navbarComponents.default;
};

export default NavbarSelector;