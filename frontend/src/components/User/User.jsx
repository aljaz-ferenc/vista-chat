import "./User.scss";
import { useUser } from "../../UserContext";
import Avatar from "../Avatar/Avatar";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlinePhone } from "react-icons/ai";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { IoSchoolOutline } from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";
import SharedFilesLayout from "../../layouts/SharedFilesLayout/SharedFilesLayout";
import { GoDotFill } from "react-icons/go";

export default function User() {
  const { user } = useUser();
  const chat = user.chats.filter((ch) => ch._id === user.currentChat)[0];
  const otherUser = chat.users.find((u) => u._id !== user.id);
  const isOnline = user.connectedUsers.some((u) => u === otherUser._id);

  return (
    <div className="user">
      <div className="user__top">
        <h2>{otherUser.name}</h2>
        <Avatar size={"10rem"} config={otherUser.avatar} />
        {isOnline && (
          <div className="user__top--online-status">
            <GoDotFill color="rgb(0, 187, 0)" size={25} />
            <p>Online</p>
          </div>
        )}
        <div className="info">
          <div>
            <AiOutlineMail color="#465cc8" size={25} />
            {otherUser.email}
          </div>
          {otherUser.phone && (
            <div>
              <AiOutlinePhone color="#465cc8" size={25} />
              <span>{otherUser.phone}</span>
            </div>
          )}
          {otherUser.birthDate && (
            <div>
              <LiaBirthdayCakeSolid color="#465cc8" size={25} />
              <span>
                {new Date(otherUser.birthDate).toDateString().slice(4)}
              </span>
            </div>
          )}
          {otherUser.education && (
            <div>
              <IoSchoolOutline color="#465cc8" size={25} />
              <span>{otherUser.education}</span>
            </div>
          )}
          {otherUser.work && (
            <div>
              <MdWorkOutline color="#465cc8" size={25} />
              <span>{otherUser.work}</span>
            </div>
          )}
        </div>
        <SharedFilesLayout />
      </div>
    </div>
  );
}
