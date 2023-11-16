import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../UserContext";
import { authenticateUser } from "../api/api";

export default function useAuthAndUpdateUser() {
  const { user, setAuthStatus, updateUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    authenticateUser()
      .then((res) => {
        if (res.status === "success") {
          console.log("Token is valid");

          setAuthStatus(true);

          const userData = res.data.user;
          const chatsData = res.data.chats;
          userData.id = userData._id;
          delete userData._id;

          updateUser({
            ...userData,
            socket: user.socket,
            connectedUsers: [],
            chats: chatsData,
            authorized: true,
          });
          navigate("/chat");
        } else {
          throw new Error("Invalid or missing token");
        }
      })
      .catch((err) => {
        console.log(err.message);
        setAuthStatus(false);
        navigate("/login");
      });
  }, []);
}
