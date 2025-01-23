import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ressetPassword } from "../../api/apiLogin";
import { useNavigate } from "react-router-dom";
import forgot from "../../assets/forgot.png";
import eye from "../../assets/eye.svg";
import hideEye from "../../assets/hideEye.svg";

const Resset = () => {
  const toast = useRef<Toast>(null);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (tokenParam) setToken(decodeURIComponent(tokenParam));
  }, []);

  const hanldeSumbmit = () => {
    const data = {
      email,
      newPassword,
      confirmPassword,
      token,
    };
    ressetPassword(data).then(() => {
      navigate("../");
    });
  };

  const validateField = (field: string) => {
    let error: string | undefined;

    switch (field) {
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

  const togglePasswordVisibility = (value: number) => {
    if (value === 1) {
      setPasswordVisible(!passwordVisible);
    }
    if (value === 2) {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid md:grid-cols-2 h-screen sm:grid-cols-1">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đổi mật khẩu" className="w-2/3 h-auto">
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
                onClick={hanldeSumbmit}
                className="w-full flex justify-center"
                severity="help"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </Card>
        </div>
        <div className="col h-full flex justify-center items-center sm:hidden md:flex">
          <img
            src={forgot}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Resset;
