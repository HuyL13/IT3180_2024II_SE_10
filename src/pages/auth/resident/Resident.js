import React, { useState } from "react";
import "../../../styles/Resident.css";

const Resident = () => {
  const [showQR, setShowQR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const fees = [
    { id: 1, description: "Phí dịch vụ", amount: "300,000 VNĐ", dueDate: "2025-04-01" },
    { id: 2, description: "Phí bảo trì", amount: "200,000 VNĐ", dueDate: "2025-04-10" },
    { id: 3, description: "Phí gửi xe", amount: "100,000 VNĐ", dueDate: "2025-04-15" },
    { id: 4, description: "Phí dịch vụ", amount: "300,000 VNĐ", dueDate: "2025-04-01" },
    { id: 5, description: "Phí bảo trì", amount: "200,000 VNĐ", dueDate: "2025-04-10" },
    { id: 6, description: "Phí gửi xe", amount: "100,000 VNĐ", dueDate: "2025-04-15" }
  ];

  const handleShowModal = (fee) => {
    setSelectedFee(fee);
    setShowModal(true);
  };

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
          <h2>Danh sách các khoản phí</h2>
          <div className="fee-list">
            {fees.map((fee) => (
              <div key={fee.id} className="fee-card">
                <div className ="fee-detail">
                  <h4>{fee.description}</h4>
                  <p>Số tiền: {fee.amount}</p>
                  <p>Hạn thanh toán: {fee.dueDate}</p>
                </div>
                <button className="btn btn-light" onClick={() => handleShowModal(fee)}>
                  &#x22EE;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal hiển thị chi tiết khoản phí */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Chi tiết khoản phí</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedFee && (
                <div>
                  <h4>{selectedFee.description}</h4>
                  <p><strong>Số tiền:</strong> {selectedFee.amount}</p>
                  <p><strong>Hạn thanh toán:</strong> {selectedFee.dueDate}</p>
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
