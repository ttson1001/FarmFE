import { Avatar } from "primereact/avatar";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../api/profileFarmer";
import { Button } from "primereact/button";
import moment from "moment";
import { FarmerProfileDto } from "../../dto/FarmerProfileDto";
import { Toast } from "primereact/toast";

const FarmerProfile = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [identityCard, setIdentityCard] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<number>(1);
  const [avatar, setAvatar] = useState<string>("");
  const [load, setLoad] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    getProfile()
      .then((req) => {
        const farmer = req?.data?.data;
        setFirstName(farmer?.firstName);
        setLastName(farmer?.lastName);
        setIdentityCard(farmer?.identityCard);
        setDateOfBirth(farmer?.dateOfBirth);
        setGender(farmer?.gender);
        setAvatar(farmer?.avatar);
        setLoad(false);
      })
      .catch((e: any) => {
        {
          console.log(e);
        }
      });
  }, [load]);

  const handleUpdate = () => {
    const dob = moment(moment(dateOfBirth, "DD/MM/YYYY").toDate()).format(
      "YYYY-MM-DD"
    );
    const data: FarmerProfileDto = {
      firstName,
      lastName,
      avatar,
      dateOfBirth: dob,
      gender: 1,
      identityCard,
    };

    updateProfile(data).then((x) => {
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
          image={avatar}
          shape="circle"
        />
      </div>
      <div className="flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">Họ:</div>
        <InputText
          value={lastName}
          onChange={(e: any) => setLastName(e.target.value)}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Tên:</div>
        <InputText
          onChange={(e: any) => setFirstName(e.target.value)}
          value={firstName}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">Giới tính:</div>
        <InputText
          onChange={(e: any) => setGender(e.target.value)}
          value={gender + ""}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Hình ảnh:</div>
        <InputText
          onChange={(e: any) => setAvatar(e.target.value)}
          value={avatar}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Ngày sinh:</div>
        <Calendar
          value={moment(dateOfBirth, "DD/MM/YYYY").toDate()}
          showIcon
          onSelect={(e: any) => setDateOfBirth(e.value)}
          className="w-96"
        />
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">số CCCD:</div>
        <InputText
          onChange={(e: any) => setIdentityCard(e.target.value)}
          value={identityCard}
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

export default FarmerProfile;
