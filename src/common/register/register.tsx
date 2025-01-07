import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUserDto } from "../../dto/RegisterDto";
import { register } from "../../api/apiLogin";
import { Toast } from "primereact/toast";

const Register = () => {
  const toast = useRef<Toast>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userType, setUserType] = useState<number>(1);
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
      .then((r: any) => {
        const message = r?.data?.message || "Đăng ký thành công!";
        toast.current?.show({
          severity: "success",
          summary: message,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((e) => {
        const errorMessage = e?.response?.data?.message || "Có lỗi xảy ra!";
        console.log(e);
        toast.current?.show({
          severity: "error",
          summary: errorMessage,
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-2 h-screen">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đăng kí" className="w-2/3 h-3/3">
            <div className="font-bold mb-2">Bạn là:</div>
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="pizza"
                  value={1}
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === 1}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Doanh nghiệp
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="pizza"
                  value={2}
                  onChange={(e) => setUserType(e.value)}
                  checked={userType === 2}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  Nông dân
                </label>
              </div>
            </div>
            <div className="mt-5">
              <div className="font-bold">Tên đăng nhập:</div>
              <InputText
                onChange={(e: any) => setUserName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-5">
              <div className="font-bold">Email:</div>
              <InputText
                type="email"
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-5">
              <div className="font-bold">Số điện thoại:</div>
              <InputText
                onChange={(e: any) => setPhoneNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-5 w-full">
              <div className="font-bold">Mật khẩu:</div>
              <InputText
                type="password"
                onChange={(e: any) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-5 w-full">
              <div className="font-bold">Nhập lại mật khẩu:</div>
              <InputText
                type="password"
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
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
        <div className="col h-full flex justify-center items-center">
          <img
            src={
              userType === 2
                ? "/src/assets/farmer.png"
                : "/src/assets/company.png"
            }
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Register;
