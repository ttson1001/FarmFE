import { Menubar } from "primereact/menubar";
import AvatarMenu from "./avatar";
import { useNavigate } from "react-router-dom";
import { role } from "../../../constant/utils";

const ClientHeader = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: "Trang chủ",
      icon: "pi pi-home",
      command: () => {
        if (role() === 2) navigate("../farmer-home");
        if (role() === 3) navigate("../company-home");
      },
    },
    {
      label: "Giới thiệu",
      icon: "pi pi-star",
    },
  ];

  const start = (
    <img
      alt="logo"
      src="https://primefaces.org/cdn/primereact/images/logo.png"
      width={50}
      height={50}
      className="mr-2"
    ></img>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <AvatarMenu />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};
export default ClientHeader;
