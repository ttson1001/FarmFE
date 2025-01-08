import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import {
  getBusinesProfile,
  updateBusinessProfile,
} from "../../api/profileFarmer";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const CompanyProfile = () => {
  const [companyName, setCompanyName] = useState("123231");
  const [address, setAddress] = useState("213213");
  const [taxNumber, setTaxNumber] = useState(12312314);
  const [load, setLoad] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    getBusinesProfile()
      .then((req) => {
        const business = req?.data?.data;
        setTaxNumber(business?.taxNumber);
        setAddress(business?.address);
        setCompanyName(business?.companyName);
      })
      .catch((e: any) => {
        {
          console.log(e);
        }
      });
  }, [load]);

  const handleUpdate = () => {
    const companyData = {
      companyName,
      address,
      taxNumber,
    };

    updateBusinessProfile(companyData).then((x) => {
      toast.current?.show({
        severity: "success",
        summary: x.data.message,
      });
      setLoad(true);
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-center">
        <Avatar
          className="w-40 h-40 cursor-pointer"
          image={""}
          shape="circle"
        />
      </div>
      <div className="flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">Tên công ti:</div>
        <InputText
          value={companyName}
          onChange={(e: any) => setCompanyName(e.target.value)}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Địa chỉ:</div>
        <InputText
          onChange={(e: any) => setAddress(e.target.value)}
          value={address}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">Mã số thuế:</div>
        <InputText
          onChange={(e: any) => setTaxNumber(e.target.value)}
          value={taxNumber.toString()}
          className="w-96"
        />
      </div>

      <div className="flex justify-center mt-5">
        <Button onClick={handleUpdate} severity="help">
          Cập nhật
        </Button>
      </div>
    </>
  );
};

export default CompanyProfile;
