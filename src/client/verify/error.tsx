import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          <Card className="w-2/3 h-auto ">
            <div className="justify-center flex items-center">
              <img
                className="md:w-1/3 md:h-1/3 sm:w-[250px] sm:h-[250px]"
                src={erorr}
                alt=""
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-medium">
                Bạn sẽ được chuyển hướng về trang đăng nhập sau {countdown}{" "}
                giây...
              </p>
              Hoặc
              <div className="font-bold">
                <Link to={"/"}>Đến trang đăng nhập</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Error;
