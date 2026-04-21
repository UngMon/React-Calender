import { Outlet } from "react-router-dom";
import Header from "../feature/header/Header";

const Root = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Root;
