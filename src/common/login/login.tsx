import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginData } from "../../dto/LoginDto";
import { login } from "../../api/apiLogin";
import { Toast } from "primereact/toast";
import {
  getFromLocalStorage,
  role,
  saveToLocalStorage,
} from "../../constant/utils";

const Login = () => {
  const [ingredient, setIngredient] = useState("");
  const toast = useRef<Toast>(null);

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRemember, setIsRemember] = useState<boolean>(true);
  const [ruuid, setRuuid] = useState<number>(0);
  const [redirect, setRedirect] = useState<string>("");

  const navigate = useNavigate();

  const hanldeSumbmit = () => {
    const data: UserLoginData = {
      userNameOrEmail,
      password,
      isRemember,
      ruuid,
      redirect,
    };

    login(data)
      .then((r: any) => {
        const message = r?.data?.message;
        saveToLocalStorage("token", r?.data?.data?.accessToken);
        console.log(getFromLocalStorage("token"));
        toast.current?.show({
          severity: "success",
          summary: message,
        });
        console.log(role());
        setTimeout(() => {
          if (role() === 1) {
            navigate("/admin");
          }
          if (role() === 2) {
            navigate("farmer-home");
          }
          if (role() === 3) {
            navigate("company-home");
          }
        }, 1000);
      })
      .catch((e) => {
        const errorMessage = e?.response?.data?.message;
        toast.current?.show({
          severity: "error",
          summary: errorMessage,
        });

        if (e?.response?.status === 401) {
          navigate("/verify");
        }
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-2 h-screen">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đăng nhập" className="w-2/3 h-2/3">
            <div className="font-bold mb-2">Bạn là:</div>
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="pizza"
                  value="1"
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === "1"}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Doanh nghiệp
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="pizza"
                  value="2"
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === "2"}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  Nông dân
                </label>
              </div>
            </div>
            <div className="mt-5">
              <div className="font-bold">Tài khoản:</div>
              <InputText
                onChange={(e: any) => setUserNameOrEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-5 w-full">
              <div className="font-bold">Mật khẩu:</div>
              <InputText
                onChange={(e: any) => setPassword(e.target.value)}
                type="password"
                className="w-full"
              />
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
              <div className="font-bold">Quên mật khẩu</div>
            </div>
            <Divider />
            <div className="flex gap-10 justify-center">
              <img className="w-12 h-12" src="/src/assets/face.svg" alt="" />
              <img className="w-12 h-12" src="/src/assets/gmail.svg" alt="" />
              <img className="w-12 h-12" src="/src/assets/x.svg" alt="" />
            </div>
          </Card>
        </div>
        <div className="col h-full flex justify-center items-center">
          <img
            src={
              ingredient === "2"
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
export default Login;
