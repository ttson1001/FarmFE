import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import empty from "../../assets/empty.png";

import {
  addFileToPost,
  addImageToPost,
  deletePost,
  delFileFromPost,
  delImageFromPost,
  getFarmerHistory,
  UpdateFarmerPost,
} from "../../api/historyFarmer";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import FileCarousel from "../../common/carousel/FileCarousel";
import { Divider } from "primereact/divider";
import { uploadFile, uploadImage } from "../../api/file";
import {
  clearLocalStorage,
  getFromLocalStorage,
  getStatus,
  role,
} from "../../constant/utils";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { categories } from "../../constant/constant";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import FileCarouselDel from "../../common/carousel/FileCarouselDel";
import ImageCarouselDel from "../../common/carousel/ImageCarouselDel";

const HistoryFarmer = () => {
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Đảo trạng thái mở rộng của item hiện tại
    }));
  };
  const [isModalVisible, setModalVisible] = useState(false); // State để quản lý modal
  const [object, setObject] = useState<any>(null);
  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [visible, setVisible] = useState(false);
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

  useEffect(() => {
    getFarmerHistory()
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
    setObject(value);
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
    const cate = categories?.find((x) => x.label === value?.category)?.value;

    setSelectedCategory(cate);
    setModalVisible(true); // Mở modal
  };

  const hideModal = () => {
    setObject(null);
    setImages([]);
    setFiles([]);
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
        setLoading(true);
        setVisible(false);
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

  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [files, setFiles] = useState<{ id: number; filePath: string }[]>([]);

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
      quantity: Number(object?.quantity),
      category: selectedCategory,
      lossRate: Number(object?.lossRate),
      unitPrice: object?.unitPrice,
    };
    UpdateFarmerPost(data)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Chỉnh sửa bài đăng thành công",
        });

        setFiles([]);
        setImages([]);
        setLoading(true);
        hideModal();
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Chỉnh sửa bài đăng thất bại",
        });
      });
  };

  const footerContent = (
    <div className="flex justify-end mt-10">
      <Button className="mr-5" severity="help" onClick={update}>
        Thay đổi
      </Button>
      <Button severity="danger" onClick={hideModal}>
        Hủy Bỏ
      </Button>
    </div>
  );

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
  const toast = useRef<Toast>(null);

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

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-12 ">
        <div className="col-span-3 text-center hidden md:block"></div>

        <div className="col-span-12 md:col-span-6 mb-5  text-center">
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
                    {categories.find((x) => x.label === item?.category)?.name}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Tỉ lệ thất thoát:</strong>{" "}
                    {item?.lossRate} %
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
                    <strong className="mr-1">Tổng giá tiền:</strong>{" "}
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        item?.unitPrice || 0
                      )}{" "}
                      VND
                    </span>
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
        className="h-[900px] w-[900px]"
      >
        <div className="grid md:grid-cols-12 gap-4 sm:grid-cols-1">
          <div className="md:col-span-4 sm:col-span-full">
            <label className="mr-2">Tên nông sản:</label>
            <InputText
              value={object?.productName}
              onChange={(e) =>
                setObject({ ...object, productName: e.target.value })
              }
              className={`mt-2 w-full ${
                errors.productName ? "p-invalid border-red-500" : ""
              }`}
              onBlur={(e) => validateField("productName", e.target.value)}
            />
            {errors.productName && (
              <small className="text-red-500">{errors.productName}</small>
            )}
          </div>
          <div className="md:col-span-4 sm:col-span-full">
            <label className="mr-2">Số lượng (kg):</label>
            <InputText
              className={`mt-2 w-full ${
                errors.quantity ? "p-invalid border-red-500" : ""
              }`}
              onBlur={(e) => validateField("quantity", e.target.value)}
              value={object?.quantity}
              onChange={(e) =>
                setObject({ ...object, quantity: e.target.value })
              }
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
              onChange={(e) => setSelectedCategory(e.value)}
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
              value={object?.lossRate}
              onChange={(e) =>
                setObject({ ...object, lossRate: e.target.value })
              }
            />
            {errors.lossRate && (
              <small className="text-red-500">{errors.lossRate}</small>
            )}
          </div>
          <div className=" md:col-span-6 sm:col-span-full">
            <label className="mr-2">Giá tiền (VND):</label>
            <InputText
              onBlur={(e) => validateField("unitPrice", e.target.value)}
              className={`mt-2 w-full ${
                errors.unitPrice ? "p-invalid border-red-500" : ""
              }`}
              value={object?.unitPrice}
              onChange={(e) =>
                setObject({ ...object, unitPrice: e.target.value })
              }
            />
            {errors.unitPrice && (
              <small className="text-red-500">{errors.unitPrice}</small>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 h-60 mt-2 sm:grid-cols-1">
          <div className="col-span-full h-52">
            <label className=" col-span-3">Mô tả:</label>
            <Editor
              placeholder="Nhập nội dung"
              className="h-40"
              value={object?.content}
              onTextChange={(e: any) => {
                setObject({ ...object, content: e.htmlValue });
              }}
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
          <input id="file-upload" type="file" onChange={onImageChange} />
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
            <FileCarouselDel files={files} onRemoveFile={handleRemoveFile} />
          </div>
        ) : (
          <></>
        )}
        <div className="card col-span-full sm:col-span-full">
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

export default HistoryFarmer;
