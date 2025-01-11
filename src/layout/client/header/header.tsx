import { Menubar } from "primereact/menubar";
import AvatarMenu from "./avatar";
import { useNavigate } from "react-router-dom";
import { role } from "../../../constant/utils";
import logo from "../../../assets/logo.png";

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
      command: () => {
        navigate("../about");
      },
    },
  ];

  const start = (
    <img alt="logo" src={logo} width={70} height={70} className="mr-2"></img>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <AvatarMenu />
    </div>
  );

  return (
    <div className="card bg-white">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};
export default ClientHeader;
