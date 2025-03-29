import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import "../../../styles/Resident.css";

const Resident = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Dùng useRef để đảm bảo fetch chỉ chạy 1 lần
  const isFetched = useRef(false);

  const fetchFees = async () => {
    if (isFetched.current) return;
    isFetched.current = true;

    try {
      console.log("Fetching API...");
      const token = localStorage.getItem("authToken");
      console.log(token);
      if (!token) {
        throw new Error("Auth token not found!");
      }
      
      const response = await fetch("http://localhost:22986/users/unpaid", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        // Nếu response không ok, in nội dung trả về để debug
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setFees(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleShowModal = (fee) => {
    setSelectedFee(fee);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading fees...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="resident-overlay">
      <div className="resident-layout">
        <div className="qr-code">
          <button className="btn btn-primary" onClick={() => setShowQR(!showQR)}>
            {showQR ? "Ẩn QR Code" : "Hiển thị QR Code"}
          </button>
          {showQR && (
            <img
              src="https://via.placeholder.com/150"
              alt="QR Code"
              className="qr-image"
            />
          )}
        </div>

        <div className="resident-fees">
          <h2>Danh sách các khoản phí chưa thanh toán</h2>
          <div className="fee-list">
            {fees.length === 0 ? (
              <p>Không có khoản phí nào chưa thanh toán.</p>
            ) : (
              fees.map((fee) => (
                <div key={fee.id} className="fee-card">
                  <div className="fee-detail">
                    <h4>{fee.description}</h4>
                    <p>Phòng: {fee.roomNumber}</p>
                    <p>
                      Số tiền:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(fee.amount)}
                    </p>
                    <p>
                      Hạn thanh toán: {format(new Date(fee.dueDate), "dd/MM/yyyy")}
                    </p>
                    <p>Trạng thái: {fee.status}</p>
                  </div>
                  <button className="btn btn-light" onClick={() => handleShowModal(fee)}>
                    &#x22EE;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết khoản phí */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Chi tiết khoản phí</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {selectedFee && (
                <div>
                  <h4>{selectedFee.description}</h4>
                  <p>
                    <strong>Phòng:</strong> {selectedFee.roomNumber}
                  </p>
                  <p>
                    <strong>Số tiền:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedFee.amount)}
                  </p>
                  <p>
                    <strong>Hạn thanh toán:</strong>{" "}
                    {format(new Date(selectedFee.dueDate), "dd/MM/yyyy")}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {selectedFee.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resident;
