import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ressetPassword } from "../../api/apiLogin";
import { useNavigate } from "react-router-dom";

const Resset = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

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

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-2 h-screen">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Đổi mật khẩu" className="w-2/3 h-auto">
            <div className="mt-5">
              <div className="font-bold">Mật khẩu:</div>
              <InputText
                onChange={(e: any) => setNewPassword(e.target.value)}
                className="w-full"
                type="password"
              />
            </div>
            <div className="mt-5">
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
                Đổi mật khẩu
              </Button>
            </div>
          </Card>
        </div>
        <div className="col h-full flex justify-center items-center">
          <img
            src={"/src/assets/farmer.png"}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Resset;
