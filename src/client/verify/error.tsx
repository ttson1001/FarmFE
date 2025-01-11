import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import erorr from "../../assets/error.png";

const Error = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Bắt đầu từ 5 giây

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // Giảm 1 mỗi giây
    }, 1000);

    if (countdown === 0) {
      navigate("/"); // Chuyển hướng khi countdown = 0
    }

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, [countdown, navigate]);
  return (
    <>
      <div className="grid grid-cols-2 h-screen">
        <div className="col-span-full bg-purple-200 h-full justify-center flex items-center">
          <Card className="w-2/3 h-2/3 ">
            <div className="justify-center flex items-center">
              <img className="w-1/3 h-1/3" src={erorr} alt="" />
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-medium">
                Bạn sẽ được chuyển hướng về trang đăng nhập sau {countdown}{" "}
                giây...
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Error;
