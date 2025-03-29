import React, { useEffect, useState } from "react";
import "../../../styles/Admin.css";

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState({
    page: true,
    form: false,
    initial: true,
  });
  const [error, setError] = useState("");
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    floor: "",
    peopleCount: "",
  });
  const [roomUsers, setRoomUsers] = useState([]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((prev) => ({ ...prev, initial: false }));
    }, 1500); // Simulate initial loading for 1.5s
    
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleShowModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const createRoom = async (roomData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:22986/demo/admin/room/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNumber: roomData.roomNumber,
          floor: Number(roomData.floor),
          peopleCount: Number(roomData.peopleCount),
        }),
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
    if (!newRoom.roomNumber.trim() || !newRoom.floor.trim() || !newRoom.peopleCount.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading((prev) => ({ ...prev, form: true }));
    try {
      const createdRoom = await createRoom({
        roomNumber: newRoom.roomNumber,
        floor: newRoom.floor,
        peopleCount: newRoom.peopleCount,
      });

      setRooms([...rooms, { ...createdRoom, residents: [] }]);
      setNewRoom({ roomNumber: "", floor: "", peopleCount: "" });
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Tạo phòng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const fetchRooms = async () => {
    setLoading((prev) => ({ ...prev, page: true }));
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:22986/demo/admin/room", {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (!response.ok) throw new Error("Lỗi khi lấy danh sách phòng");

      const data = await response.json();
      const formattedRooms = data.map((room) => ({
        ...room,
        floor: room.floor ?? "Chưa cập nhật",
        peopleCount: room.peopleCount ?? "Chưa cập nhật",
      }));

      setRooms(formattedRooms);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, page: false }));
    }
  };

  useEffect(() => {
    if (!loading.initial) {
      fetchRooms();
      const intervalId = setInterval(fetchRooms, 100000);
      return () => clearInterval(intervalId);
    }
  }, [loading.initial]);

  const deleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:22986/demo/admin/room/${roomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      setError(error.message);
    }
  };
  // Thêm state mới cho modal người dùng
const [showUserModal, setShowUserModal] = useState(false);

// Sửa hàm showAllUser
const showAllUser = async (roomId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:22986/demo/admin/room/${roomId}`, { // Sửa endpoint
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Không thể lấy danh sách người dùng");

    const data = await response.json();
    console.log(data);
    setRoomUsers(data.result || []); // Giả sử API trả về {result: [...]}
    setShowUserModal(true); // Sử dụng state riêng cho modal người dùng
  } catch (error) {
    setError(error.message);
  }
};
//thêm
  
const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:22986/demo/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Không thể tạo người dùng");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
  }
};

const getUsers = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:22986/demo/admin/users", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể lấy danh sách người dùng");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
  }
};

const getUserInfo = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:22986/demo/admin/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể lấy thông tin người dùng");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
};

const getMyInfo = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:22986/demo/admin/users/my-info", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể lấy thông tin cá nhân");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân:", error);
  }
};

const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:22986/demo/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể xóa người dùng");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
  }
};

const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:22986/demo/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Không thể cập nhật thông tin người dùng");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
  }
};

const activateUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:22986/demo/admin/users/${userId}/activate`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể kích hoạt tài khoản");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi kích hoạt tài khoản:", error);
  }
};

  return (
    <div className="admin-overlay">
      {loading.initial && (
        <div className="initial-loading">
          <div className="spinner"></div>
        </div>
      )}

      {loading.page && !loading.initial && (
        <div className="page-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      <div className="admin-layout">
        <h2 className="name">Danh sách phòng</h2>
        <div className="room-list">
          <div className="add-room" onClick={() => setShowForm(true)}>
            <div className="add-room-detail">
              <div className="add-room-icon">+</div>
            </div>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-detail">
                <h4>Phòng {room.roomNumber || room.id}</h4>
                <p><strong>Tầng:</strong> {room.floor}</p>
                <p><strong>Sức chứa:</strong> {room.peopleCount} người</p>

                <button
                  className="btn btn-light"
                  onClick={() => handleShowModal(room)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  &#x22EE;
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => deleteRoom(room.id)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  &#x1F5D1; {/* Trash can icon */}
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => showAllUser(room.id)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  &#x1F465; {/* Trash can icon */}
                </button>

                {showTooltip && (
                  <div
                    className="tooltip"
                    style={{
                      left: `${tooltipPosition.x + 10}px`,
                      top: `${tooltipPosition.y + 10}px`,
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
                placeholder="Tầng"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
              />
              <input
                type="number"
                placeholder="Sức chứa"
                value={newRoom.peopleCount}
                onChange={(e) => setNewRoom({ ...newRoom, peopleCount: e.target.value })}
              />
              <div className="form-actions">
                <button
                  className="btn btn-success"
                  onClick={handleAddRoom}
                  disabled={loading.form}
                >
                  {loading.form ? "Đang xử lý..." : "Lưu"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowForm(false)}
                  disabled={loading.form}
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
                <h4>Chi tiết phòng {selectedRoom.roomNumber}</h4>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="room-info">
                  <p><strong>Số phòng:</strong> <span>{selectedRoom.roomNumber || "Chưa có thông tin"}</span></p>
                  <p><strong>Tầng:</strong> <span>{selectedRoom.floor ?? "Chưa có thông tin"}</span></p>
                  <p><strong>Sức chứa:</strong> <span>{selectedRoom.peopleCount ?? "Chưa có thông tin"}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}


{showUserModal && (
  <div className="modal-overlay-admin" onClick={() => setShowUserModal(false)}>
    <div className="modal-content-admin" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h4>Danh sách người dùng</h4>
        <button className="close-btn" onClick={() => setShowUserModal(false)}>&times;</button>
      </div>
      <div className="modal-body">
        {roomUsers.length > 0 ? (
          <ul className="user-list">
            {roomUsers.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <p><strong>Tên:</strong> {user.fullName}</p>
                  
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-users">Không có người dùng nào trong phòng này</p>
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
