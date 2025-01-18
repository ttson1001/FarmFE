import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { forgotPassword } from "../../api/apiLogin";
import { Link } from "react-router-dom";
import forgot from "../../assets/forgot.png";

const Forgot = () => {
  const toast = useRef<Toast>(null);

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");

  const hanldeSumbmit = () => {
    const data = {
      email: userNameOrEmail,
      clientUri: "https://farm-forum-fe.techtheworld.id.vn/resset",
    };

    forgotPassword(data).then(() => {
      toast.current?.show({
        severity: "success",
        summary: `Gửi mail thành công`,
      });
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid md:grid-cols-2 h-screen sm:grid-cols-1">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Nhập email để đổi mật khẩu" className="w-2/3 h-auto">
            <div className="mt-5">
              <div className="font-bold">Email:</div>
              <InputText
                onChange={(e: any) => setUserNameOrEmail(e.target.value)}
                className="w-full"
                type="email"
              />
            </div>
            <div className="mt-5">
              <Button
                onClick={hanldeSumbmit}
                className="w-full flex justify-center"
                severity="help"
              >
                Gửi mail
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
            src={forgot}
            alt="Farmer"
            className="h-2/3 w-2/3 object-contain"
          />
        </div>
      </div>
    </>
  );
};
export default Forgot;
