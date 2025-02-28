import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { getBussinesPost, updatePostStatus } from "../../../api/homeFarmer";
import FileCarousel from "../../../common/carousel/FileCarousel";
import ImageCarousel from "../../../common/carousel/ImageCarousel";
import {
  categories,
  maximumPrice,
  nextYear,
  postStatusOption,
  prvYear,
} from "../../../constant/constant";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage, role } from "../../../constant/utils";
import empty from "../../../assets/empty.png";

const CompanyPage = () => {
  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 1) {
      clearLocalStorage();
      navigate("../");
    }
  });

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
      [id]: !prevState[id], // Đảo trạng thái mở rộng của item hiện tại
    }));
  };

  const handleUpdateStatus = (id: number, newStatus: number) => {
    updatePostStatus(id, newStatus)
      .then((response) => {
        if (response.data.success) {
          toast.current?.show({
            severity: "success",
            summary: `${
              newStatus === 2 ? "Chấp nhận" : "Từ chối"
            } bài đăng thành công`,
          });
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
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "thất bại",
        });
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
  const [fromDate, setFromDate] = useState<Date | null>(prvYear);
  const [toDate, setToDate] = useState<Date | null>(nextYear);
  const [status, setStatus] = useState<number>(1);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(maximumPrice);

  const handleReset = () => {
    setSearchTerm("");
    setFromDate(prvYear);
    setToDate(nextYear);
    setMinPrice(0);
    setMaxPrice(maximumPrice);
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
      status,
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
    console.log({
      searchTerm,
      fromDate,
      toDate,
      minPrice,
      maxPrice,
    });
  };
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
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
              dateFormat="dd/mm/yy"
              value={fromDate}
              maxDate={toDate ?? new Date()}
              onChange={(e) => setFromDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Đến ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              dateFormat="dd/mm/yy"
              minDate={fromDate ?? new Date()}
              value={toDate}
              onChange={(e) => setToDate(e.value as Date)}
            />
            <div className="text-start mt-2 font-bold">Trạng thái:</div>
            <div>
              <Dropdown
                value={status}
                options={postStatusOption}
                optionLabel="name"
                onChange={(e) => setStatus(e.value)}
                placeholder="Chọn loại"
                className={`mt-2 w-full  text-start`}
              />
            </div>
            <div className="flex justify-between mt-5 gap-5">
              <Button className="" severity="help" onClick={handleSearch}>
                Tìm kiếm
              </Button>

              <Button className="" severity="danger" onClick={handleReset}>
                Mặc định
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-9 text-center">
          <div className="overflow-y-auto h-screen">
            {listObjects.length > 0 ? (
              listObjects?.map((item: any) => (
                <div key={item?.id}>
                  <Card className="mt-5 rounded-3xl mb-3 mr-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="w-12 h-12 mx-auto sm:col-span-1"
                          image={item.avatar}
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
                          <div className="text-start">
                            <strong className="mr-1">Trạng thái:</strong>
                            {getStatus(item?.status)}
                          </div>
                        </div>
                      </div>
                      <div>
                        {item?.status !== "Approved" ? (
                          <>
                            <Button
                              severity="help"
                              className="mr-5"
                              onClick={() => {
                                handleUpdateStatus(item.id, 2);
                              }}
                            >
                              Chấp nhận
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
                        {item?.status !== "Rejected" ? (
                          <>
                            <Button
                              severity="danger"
                              onClick={() => {
                                handleUpdateStatus(item.id, 3);
                              }}
                            >
                              Từ chối
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
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
                      <strong className="mr-1">Email người đại điện:</strong>
                      {item?.reprentativeEmail}
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
              ))
            ) : (
              <>
                <Card className="rounded-3xl mt-5">
                  <img src={empty} className="w-auto h-auto" alt="" />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
