import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import {
  addFileToPost,
  addImageToPost,
  deletePost,
  delFileFromPost,
  delImageFromPost,
  getBusinessHistory,
  UpdateBusinessPost,
} from "../../api/historyFarmer";
import { uploadFile, uploadImage } from "../../api/file";
import { Divider } from "primereact/divider";
import FileCarousel from "../../common/carousel/FileCarousel";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import {
  clearLocalStorage,
  getFromLocalStorage,
  getStatus,
  role,
} from "../../constant/utils";
import { categories } from "../../constant/constant";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/empty.png";
import ImageCarouselDel from "../../common/carousel/ImageCarouselDel";
import FileCarouselDel from "../../common/carousel/FileCarouselDel";
import { MultiSelect } from "primereact/multiselect";

const HistoryCompany = () => {
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const [isModalVisible, setModalVisible] = useState(false);

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [object, setObject] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [files, setFiles] = useState<{ id: number; filePath: string }[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [visible, setVisible] = useState(false);

  const [errors, setErrors] = useState<{
    content?: string;
    productName?: string;
    quantity?: string;
    category?: string;
    unitPrice?: string;
    standardRequirements?: string;
    otherRequirement?: string;
  }>({});

  const validateProductFields = (fieldToValidate: string, value?: any) => {
    const newErrors: {
      content?: string;
      productName?: string;
      quantity?: string;
      category?: string;
      unitPrice?: string;
      standardRequirements?: string;
      otherRequirement?: string;
    } = { ...errors }; // Giữ các lỗi trước đó

    // Kiểm tra từng trường dựa trên `fieldToValidate`
    switch (fieldToValidate) {
      case "productName":
        if (!object.productName) {
          newErrors.productName = "Vui lòng nhập tên sản phẩm.";
        } else {
          delete newErrors.productName; // Xóa lỗi nếu hợp lệ
        }
        break;

      case "content":
        if (!object.content) {
          newErrors.content = "Vui lòng nhập mô tả.";
        } else {
          delete newErrors.content;
        }
        break;

      case "quantity":
        if (
          !object.quantity ||
          object.quantity <= 0 ||
          object.quantity > 1000000
        ) {
          newErrors.quantity = "Số lượng phải trong khoảng 1 đến 1000000.";
        } else {
          delete newErrors.quantity;
        }
        break;

      case "category":
        console.log(value); // Kiểm tra giá trị
        if (!value || value.length === 0) {
          newErrors.category = "Vui lòng chọn loại hàng.";
        } else {
          delete newErrors.category;
        }
        break;

      case "unitPrice":
        if (
          !object.unitPrice ||
          object.unitPrice < 1000 ||
          object.unitPrice > 1000000000000
        ) {
          newErrors.unitPrice =
            "Giá tiền phải nằm trong khoảng từ 1 000 VND đến 1 000 000 000 000 VND.";
        } else {
          delete newErrors.unitPrice;
        }
        break;

      case "standardRequirements":
        if (!object.standardRequirement) {
          newErrors.standardRequirements = "Vui lòng nhập yêu cầu tiêu chuẩn.";
        } else {
          delete newErrors.standardRequirements;
        }
        break;

      case "otherRequirement":
        if (!object.otherRequirement) {
          newErrors.otherRequirement = "Vui lòng nhập yêu cầu khác.";
        } else {
          delete newErrors.otherRequirement;
        }
        break;

      default:
        break;
    }

    // Cập nhật lỗi
    setErrors(newErrors);
  };

  const footerContent1 = (
    <>
      <Button
        label="Có"
        severity="danger"
        onClick={() => handleDelete(selectedItemId ?? 0)}
      />
      <Button label="Không" onClick={() => setVisible(false)} />
    </>
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 3) {
      clearLocalStorage();
      navigate("../");
    }
  });

  useEffect(() => {
    getBusinessHistory()
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

  const showModal = (value: any) => {
    const images = value?.postImages?.map((x: any) => ({
      id: x.id,
      url: x.url,
    }));

    const filesx = value?.postFiles?.map((x: any) => ({
      id: x.id,
      filePath: x.filePath,
    }));
    setFiles(filesx);
    setImages(images);
    setObject(value);
    const cate = categories
      ?.filter((item) => value?.category.includes(item.label))
      .map((item) => item.value);

    setSelectedCategory(cate);
    setModalVisible(true); // Mở modal
  };

  const hideModal = () => {
    setObject(null);
    setErrors({});
    setModalVisible(false); // Đóng modal
  };

  const handleDelete = (id: number) => {
    deletePost(id)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Xóa bài đăng thành công",
        });
        setVisible(false);
        setLoading(true);
      })
      .catch(() => {
        toast.current?.show({
          severity: "success",
          summary: "Xóa bài đăng thất bại",
        });
      });
  };

  const [file, setFile] = useState<any>(null);
  const [file1, setFile1] = useState<any>(null);

  const onFileChange = (event: any) => {
    setFile(event.target.files[0]); // Get the first selected file
  };
  const onImageChange = (event: any) => {
    setFile1(event.target.files[0]); // Get the first selected file
  };

  const onUploadImage = async () => {
    const formData = new FormData();
    formData.append("File", file1); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadImage(formData)
      .then((x) => {
        const data = {
          id: x.data.data.data.id,
          url: x.data.data.data.imageUrl,
        };
        setImages((prv) => [...prv, data]);
        const imagesData = {
          postId: object?.id,
          imageIds: [data.id],
        };
        addImageToPost(imagesData).then(() => {
          toast.current?.show({
            severity: "success",
            summary: "Tải lên thành công",
          });
        });
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Tải lên thất bại",
        });
      });
  };

  const handleRemoveImage = (id: number) => {
    const updatedImages = images.filter((image) => image.id !== id);
    const value = {
      postId: object?.id,
      imageIds: [id],
    };
    delImageFromPost(value.postId, value.imageIds).then(() => {
      toast.current?.show({
        severity: "success",
        summary: "Xóa thành công",
      });
      setImages(updatedImages);
      setLoading(true);
    });
  };

  const handleRemoveFile = (id: number) => {
    const filesx = files.filter((file) => file.id !== id);
    const value = {
      postId: object?.id,
      fileIds: [id],
    };
    delFileFromPost(value.postId, value.fileIds).then(() => {
      toast.current?.show({
        severity: "success",
        summary: "Xóa thành công",
      });
      setFiles(filesx);
      setLoading(true);
    });
  };

  const onUploadFile = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadFile(formData)
      .then((x) => {
        toast.current?.show({
          severity: "success",
          summary: "Tải lên thành công",
        });
        const data = {
          id: x.data.data.data.id,
          filePath: x.data.data.data.filePath,
        };
        setFiles((prv) => [...prv, data]);
        const filesData = {
          postId: object?.id,
          fileIds: [data.id],
        };
        addFileToPost(filesData).then(() => {
          toast.current?.show({
            severity: "success",
            summary: "Tải lên thành công",
          });
        });
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Tải lên thất bại",
        });
      });
  };

  const update = () => {
    const data = {
      id: object?.id,
      content: object?.content,
      productName: object?.productName,
      quantity: object?.quantity,
      categories: selectedCategory,
      unitPrice: object?.unitPrice,
      standardRequirments: object?.standardRequirement,
      otherRequirement: object?.otherRequirement,
    };
    UpdateBusinessPost(data)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Tạo bài đăng thành công",
        });
        setFiles([]);
        setImages([]);
        setLoading(true);
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
      <Button
        className="mr-5"
        severity="help"
        onClick={() => {
          update();
        }}
      >
        Thay đổi
      </Button>
      <Button severity="danger" onClick={hideModal}>
        Hủy Bỏ
      </Button>
    </div>
  );
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-12 ">
        <div className="col-span-3 text-center hidden md:block"></div>

        <div className="col-span-12 md:col-span-6 mb-5 text-center">
          {listObjects.length > 0 ? (
            listObjects?.map((item: any) => (
              <div key={item?.id}>
                <Card className="rounded-3xl mt-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="w-12 h-12 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                        image={getFromLocalStorage("avatar") ?? ""}
                        shape="circle"
                      />
                      <div>
                        <div className="text-start">
                          <strong className="mr-1">Người đăng bài:</strong>
                          {item?.createdBy}
                        </div>
                        <div className="text-start">
                          <strong className="mr-1">Ngày đăng bài:</strong>
                          {item?.createdDate}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`rounded-md p-2 text-white ${
                        item?.status === "Pending"
                          ? "bg-blue-500"
                          : item?.status === "Rejected"
                          ? "bg-red-500"
                          : item?.status === "Approved"
                          ? "bg-green-500"
                          : "bg-gray-400" // màu mặc định nếu không có trạng thái nào khớp
                      }`}
                    >
                      {getStatus(item?.status)}
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
                    {categories
                      .filter((x) => item.category.includes(x.label))
                      .map((item) => item.name)
                      .join(", ")}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Giá đề xuất :</strong>{" "}
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        item?.unitPrice || 0
                      )}{" "}
                      VND
                    </span>
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Số điện thoại:</strong>
                    {item?.phoneNumber}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Yêu cầu tiêu chuẩn:</strong>{" "}
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
                  <Divider />
                  <div className="flex justify-between mt-5">
                    <Button severity="help" onClick={() => showModal(item)}>
                      Chỉnh sửa bài đăng
                    </Button>
                    <Button
                      onClick={() => {
                        setVisible(true); // Hiển thị hộp thoại xác nhận
                        setSelectedItemId(item.id);
                      }}
                      severity="danger"
                    >
                      Xóa bài đăng
                    </Button>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <Card className="rounded-3xl mt-5">
              <img src={empty} className="w-auto h-auto" alt="" />
            </Card>
          )}
        </div>

        <div className="col-span-3  p-4 text-center hidden md:block"></div>
      </div>
      <Dialog
        footer={footerContent}
        header="Thông tin bài đăng"
        visible={isModalVisible}
        onHide={hideModal}
        className="h-[950px] w-[950px]"
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <label className="mr-2">
              Tên nông sản: <span className="text-red-500">*</span>
            </label>
            <InputText
              className={`mt-2 w-full ${
                errors.productName ? "p-invalid border-red-500" : ""
              }`}
              value={object?.productName}
              onBlur={() => validateProductFields("projectName")}
              onChange={(e) =>
                setObject({ ...object, productName: e.target.value })
              }
            />
            {errors.productName && (
              <small className="text-red-500">{errors.productName}</small>
            )}
          </div>
          <div className="col-span-4">
            <label className="mr-2">
              Số lượng (kg): <span className="text-red-500">*</span>
            </label>
            <InputText
              className={`mt-2 w-full ${
                errors.quantity ? "p-invalid border-red-500" : ""
              }`}
              onBlur={() => validateProductFields("quantity")}
              value={object?.quantity}
              onChange={(e) =>
                setObject({ ...object, quantity: e.target.value })
              }
            />
            {errors.quantity && (
              <small className="text-red-500">{errors.quantity}</small>
            )}
          </div>
          <div className="col-span-4">
            <label className="mr-2  mt-2">
              Loại hàng: <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              value={selectedCategory} // Đổi sang mảng
              options={categories}
              optionLabel="name"
              onChange={(e: any) => {
                setSelectedCategory(e.value);
                validateProductFields("category", e.value);
              }} // Cập nhật danh sách chọn
              placeholder="Chọn loại"
              className={`mt-2 w-full ${
                errors.category ? "p-invalid border-red-500" : ""
              }`}
            />
            {errors.category && (
              <small className="text-red-500">{errors.category}</small>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2  mt-2">
          <div className="col-span-4">
            <label className="mr-2">
              Yêu cầu tiêu chuẩn: <span className="text-red-500">*</span>
            </label>
            <InputText
              onBlur={() => validateProductFields("standardRequirements")}
              className={`mt-2 w-full ${
                errors.standardRequirements ? "p-invalid border-red-500" : ""
              }`}
              value={object?.standardRequirement}
              onChange={(e) =>
                setObject({ ...object, standardRequirement: e.target.value })
              }
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
              className="w-full  mt-2"
              value={object?.otherRequirement}
              onChange={(e) =>
                setObject({ ...object, otherRequirement: e.target.value })
              }
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">
              Giá đề xuất (VND): <span className="text-red-500">*</span>
            </label>
            <InputText
              onBlur={() => validateProductFields("unitPrice")}
              className={`mt-2 w-full ${
                errors.unitPrice ? "p-invalid border-red-500" : ""
              }`}
              type="number"
              value={object?.unitPrice}
              onChange={(e) =>
                setObject({ ...object, unitPrice: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 h-60  mt-2">
          <div className="col-span-full h-52">
            <label className=" col-span-3">
              Mô tả: <span className="text-red-500">*</span>
            </label>
            {errors.content && (
              <small className="text-red-500">{errors.content}</small>
            )}
            <Editor
              placeholder="Nhập nội dung"
              className="h-40  mt-2"
              value={object?.content}
              onTextChange={(e: any) =>
                setObject({ ...object, content: e.htmlValue })
              }
              onBlur={() => validateProductFields("content")}
            />
          </div>
        </div>
        <Divider />
        <div>Chứng từ liên quan (hình ảnh)</div>
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

        <div className="card col-span-full">
          <input id="file-upload" type="file" onChange={onImageChange} />
          <button
            onClick={onUploadImage}
            className="p-button p-component p-mt-2"
          >
            Tải lên
          </button>
        </div>
        <Divider />
        <div>Chứng từ liên quan (file)</div>

        {files?.length > 0 ? (
          <div className="mt-1">
            <FileCarouselDel files={files} onRemoveFile={handleRemoveFile} />
          </div>
        ) : (
          <></>
        )}
        <div className="card col-span-full">
          <input id="file-upload" type="file" onChange={onFileChange} />
          <button
            onClick={onUploadFile}
            className="p-button p-component p-mt-2"
          >
            Tải lên
          </button>
        </div>
      </Dialog>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)} // Đóng hộp thoại
        message="Bạn có chắc chắn muốn xóa mục này không?"
        header="Xác nhận"
        icon="pi pi-exclamation-triangle"
        footer={footerContent1}
      />
    </>
  );
};

export default HistoryCompany;
