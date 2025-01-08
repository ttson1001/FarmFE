import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { forgotPassword } from "../../api/apiLogin";

const Forgot = () => {
  const toast = useRef<Toast>(null);

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");

  const hanldeSumbmit = () => {
    const data = {
      email: userNameOrEmail,
      clientUri: "http://localhost:5174/resset",
    };

    forgotPassword(data);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-2 h-screen">
        <div className="col bg-purple-200 h-full items-center justify-center flex">
          <Card title="Nhập email để đổi mật khẩu" className="w-2/3 h-auto">
            <div className="mt-5">
              <div className="font-bold">Email:</div>
              <InputText
                onChange={(e: any) => setUserNameOrEmail(e.target.value)}
                className="w-full"
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
export default Forgot;
