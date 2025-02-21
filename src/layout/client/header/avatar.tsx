import { Avatar } from "primereact/avatar";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import eye from "../../../assets/eye.svg";
import hideEye from "../../../assets/hideEye.svg";
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
import { Toast } from "primereact/toast";

const AvatarMenu = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleReset = () => {
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
  };
  const handleSubmit = () => {
    const data = { password, newPassword, confirmPassword };
    changePassword(data)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Đổi mật khẩu thành công",
        });
        setTimeout(() => {
          navigate("../");
        }, 1000);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Đổi mật khẩu thất bại",
        });
      });
  };

  const showProfileModal = () => setProfileVisible(true);
  const hideProfileModal = () => setProfileVisible(false);

  const showSettingsModal = () => setSettingsVisible(true);
  const hideSettingsModal = () => {
    setSettingsVisible(false);
    handleReset();
  };

  const items = [
    {
      label: "Thông tin cá nhân",
      icon: "pi pi-user",
      command: showProfileModal,
    },
    ...(role() !== 2
      ? [
          {
            label: "Tin đã đăng",
            icon: "pi pi-list",
            command: () => {
              if (role() === 3) navigate("../history-company");
            },
          },
        ]
      : []),
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

  const handleAvatarClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleOptionClick = (command: () => void) => {
    command();
    setDropdownVisible(false);
  };

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (value: number) => {
    if (value === 0) {
      setOldPasswordVisible(!oldPasswordVisible);
    }
    if (value === 1) {
      setPasswordVisible(!passwordVisible);
    }
    if (value === 2) {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const validateField = (field: string) => {
    let error: string | undefined;

    switch (field) {
      case "password":
        if (!password) {
          error = "Vui lòng nhập mật khẩu hiện tại.";
        }
        break;

      case "newPassword":
        if (!newPassword) {
          error = "Vui lòng nhập mật khẩu mới.";
        } else if (newPassword.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự.";
        } else if (!/[A-Z]/.test(newPassword)) {
          error = "Mật khẩu phải chứa ít nhất một chữ hoa.";
        } else if (!/[a-z]/.test(newPassword)) {
          error = "Mật khẩu phải chứa ít nhất một chữ thường.";
        } else if (!/[0-9]/.test(newPassword)) {
          error = "Mật khẩu phải chứa ít nhất một số.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
          error = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
        }
        break;

      case "confirmPassword":
        if (!confirmPassword) {
          error = "Vui lòng xác nhận mật khẩu mới.";
        } else if (confirmPassword !== newPassword) {
          error = "Mật khẩu xác nhận không khớp.";
        }
        break;

      default:
        break;
    }

    // Cập nhật lỗi vào state
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
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
          className="md:w-[365px] lg:w-[500px]"
          visible={profileVisible}
          position="right"
          onHide={hideProfileModal}
          draggable={false}
          resizable={false}
        >
          {role() === 2 ? (
            <FarmerProfile value="" />
          ) : (
            <CompanyProfile value="" />
          )}
        </Dialog>

        {/* Dialog: Cài đặt */}
        <Dialog
          header="Đổi mật khẩu"
          className="md:w-[365px] lg:w-[500px]"
          visible={settingsVisible}
          position="right"
          onHide={hideSettingsModal}
          draggable={true}
          resizable={true}
        >
          <div>
            <div className="mt-5">
              <div className="font-bold">Mật khẩu cũ:</div>
              <div className="flex items-center">
                <InputText
                  type={oldPasswordVisible ? "text" : "password"}
                  onChange={(e: any) => setPassword(e.target.value)}
                  className="w-full"
                  onBlur={() => validateField("password")} // Gọi hàm kiểm tra khi trường mất tiêu điểm
                />

                <img
                  className="ml-2 cursor-pointer"
                  width={25}
                  height={25}
                  src={oldPasswordVisible ? eye : hideEye}
                  onClick={() => togglePasswordVisibility(0)}
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>
            <div className="mt-5">
              <div className="font-bold">Mật khẩu mới:</div>
              <div className="flex items-center">
                <InputText
                  type={passwordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => validateField("newPassword")}
                  className={`w-full ${
                    errors.newPassword ? "border-red-500" : ""
                  }`}
                />
                <img
                  className="ml-2 cursor-pointer"
                  width={25}
                  height={25}
                  src={passwordVisible ? eye : hideEye}
                  onClick={() => togglePasswordVisibility(1)}
                />
              </div>
              {errors.newPassword && (
                <div className="text-red-500 text-sm">{errors.newPassword}</div>
              )}
            </div>
            <div className="mt-5">
              <div className="font-bold">Nhập lại mật khẩu mới:</div>
              <div className="flex items-center">
                <InputText
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => validateField("confirmPassword")}
                  className={`w-full ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <img
                  className="ml-2 cursor-pointer"
                  width={25}
                  height={25}
                  src={confirmPasswordVisible ? eye : hideEye}
                  onClick={() => togglePasswordVisibility(2)}
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </div>
              )}
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
    </>
  );
};

export default AvatarMenu;
