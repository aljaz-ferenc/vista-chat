import { createNewChat, queryUsers, sendChatRequest } from "../../api/api";
import "./NewChat.scss";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { AiOutlineClose } from "react-icons/ai";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router";
import { BsSearch } from "react-icons/bs";
import useClickOutside from "../../utils/useClickOutside";
import Avatar from "../Avatar/Avatar";

export default function NewChat() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  const { user, updateUser, updateReadStatus } = useUser();
  const navigate = useNavigate();
  const foundUsersContainerRef = useRef();
  const inputRef = useRef();
  const timerRef = useRef();

  useEffect(() => {
    if (input === "") return;
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      if (input !== "") {
        queryUsers(input.trim()).then((res) => {
          setFoundUsers(res.data);
          setIsLoading(false);
        });
      }
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [input]);

  function handleClickUser(userId) {
    let existingChat = null;

    user.chats.forEach((chat) => {
      chat.users.forEach((user) => {
        if (user._id === userId) {
          return (existingChat = chat._id);
        }
      });
    });

    if (existingChat) {
      navigate(`./messages/${existingChat}`);
      updateReadStatus(existingChat);
    } else {
      createNewChat([user.id, userId]).then((res) => {
        if (res.status === "success") {
          navigate(`./messages/${res.data._id}`);
        }
      });
    }
    setInput("");
    setFoundUsers([]);
  }

  function handleInputChange(e) {
    if (e.target.value === "") setIsLoading(false);
    setInput(e.target.value);
  }

  function handleCloseFoundUsers() {
    setFoundUsers([]);
    setInput("");
  }

  useClickOutside(handleCloseFoundUsers, [foundUsersContainerRef, inputRef]);

  return (
    <div className="new-chat">
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={input}
          placeholder="Search users"
          onChange={handleInputChange}
        />
        {isLoading ? (
          <BeatLoader
            className="spinner"
            color={user.theme === "light" ? "#1755a2" : "white"}
          />
        ) : foundUsers.length === 0 ? null : (
          <AiOutlineClose
            onClick={handleCloseFoundUsers}
            color={user.theme === "light" ? "#555" : "white"}
            className="clear-found-users"
          />
        )}
      </div>
      {foundUsers.length > 0 && (
        <div className="found-users">
          {foundUsers.map((foundUser) => (
            <div
              className="found-users__user"
              style={{ display: foundUser._id === user.id ? "none" : "block" }}
              onClick={() => handleClickUser(foundUser._id)}
              key={foundUser._id}
              ref={foundUsersContainerRef}
            >
              <Avatar size="2rem" config={foundUser.avatar} />
              <span>{foundUser.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
