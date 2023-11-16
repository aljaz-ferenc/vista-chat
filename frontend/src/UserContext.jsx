import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { authenticateUser, getChatById, loginUser } from "./api/api";
import { io } from "socket.io-client";
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const UserContext = createContext();

const initialState = {
  name: "",
  email: "",
  id: "",
  chats: [],
  socket: null,
  currentChat: null,
  lastBatch: null,
  theme: null,
  connectedUsers: [],
  authenticated: "unathorized",
};

function reducer(state, action) {
  switch (action.type) {
    case "update/user":
      return action.payload;
    case "add/chat":
      return {
        ...state,
        chats: [...state.chats, action.payload],
        lastBatch: action.payload.lastBatch,
      };
    case "chat/update":
      const chatId = action.payload._id;
      const index = state.chats.findIndex((chat) => chat._id === chatId);

      const updatedChats = [...state.chats];
      updatedChats[index] = action.payload;

      return {
        ...state,
        chats: updatedChats,
        lastBatch: action.payload.lastBatch,
      };
    case "authenticated/set":
      return {
        ...state,
        authenticated: action.payload,
      };

    case "batch/add":
      const chatIndex = state.chats.findIndex(
        (chat) => chat._id === action.payload.chatId
      );
      const newChat = state.chats[chatIndex];
      const prevMessages = newChat.messages;
      const newMessages = action.payload.messages;
      newChat.messages = [...newMessages, ...prevMessages];

      const otherChats = state.chats.filter(
        (chat) => chat._id !== action.payload.chatId
      );
      const newChats = [newChat, ...otherChats];

      return {
        ...state,
        chats: newChats,
      };

    case "currentChat/set":
      return {
        ...state,
        currentChat: action.payload,
      };

    case "currentChat/reset":
      return {
        ...state,
        currentChat: null,
      };
    case "theme/set":
      return {
        ...state,
        theme: action.payload,
      };
    case "connectedUsers/update":
      return {
        ...state,
        connectedUsers: action.payload,
      };
    case "connectedUsers/remove":
      return {
        ...state,
        connectedUsers: action.payload,
      };
    case "socket/set":
      return {
        ...state,
        socket: action.payload,
      };
  }
}

export default function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(reducer, initialState);

  function setSocket(socket) {
    dispatch({ type: "socket/set", payload: socket });
  }

  function updateUser(userData) {
    dispatch({ type: "update/user", payload: userData });
  }

  function addChat(chat) {
    dispatch({ type: "add/chat", payload: chat });
  }

  function updateChat(chat) {
    dispatch({ type: "chat/update", payload: chat });
  }

  function setCurrentChat(chatId) {
    dispatch({ type: "currentChat/set", payload: chatId });
  }

  function resetCurrentChat() {
    dispatch({ type: "currentChat/reset" });
  }

  function addBatch(chatId, messages) {
    dispatch({ type: "batch/add", payload: { chatId, messages } });
  }

  function setTheme(theme) {
    dispatch({ type: "theme/set", payload: theme });
  }

  function updateConnectedUsers(connectedUsers) {
    dispatch({ type: "connectedUsers/update", payload: connectedUsers });
  }

  function setAuthStatus(status) {
    dispatch({ type: "authenticated/set", payload: status });
  }

  function updateReadStatus(chatId) {
    const chat = user.chats.find((chat) => chat._id === chatId);

    if (!chat.lastMessage.readBy.includes(user.id)) {
      chat.lastMessage.readBy.push(user.id);
      dispatch({ type: "chat/update", payload: chat });
    }
  }

  useEffect(() => {
    if (!user.authorized || !user.id) return;
    if (!user.socket) {
      return setSocket(io(serverUrl, { autoConnect: true }));
    }
    // console.log("useEffect ", user.socket);

    user.socket.on("connect", () => {
      // console.log("connect event in context");
      user.socket.emit("getConnectedUsers", (connectedUsers) => {
        updateConnectedUsers(connectedUsers);
      });
      const userObj = {
        id: user.id,
        socketId: user.socket.id,
        name: user.name,
      };
      // console.log("userObj: ", userObj);

      user.socket.emit("loginUser", userObj);
    });

    user.socket.on("connect_error", (err) => {
      console.log(err);
      console.log(err.message);
      setSocket();
    });

    // window.addEventListener('beforeunload', () => {
    //   user.socket.disconnect();
    // });
  }, [user.authenticated, user.socket]);

  useEffect(() => {
    if (!user.socket) return;

    user.socket.on("newMessage", (chatId) => {
      console.log("context newMessage event");
      let addUserToReadBy = chatId === user.currentChat;

      getChatById(chatId, user.id, addUserToReadBy).then((res) => {
        const updatedChat = res.data.chat;
        updatedChat.messages = res.data.messages;
        updateChat(updatedChat);
      });
    });

    user.socket.on("newChat", (chat) => {
      addChat(chat);
    });

    user.socket.on("connectedUsers", (connectedUsers) => {
      updateConnectedUsers(connectedUsers);
    });

    return () => {
      user.socket.removeAllListeners("newMessage");
      user.socket.removeAllListeners("newChat");
    };
  }, [user.socket, user.currentChat, updateChat, addChat]);

  return (
    <UserContext.Provider
      value={{
        user,
        setTheme,
        addBatch,
        updateUser,
        addChat,
        updateChat,
        updateReadStatus,
        setCurrentChat,
        resetCurrentChat,
        setSocket,
        setAuthStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

