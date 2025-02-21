import { Menu } from "primereact/menu";
import { Outlet, useNavigate } from "react-router-dom";
import { clearLocalStorage, role } from "../../../constant/utils";
import logo from "../../../assets/logo.png";
import { useEffect } from "react";

const HomeAdminLayout = () => {
  useEffect(() => {
    if (role() !== 1) {
      clearLocalStorage();
      navigate("../");
    }
  });
  const navigate = useNavigate();
  const items = [
    {
      template: () => {
        return (
          <div className="flex items-center gap-1 px-2 py-2">
            <img src={logo} width={75} height={75} alt="" />
            <div className="text-xl font-semibold">AP TEAM</div>
          </div>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "Quản lý",
      items: [
        {
          label: "Tài khoản",
          command: () => navigate("../admin/account"),
        },
        {
          label: "Thống kê",
          command: () => navigate("../admin/report"),
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
        // {
        //   label: "Bài đăng nông dân",
        //   icon: "pi pi-inbox",
        //   command: () => navigate("../admin/farmer"),
        // },
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
