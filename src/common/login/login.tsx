import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginData } from "../../dto/LoginDto";
import { login } from "../../api/apiLogin";
import { Toast } from "primereact/toast";
import farmerImage from '../../assets/farmer.png';

import {
  getFromLocalStorage,
  role,
  saveToLocalStorage,
} from "../../constant/utils";
import { getBusinesProfile, getProfile } from "../../api/profileFarmer";

const Login = () => {
  const toast = useRef<Toast>(null);

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

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
        const message = r?.data?.message;
        saveToLocalStorage("token", r?.data?.data?.accessToken);
        console.log(getFromLocalStorage("token"));
        toast.current?.show({
          severity: "success",
          summary: message,
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
                  console.log(e);
                }
              });
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
              <div className="font-bold">
                <Link to={"/forgot"}>Quên mật khẩu</Link>
              </div>
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
            src={farmerImage}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Login;
