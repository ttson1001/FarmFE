import { Card } from "primereact/card";
import lpz from "../../assets/plz.png";

const Verify = () => {
  return (
    <>
      <div className="grid grid-cols-2 h-screen">
        <div className="col-span-full bg-purple-200 h-full items-center justify-center flex">
          <Card className="w-2/3 h-2/3 ">
            <div className="justify-center flex">
              <img className="w-1/3 h-1/3" src={lpz} alt="" />
            </div>
            <div className="justify-center flex">
              <span className="text-4xl font-bold">
                Vui lòng vào email của bạn để xác thực tài khoản
              </span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Verify;
