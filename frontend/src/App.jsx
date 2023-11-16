import {
  Navigate,
  Route,
  RouterProvider,
  createRoutesFromElements,
  useNavigate,
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
import { authenticateUser } from "./api/api";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<Navigate to='/chat/messages'/>}>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      <Route path="chat" element={<ChatLayout />} >
        <Route path="messages" element={<Chat />}>
          <Route path=":chatId" element={<Messages />}  />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  )
);

function App() {
  const {user} = useUser()

  useEffect(() => {
    if(!user) return
    switch(user.theme){
      case 'light':
        document.documentElement.style.setProperty('--color-primary', '#1755a2')
        document.documentElement.style.setProperty('--color-primary-light', '#4c9afa')
        document.documentElement.style.setProperty('--color-accent', '#ef7e4c')
        document.documentElement.style.setProperty('--color-accent-light', '#f1956e')
        document.documentElement.style.setProperty('--color-text', 'rgb(75, 75, 75)')
        document.documentElement.style.setProperty('--color-background', 'rgb(255, 255, 255)')
        document.documentElement.style.setProperty('--color-messages-background', 'rgb(255, 255, 255)')
        document.documentElement.style.setProperty('--color-user-background', 'rgb(255, 255, 255)')
        document.documentElement.style.setProperty('--color-my-message', '#e8f3ff')
        document.documentElement.style.setProperty('--color-other-message', '#4b9af9')
        document.documentElement.style.setProperty('--color-chats-list-bg', '#f2f5fc')
        document.documentElement.style.setProperty('--color-chats-list-item', 'rgb(255, 255, 255)')
        document.documentElement.style.setProperty('--color-border', '#f2f5fc')
        document.documentElement.style.setProperty('--color-shared-files', '#4c9afa')
        document.documentElement.style.setProperty('--color-shared-files-tab-active', '#fff')
        document.documentElement.style.setProperty('--color-shared-files-tab-inactive', '#4c9afa')
        document.documentElement.style.setProperty('--color-active-line', '#4c9afa')
          break
      case 'dark':
        document.documentElement.style.setProperty('--color-primary', 'rgb(33, 33, 33)')
        document.documentElement.style.setProperty('--color-primary-light', '#151a28')
        document.documentElement.style.setProperty('--color-accent', '#e13073')
        document.documentElement.style.setProperty('--color-accent-light', '#f14788')
        document.documentElement.style.setProperty('--color-text', 'white')
        document.documentElement.style.setProperty('--color-background', '#32405d')
        document.documentElement.style.setProperty('--color-messages-background', '#32405d')
        document.documentElement.style.setProperty('--color-user-background', '#232b40')
        document.documentElement.style.setProperty('--color-my-message', '#3d4b6c')
        document.documentElement.style.setProperty('--color-other-message', '#232a3e')
        document.documentElement.style.setProperty('--color-chats-list-bg', '#232b40')
        document.documentElement.style.setProperty('--color-chats-list-item', '#3d4b6c')
        document.documentElement.style.setProperty('--color-border', '#232b40')
        document.documentElement.style.setProperty('--color-shared-files', '#32405d')
        document.documentElement.style.setProperty('--color-shared-files-tab-active', '#fff')
        document.documentElement.style.setProperty('--color-shared-files-tab-inactive', '#475b82')
        document.documentElement.style.setProperty('--color-active-line', 'white')
        }
  }, [user.theme])
  
  return (
      <RouterProvider router={router} />
  );
}

export default App;
