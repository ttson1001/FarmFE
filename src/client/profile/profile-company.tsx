import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import {
  getBusinesProfile,
  updateBusinessProfile,
} from "../../api/profileFarmer";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { uploadImage } from "../../api/file";
import { useNavigate } from "react-router-dom";
import {
  clearLocalStorage,
  role,
  saveToLocalStorage,
} from "../../constant/utils";
import { Divider } from "primereact/divider";
interface CompanyProfileProps {
  value: string; // Gán kiểu string cho prop value
}
const CompanyProfile: React.FC<CompanyProfileProps> = ({ value }) => {
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [taxNumber, setTaxNumber] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [load, setLoad] = useState(false);
  const toast = useRef<Toast>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 3) {
      clearLocalStorage();
      navigate("../");
    }
  });

  const [errors, setErrors] = useState<{
    companyName?: string;
    address?: string;
    taxNumber?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  }>({});

  const validateCompanyFields = () => {
    const newErrors: {
      companyName?: string;
      address?: string;
      taxNumber?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
    } = {};

    // Kiểm tra tên công ty
    if (!companyName) {
      newErrors.companyName = "Vui lòng nhập tên công ty.";
    } else if (companyName.length > 255) {
      newErrors.companyName = "Tên công ty không được quá 255 ký tự";
    }

    // Kiểm tra địa chỉ
    if (!address) {
      newErrors.address = "Vui lòng nhập địa chỉ.";
    } else if (address.length > 255) {
      newErrors.address = "Tên công ty không được quá 255 ký tự";
    }

    if (fullName?.split(" ").length == 1 || !fullName) {
      newErrors.fullName = "Vui lòng nhập cả Họ và Tên.";
    } else if (fullName.length > 255) {
      newErrors.fullName = "Họ và Tên không được quá 255 ký tự";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập địa chỉ.";
    } else if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 hoặc 11 chữ số.";
    }

    // Kiểm tra mã số thuế
    if (!taxNumber) {
      newErrors.taxNumber = "Vui lòng nhập mã số thuế.";
    } else if (!/^\d{10}$|^\d{13}$/.test(taxNumber.toString())) {
      newErrors.taxNumber = "Mã số thuế phải có 10 hoặc 13 chữ số.";
    }
    setErrors(newErrors);
  };

  useEffect(() => {
    getBusinesProfile()
      .then((req) => {
        const business = req?.data?.data;
        setTaxNumber(business?.taxNumber);
        setAvatar(business?.avatar);
        setAddress(business?.address);
        setCompanyName(business?.companyName);
        setFullName(business?.fullName);
        setPhoneNumber(business?.phoneNumber);
        setEmail(business?.email);
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
      avatar,
      firstName: fullName?.split(" ")?.shift(),
      lastName: " " + fullName?.split(" ")?.pop(),
    };
    updateBusinessProfile(companyData).then((x) => {
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

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-center">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Avatar
            className="w-40 h-40"
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
      <div className="w-26 font-bold">Tên công ty:</div>
      {errors.companyName && (
        <span className="text-red-500 mt-2">{errors.companyName}</span>
      )}
      <div className="flex items-center mt-2">
        <InputText
          value={companyName}
          onChange={(e: any) => setCompanyName(e.target.value)}
          className="w-full"
          onBlur={validateCompanyFields} // Gọi hàm kiểm tra khi trường mất tiêu điểm
        />
      </div>
      <div className=" w-full font-bold mt-2">Địa chỉ:</div>
      {errors.address && (
        <span className="text-red-500 mt-2">{errors.address}</span>
      )}
      <div className=" flex gap-10 items-center mt-2">
        <InputText
          onChange={(e: any) => setAddress(e.target.value)}
          value={address}
          className="w-full"
          onBlur={validateCompanyFields}
        />
      </div>
      <div className="w-24 font-bold mt-2">Mã số thuế:</div>
      {errors.taxNumber && (
        <span className="text-red-500 mt-2">{errors.taxNumber}</span>
      )}
      <div className="flex gap-10 items-center mt-2">
        <InputText
          onChange={(e: any) => setTaxNumber(e.target.value)}
          value={taxNumber.toString()}
          className="w-full"
          onBlur={validateCompanyFields}
        />
      </div>
      <Divider></Divider>
      <div className="w-full font-bold">Người đại diện </div>
      <div className="w-full font-bold  mt-2">Họ và tên:</div>
      {errors.fullName && (
        <span className="text-red-500  mt-2">{errors.fullName}</span>
      )}
      <div className=" flex gap-10 items-center mt-2">
        <InputText
          onChange={(e: any) => setFullName(e.target.value)}
          value={fullName?.toString()}
          className="w-full"
          onBlur={validateCompanyFields}
        />
      </div>
      <div className="w-full font-bold mt-2">Số điện thoại:</div>
      {errors.phoneNumber && (
        <span className="text-red-500  mt-2">{errors.phoneNumber}</span>
      )}
      <div className=" flex gap-10 items-center mt-2">
        <InputText value={phoneNumber.toString()} className="w-full" readOnly />
      </div>
      <div className="w-full font-bold  mt-2">Email:</div>
      {errors.email && <span className="text-red-500">{errors.email}</span>}
      <div className=" flex gap-10 items-center  mt-2">
        <InputText value={email.toString()} className="w-full" readOnly />
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
