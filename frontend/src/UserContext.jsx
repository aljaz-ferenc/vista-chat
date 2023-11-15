import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getChatById } from "./api/api";

const UserContext = createContext();

const initialState = {
  name: "",
  email: "",
  id: "",
  chats: [],
  socket: null,
  currentChat: null,
  lastBatch: null,
  theme: 'dark'
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

    case "batch/add":
      const chatIndex = state.chats.findIndex(chat => chat._id === action.payload.chatId)
      const newChat = state.chats[chatIndex]
      const prevMessages = newChat.messages
      const newMessages = action.payload.messages
      newChat.messages = [...newMessages, ...prevMessages]

      const otherChats = state.chats.filter(chat => chat._id !==action.payload.chatId)
      const newChats = [newChat, ...otherChats ]

      return {
        ...state,
        chats: newChats
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
        theme: action.payload
      }
  }
}

export default function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(reducer, initialState);

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

  function addBatch(chatId, messages){
    dispatch({type: 'batch/add', payload: {chatId, messages}})
  }

  function setTheme(theme){
    dispatch({type: 'theme/set', payload: theme})
  }

  function updateReadStatus(chatId) {
    const chat = user.chats.find((chat) => chat._id === chatId);

    if (!chat.lastMessage.readBy.includes(user.id)) {
      chat.lastMessage.readBy.push(user.id);
      dispatch({ type: "chat/update", payload: chat });
    }
  }

  useEffect(() => {
    if (!user.socket) return;

    user.socket.on("newMessage", (chatId) => {
      console.log("newMessage event");
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
