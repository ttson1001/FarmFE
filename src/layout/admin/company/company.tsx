import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { getBussinesPost, updatePostStatus } from "../../../api/homeFarmer";
import FileCarousel from "../../../common/carousel/FileCarousel";
import ImageCarousel from "../../../common/carousel/ImageCarousel";
import { categories } from "../../../constant/constant";

const CompanyPage = () => {
  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
      [id]: !prevState[id], // Đảo trạng thái mở rộng của item hiện tại
    }));
  };

  const handleUpdateStatus = (id: number, newStatus: number) => {
    updatePostStatus(id, newStatus)
      .then((response) => {
        console.log("Response from API:", response.data);
        if (response.data.success) {
          // Cập nhật trạng thái của bài viết trong listObjects
          setListObjects((prevList: any) =>
            prevList.map((item: any) =>
              item.id === id
                ? {
                    ...item,
                    status:
                      newStatus === 2
                        ? "Approved"
                        : newStatus === 3
                        ? "Rejected"
                        : "Pending",
                  }
                : item
            )
          );
        } else {
          throw new Error(response.data.message || "Failed to update status");
        }
      })
      .catch((err) => {
        console.error("Error occurred:", err.message || "An error occurred");
      });
  };

  const getStatus = (value: any) => {
    if (value === "Pending" || value === "1") {
      return "Đang chờ duyệt";
    } else if (value === "Approved" || value === "2") {
      return "Đã duyệt";
    } else {
      return "Từ chối";
    }
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

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
      status,
    };
    getBussinesPost(data)
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
    console.log({
      searchTerm,
      fromDate,
      toDate,
      minPrice,
      maxPrice,
    });
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-3 p-4 h-screen text-center hidden md:block">
          <Card className="rounded-3xl sticky top-0">
            <div className="text-start font-bold">Tìm kiếm:</div>
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
            <div className="text-start mt-2 font-bold">Trạng thái:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={status + ""}
                onChange={(e) =>
                  setStatus(e.target.value ? parseFloat(e.target.value) : 0)
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

        <div className="col-span-12 md:col-span-9 text-center pr-4">
          <div className="overflow-y-auto h-screen">
            {listObjects?.map((item: any) => (
              <div key={item?.id}>
                <Card className="mt-5 rounded-3xl">
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
                        <div className="text-start">
                          <strong className="mr-1">Trạng thái:</strong>
                          {getStatus(item?.status)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        severity="help"
                        className="mr-5"
                        onClick={() => {
                          handleUpdateStatus(item.id, 2);
                        }}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        severity="danger"
                        onClick={() => {
                          handleUpdateStatus(item.id, 3);
                        }}
                      >
                        Từ chối
                      </Button>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Tên sản phẩm:</strong>
                    {item?.productName}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1"> Số lượng:</strong>{" "}
                    {item?.quantity}
                  </div>
                  <div className="flex justify-start text-start">
                    <strong className="mr-1">Loại sản phẩm:</strong>{" "}
                    {categories.find((x) => x.label === item?.category)?.name}
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
