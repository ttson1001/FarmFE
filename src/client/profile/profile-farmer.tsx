import { Avatar } from "primereact/avatar";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../api/profileFarmer";
import { Button } from "primereact/button";
import moment from "moment";
import { FarmerProfileDto } from "../../dto/FarmerProfileDto";
import { Toast } from "primereact/toast";
import { uploadImage } from "../../api/file";
import { Dropdown } from "primereact/dropdown";
import { genderOption } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import {
  clearLocalStorage,
  role,
  saveToLocalStorage,
} from "../../constant/utils";

interface FarmerProfileProps {
  value: string; // Gán kiểu string cho prop value
}
const FarmerProfile: React.FC<FarmerProfileProps> = ({ value }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<number>(1);
  const [avatar, setAvatar] = useState<string>("");
  const [load, setLoad] = useState(false);
  const toast = useRef<Toast>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 2) {
      clearLocalStorage();
      navigate("../");
    }
  });

  useEffect(() => {
    getProfile()
      .then((req) => {
        const farmer = req?.data?.data;
        setFirstName(farmer?.firstName);
        setLastName(farmer?.lastName);
        setPhoneNumber(farmer?.phoneNumber);
        setDateOfBirth(farmer?.dateOfBirth);
        setGender(
          farmer.gender === "Male" ? 1 : farmer.gender === "Female" ? 2 : 3
        );
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
      identityCard: "00",
      phoneNumber,
    };

    updateProfile(data).then((x) => {
      toast.current?.show({
        severity: "success",
        summary: x.data.message,
      });
      if (value === "login") {
        navigate("/profile-farmer");
      }
      saveToLocalStorage("avatar", avatar);
      setLoad(true);
      window.location.reload();
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Lấy file được chọn (nếu có)

    if (selectedFile) {
      onUploadImage(selectedFile); // Gọi hàm upload với file đã chọn
    } else {
      console.error("No file selected."); // Xử lý nếu không có file được chọn
    }
  };

  const onUploadImage = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("File", fileToUpload); // Thêm file vào formData
    formData.append("CustomFileName", "aaa"); // Thêm tên file tùy chỉnh

    try {
      const response = await uploadImage(formData); // Gọi hàm uploadImage để tải lên hình ảnh
      const url = response.data.data.data.imageUrl;
      setAvatar(url); // Cập nhật avatar với URL mới
    } catch (error) {
      console.error("Error uploading image:", error); // Xử lý lỗi nếu có
    }
  };

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  }>({});

  const validateField = (fieldName: string) => {
    let errorMessage = "";

    switch (fieldName) {
      case "firstName":
        if (!firstName) {
          errorMessage = "Vui lòng nhập tên.";
        }
        break;

      case "lastName":
        if (!lastName) {
          errorMessage = "Vui lòng nhập họ.";
        }
        break;

      case "phoneNumber":
        if (!phoneNumber) {
          errorMessage = "Vui lòng nhập số điện thoại.";
        } else if (!/^\d{10,11}$/.test(phoneNumber)) {
          errorMessage = "Số điện thoại phải là số và có độ dài 10-11 ký tự.";
        }
        break;

      case "dateOfBirth":
        if (!dateOfBirth) {
          errorMessage = "Vui lòng nhập ngày sinh.";
        } else {
          const birthDate = new Date(dateOfBirth);
          const today = new Date();

          // Tính tuổi
          let age = today.getFullYear() - birthDate.getFullYear();

          // Kiểm tra tháng và ngày để điều chỉnh tuổi
          const isBeforeBirthdayThisYear =
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
              today.getDate() < birthDate.getDate());

          // Nếu sinh nhật chưa tới trong năm nay, giảm tuổi đi 1
          if (isBeforeBirthdayThisYear) {
            age--;
          }

          // Kiểm tra tuổi
          if (age < 18) {
            errorMessage = "Bạn phải đủ 18 tuổi.";
          }
        }
        break;

      case "gender":
        if (gender === 0) {
          // Giả sử 0 là giá trị không hợp lệ
          errorMessage = "Vui lòng chọn giới tính.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-center">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Avatar
            className="w-32 h-32"
            image={avatar} // Đặt đường dẫn đến hình ảnh mặc định nếu không có hình ảnh
            shape="circle"
          />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden" // Ẩn input
        />
      </div>
      <div className="gap-10 items-center mt-5">
        <div className="w-24 font-bold">Họ:</div>
        <InputText
          value={lastName}
          onChange={(e: any) => setLastName(e.target.value)}
          className="w-full"
          onBlur={() => validateField("lastName")} // Gọi validateField khi rời khỏi trường
        />
        {errors.lastName && (
          <span className="text-red-500">{errors.lastName}</span>
        )}
      </div>
      <div className="  gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Tên:</div>
        <InputText
          onChange={(e: any) => setFirstName(e.target.value)}
          value={firstName}
          className="w-full"
          onBlur={() => validateField("firstName")}
        />
        {errors.firstName && (
          <span className="text-red-500">{errors.firstName}</span>
        )}
      </div>
      <div className=" gap-10 items-center mt-5">
        <div className="w-24 font-bold">Giới tính:</div>
        <Dropdown
          value={gender}
          options={genderOption}
          optionLabel="name"
          onChange={(e) => setGender(e.value)}
          placeholder="Chọn loại"
          onBlur={() => validateField("gender")}
          className={`mt-2 w-full ${
            errors.gender ? "p-invalid border-red-500" : ""
          }`}
        />
        {errors.gender && <span className="text-red-500">{errors.gender}</span>}
      </div>
      <div className=" gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Ngày sinh:</div>
        <Calendar
          value={moment(dateOfBirth, "DD/MM/YYYY").toDate()}
          showIcon
          dateFormat="dd/mm/yy"
          onSelect={(e: any) => setDateOfBirth(e.value)}
          className="w-full"
          onChange={() => validateField("dateOfBirth")}
        />
        {errors.dateOfBirth && (
          <span className="text-red-500">{errors.dateOfBirth}</span>
        )}
      </div>
      <div className=" gap-10 items-center mt-5">
        <div className="w-full font-bold">Số điện thoại:</div>
        <InputText
          onChange={(e: any) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          className="w-full"
          onBlur={() => validateField("phoneNumber")}
        />
        {errors.phoneNumber && (
          <span className="text-red-500">{errors.phoneNumber}</span>
        )}
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
