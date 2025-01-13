import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginData } from "../../dto/LoginDto";
import { login } from "../../api/apiLogin";
import { Toast } from "primereact/toast";
import { role, saveToLocalStorage } from "../../constant/utils";
import { getBusinesProfile, getProfile } from "../../api/profileFarmer";
import eye from "../../assets/eye.svg";
import hideEye from "../../assets/hideEye.svg";
import farmer from "../../assets/farmer.png";
import f from "../../assets/face.svg";
import g from "../../assets/x.svg";
import x from "../../assets/gmail.svg";
import { Dialog } from "primereact/dialog";
import FarmerProfile from "../../client/profile/profile-farmer";
import CompanyProfile from "../../client/profile/profile-company";

const Login = () => {
  const toast = useRef<Toast>(null);

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileVisible, setProfileVisible] = useState(false);
  const [errors, setErrors] = useState<{
    userNameOrEmail?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  const showProfileModal = () => setProfileVisible(true);
  const hideProfileModal = () => setProfileVisible(false);

  const hanldeSumbmit = () => {
    const data: UserLoginData = {
      userNameOrEmail,
      password,
      isRemember: true,
      ruuid: 0,
      redirect: "",
    };

    login(data)
      .then((r: any) => {
        saveToLocalStorage("token", r?.data?.data?.accessToken);
        toast.current?.show({
          severity: "success",
          summary: "Đăng nhập thành công",
        });
        setTimeout(() => {
          if (role() === 1) {
            navigate("admin/account");
          }
          if (role() === 2) {
            getProfile()
              .then((req) => {
                const farmer = req?.data?.data;
                saveToLocalStorage("avatar", farmer?.avatar);
                navigate("farmer-home");
              })
              .catch((e: any) => {
                {
                  toast.current?.show({
                    severity: "error",
                    summary:
                      "Vui lòng nhập đầy đủ thông tin để sử dụng dc app của chúng tôi",
                  });
                  showProfileModal();
                  console.log(e);
                }
              });
          }
          if (role() === 3) {
            getBusinesProfile()
              .then((req) => {
                const farmer = req?.data?.data;
                saveToLocalStorage("avatar", farmer?.avatar);
                navigate("company-home");
              })
              .catch((e: any) => {
                {
                  toast.current?.show({
                    severity: "error",
                    summary:
                      "Vui lòng nhập đầy đủ thông tin để sử dụng dc app của chúng tôi",
                  });
                  showProfileModal();
                  console.log(e);
                }
              });
          }
        }, 1000);
      })
      .catch((e) => {
        toast.current?.show({
          severity: "error",
          summary: "Đăng nhập thất bạn",
        });

        if (e?.response?.status === 401) {
          navigate("/verify");
        }
      });
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "userNameOrEmail": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "Tên người dùng hoặc Email là bắt buộc.";
        } else if (!emailRegex.test(value) && value.length < 3) {
          error = "Nhập ít nhất 3 ký tự cho tên người dùng hoặc email hợp lệ.";
        }
        break;
      }

      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc.";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid md:grid-cols-2 h-screen sm:grid-cols-1">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đăng nhập" className="w-2/3 h-auto">
            <div className="mt-5">
              <div className="font-bold">Tài khoản:</div>
              <InputText
                onChange={(e) => setUserNameOrEmail(e.target.value)}
                onBlur={() => validateField("userNameOrEmail", userNameOrEmail)}
                className={`w-full border ${
                  errors.userNameOrEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.userNameOrEmail && (
                <div className="text-red-500 text-sm">
                  {errors.userNameOrEmail}
                </div>
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
                  onClick={() => togglePasswordVisibility()}
                />
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>
            <div className="mt-5">
              <Button
                onClick={hanldeSumbmit}
                className="w-full flex justify-center"
                severity="help"
              >
                Đăng nhập
              </Button>
            </div>
            <div className="flex justify-between mt-5">
              <div className="font-bold">
                <Link to={"/register"}>Đăng kí</Link>
              </div>
              <div className="font-bold">
                <Link to={"/forgot"}>Quên mật khẩu</Link>
              </div>
            </div>
          </Card>
        </div>
        <div className="col h-full flex justify-center items-center sm:hidden md:flex">
          <img
            src={farmer}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
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
          <FarmerProfile value="login" />
        ) : (
          <CompanyProfile value="login" />
        )}
      </Dialog>
    </>
  );
};
export default Login;
