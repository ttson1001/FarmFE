import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { deletePost, getFarmerHistory } from "../../api/historyFarmer";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import FileCarousel from "../../common/carousel/FileCarousel";
import moment from "moment";
import { Divider } from "primereact/divider";
import { uploadFile, uploadImage } from "../../api/file";

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

  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFarmerHistory()
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
                  <strong className="mr-1">Tỉ lệ thất thoát:</strong>{" "}
                  {item?.lossRate}
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
                  <strong className="mr-1">Tổng giá tiền:</strong>{" "}
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item?.totalPrice || 0)}
                  </span>
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
                <Divider />
                {item?.postFiles.length > 0 ? (
                  <FileCarousel files={item?.postFiles ?? []} />
                ) : (
                  <></>
                )}
                <Divider />
                {item?.postImages.length > 0 ? (
                  <ImageCarousel images={item?.postImages ?? []} />
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
        className="h-[800px] w-[800px]"
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <label className="mr-2">Tên nông sản:</label>
            <InputText />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Số lượng:</label>
            <InputText />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Loại Hàng:</label>
            <InputText />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <label className="mr-2">Tỉ lệ thất thoát:</label>
            <InputText className="w-full" />
          </div>
          <div className="col-span-6">
            <label className="mr-2">Giá tiền:</label>
            <InputText className="w-full" />
          </div>
        </div>
        <div className="grid grid-cols-12 h-60">
          <div className="col-span-full h-52">
            <label className=" col-span-3">Mô tả:</label>
            <Editor placeholder="Nhập nội dung" className="h-40" />
          </div>
        </div>
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

export default HistoryFarmer;
