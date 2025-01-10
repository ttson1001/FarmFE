import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import {
  deletePost,
  getFarmerHistory,
  UpdateFarmerPost,
} from "../../api/historyFarmer";
import ImageCarousel from "../../common/carousel/ImageCarousel";
import FileCarousel from "../../common/carousel/FileCarousel";
import moment from "moment";
import { Divider } from "primereact/divider";
import { uploadFile, uploadImage } from "../../api/file";
import { getFromLocalStorage, getStatus } from "../../constant/utils";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { categories } from "../../constant/constant";

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
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const showModal = (value: any) => {
    setObject(value);
    console.log(value.category);
    const cate = categories?.find((x) => x.label === value?.category)?.value;

    setSelectedCategory(cate);
    setModalVisible(true); // Mở modal
  };

  const hideModal = () => {
    setObject(null);
    setModalVisible(false); // Đóng modal
  };

  const handleDelete = (id: number) => {
    deletePost(id);
    setVisible(true);
    setLoading(true);
  };

  const [file, setFile] = useState<any>(null);

  const onFileChange = (event: any) => {
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
    console.log(data);
    UpdateFarmerPost(data).then(() => {
      setLoading(true);
      hideModal();
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
                      image={getFromLocalStorage("avatar") ?? ""}
                      shape="circle"
                    />
                    <div>
                      <div>
                        <strong className="mr-1">Người đăng bài:</strong>
                        {item?.createdBy}
                      </div>
                      <div className="text-start">
                        <strong className="mr-1">Ngày đăng bài:</strong>
                        {moment(item?.createdDate, "DD/MM/YYYY").format(
                          "DD.MM.YYYY"
                        )}
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
                  <strong className="mr-1"> Số lượng:</strong> {item?.quantity}
                </div>
                <div className="flex justify-start text-start">
                  <strong className="mr-1">Loại sản phẩm:</strong>{" "}
                  {categories.find((x) => x.label === item?.category)?.name}
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
          ))}
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
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <label className="mr-2">Tên nông sản:</label>
            <InputText
              className="w-full"
              value={object?.productName}
              onChange={(e) =>
                setObject({ ...object, productName: e.target.value })
              }
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Số lượng:</label>
            <InputText
              className="w-full"
              value={object?.quantity}
              onChange={(e) =>
                setObject({ ...object, quantity: e.target.value })
              }
            />
          </div>
          <div className="col-span-4">
            <label className="mr-2">Loại Hàng:</label>
            <Dropdown
              value={selectedCategory}
              options={categories}
              optionLabel="name"
              onChange={(e) => setSelectedCategory(e.value)}
              placeholder="Chọn loại"
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <label className="mr-2">Tỉ lệ thất thoát:</label>
            <InputText
              className="w-full"
              value={object?.lossRate}
              onChange={(e) =>
                setObject({ ...object, lossRate: e.target.value })
              }
            />
          </div>
          <div className="col-span-6">
            <label className="mr-2">Giá tiền:</label>
            <InputText
              className="w-full"
              value={object?.unitPrice}
              onChange={(e) =>
                setObject({ ...object, unitPrice: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 h-60">
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
