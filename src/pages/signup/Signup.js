import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Signup.css";


const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Giả lập lưu tài khoản (thực tế sẽ gọi API)
    localStorage.setItem("user", JSON.stringify({ name, email, password, role: "guest" }));
    setMessage("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="login-container">
      <h2>Đăng ký</h2>
      {message && <p className="success">{message}</p>}
      <form className ="login-form" onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Họ và tên" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn btn-secondary">Đăng ký</button>
      </form>
    </div>
  );
};

export default Signup;
