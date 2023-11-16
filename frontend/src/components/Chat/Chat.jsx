import { Outlet, useOutletContext } from "react-router";
import "./Chat.scss";
import ChatsList from "../ChatsList/ChatsList";
import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import User from "../User/User";

export default function Chat() {
  const { user } = useUser();

  return (
    <div className="chat">
      <ChatsList />
      <Outlet />
      {user.currentChat && <User />}
    </div>
  );
}
