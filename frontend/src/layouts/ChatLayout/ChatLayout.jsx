import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./ChatLayout.scss";
import { BiMessageAltDetail } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import Notification from "../../components/Notification/Notification";
import { authenticateUser, getChatById, logoutUser } from "../../api/api";
import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { io } from "socket.io-client";
import NewChat from "../../components/NewChat/NewChat";
import Avatar from "../../components/Avatar/Avatar";

export default function ChatLayout() {
  const userData = useLoaderData();
  const { updateUser, user, addChat, updateChat } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const color = user.theme === 'light' ? 'rgb(75, 75, 75)' : 'white'

  useEffect(() => {
    updateUser({
      name: userData.user.name,
      email: userData.user.email,
      id: userData.user._id,
      chats: userData.chats,
      socket: userData.socket,
      theme: userData.user.theme,
      phone: userData.user.phone,
      education: userData.user.education,
      work: userData.user.work,
      avatar: userData.user.avatar,
      gender: userData.user.gender
    });
  }, []);

  async function handleLogout() {
    logoutUser()
      .then(() => navigate("/login", { replace: true }))
  }

  if (!user) return <div>Loading...</div>;

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
            color={
              location.pathname.includes("profile") ? "#fff" : "#ffffff5c"
            }
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
        {/* <div className="chat-layout__top--item">
          <Notification/>
        </div> */}
        <div className="chat-layout__top--item">
          <Avatar size='2rem' config={user.avatar}/>
          <span style={{color}}>{user.name}</span>
        </div>
        <div className="chat-layout__top--item logout-btn">
          <IoIosLogOut color={color} onClick={handleLogout} size={30} />
        </div>
      </div>
      <Outlet context={user} />
    </div>
  );
}

export async function loader() {
  const socket = io(import.meta.env.VITE_SERVER_URL);
  const response = await authenticateUser();

  if (response.status === "fail") {
    return redirect("/login");
  }

  const userObj = {
    id: response.data.user._id,
    socketId: socket.id,
    name: response.data.user.name,
  };

  socket.emit("loginUser", userObj);

  return { ...response.data, socket };
}