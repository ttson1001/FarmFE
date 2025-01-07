import ClientHeader from "../header/header";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-300">
      <ClientHeader />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
