import { Card } from "primereact/card";
import "./account.css"; // Import Tailwind CSS
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
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
import { nextYear, prvYear, statusOption } from "../../../constant/constant";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import {
  clearLocalStorage,
  role,
  translateRole,
  translateStatus,
} from "../../../constant/utils";

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
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

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
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReset = () => {
    setSearchTerm("");
    setFromDate(prvYear);
    setToDate(nextYear);
    setStatus(0);
    getAccounts(null)
      .then((response) => {
        if (response.data.success) {
          setListObjects(response.data.data.listObjects);
        }
      })
      .catch((err) => {
        console.log(err);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(prvYear);
  const [toDate, setToDate] = useState(nextYear);
  const [status, setStatus] = useState(0);
  const toast = useRef<Toast>(null);

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

  return (
    <>
      <Toast ref={toast} />
      <div className="px-4 pt-2 ">
        {/* Thanh tìm kiếm ngang */}
        <Card className="p-0 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputText
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              value={fromDate}
              maxDate={toDate ?? new Date()}
              onChange={(e) => setFromDate(e.value as Date)}
              placeholder="Từ ngày"
              className="w-full"
            />
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              minDate={fromDate ?? new Date()}
              value={toDate}
              onChange={(e) => setToDate(e.value as Date)}
              placeholder="Đến ngày"
              className="w-full"
            />
            <Dropdown
              value={status}
              options={statusOption}
              optionLabel="name"
              onChange={(e) => setStatus(e.value)}
              placeholder="Chọn trạng thái"
              className="w-full"
            />
            <div className="flex gap-2">
              <Button severity="help" onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button severity="danger" onClick={handleReset}>
                Mặc định
              </Button>
            </div>
          </div>
        </Card>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto rounded-3xl">
          <DataTable
            value={listObjects}
            className="mt-5 custom-rounded"
            scrollable
            scrollHeight="70vh"
            paginator
            rows={10}
          >
            <Column
              header="STT"
              body={(_rowData, options) => options.rowIndex + 1}
            />
            <Column field="username" header="Tên đăng nhập" />
            <Column field="email" header="Email" />
            <Column field="businessFullName" header="Tên người đại diện" />
            <Column
              field="businessRepresentativeEmail"
              header="Email người đại diện"
            />
            <Column field="phoneNumber" header="Số điện thoại" />
            <Column
              field="status"
              header="Trạng thái"
              body={(x) => translateStatus(x.status)}
            />
            <Column
              header="Vai trò"
              body={(rowData) =>
                rowData.roles?.length > 0
                  ? translateRole(rowData.roles[0])
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

                  {rowData.status === "Deleted" ? (
                    <>
                      <Button
                        severity="help"
                        className="mr-2"
                        onClick={() => {
                          handleUpdateStatus(rowData.id);
                        }}
                      >
                        Kích hoạt
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                  {rowData.roles[0] !== "Admin" &&
                  rowData.status !== "Deleted" ? (
                    <>
                      <Button
                        severity="danger"
                        onClick={() => {
                          setVisible(true); // Hiển thị hộp thoại xác nhận
                          setSelectedItemId(rowData.id); // Lưu ID của item để xóa
                        }}
                      >
                        Xóa
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
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
    </>
  );
};

export default AccountPage;
