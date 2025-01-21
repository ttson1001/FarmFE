import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import FileCarousel from "../../common/carousel/FileCarousel";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import { Calendar } from "primereact/calendar";
import {
  createBussinesPost,
  getBussinesPost,
  getFarmerPost,
} from "../../api/homeFarmer";
import { uploadFile, uploadImage } from "../../api/file";
import {
  clearLocalStorage,
  getFromLocalStorage,
  role,
} from "../../constant/utils";
import { categories } from "../../constant/constant";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/empty.png";

const HomeCompanyPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [standardRequirements, setStandardRequirements] = useState("");
  const [otherRequirement, setOtherRequirement] = useState("");
  const [images, setImages] = useState<number[]>([]);
  const [files, setFiles] = useState<number[]>([]);

  const [errors, setErrors] = useState<{
    content?: string;
    productName?: string;
    quantity?: string;
    category?: string;
    unitPrice?: string;
    standardRequirements?: string;
    otherRequirement?: string;
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 3) {
      clearLocalStorage();
      navigate("../");
    }
  });

  const validateProductFields = () => {
    const newErrors: {
      content?: string;
      productName?: string;
      quantity?: string;
      category?: string;
      unitPrice?: string;
      standardRequirements?: string;
      otherRequirement?: string;
    } = {};

    // Kiểm tra tên sản phẩm
    if (!productName) {
      newErrors.productName = "Vui lòng nhập tên sản phẩm.";
    }

    if (!content) {
      newErrors.content = "Vui lòng nhập mô tả.";
    }

    // Kiểm tra số lượng
    if (quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0.";
    }

    // Kiểm tra loại hàng (category)
    if (!selectedCategory) {
      newErrors.category = "Vui lòng chọn loại hàng.";
    }

    // Kiểm tra giá tiền
    if (unitPrice <= 1000) {
      newErrors.unitPrice = "Giá tiền phải lớn hơn 1000.";
    }

    // Kiểm tra yêu cầu tiêu chuẩn
    if (!standardRequirements) {
      newErrors.standardRequirements = "Vui lòng nhập yêu cầu tiêu chuẩn.";
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    getFarmerPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setErrors({});
    setModalVisible(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleReset = () => {
    setSearchTerm("");
    setFromDate(null);
    setToDate(null);
    setMinPrice(0);
    setMaxPrice(0);
    getBussinesPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    const data = {
      searchTerm,
      fromDate,
      toDate,
      minPrice,
      maxPrice,
    };
    getFarmerPost(data)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [file, setFile] = useState<any>(null);

  const [file1, setFile1] = useState<any>(null);

  const onFileChange = (event: any) => {
    setFile(event.target.files[0]); // Get the first selected file
  };

  const onFile1Change = (event: any) => {
    setFile1(event.target.files[0]); // Get the first selected file
  };

  const onUploadImage = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadImage(formData).then((x) => {
      const id = x.data.data.data.id;
      setImages((prv) => [...prv, id]);
    });
  };

  const onUploadFile = async () => {
    const formData = new FormData();
    formData.append("File", file1); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadFile(formData).then((x) => {
      const id = x.data.data.data.id;
      setFiles((prv) => [...prv, id]);
    });
  };

  const handleResetData = () => {
    setContent("");
    setProductName("");
    setQuantity(0);
    setStandardRequirements("");
    setOtherRequirement("");
    setSelectedCategory(0);
    setUnitPrice(0);
    setImages([]);
    setFiles([]);
  };

  const handleCreate = () => {
    const formData = {
      content,
      productName,
      quantity,
      category: selectedCategory,
      unitPrice,
      standardRequirments: standardRequirements,
      otherRequirement,
      images,
      files,
    };
    createBussinesPost(formData)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Tạo bài đăng thành công",
        });
        handleResetData();
        hideModal();
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Tạo bài đăng thất bại",
        });
      });
  };
  const toast = useRef<Toast>(null);

  const footerContent = (
    <div className="flex justify-end mt-10">
      <Button className="mr-5" onClick={handleCreate} severity="help">
        Đăng Tin
      </Button>
      <Button severity="danger" onClick={hideModal}>
        Hủy Bỏ
      </Button>
    </div>
  );
  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-12 p-4">
        <div className="col-span-3 p-4 text-center hidden md:block">
          <Card className="rounded-3xl sticky top-28">
            <div className="text-start font-bold">
              Tìm kiếm theo nội dung bài viết:
            </div>
            <div>
              <InputText
                type="text"
                className="w-full mt-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-start font-bold mt-2">Từ ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              value={fromDate}
              maxDate={toDate ?? new Date()}
              onChange={(e) => setFromDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Đến ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              minDate={fromDate ?? new Date()}
              value={toDate}
              onChange={(e) => setToDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Giá tối thiểu:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={minPrice + ""}
                onChange={(e) =>
                  setMinPrice(e.target.value ? parseFloat(e.target.value) : 0)
                }
              />
            </div>
            <div className="text-start mt-2 font-bold">Giá tối đa:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={maxPrice + ""}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? parseFloat(e.target.value) : 0)
                }
              />
            </div>
            <div className="flex justify-between mt-5">
              <Button className="" severity="help" onClick={handleSearch}>
                Tìm kiếm
              </Button>

              <Button className="" severity="danger" onClick={handleReset}>
                Mặc định
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-9 p-4 text-center">
          <Card className="rounded-3xl">
            <div className="grid grid-cols-12 gap-2">
              <Avatar
                className="w-12 h-12 col-span-2 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                image={getFromLocalStorage("avatar") ?? ""}
                shape="circle"
              />
              <InputText
                placeholder="Đăng gì đó lên tường nhà bạn"
                type="text"
                className="w-full ml-2 col-span-10 sm:col-span-11"
                onClick={showModal} // Sử dụng col-span-10 trên màn hình nhỏ
              />

              {/* Modal */}
              <Dialog
                footer={footerContent}
                header="Thông tin bài đăng"
                visible={isModalVisible}
                onHide={hideModal}
                className="h-[950px] w-[950px]"
              >
                <div className="grid grid-cols-12 gap-4 ">
                  <div className="col-span-4">
                    <label className="mr-2">Tên nông sản:</label>
                    <InputText
                      className={`mt-2 w-full ${
                        errors.productName ? "p-invalid border-red-500" : ""
                      }`}
                      onBlur={validateProductFields}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                    {errors.productName && (
                      <small className="text-red-500">
                        {errors.productName}
                      </small>
                    )}
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Số lượng (kg):</label>
                    <InputText
                      className={`mt-2 w-full ${
                        errors.quantity ? "p-invalid border-red-500" : ""
                      }`}
                      type="number"
                      onBlur={validateProductFields}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    {errors.quantity && (
                      <small className="text-red-500">{errors.quantity}</small>
                    )}
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Loại Hàng:</label>
                    <Dropdown
                      value={selectedCategory}
                      options={categories}
                      optionLabel="name"
                      onChange={(e: any) => setSelectedCategory(e.value)}
                      placeholder="Chọn loại"
                      onBlur={validateProductFields}
                      className={`mt-2 w-full ${
                        errors.category ? "p-invalid border-red-500" : ""
                      }`}
                    />
                    {errors.category && (
                      <small className="text-red-500">{errors.category}</small>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mt-2">
                  <div className="col-span-4">
                    <label className="mr-2">Yêu cầu tiêu chuẩn:</label>
                    <InputText
                      onBlur={validateProductFields}
                      className={`mt-2 w-full ${
                        errors.standardRequirements
                          ? "p-invalid border-red-500"
                          : ""
                      }`}
                      onChange={(e) => setStandardRequirements(e.target.value)}
                    />
                    {errors.standardRequirements && (
                      <small className="text-red-500">
                        {errors.standardRequirements}
                      </small>
                    )}
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Các yêu cầu khác:</label>
                    <InputText
                      className="w-full mt-2"
                      onChange={(e) => setOtherRequirement(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="mr-2">Giá từng sản phẩm (VND):</label>
                    <InputText
                      onBlur={validateProductFields}
                      className={`mt-2 w-full ${
                        errors.unitPrice ? "p-invalid border-red-500" : ""
                      }`}
                      type="number"
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                    />
                    {errors.unitPrice && (
                      <small className="text-red-500">{errors.unitPrice}</small>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 h-60 mt-2">
                  <div className="col-span-full h-52">
                    <label className=" col-span-3">Mô tả:</label>
                    {errors.content && (
                      <small className="text-red-500">{errors.content}</small>
                    )}
                    <Editor
                      placeholder="Nhập nội dung"
                      className="h-40 mt-2"
                      onTextChange={(e: any) => setContent(e.htmlValue)}
                      onBlur={validateProductFields}
                    />
                  </div>
                </div>
                <Divider />
                <div>Chứng từ liên quan (hình ảnh)</div>
                <div className="card col-span-full">
                  <input id="file-upload" type="file" onChange={onFileChange} />
                  <button
                    onClick={onUploadImage}
                    className="p-button p-component p-mt-2"
                  >
                    Tải lên
                  </button>
                </div>
                <Divider />
                <div>Chứng từ liên quan (file)</div>
                <div className="card col-span-full">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={onFile1Change}
                  />
                  <button
                    onClick={onUploadFile}
                    className="p-button p-component p-mt-2"
                  >
                    Tải lên
                  </button>
                </div>
              </Dialog>
            </div>
          </Card>
          {listObjects.length > 0 ? (
            listObjects?.map((item: any) => (
              <div key={item?.id}>
                <Card className="mt-5 rounded-3xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="w-12 h-12 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                        image={item?.avatar}
                        shape="circle"
                      />
                      <div>
                        <div>
                          <strong className="mr-1">Người đăng bài:</strong>
                          {item?.createdBy}
                        </div>
                        <div className="text-start">
                          <strong className="mr-1">Ngày đăng bài:</strong>
                          {item?.createdDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Tên sản phẩm:</strong>
                    {item?.productName}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1"> Số lượng:</strong>{" "}
                    {item?.quantity} kg
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Loại sản phẩm:</strong>{" "}
                    {categories.find((x) => x.label === item?.category)?.name}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Giá từng sản phẩm:</strong>{" "}
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        item?.unitPrice || 0
                      )}{" "}
                      VND
                    </span>
                  </div>
                  <div className="flex justify-start text-start">
                    <div>
                      <p>
                        {expandedItems[item.id] ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          ></span>
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.content.slice(0, 100),
                            }}
                          ></span>
                        )}
                        {item.content.length > 100 && (
                          <span
                            className="text-blue-500 cursor-pointer ml-2"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {expandedItems[item.id]
                              ? "Rút gọn"
                              : "... Xem thêm"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {item?.postFiles.length > 0 ? (
                    <>
                      <Divider />
                      <FileCarousel files={item?.postFiles ?? []} />
                    </>
                  ) : (
                    <></>
                  )}

                  {item?.postImages.length > 0 ? (
                    <>
                      <Divider />
                      <ImageCarousel images={item?.postImages ?? []} />
                    </>
                  ) : (
                    <></>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <Card className="rounded-3xl mt-5">
              <img src={empty} className="w-auto h-auto" alt="" />
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeCompanyPage;
