import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { NavbarProvider } from "./context/NavbarContext"; 
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>  {/* ✅ Bọc AuthProvider trước */}
        <NavbarProvider>
          <App />
        </NavbarProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
