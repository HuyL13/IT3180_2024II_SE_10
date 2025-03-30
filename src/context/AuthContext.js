import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavbar } from "./NavbarContext";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setNavbarType } = useNavbar();

  // Định nghĩa các route cho mỗi role (roleRoutes được xác định theo role ưu tiên)
  const roleRoutes = {
    admin: ["/admin", "/dashboard"],
    user: ["/resident"],
    guest: ["/guest", "/join-resident"],
  };

  const commonAuthRoutes = ["/settings", "/account"];

  // Lưu trữ user với roles là mảng, mặc định là guest
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || { 
      isAuthenticated: false, 
      roles: ["guest"] 
    };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.isAuthenticated && Array.isArray(user.roles)) {
      // Nếu có cả ADMIN và USER thì ưu tiên "user_admin"
      if (user.roles.includes("ADMIN") && user.roles.includes("USER")) {
        setNavbarType("user_admin");
      } else {
        // Nếu không, dùng role đầu tiên (chuyển về chữ thường)
        setNavbarType(user.roles[0].toLowerCase());
      }
    } else {
      setNavbarType("default");
    }
  }, [user, setNavbarType]);

  useEffect(() => {
    const currentPath = location.pathname;
    const publicRoutes = ["/settings", "/login", "/signup", "/lobby", "/"];
    
    // Nếu đã đăng nhập mà truy cập trang login/signup thì chuyển hướng về trang chủ của role đó
    if (user.isAuthenticated && ["/login", "/signup"].includes(currentPath)) {
      navigate(roleRoutes[user.roles[0].toLowerCase()][0], { replace: true });
      return;
    }

    if (commonAuthRoutes.some(route => currentPath.startsWith(route))) {
      if (!user.isAuthenticated) {
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
        return;
      }
      return;
    }

    if (user.isAuthenticated) {
      const allowedRoutes = [
        ...roleRoutes[user.roles[0].toLowerCase()],
        ...commonAuthRoutes
      ];
      const isAllowed = allowedRoutes.some(route => currentPath.startsWith(route));
      if (!isAllowed) {
        navigate("/404", { replace: true });
        return;
      }
    }

    if (!user.isAuthenticated && !publicRoutes.includes(currentPath)) {
      navigate("/login", { replace: true });
      return;
    }
  }, [user, location.pathname, navigate]);

  // Hàm login nhận vào mảng role, ví dụ: ["ADMIN", "USER"]
  const login = (roles, redirectUrl) => {
    const targetPath = redirectUrl || roleRoutes[roles[0].toLowerCase()][0];
    setUser({ isAuthenticated: true, roles });
    navigate(targetPath, { replace: true });
  };

  const logout = () => {
    setUser({ isAuthenticated: false, roles: ["guest"] });
    navigate("/login", { replace: true });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
