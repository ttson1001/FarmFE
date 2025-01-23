import { Card } from "primereact/card";
import { getAccounts } from "../../../api/apiLogin";
import { useEffect, useState } from "react";
import { getBussinesPost, getFarmerPost } from "../../../api/homeFarmer";
import { clearLocalStorage, role } from "../../../constant/utils";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const [totalBusinessesArticles, setTotalBusinessesArticles] = useState(0);
  const [totalFarmerArticles, setTotalFarmerArticles] = useState(0);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  useEffect(() => {
    if (role() !== 1) {
      clearLocalStorage();
      navigate("../");
    }
  });
  const navigate = useNavigate();
  useEffect(() => {
    getAccounts(null).then((x) => {
      const list = x.data.data.listObjects;
      setTotalFarmers(list?.filter((x: any) => x.roles[0] === "Farmer").length);
      setTotalBusinesses(
        list?.filter((x: any) => x.roles[0] === "Business").length
      );
    });
    getBussinesPost(null).then((x) => {
      const list = x.data.data.paging.totalRecord;
      setTotalBusinessesArticles(list);
    });
    getFarmerPost(null).then((x) => {
      const list = x.data.data.paging.totalRecord;
      setTotalFarmerArticles(list);
    });
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex">
          <Card
            title="Tổng số bài đăng của doanh nghiệp"
            className="text-center p-4 flex-1 flex flex-col justify-center items-center"
          >
            <h2 className="text-3xl font-bold text-blue-600">
              {totalBusinessesArticles}
            </h2>
          </Card>
        </div>
        <div className="flex">
          <Card
            title="Tổng số bài đăng của nông dân"
            className="text-center p-4 flex-1 flex flex-col justify-center items-center"
          >
            <h2 className="text-3xl font-bold text-green-600">
              {totalFarmerArticles}
            </h2>
          </Card>
        </div>
        <div className="flex">
          <Card
            title="Tổng số người dùng nông dân"
            className="text-center p-4 flex-1 flex flex-col justify-center items-center"
          >
            <h2 className="text-3xl font-bold text-orange-600">
              {totalFarmers}
            </h2>
          </Card>
        </div>
        <div className="flex">
          <Card
            title="Tổng số người dùng là doanh nghiệp"
            className="text-center p-4 flex-1 flex flex-col justify-center items-center"
          >
            <h2 className="text-3xl font-bold text-red-600">
              {totalBusinesses}
            </h2>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
