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

  // Định nghĩa các route ở phạm vi component
  const roleRoutes = {
    admin: ["/admin", "/dashboard"],
    resident: ["/resident"],
    guest: ["/guest", "/join-resident"],
  };

  // Thêm các route chung cho tất cả role đã đăng nhập
  const commonAuthRoutes = ["/settings", "/account"];

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || { 
      isAuthenticated: false, 
      role: "guest" 
    };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    setNavbarType(user.role);
  }, [user, setNavbarType]);

  useEffect(() => {
    const currentPath = location.pathname;

    const publicRoutes = ["/settings","/login", "/signup", "/lobby", "/"];
    
    // 1. Chuyển hướng nếu đã đăng nhập truy cập trang login/signup
    if (user.isAuthenticated && ["/login", "/signup"].includes(currentPath)) {
      navigate(roleRoutes[user.role][0], { replace: true });
      return;
    }

    // 2. Xử lý route yêu cầu đăng nhập
    if (commonAuthRoutes.some(route => currentPath.startsWith(route))) {
      if (!user.isAuthenticated) {
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
        return;
      }
      // Cho phép truy cập luôn nếu đã đăng nhập
      return;
    }

    // 3. Kiểm tra route theo role
    if (user.isAuthenticated) {
      const allowedRoutes = [
        ...roleRoutes[user.role],
        ...commonAuthRoutes
      ];

      const isAllowed = allowedRoutes.some(route => currentPath.startsWith(route));
      
      if (!isAllowed) {
        navigate("/404", { replace: true });
        return;
      }
    }

    // 4. Chặn truy cập trái phép
    if (!user.isAuthenticated && !publicRoutes.includes(currentPath)) {
      navigate("/login", { replace: true });
      return;
    }

  }, [user, location.pathname, navigate]);

  const login = (role, redirectUrl) => {
    const targetPath = redirectUrl || roleRoutes[role][0];
    setUser({ isAuthenticated: true, role });
    navigate(targetPath, { replace: true });
  };

  const logout = () => {
    setUser({ isAuthenticated: false, role: "guest" });
    navigate("/login", { replace: true });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};