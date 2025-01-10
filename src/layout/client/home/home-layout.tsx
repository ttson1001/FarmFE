import ClientHeader from "../header/header";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-300">
      <div className="sticky top-0 z-10">
        <ClientHeader />
      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
