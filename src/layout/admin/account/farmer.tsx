import { Card } from "primereact/card";
import "./account.css"; // Import Tailwind CSS
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

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

const AccountPage = () => {
  const [listObjects, setListObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

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
        setError(err.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const handleUpdateStatus = (id: number) => {
    approvedAccount(id).then(() => setLoading(true));
  };

  const handleDelete = (id: number) => {
    deleteAccount(id).then(() => {
      setLoading(true);
      setVisible(false);
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
        setError(err.message || "An error occurred");
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
        setError(err.message || "An error occurred");
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
        onClick={() => handleDelete(selectedItemId)}
      />
      <Button label="Không" onClick={() => setVisible(false)} />
    </>
  );

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
              maxDate={toDate}
              onChange={(e) => setFromDate(e.value as Date)}
            />
            <div className="text-start font-bold mt-2">Đến ngày:</div>
            <Calendar
              className="w-full mt-2"
              showIcon
              minDate={fromDate}
              value={toDate}
              onChange={(e) => setToDate(e.value as Date)}
            />
            <div className="text-start mt-2 font-bold">Trạng thái:</div>
            <div>
              <InputText
                type="number"
                className="w-full mt-2"
                value={status}
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
                    <Button
                      severity="help"
                      className="mr-2"
                      onClick={() => {
                        handleUpdateStatus(rowData.id);
                      }}
                    >
                      Chấp nhận
                    </Button>
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
