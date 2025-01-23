import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { createFarmerPost, getBussinesPost } from "../../api/homeFarmer";
import { Divider } from "primereact/divider";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import FileCarousel from "../../common/carousel/FileCarousel";
import { Calendar } from "primereact/calendar";
import { uploadFile, uploadImage } from "../../api/file";
import empty from "../../assets/empty.png";
import {
  clearLocalStorage,
  getFromLocalStorage,
  role,
} from "../../constant/utils";
import { categories, nextYear, prvYear } from "../../constant/constant";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import ImageCarouselDel from "../../common/carousel/ImageCarouselDel";
import FileCarouselDel from "../../common/carousel/FileCarouselDel";

const HomeFarmerPage = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State để quản lý modal;

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState(0);
  const [lossRate, setLossRate] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [files, setFiles] = useState<{ id: number; filePath: string }[]>([]);

  useEffect(() => {
    getBussinesPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
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
    setFiles([]);
    setImages([]);
    console.log(category);
    setModalVisible(true);
  };

  const hideModal = () => {
    setCategory(0);
    setErrors({});
    setModalVisible(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(prvYear);
  const [toDate, setToDate] = useState<Date | null>(nextYear);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    0
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 2) {
      clearLocalStorage();
      navigate("../");
    }
  });

  const handleReset = () => {
    setSearchTerm("");
    setFromDate(prvYear);
    setToDate(nextYear);
    setMinPrice(0);
    setMaxPrice(Number.MAX_SAFE_INTEGER);
    getBussinesPost(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
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
    getBussinesPost(data)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
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
      const data = {
        id: x.data.data.data.id,
        url: x.data.data.data.imageUrl,
      };
      setImages((prv) => [...prv, data]);
      toast.current?.show({
        severity: "success",
        summary: "Tải lên thành công",
      });
    });
  };

  const handleRemoveImage = (id: number) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
  };

  const handleRemoveFile = (id: number) => {
    const filesx = files.filter((file) => file.id !== id);
    setFiles(filesx);
  };

  const onUploadFile = async () => {
    const formData = new FormData();
    formData.append("File", file1); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadFile(formData).then((x) => {
      toast.current?.show({
        severity: "success",
        summary: "Tải lên thành công",
      });
      const data = {
        id: x.data.data.data.id,
        filePath: x.data.data.data.filePath,
      };
      setFiles((prv) => [...prv, data]);
    });
  };

  const handleResetData = () => {
    setContent("");
    setProductName("");
    setQuantity(0);
    setCategory(0);
    setSelectedCategory(0);
    setLossRate(1.0);
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
      lossRate,
      unitPrice,
      images: images?.map((x) => x.id),
      files: files?.map((x) => x.id),
    };
    createFarmerPost(formData)
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

  const [errors, setErrors] = useState<{
    content?: string;
    productName?: string;
    quantity?: string;
    category?: string;
    lossRate?: string;
    unitPrice?: string;
  }>({});

  const validateField = (field: string, value: any) => {
    let error = "";
    switch (field) {
      case "content":
        if (!value.trim()) {
          error = "Nội dung không được để trống.";
        }
        break;

      case "productName":
        if (!value.trim()) {
          error = "Tên sản phẩm không được để trống.";
        }
        break;

      case "quantity":
        if (value <= 0) {
          error = "Số lượng phải lớn hơn 0.";
        }
        break;

      case "category":
        if (value <= 0) {
          error = "Danh mục không hợp lệ.";
        }
        break;

      case "lossRate":
        if (value < 1 || value > 99) {
          error = "Tỷ lệ hao hụt phải nằm trong khoảng từ 1 đến 99.";
        }
        break;

      case "unitPrice":
        if (value <= 1000) {
          error = "Đơn giá phải lớn hơn 1 000 VND.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };
  const toast = useRef<Toast>(null);

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
                <div className="grid md:grid-cols-12 gap-4 sm:grid-cols-1">
                  <div className="md:col-span-4 sm:col-span-full">
                    <label className="mr-2">Tên nông sản:</label>
                    <InputText
                      onChange={(e: any) => setProductName(e.target.value)}
                      className={`mt-2 w-full ${
                        errors.productName ? "p-invalid border-red-500" : ""
                      }`}
                      onBlur={(e) =>
                        validateField("productName", e.target.value)
                      }
                    />
                    {errors.productName && (
                      <small className="text-red-500">
                        {errors.productName}
                      </small>
                    )}
                  </div>
                  <div className="md:col-span-4 sm:col-span-full">
                    <label className="mr-2">Số lượng (kg):</label>
                    <InputText
                      type="number"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className={`mt-2 w-full ${
                        errors.quantity ? "p-invalid border-red-500" : ""
                      }`}
                      onBlur={(e) => validateField("quantity", e.target.value)}
                    />
                    {errors.quantity && (
                      <small className="text-red-500">{errors.quantity}</small>
                    )}
                  </div>
                  <div className="md:col-span-4 sm:col-span-full">
                    <label className="mr-2">Loại hàng:</label>
                    <Dropdown
                      value={selectedCategory}
                      options={categories}
                      optionLabel="name"
                      onChange={(e: any) => setSelectedCategory(e.value)}
                      placeholder="Chọn loại"
                      onBlur={() => validateField("category", selectedCategory)}
                      className={`mt-2 w-full ${
                        errors.category ? "p-invalid border-red-500" : ""
                      }`}
                    />
                    {errors.category && (
                      <small className="text-red-500">{errors.category}</small>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-12 gap-2 mt-2 sm:grid-cols-1">
                  <div className=" md:col-span-6 sm:col-span-full">
                    <label className="mr-2">Tỉ lệ thất thoát (%):</label>
                    <InputText
                      onBlur={(e) => validateField("lossRate", e.target.value)}
                      className={`mt-2 w-full ${
                        errors.lossRate ? "p-invalid border-red-500" : ""
                      }`}
                      type="number"
                      onChange={(e) => setLossRate(parseFloat(e.target.value))}
                    />
                    {errors.lossRate && (
                      <small className="text-red-500">{errors.lossRate}</small>
                    )}
                  </div>
                  <div className="md:col-span-6 sm:col-span-full">
                    <label className="mr-2">Giá tiền (VND):</label>
                    <InputText
                      onBlur={(e) => validateField("unitPrice", e.target.value)}
                      className={`mt-2 w-full ${
                        errors.unitPrice ? "p-invalid border-red-500" : ""
                      }`}
                      type="number"
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                    />
                    {errors.unitPrice && (
                      <small className="text-red-500">{errors.unitPrice}</small>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 h-60 mt-2 sm:grid-cols-1">
                  <div className="col-span-full h-52">
                    <label className=" col-span-3 ">Mô tả:</label>
                    {errors.content && (
                      <small className="text-red-500">{errors.content}</small>
                    )}
                    <Editor
                      placeholder="Nhập nội dung"
                      className="h-40 mt-2"
                      onBlur={() => validateField("content", content)}
                      onTextChange={(e: any) => setContent(e.htmlValue)}
                    />
                  </div>
                </div>
                <Divider />
                <div>Chứng từ đính kèm (Hình ảnh)</div>
                {images?.length > 0 ? (
                  <div className="mt-1">
                    <ImageCarouselDel
                      images={images}
                      onRemoveImage={handleRemoveImage}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="card col-span-full sm:col-span-full">
                  <input id="file-upload" type="file" onChange={onFileChange} />
                  <button
                    onClick={onUploadImage}
                    className="p-button p-component p-mt-2"
                  >
                    Tải lên
                  </button>
                </div>
                <Divider />
                <div>Chứng từ đính kèm (File)</div>
                {files?.length > 0 ? (
                  <div className="mt-1">
                    <FileCarouselDel
                      files={files}
                      onRemoveFile={handleRemoveFile}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="card col-span-full sm:col-span-full">
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
                        <div className="text-start">
                          <strong className="mr-1 ">Người đăng bài:</strong>
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
                    <strong className="mr-1">Yêu cầu phải có:</strong>{" "}
                    {item?.standardRequirement}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Các yêu cầu khác:</strong>{" "}
                    {item?.otherRequirement}
                  </div>
                  <div className="flex justify-start text-start">
                    <div>
                      {/* Hiển thị nội dung văn bản */}
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

                  {item?.postFiles?.length > 0 ? (
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

export default HomeFarmerPage;
