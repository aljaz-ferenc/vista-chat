import { FaPaperPlane } from "react-icons/fa";
import "./NewMessage.scss";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { createNewChat, getUserById } from "../../api/api";
import { useUser } from "../../UserContext";

export default function NewMessage() {
  const { userId: receiverId } = useParams();
  const [receiver, setReceiver] = useState(null);
  const {user} = useUser()
  const [input, setInput] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    getUserById(receiverId).then((res) => {
        setReceiver(res.data);
    });
  }, []);

  function submitForm(e){
    //create new chat with first message
    e.preventDefault()
    createNewChat(user.id, receiverId, input)
        .then(res => {
            if(res.status === 'success'){
                setInput('')
                navigate(`../${res.data._id}`)
            }
        })
    //navigate to messages/:userId and continue the chat
  }

  return (
    <div className="new-message">
      <div className="messages__top">
        {receiver && (
          <p>This is the beginning of your conversation with {receiver.name}</p>
        )}
        {/* <div className="users">
          {chat && chat.users.length === 2 ? (
            chat.users.map((user) => (
              <div
                style={{ display: thisUser.id === user._id ? "none" : "block" }}
                key={user._id}
              >
                <h3>{user.name}</h3>
                <p>
                  This is the beginning of your conversation with {user.name}
                </p>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div> */}
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
