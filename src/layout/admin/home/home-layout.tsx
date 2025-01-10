import { Menu } from "primereact/menu";
import { Outlet, useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../../../constant/utils";

const HomeAdminLayout = () => {
  const navigate = useNavigate();
  const items = [
    {
      template: () => {
        return (
          <span className="inline-flex align-items-center gap-1 px-2 py-2">
            <img src={"/src/assets/logo.png"} width={75} height={75} alt="" />
            <span className="text-xl font-semibold">
              FARM <span className="text-primary">APP</span>
            </span>
          </span>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "Quản lý tài khoản",
      items: [
        {
          label: "Tài khoản",
          command: () => navigate("../admin/account"),
        },
      ],
    },
    {
      label: "Bài đăng",
      items: [
        {
          label: "Bài đăng doanh nghiệp",
          icon: "pi pi-cog",
          command: () => navigate("../admin/company"),
        },
        {
          label: "Bài đăng nông dân",
          icon: "pi pi-inbox",
          command: () => navigate("../admin/farmer"),
        },
      ],
    },
    {
      separator: true,
    },
    {
      label: "Đăng xuất",
      command: () => {
        clearLocalStorage();
        setTimeout(() => {
          navigate("../");
        }, 1000);
      },
    },
  ];

  return (
    <div className="grid grid-cols-12 min-h-screen bg-gradient-to-b from-purple-200 to-purple-300">
      {/* Menu */}
      <div className="col-span-2 h-screen sticky top-0">
        <div className="card flex justify-content-center h-full">
          <Menu model={items} className="w-full md:w-15rem" />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="col-span-10">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeAdminLayout;
