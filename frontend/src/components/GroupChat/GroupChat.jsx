import { useOutletContext } from "react-router";
import "./GroupChat.scss";

export default function GroupChat() {
  const user = useOutletContext();

  return <div>{user.id}</div>;
}
