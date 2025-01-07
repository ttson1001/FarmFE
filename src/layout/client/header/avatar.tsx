import { Avatar } from "primereact/avatar";
import { useRef, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage, role } from "../../../constant/utils";
import { Dialog } from "primereact/dialog";
import FarmerProfile from "../../../client/profile/profile-farmer";

const AvatarMenu = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false); // Trạng thái để kiểm soát dropdown
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true); // Mở modal
  };

  const hideModal = () => {
    setVisible(false); // Đóng modal
  };

  const items = [
    {
      label: "Thông tin cá nhân",
      icon: "pi pi-user",
      command: () => {
        showModal();
      },
    },
    {
      label: "Tin đã đăng",
      icon: "pi pi-list",
      command: () => {
        if (role() === 2) navigate("../history-farmer");
        if (role() === 3) navigate("../history-company");
      },
    },
    {
      label: "Cài đặt",
      icon: "pi pi-cog",
      command: () => console.log("Cài đặt"),
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: () => {
        clearLocalStorage();
        setTimeout(() => {
          navigate("../");
        }, 1000);
      },
    },
  ];

  const handleAvatarClick = (event: MouseEvent) => {
    setDropdownVisible((prev) => !prev); // Toggle dropdown visibility
  };

  const handleOptionClick = (command: () => void) => {
    command(); // Gọi lệnh khi chọn tùy chọn
    setDropdownVisible(false); // Ẩn dropdown sau khi chọn
  };

  return (
    <div className="relative">
      <Avatar
        className="w-12 h-12 cursor-pointer"
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
        onClick={handleAvatarClick} // Xử lý nhấn vào Avatar
        aria-label="Avatar Menu" // Thêm hỗ trợ truy cập
      />
      {dropdownVisible && ( // Hiển thị dropdown nếu dropdownVisible là true
        <div
          ref={menuRef}
          className="absolute -translate-x-40 z-10 mt-2 w-48 shadow-lg border border-gray-300 bg-white rounded-lg"
        >
          <ul className="list-none m-0 p-0">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(item.command)} // Gọi lệnh khi chọn
              >
                <i className={item.icon}></i>
                <span className="ml-2">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Dialog
        header="Thông tin cá nhân"
        visible={visible}
        position="right"
        onHide={() => {
          hideModal();
        }}
        draggable={false}
        resizable={false}
      >
        <FarmerProfile />
      </Dialog>
    </div>
  );
};

export default AvatarMenu;
