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
interface CompanyProfileProps {
  value: string; // Gán kiểu string cho prop value
}
const CompanyProfile: React.FC<CompanyProfileProps> = ({ value }) => {
  const [companyName, setCompanyName] = useState("");
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
  }>({});

  const validateCompanyFields = () => {
    const newErrors: {
      companyName?: string;
      address?: string;
      taxNumber?: string;
    } = {};

    // Kiểm tra tên công ty
    if (!companyName) {
      newErrors.companyName = "Vui lòng nhập tên công ty.";
    }

    // Kiểm tra địa chỉ
    if (!address) {
      newErrors.address = "Vui lòng nhập địa chỉ.";
    }

    // Kiểm tra mã số thuế
    if (!taxNumber) {
      newErrors.taxNumber = "Vui lòng nhập mã số thuế.";
    } else if (taxNumber <= 0) {
      newErrors.taxNumber = "Mã số thuế phải lớn hơn 0.";
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
      <div className="flex gap-10 items-center mt-5">
        <div className="w-26 font-bold">Tên công ty:</div>
        <InputText
          value={companyName}
          onChange={(e: any) => setCompanyName(e.target.value)}
          className="w-96"
          onBlur={validateCompanyFields} // Gọi hàm kiểm tra khi trường mất tiêu điểm
        />
        {errors.companyName && (
          <span className="text-red-500">{errors.companyName}</span>
        )}
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className=" w-24 font-bold">Địa chỉ:</div>
        <InputText
          onChange={(e: any) => setAddress(e.target.value)}
          value={address}
          className="w-96"
          onBlur={validateCompanyFields}
        />
        {errors.address && (
          <span className="text-red-500">{errors.address}</span>
        )}
      </div>
      <div className=" flex gap-10 items-center mt-5">
        <div className="w-24 font-bold">Mã số thuế:</div>
        <InputText
          onChange={(e: any) => setTaxNumber(e.target.value)}
          value={taxNumber.toString()}
          className="w-96"
          onBlur={validateCompanyFields}
        />
        {errors.taxNumber && (
          <span className="text-red-500">{errors.taxNumber}</span>
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

export default CompanyProfile;
