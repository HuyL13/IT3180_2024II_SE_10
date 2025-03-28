import React, { useEffect, useState } from "react";
import "../../../styles/Admin.css";

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: "", capacity: "" });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMouseEnter = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    // Tạm thời giữ nguyên dữ liệu mẫu
    const data = [
      { id: 101, capacity: 4, residents: ["Nguyễn Văn A", "Trần Thị B"] },
      { id: 102, capacity: 2, residents: ["Lê Văn C"] },
      { id: 103, capacity: 6, residents: ["Phạm Thị D", "Hoàng Văn E", "Vũ Minh F"] },
    ];
    setRooms(data);
  }, []);

  const handleShowModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const createRoom = async (roomData) => {
    try {
      const response = await fetch("http://localhost:22986/demo/admin/room/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Thêm authorization header nếu cần
          // "Authorization": "Bearer your-token"
        },
        body: JSON.stringify(roomData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Tạo phòng thất bại");
      }
      return data;
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
      throw error;
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.roomNumber.trim() || !newRoom.capacity.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const createdRoom = await createRoom({
        roomNumber: newRoom.roomNumber,
        capacity: Number(newRoom.capacity)
      });

      setRooms([...rooms, { 
        ...createdRoom,
        residents: [] // Thêm mảng residents trống
      }]);
      setNewRoom({ roomNumber: "", capacity: "" });
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Tạo phòng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-overlay">
      <div className="admin-layout">
        <h2>Danh sách phòng</h2>
        <div className="room-list">
          <div 
            className="room-card" 
            onClick={() => setShowForm(true)}
          >
            <div className="room-detail add-room-detail">
              <div className="add-room-icon">+</div>
            </div>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-detail">
                <h4>Phòng {room.roomNumber || room.id}</h4>
                <p><strong>Sức chứa:</strong> {room.capacity} người</p>

                <button 
                  className="btn btn-light" 
                  onClick={() => handleShowModal(room)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  &#x22EE;
                </button>
                {showTooltip && (
                  <div 
                    className="tooltip"
                    style={{
                      left: `${tooltipPosition.x + 10}px`,
                      top: `${tooltipPosition.y + 10}px`
                    }}
                  >
                    Thông tin
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="form-overlay">
            <div className="form-content">
              <h3>Thêm phòng</h3>
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                placeholder="Số phòng"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
              />
              <input
                type="number"
                placeholder="Sức chứa"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              />
              <div className="form-actions">
                <button 
                  className="btn btn-success" 
                  onClick={handleAddRoom}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Lưu"}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && selectedRoom && (
          <div className="modal-overlay-admin" onClick={() => setShowModal(false)}>
            <div className="modal-content-admin" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Chi tiết phòng {selectedRoom.roomNumber || selectedRoom.id}</h4>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <h5>Danh sách cư dân:</h5>
                {selectedRoom.residents.length > 0 ? (
                  <ul>
                    {selectedRoom.residents.map((resident, index) => (
                      <li key={index}>{resident}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Chưa có cư dân.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;