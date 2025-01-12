import { Card } from "primereact/card";
import "./account.css"; // Import Tailwind CSS
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { getBussinesPost } from "../../../api/homeFarmer";
import {
  approvedAccount,
  deleteAccount,
  getAccounts,
} from "../../../api/apiLogin";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import { statusOption } from "../../../constant/constant";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage, role } from "../../../constant/utils";

const AccountPage = () => {
  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (role() !== 1) {
      clearLocalStorage();
      navigate("../");
    }
  });

  useEffect(() => {
    getAccounts(null)
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

  const handleUpdateStatus = (id: number) => {
    approvedAccount(id)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Chấp nhận thành công",
        });
        setLoading(true);
      })
      .catch(() => {
        toast.current?.show({
          severity: "success",
          summary: "Chấp nhận thất bại",
        });
      });
  };

  const handleDelete = (id: number) => {
    deleteAccount(id)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Xóa tài khoản thành công",
        });
        setLoading(true);
        setVisible(false);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Xóa tài khoản thất bại",
        });
      });
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
      pageIndex: 1,
      pageSize: 10000,
      keyword: searchTerm,
      orderDate: 1,
      totalRecord: 0,
      status: status,
      createdDate: {
        from: moment(fromDate).format("YYYY-MM-DD"),
        to: moment(toDate).format("YYYY-MM-DD"),
      },
    };
    getAccounts(data)
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

  const footerContent = (
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
            <Dropdown
              value={status}
              options={statusOption}
              optionLabel="name"
              onChange={(e) => setStatus(e.value)}
              placeholder="Chọn status"
              className={`mt-2 w-full text-start`}
            />
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

        <div className="col-span-12 md:col-span-9 text-center">
          <div className="overflow-x-auto rounded-3xl">
            <DataTable
              value={listObjects}
              className="mt-5 custom-rounded"
              scrollable
              scrollHeight="90vh"
              paginator
              rows={10}
            >
              <Column field="username" header="Tên đăng nhập" />
              <Column field="email" header="Email" />
              <Column field="phoneNumber" header="Số điện thoại" />
              <Column field="status" header="Trạng thái" />
              <Column
                header="Vai trò"
                body={(rowData) =>
                  rowData.roles && rowData.roles.length > 0
                    ? rowData.roles[0]
                    : "Chưa có vai trò"
                }
              />
              <Column
                header="Hành động"
                body={(rowData) => (
                  <div>
                    {rowData.roles[0] === "Business" &&
                    rowData.status === "Pending" ? (
                      <>
                        {" "}
                        <Button
                          severity="help"
                          className="mr-2"
                          onClick={() => {
                            handleUpdateStatus(rowData.id);
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
                    <Button
                      severity="danger"
                      onClick={() => {
                        setVisible(true); // Hiển thị hộp thoại xác nhận
                        setSelectedItemId(rowData.id); // Lưu ID của item để xóa
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
              />
            </DataTable>
            <ConfirmDialog
              visible={visible}
              onHide={() => setVisible(false)} // Đóng hộp thoại
              message="Bạn có chắc chắn muốn xóa mục này không?"
              header="Xác nhận"
              icon="pi pi-exclamation-triangle"
              footer={footerContent}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
