import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./ChatLayout.scss";
import { BiMessageAltDetail } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { logoutUser } from "../../api/api";
import { useUser } from "../../UserContext";
import NewChat from "../../components/NewChat/NewChat";
import Avatar from "../../components/Avatar/Avatar";
import useAuthAndUpdateUser from "../../utils/useAuthAndUpdateUser";

export default function ChatLayout() {
  const {  user, setAuthStatus } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const color = user.theme === "light" ? "rgb(75, 75, 75)" : "white";

  useAuthAndUpdateUser();

  async function handleLogout() {
    logoutUser().then(() => {
      setAuthStatus(false);
      navigate("/login", { replace: true });
    });
  }

  if (!user.name) return <div>Loading...</div>;

  return (
    <div className="chat-layout">
      <aside className="chat-layout__sidebar">
        <NavLink to="messages" className="chat-layout__sidebar--item">
          <BiMessageAltDetail
            size={30}
            color={
              location.pathname.includes("messages") ? "#fff" : "#ffffff5c"
            }
          />
        </NavLink>
        <NavLink to="profile" className="chat-layout__sidebar--item">
          <BsPersonCircle
            size={30}
            color={location.pathname.includes("profile") ? "#fff" : "#ffffff5c"}
          />
        </NavLink>
        <NavLink to="settings" className="chat-layout__sidebar--item">
          <FiSettings
            size={30}
            color={
              location.pathname.includes("settings") ? "#fff" : "#ffffff5c"
            }
          />
        </NavLink>
      </aside>
      <div className="chat-layout__top">
        <NewChat />
        <div className="chat-layout__top--item">
          <Avatar size="2rem" config={user.avatar} />
          <span style={{ color }}>{user.name}</span>
        </div>
        <div className="chat-layout__top--item logout-btn">
          <IoIosLogOut color={color} onClick={handleLogout} size={30} />
        </div>
      </div>
      <Outlet context={user} />
    </div>
  );
}
