import Login from "./common/login/login";
import Register from "./common/register/register";
import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layout/client/home/home-layout";
import CompanyProfile from "./client/profile/profile-company";
import FarmerProfile from "./client/profile/profile-farmer";
import HomeCompanyPage from "./client/home-page/home-company";
import HomeFarmerPage from "./client/home-page/home-farmer";
import HistoryCompany from "./client/history/history-company";
import HistoryFarmer from "./client/history/history-farmer";
import HomeAdminLayout from "./layout/admin/home/home-layout";
import Verify from "./client/verify/verify";
import Success from "./client/verify/success";
import Error from "./client/verify/error";
import FarmerPage from "./layout/admin/farmer/famer";
import CompanyPage from "./layout/admin/company/company";
import AccountPage from "./layout/admin/account/account";
import Forgot from "./client/password/forgot-password";
import Resset from "./client/password/resest-pasword";
import { useEffect } from "react";
import AboutUs from "./client/profile/adbout";
import ReportPage from "./layout/admin/report/report";

const App = () => {
  useEffect(() => {
    document.title = "AP TEAM"; // Đổi tiêu đề tab
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<HomeAdminLayout />}>
        <Route path="farmer" element={<FarmerPage />}></Route>
        <Route path="company" element={<CompanyPage />}></Route>
        <Route path="account" element={<AccountPage />}></Route>
        <Route path="report" element={<ReportPage />}></Route>
      </Route>
      <Route path="verify" element={<Verify />}></Route>
      <Route path="forgot" element={<Forgot />}></Route>
      <Route path="resset" element={<Resset />}></Route>
      <Route path="success" element={<Success />}></Route>
      <Route path="error" element={<Error />}></Route>
      <Route path="/" element={<HomeLayout />}>
        <Route path="company-home" element={<HomeCompanyPage />}></Route>
        <Route path="about" element={<AboutUs />}></Route>
        <Route path="farmer-home" element={<HomeFarmerPage />}></Route>
        <Route
          path="company-profile"
          element={<CompanyProfile value="" />}
        ></Route>
        <Route
          path="farmer-profile"
          element={<FarmerProfile value="" />}
        ></Route>
        <Route path="history-company" element={<HistoryCompany />}></Route>
        <Route path="history-farmer" element={<HistoryFarmer />}></Route>
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
