import { Avatar } from "primereact/avatar";
import { useRef, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearLocalStorage,
  getFromLocalStorage,
  role,
} from "../../../constant/utils";
import { Dialog } from "primereact/dialog";
import FarmerProfile from "../../../client/profile/profile-farmer";
import CompanyProfile from "../../../client/profile/profile-company";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { changePassword } from "../../../api/apiLogin";

const AvatarMenu = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    const data = { password, newPassword, confirmPassword };
    changePassword(data).then(() => navigate("../"));
  };

  const showProfileModal = () => setProfileVisible(true);
  const hideProfileModal = () => setProfileVisible(false);

  const showSettingsModal = () => setSettingsVisible(true);
  const hideSettingsModal = () => setSettingsVisible(false);

  const items = [
    {
      label: "Thông tin cá nhân",
      icon: "pi pi-user",
      command: showProfileModal,
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
      label: "Đổi mật khẩu",
      icon: "pi pi-cog",
      command: showSettingsModal,
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
    setDropdownVisible((prev) => !prev);
  };

  const handleOptionClick = (command: () => void) => {
    command();
    setDropdownVisible(false);
  };

  return (
    <div className="relative">
      <Avatar
        className="w-12 h-12 cursor-pointer"
        image={getFromLocalStorage("avatar") ?? ""}
        shape="circle"
        onClick={handleAvatarClick}
        aria-label="Avatar Menu"
      />
      {dropdownVisible && (
        <div
          ref={menuRef}
          className="absolute -translate-x-40 z-10 mt-2 w-48 shadow-lg border border-gray-300 bg-white rounded-lg"
        >
          <ul className="list-none m-0 p-0">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(item.command)}
              >
                <i className={item.icon}></i>
                <span className="ml-2">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dialog: Thông tin cá nhân */}
      <Dialog
        header="Thông tin cá nhân"
        visible={profileVisible}
        position="right"
        onHide={hideProfileModal}
        draggable={false}
        resizable={false}
      >
        {role() === 2 ? <FarmerProfile /> : <CompanyProfile />}
      </Dialog>

      {/* Dialog: Cài đặt */}
      <Dialog
        header="Đổi mật khẩu"
        visible={settingsVisible}
        position="right"
        onHide={hideSettingsModal}
        draggable={true}
        resizable={true}
      >
        <div>
          <div className="mt-5">
            <div className="font-bold">Mật khẩu cũ:</div>
            <InputText
              onChange={(e: any) => setPassword(e.target.value)}
              className="w-full"
              type="password"
            />
          </div>
          <div className="mt-5">
            <div className="font-bold">Mật khẩu mới:</div>
            <InputText
              onChange={(e: any) => setNewPassword(e.target.value)}
              className="w-full"
              type="password"
            />
          </div>
          <div className="mt-5">
            <div className="font-bold">Nhập lại mật khẩu mới:</div>
            <InputText
              type="password"
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mt-5">
            <Button
              onClick={handleSubmit}
              className="w-full flex justify-center"
              severity="help"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AvatarMenu;
