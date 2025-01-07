import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import {
  deletePost,
  getBusinessHistory,
  getFarmerHistory,
} from "../../api/historyFarmer";
import { uploadFile, uploadImage } from "../../api/file";
import { Divider } from "primereact/divider";
import FileCarousel from "../../common/carousel/FileCarousel";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import moment from "moment";

const HistoryCompany = () => {
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

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [content, setContent] = useState("string");
  const [productName, setProductName] = useState("string");
  const [quantity, setQuantity] = useState(2147483647);
  const [category, setCategory] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [standardRequirements, setStandardRequirements] = useState("string");
  const [otherRequirement, setOtherRequirement] = useState("string");
  const [images, setImages] = useState<number[]>([]);
  const [files, setFiles] = useState<number[]>([]);

  useEffect(() => {
    getBusinessHistory()
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        setError(err.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const showModal = () => {
    setModalVisible(true); // Mở modal
  };

  const hideModal = () => {
    setModalVisible(false); // Đóng modal
  };

  const handleDelete = (id: number) => {
    deletePost(id);
    setLoading(true);
  };

  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]); // Get the first selected file
  };

  const onUploadImage = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadImage(formData);
  };

  const onUploadFile = async () => {
    const formData = new FormData();
    formData.append("File", file); // Append the file
    formData.append("CustomFileName", "aaa"); // Append the custom file name

    uploadFile(formData);
  };

  const footerContent = (
    <div className="flex justify-end mt-10">
      <Button className="mr-5" severity="help">
        Thay đổi
      </Button>
      <Button severity="danger" onClick={hideModal}>
        Hủy Bỏ
      </Button>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-12 ">
        <div className="col-span-3 text-center hidden md:block"></div>

        <div className="col-span-12 md:col-span-6 text-center">
          {listObjects?.map((item: any) => (
            <div key={item?.id}>
              <Card className="rounded-3xl mt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="w-12 h-12 mx-auto sm:col-span-1" // Sử dụng col-span-2 trên màn hình nhỏ
                      image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                      shape="circle"
                    />
                    <div>
                      <div>
                        <strong className="mr-1">Người đăng bài:</strong>
                        {item?.createdBy}
                      </div>
                      <div className="text-start">
                        <strong className="mr-1">Ngày đăng bài:</strong>
                        {moment(item?.createdDate).format("DD.MM.YYYY")}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md p-2 bg-green-400">
                    {item?.status}
                  </div>
                </div>
                <Divider />
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Tên sản phẩm:</strong>
                  {item?.productName}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1"> Số lượng:</strong> {item?.quantity}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Loại sản phẩm:</strong>{" "}
                  {item?.category}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Giá từng sản phẩm:</strong>{" "}
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item?.unitPrice || 0)}
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
                      {expandedItems[item.id]
                        ? item.content
                        : item.content.slice(0, 100)}
                      {item.content.length > 100 && (
                        <span
                          className="text-blue-500 cursor-pointer ml-2"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {expandedItems[item.id] ? "Rút gọn" : "... Xem thêm"}
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
                  <Button severity="help" onClick={showModal}>
                    Chỉnh sửa bài đăng
                  </Button>
                  <Button
                    onClick={() => handleDelete(item?.id)}
                    severity="danger"
                  >
                    Xóa bài đăng
                  </Button>
                </div>
              </Card>
            </div>
          ))}
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
            <label className="mr-2">Tên nông sản:</label>
            <InputText
              className="w-full"
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Số lượng:</label>
            <InputText
              className="w-full"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Loại Hàng:</label>
            <InputText
              className="w-full"
              onChange={(e) => setCategory(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <label className="mr-2">Yêu cầu tiêu chuẩn:</label>
            <InputText
              className="w-full"
              onChange={(e) => setStandardRequirements(e.target.value)}
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Các yêu cầu khác:</label>
            <InputText
              className="w-full"
              onChange={(e) => setOtherRequirement(e.target.value)}
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Giá từng sản phẩm:</label>
            <InputText
              className="w-full"
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 h-60">
          <div className="col-span-full h-52">
            <label className=" col-span-3">Mô tả:</label>
            <Editor
              placeholder="Nhập nội dung"
              className="h-40"
              onChange={(e: any) => setContent(e.target.value)}
            />
          </div>
        </div>
        <Divider />
        <div>Chọn hình ảnh</div>
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
        <div>Chọn file</div>
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
    </>
  );
};

export default HistoryCompany;
