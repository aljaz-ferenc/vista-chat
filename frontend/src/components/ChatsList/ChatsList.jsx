import { useNavigate } from "react-router";
import { useUser } from "../../UserContext";
import "./ChatsList.scss";
import NewChat from "../NewChat/NewChat";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import ChatPreview from "../ChatPreview/ChatPreview";

export default function ChatsList() {
  const { user: thisUser, updateReadStatus } = useUser();

  useEffect(() => {
    if (!thisUser.socket) return;
    const socket = thisUser.socket;

    // socket.on("newMessage", (chatId, users) => {
    //   console.log("newMessage from Messages:", chatId);
    //   // setNewMessageChatId(chatId);
    // });
  }, []);

  return (
    <div className="conversations-list">
      {/* <NewChat /> */}
      <div className="conversations-list__previews">
        <div>
          {thisUser.chats.map((chat) => {
            return (
              <ChatPreview
                key={chat._id}
                user={chat.users.filter(u =>u._id !== thisUser.id)[0]}
                thisUser={thisUser}
                chat={chat}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
