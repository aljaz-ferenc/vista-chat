import { FaPaperPlane } from "react-icons/fa";
import "./NewMessage.scss";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { createNewChat, getUserById } from "../../api/api";
import { useUser } from "../../UserContext";

export default function NewMessage() {
  const { userId: receiverId } = useParams();
  const [receiver, setReceiver] = useState(null);
  const { user } = useUser();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserById(receiverId).then((res) => {
      setReceiver(res.data);
    });
  }, []);

  function submitForm(e) {
    e.preventDefault();
    createNewChat(user.id, receiverId, input).then((res) => {
      if (res.status === "success") {
        setInput("");
        navigate(`../${res.data._id}`);
      }
    });
  }

  return (
    <div className="new-message">
      <div className="messages__top">
        {receiver && (
          <p>This is the beginning of your conversation with {receiver.name}</p>
        )}
      </div>
      <div className="messages__main"></div>
      <form className="messages__input" onSubmit={submitForm}>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
        />
        <button className="send-message-btn">
          <FaPaperPlane className="icon" color="#fff" />
        </button>
      </form>
    </div>
  );
}
