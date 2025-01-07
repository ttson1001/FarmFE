import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

const CompanyProfile = () => {
  return (
    <div className="flex justify-center items-center mt-40">
      <Card className="w-2/3 h-1/2  ">
        <div className="flex justify-center">
          <Avatar
            className="w-40 h-40 cursor-pointer"
            image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
            shape="circle"
          />
        </div>
        <div className=" flex justify-between items-center mt-5">
          <div className="font-bold">Tên công ti:</div>
          <InputText className="w-3/6" />
        </div>
        <div className=" flex justify-between items-center mt-5">
          <div className="font-bold">Địa chỉ:</div>
          <InputText className="w-3/6" />
        </div>
        <div className=" flex justify-between items-center mt-5">
          <div className="font-bold">Mã số thuế:</div>
          <InputText className="w-3/6" />
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfile;
