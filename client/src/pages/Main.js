import Banner from "../components/common/Banner";
import Carousel from "../components/common/Carousel/Carousel";
import { useSelector } from "react-redux";
import user from "../store/user";

function Main() {
  const userInfo = useSelector((state) => state.user);
  console.log(userInfo);
  return (
    <div>
      <Banner />
      <Carousel />
    </div>
  );
}

export { Main };
