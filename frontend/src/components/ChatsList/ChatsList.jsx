import { useUser } from "../../UserContext";
import "./ChatsList.scss";
import ChatPreview from "../ChatPreview/ChatPreview";

export default function ChatsList() {
  const { user: thisUser } = useUser();

  return (
    <div className="conversations-list">
      <div className="conversations-list__previews">
          {thisUser.chats.map((chat) => {
            return (
              <ChatPreview
                key={chat._id}
                user={chat.users.filter((u) => u._id !== thisUser.id)[0]}
                thisUser={thisUser}
                chat={chat}
              />
            );
          })}
      </div>
    </div>
  );
}
