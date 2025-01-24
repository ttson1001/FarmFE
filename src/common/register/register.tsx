import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUserDto } from "../../dto/RegisterDto";
import { register } from "../../api/apiLogin";
import { Toast } from "primereact/toast";
import farmer from "../../assets/farmer.png";
import business from "../../assets/company.png";
import eye from "../../assets/eye.svg";
import hideEye from "../../assets/hideEye.svg";

const Register = () => {
  const toast = useRef<Toast>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userType, setUserType] = useState<number>(2);
  const navigate = useNavigate();

  const hanldeSumbmit = () => {
    const data: RegisterUserDto = {
      phoneNumber,
      email,
      userName,
      password,
      confirmPassword,
      userType,
    };

    register(data)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary:
            "Đăng ký thành công! Tài khoản của bạn đang chờ phê duyệt từ quản trị viên. Vui lòng đợi thông báo qua email.",
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Đăng kí thất bại",
        });
      });
  };
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    email?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "phoneNumber": {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!value) {
          error = "Số điện thoại là bắt buộc.";
        } else if (!phoneRegex.test(value)) {
          error = "Số điện thoại không hợp lệ (10-11 chữ số).";
        }
        break;
      }

      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "Email là bắt buộc.";
        } else if (!emailRegex.test(value)) {
          error = "Email không hợp lệ.";
        }
        break;
      }

      case "userName":
        if (!value) {
          error = "Tên người dùng là bắt buộc.";
        }
        break;

      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc.";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự.";
        } else if (!/[A-Z]/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất một chữ hoa.";
        } else if (!/[a-z]/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất một chữ thường.";
        } else if (!/[0-9]/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất một số.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Xác nhận mật khẩu là bắt buộc.";
        } else if (value !== password) {
          error = "Mật khẩu không khớp.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (value: number) => {
    if (value === 1) {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid md:grid-cols-2 h-screen sm:grid-cols-1">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đăng kí" className="w-2/3 h-auto">
            <div className="font-bold mb-2">Bạn là:</div>
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="business"
                  value={2}
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === 2}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Nông dân
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="farmer"
                  value={3}
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === 3}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  Doanh nghiệp
                </label>
              </div>
            </div>
            <div className="mt-5">
              <div className="font-bold">Tên đăng nhập:</div>
              <InputText
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => validateField("userName", userName)}
                className={`w-full ${errors.userName ? "border-red-500" : ""}`}
              />
              {errors.userName && (
                <div className="text-red-500 text-sm">{errors.userName}</div>
              )}
            </div>
            <div className="mt-5">
              <div className="font-bold">Email:</div>
              <InputText
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateField("email", email)}
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>
            <div className="mt-5">
              <div className="font-bold">Số điện thoại:</div>
              <InputText
                maxLength={12}
                required={true}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => validateField("phoneNumber", phoneNumber)}
                className={`w-full ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
              {errors.phoneNumber && (
                <div className="text-red-500 text-sm">{errors.phoneNumber}</div>
              )}
            </div>
            <div className="mt-5 w-full">
              <div className="font-bold">Mật khẩu:</div>
              <div className="flex items-center">
                <InputText
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validateField("password", password)}
                  className={`w-full ${
                    errors.password ? "border-red-500" : ""
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
              {errors.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>
            <div className="mt-5 w-full">
              <div className="font-bold">Nhập lại mật khẩu:</div>
              <div className="flex items-center">
                <InputText
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    validateField("confirmPassword", confirmPassword)
                  }
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
                Đăng kí
              </Button>
            </div>
            <div className="flex justify-end mt-5">
              <div className="font-bold">
                <Link to={"/"}>Đến trang đăng nhập</Link>
              </div>
            </div>
          </Card>
        </div>
        <div className="col h-full flex justify-center items-center sm:hidden md:flex">
          <img
            src={userType === 2 ? farmer : business}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Register;
