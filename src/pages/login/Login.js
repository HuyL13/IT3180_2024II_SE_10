import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Login.css";
import { NavLink } from "react-router-dom";

// Mock database
const mockUsers = [
  {
    username: "adminz",
    password: "adminz",
    role: "admin",
    route: "/admin"
  },
  {
    username: "resident",
    password: "resident",
    role: "resident",
    route: "/resident"
  },
  {
    username: "guest",
    password: "guest",
    role: "guest", 
    route: "/guest"
  }
];

// Mock API functions
const authApi = {
  login: (credentials) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      );
      
      user ? resolve(user) : reject(new Error("Email hoặc mật khẩu không đúng!"));
    }, 1000);
  }),
  
  sendOtp: (email) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const userExists = mockUsers.some(u => u.email === email);
      if(userExists) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP for testing:", otp);
        resolve(otp);
      } else {
        reject(new Error("Email không tồn tại trong hệ thống"));
      }
    }, 1000);
  })
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const otpInputs = useRef(Array(6).fill(null));

  /// State management
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    show: false,
    email: "",
    message: "",
    otp: Array(6).fill(""),
    correctOtp: "",
    isProcessing: false
  });
  

  // Email validation
  const validateEmail = (email) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  const [requestHeaders] = useState({
    'Postman-Token': 'unique-postman-identifier',
    'Host': 'localhost:22986',
    'User-Agent': 'Mozilla/5.0'
  });
   // Login handler
   const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:22986/demo/auth/login", {
        method: "POST",
        headers: {
          ...requestHeaders,
          "Content-Type": "application/json",
          // Thêm các headers cần thiết khác
          "Accept": "application/json",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Xử lý kết quả thành công
      const { token, authenticated } = data.result;
      
      // Lưu token vào localStorage
      localStorage.setItem("authToken", token);
      
      // Cập nhật context authentication
      login({
        authenticated,
        token,
        username: formData.username
      });

      // Chuyển hướng đến trang dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...modalState.otp];
    newOtp[index] = value;
    
    setModalState(prev => ({
      ...prev,
      otp: newOtp,
      message: newOtp.join("").length === 6 ? "" : prev.message
    }));

    if (value && index < 5) otpInputs.current[index + 1].focus();
    if (newOtp.every(d => d) && index === 5) verifyOtp(newOtp.join(""));
  };

  // OTP verification
  const verifyOtp = async (enteredOtp) => {
    setModalState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      if (enteredOtp !== modalState.correctOtp) {
        throw new Error("Mã OTP không chính xác");
      }
      
      setModalState(prev => ({
        ...prev,
        message: "Xác thực thành công! Vui lòng kiểm tra email để đặt lại mật khẩu.",
        isProcessing: false
      }));
      
      setTimeout(() => {
        setModalState({
          show: false,
          email: "",
          message: "",
          otp: Array(6).fill(""),
          correctOtp: "",
          isProcessing: false
        });
      }, 3000);
      
    } catch (err) {
      setModalState(prev => ({
        ...prev,
        message: err.message,
        otp: Array(6).fill(""),
        isProcessing: false
      }));
      otpInputs.current[0].focus();
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(modalState.email)) {
      setModalState(prev => ({ ...prev, message: "Vui lòng nhập email hợp lệ" }));
      return;
    }

    try {
      setModalState(prev => ({ ...prev, isProcessing: true }));
      const otp = await authApi.sendOtp(modalState.email);
      
      setModalState(prev => ({
        ...prev,
        correctOtp: otp,
        message: "Mã OTP đã được gửi đến email của bạn!",
        isProcessing: false
      }));
      
      setTimeout(() => otpInputs.current[0].focus(), 100);
    } catch (err) {
      setModalState(prev => ({
        ...prev,
        message: err.message,
        isProcessing: false
      }));
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập hệ thống</h2>
      
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          
          <input
            type="text"
            placeholder="Tên dăng nhập"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          
          <input
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner" /> : "Đăng nhập"}
        </button>
      </form>

      
        <NavLink to="/signup">Đăng ký tài khoản</NavLink>
        <NavLink 
          onClick={() => setModalState(prev => ({ ...prev, show: true }))}
        >
          Quên mật khẩu?
        </NavLink>
      

      {/* Password Reset Modal */}
      {modalState.show && (
        <div className="modal-overlay" onClick={() => setModalState(prev => ({ ...prev, show: false }))}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Khôi phục mật khẩu</h3>
            
            {!modalState.correctOtp ? (
              <>
                <div className="form-group">
                  <label>Email đăng ký:</label>
                  <input
                    type="email"
                    value={modalState.email}
                    onChange={(e) => setModalState(prev => ({ ...prev, email: e.target.value }))}
                    disabled={modalState.isProcessing}
                  />
                </div>
                
                {modalState.message && <div className="alert">{modalState.message}</div>}
                <div className ="modal-action">
                <button type ="submit"
                  onClick={handlePasswordReset}
                  disabled={modalState.isProcessing}
                >
                  {modalState.isProcessing ? <div className="spinner" /> : "Gửi mã OTP"}
                </button>
                <button
                    className="secondary"
                    onClick={() => setModalState(prev => ({ ...prev, show: false }))}
                  >
                    Đóng
                  </button>
                  </div>
              </>
            ) : (
              <>
                <p className="otp-notice">Nhập mã OTP 6 số đã gửi đến {modalState.email}</p>
                
                <div className="otp-container">
                  {modalState.otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpInputs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => e.key === "Backspace" && !digit && index > 0 && otpInputs.current[index - 1].focus()}
                      disabled={modalState.isProcessing}
                    />
                  ))}
                </div>

                {modalState.message && (
                  <div className={`alert ${modalState.message.includes("thành công") ? "success" : "error"}`}>
                    {modalState.message}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    onClick={() => verifyOtp(modalState.otp.join(""))}
                    disabled={modalState.isProcessing || modalState.otp.some(d => !d)}
                  >
                    {modalState.isProcessing ? <div className="spinner" /> : "Xác nhận"}
                  </button>
                  
                  <button
                    className="secondary"
                    onClick={() => setModalState(prev => ({ ...prev, show: false }))}
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;