import { useNavigate } from "react-router";
import "./ChatPreview.scss";
import { GoDotFill } from "react-icons/go";
import { trimText } from "../../utils/formatTime";
import Avatar from "../Avatar/Avatar";

export default function ChatPreview({ user, chat, thisUser }) {
  const navigate = useNavigate();
  const lastMessage = chat?.messages?.at(-1)

  function handleChatClick(chatId) {
    navigate(chatId);
  }

  return (
    <div
      onClick={() => handleChatClick(chat._id)}
      className={`chat-preview ${chat._id === thisUser.currentChat ? 'active':''}`}
      style={{ display: user._id === thisUser.id ? "none" : "block" }}
      key={user._id}
    >
      <Avatar size='2rem' config={user.avatar}/>
      <p className="chat-preview__name">{user.name}</p>
      {chat.messages && !chat.messages.length === 0 && (
        <p className="chat-preview__last-message"></p>
      )}
      {chat.messages && chat.lastMessage.content !== "" && chat.messages.length > 0 && (
        <p className="chat-preview__last-message">
          {trimText(chat.lastMessage.content, 20)}
        </p>
      )}
      {chat.messages && chat.lastMessage.content === ""&& lastMessage?.images.length > 0  && (
        <p className="chat-preview__last-message">Sent an image</p>
      )}
      {chat.messages && !chat.lastMessage.readBy.includes(thisUser.id) && (
        <GoDotFill
          size={25}
          className="chat-preview__unread-circle"
          color="#ef7e4c"
        />
      )}
    </div>
  );
}
