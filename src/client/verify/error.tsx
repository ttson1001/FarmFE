import { Card } from "primereact/card";

const Error = () => {
  return (
    <>
      <div className="grid grid-cols-2 h-screen">
        <div className="col-span-full bg-purple-200 h-full justify-center flex items-center">
          <Card className="w-2/3 h-2/3 ">
            <div className="justify-center flex items-center">
              <img className="w-1/3 h-1/3" src="/src/assets/error.png" alt="" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Error;
