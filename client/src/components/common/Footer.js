import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/modekunst_logo_3.png";

function Footer() {
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;
  const adminNickname = adminInfo.nickname;

  return (
    <div className="bottom-0 w-ful flex flex-col h-56 bg-black">
      <img src={logo} className="w-44 py-4 px-2 self-center" alt="logo" />
      <div className="text-white ml-2 font-content text-center">
        Copyright © Modekunst. All rights reserved
      </div>
      {!isAdmin ? (
        <Link to="/adminlogin">
          <div className="text-white mt-2 ml-2 font-content  text-center">
            ADMIN PAGE
          </div>
        </Link>
      ) : (
        <Link to={"/admin"}>
          <div className="text-white mt-2 ml-2 font-content  text-center">
            ADMIN PAGE
          </div>
        </Link>
      )}
    </div>
  );
}

export default Footer;
