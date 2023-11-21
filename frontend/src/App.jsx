import {
  Navigate,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./components/Chat/Chat";
import ChatLayout from "./layouts/ChatLayout/ChatLayout";
import { useUser } from "./UserContext";
import Settings from "./pages/Settings/Settings";
import Messages from "./components/Messages/Messages";
import { useEffect } from "react";
import Profile from "./pages/Profile/Profile";
import { setThemeColors } from "./utils/functions";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<Navigate to="/chat/messages" />}>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      <Route path="chat" element={<ChatLayout />}>
        <Route path="messages" element={<Chat />}>
          <Route path=":chatId" element={<Messages />} />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  )
);

function App() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    setThemeColors(user.theme);
  }, [user.theme]);

  return <RouterProvider router={router} />;
}

export default App;
