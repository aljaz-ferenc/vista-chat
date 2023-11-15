import { useNavigate } from "react-router";
import "./ChatPreview.scss";
import { GoDotFill } from "react-icons/go";
import { trimText } from "../../utils/formatTime";
import Avatar from "../Avatar/Avatar";
import { useUser } from "../../UserContext";
import { useEffect } from "react";

export default function ChatPreview({ user, chat, thisUser }) {
  const {user: userCtx} = useUser()
  const navigate = useNavigate();
  const lastMessage = chat.lastMessage
  const isOnline = userCtx.connectedUsers.some(u => u === user._id)

  function handleChatClick(chatId) {
    navigate(chatId);
  }

  return (
    <div
      onClick={() => handleChatClick(chat._id)}
      className={`chat-preview ${chat._id === thisUser.currentChat ? 'active':''}`}
      style={{ display: user._id === thisUser.id ? "none" : "block"}}
      key={user._id}
    >
      <Avatar isOnline={isOnline} size='2rem' config={user.avatar}/>
      <p className="chat-preview__name">{user.name}</p>
      {/* {!chat.messages.length === 0 && (
        <p className="chat-preview__last-message"></p>
      )} */}
      {lastMessage.content && lastMessage.content !== "" && (
        <p className="chat-preview__last-message">
          {trimText(lastMessage.content, 20)}
        </p>
      )}
      {lastMessage.content === "" && (
        <p className="chat-preview__last-message">Sent a file</p>
      )}
      {lastMessage?.user && !lastMessage.readBy.includes(thisUser.id) && (
        <GoDotFill
          size={25}
          className="chat-preview__unread-circle"
          color="#ef7e4c"
        />
      )}
    </div>
  );
}
